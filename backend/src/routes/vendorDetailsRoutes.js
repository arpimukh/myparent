// src/routes/vendorDetailsRoutes.js
// NEW route specifically for vendor registration with identity documents from FormModal

const express = require('express')
const { body } = require('express-validator')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcrypt')
const { pool } = require('../config/database')

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = 'uploads/vendor-details'
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Multer configuration for vendor details uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed for photo!'), false)
    }
  } else if (file.fieldname === 'identity_doc') {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only image or PDF files are allowed for identity documents!'), false)
    }
  } else {
    cb(null, true)
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// Validation rules for vendor details registration
const vendorDetailsValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').isMobilePhone('en-IN').withMessage('Invalid phone number'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('address').trim().isLength({ min: 10 }).withMessage('Address must be at least 10 characters'),
  body('services').notEmpty().withMessage('At least one service must be selected'),
]

// POST /api/vendor-details/register - Register vendor with identity documents
router.post('/register', 
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'identity_doc', maxCount: 1 }
  ]), 
  vendorDetailsValidation,
  async (req, res) => {
    const connection = await pool.getConnection()
    
    try {
      await connection.beginTransaction()

      const {
        name, phone, email, password, address,
        aadhar, voter_id, pan,
        services, service_description, gst_number
      } = req.body

      console.log('Vendor details registration received:', { name, email, phone })

      // Validate at least one identity document number
      if (!aadhar && !voter_id && !pan) {
        await connection.rollback()
        
        // Clean up uploaded files
        if (req.files?.photo) fs.unlink(req.files.photo[0].path, () => {})
        if (req.files?.identity_doc) fs.unlink(req.files.identity_doc[0].path, () => {})
        
        return res.status(400).json({
          success: false,
          message: 'At least one identity document (Aadhar/Voter ID/PAN) is required'
        })
      }

      // Validate identity document file upload
      if (!req.files?.identity_doc) {
        await connection.rollback()
        
        // Clean up uploaded files
        if (req.files?.photo) fs.unlink(req.files.photo[0].path, () => {})
        
        return res.status(400).json({
          success: false,
          message: 'Identity document file is required'
        })
      }

      // Validate photo upload
      if (!req.files?.photo) {
        await connection.rollback()
        
        // Clean up uploaded files
        if (req.files?.identity_doc) fs.unlink(req.files.identity_doc[0].path, () => {})
        
        return res.status(400).json({
          success: false,
          message: 'Photo is required'
        })
      }

      // Check if email or phone already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ? OR phone = ?',
        [email, phone]
      )

      if (existingUsers.length > 0) {
        await connection.rollback()
        
        // Clean up uploaded files
        if (req.files?.photo) fs.unlink(req.files.photo[0].path, () => {})
        if (req.files?.identity_doc) fs.unlink(req.files.identity_doc[0].path, () => {})
        
        return res.status(400).json({
          success: false,
          message: 'Email or phone number already registered'
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Get file paths
      const photoPath = `/uploads/vendor-details/${req.files.photo[0].filename}`
      const identityDocPath = `/uploads/vendor-details/${req.files.identity_doc[0].filename}`

      console.log('Files uploaded:', { photoPath, identityDocPath })

      // Insert into users table
      const [userResult] = await connection.execute(
        `INSERT INTO users 
         (role, name, phone, email, password, address, aadhar, voter_id, pan, photo_path, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['vendor', name, phone, email, hashedPassword, address, 
         aadhar || null, voter_id || null, pan || null, photoPath, 'pending']
      )

      const userId = userResult.insertId
      console.log('User created with ID:', userId)

      // Parse services if it's a string
      const servicesArray = typeof services === 'string' ? JSON.parse(services) : services

      // Insert into vendors table with identity_doc_path
      await connection.execute(
        `INSERT INTO vendors 
         (user_id, services, service_description, gst_number, identity_doc_path) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, JSON.stringify(servicesArray), service_description || null, gst_number || null, identityDocPath]
      )

      console.log('Vendor details saved')

      await connection.commit()

      res.status(201).json({
        success: true,
        message: 'Vendor registration successful. We will contact you shortly for verification.',
        data: {
          userId: userId,
          name: name,
          email: email,
          phone: phone
        }
      })

    } catch (error) {
      await connection.rollback()
      console.error('Vendor details registration error:', error)

      // Clean up uploaded files on error
      if (req.files) {
        if (req.files.photo) {
          fs.unlink(req.files.photo[0].path, (err) => {
            if (err) console.error('Error deleting photo:', err)
          })
        }
        if (req.files.identity_doc) {
          fs.unlink(req.files.identity_doc[0].path, (err) => {
            if (err) console.error('Error deleting identity doc:', err)
          })
        }
      }

      res.status(500).json({
        success: false,
        message: 'Vendor registration failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      })
    } finally {
      connection.release()
    }
  }
)

// GET /api/vendor-details/:id - Get vendor details by user ID
router.get('/:id', async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.role, u.name, u.phone, u.email, u.address, 
              u.aadhar, u.voter_id, u.pan, u.photo_path, u.status, u.created_at,
              v.services, v.service_description, v.gst_number, v.identity_doc_path
       FROM users u
       LEFT JOIN vendors v ON u.id = v.user_id
       WHERE u.id = ? AND u.role = 'vendor'`,
      [req.params.id]
    )

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      })
    }

    const vendor = users[0]
    
    // Parse services JSON
    if (vendor.services) {
      try {
        vendor.services = JSON.parse(vendor.services)
      } catch (e) {
        vendor.services = []
      }
    }

    res.json({
      success: true,
      data: vendor
    })
  } catch (error) {
    console.error('Error fetching vendor details:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
})

// GET /api/vendor-details - Get all vendors with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, service } = req.query
    let query = `
      SELECT u.id, u.name, u.phone, u.email, u.status, u.created_at,
             v.services, v.service_description
      FROM users u
      LEFT JOIN vendors v ON u.id = v.user_id
      WHERE u.role = 'vendor'
    `
    const params = []

    if (status) {
      query += ' AND u.status = ?'
      params.push(status)
    }

    if (service) {
      query += ' AND JSON_CONTAINS(v.services, ?)'
      params.push(JSON.stringify(service))
    }

    query += ' ORDER BY u.created_at DESC'

    const [vendors] = await pool.execute(query, params)

    // Parse services JSON for each vendor
    vendors.forEach(vendor => {
      if (vendor.services) {
        try {
          vendor.services = JSON.parse(vendor.services)
        } catch (e) {
          vendor.services = []
        }
      }
    })

    res.json({
      success: true,
      count: vendors.length,
      data: vendors
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
})

// PATCH /api/vendor-details/:id/status - Update vendor status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be: pending, approved, or rejected'
      })
    }

    const [result] = await pool.execute(
      'UPDATE users SET status = ? WHERE id = ? AND role = ?',
      [status, req.params.id, 'vendor']
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      })
    }

    res.json({
      success: true,
      message: 'Vendor status updated successfully'
    })
  } catch (error) {
    console.error('Error updating vendor status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
})

module.exports = router