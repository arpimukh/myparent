const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const { pool } = require('../config/database')
const fs = require('fs') // NEW: For file cleanup on error

const registrationController = {
  async register(req, res) {
    try {
      console.log('Registration request received:', req.body)
      
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        })
      }

      const userData = req.body
      
      // Handle file uploads - UPDATED to handle multiple files
      if (req.files?.photo) {
        userData.photo_path = req.files.photo[0].path
        console.log('Photo uploaded:', req.files.photo[0].path)
      }
      
      // NEW: Handle identity document for vendors
      let identityDocPath = null
      if (req.files?.identity_doc) {
        identityDocPath = req.files.identity_doc[0].path
        console.log('Identity document uploaded:', identityDocPath)
      }

      // NEW: Vendor-specific validation
      if (userData.role === 'vendor') {
        // Check if at least one identity document number is provided
        if (!userData.aadhar && !userData.voter_id && !userData.pan) {
          return res.status(400).json({
            success: false,
            message: 'At least one identity document (Aadhar/Voter ID/PAN) is required for vendors'
          })
        }
        
        // Check if identity document file is uploaded
        if (!identityDocPath) {
          return res.status(400).json({
            success: false,
            message: 'Identity document file is required for vendors'
          })
        }
      }

      // Check if email already exists
      const existingEmail = await User.findByEmail(userData.email)
      if (existingEmail) {
        console.log('Email already exists:', userData.email)
        
        // NEW: Clean up uploaded files on error
        if (req.files?.photo) {
          fs.unlink(req.files.photo[0].path, () => {})
        }
        if (req.files?.identity_doc) {
          fs.unlink(req.files.identity_doc[0].path, () => {})
        }
        
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        })
      }

      // Check if phone already exists
      const existingPhone = await User.findByPhone(userData.phone)
      if (existingPhone) {
        console.log('Phone already exists:', userData.phone)
        
        // NEW: Clean up uploaded files on error
        if (req.files?.photo) {
          fs.unlink(req.files.photo[0].path, () => {})
        }
        if (req.files?.identity_doc) {
          fs.unlink(req.files.identity_doc[0].path, () => {})
        }
        
        return res.status(400).json({
          success: false,
          message: 'Phone number already registered'
        })
      }

      // Hash the password before saving
      console.log('Hashing password...')
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      userData.password = hashedPassword
      console.log('Password hashed successfully')

      // Create user in users table
      console.log('Creating user with role:', userData.role)
      const newUser = await User.create(userData)
      console.log('User created with ID:', newUser.id)

      // Save role-specific data
      if (userData.role === 'parent') {
        console.log('Saving parent-specific data...')
        await pool.execute(
          'INSERT INTO parents (user_id, medical_conditions, emergency_contact) VALUES (?, ?, ?)',
          [newUser.id, userData.medical_conditions || null, userData.emergency_contact || null]
        )
        console.log('Parent data saved')
      } else if (userData.role === 'daughter') {
        console.log('Saving daughter-specific data...')
        await pool.execute(
          'INSERT INTO daughters (user_id, name, contact_no, email,adhar_no,voter_no,pan_no) VALUES (?,?,?,?,?,?,?)',
            [newUser.id, userData.name,userData.phone, userData.email, userData.aadhar || null, userData.voter_id || null, userData.pan || null]
          //'INSERT INTO daughters (user_id, name, contact_no, email) VALUES (?, ?, ?, ?,?)',
          //[newUser.id, userData.name,userData.contact_no, userData.email]
        )
        console.log('Daughter data saved')
      } else if (userData.role === 'vendor') {
        console.log('Saving vendor-specific data...')
        const services = Array.isArray(userData.services) ? userData.services : JSON.parse(userData.services || '[]')
        
        // UPDATED: Added identity_doc_path to vendor insertion
        await pool.execute(
          'INSERT INTO vendors (user_id, business_name, services, service_description, gst_number, identity_doc_path) VALUES (?, ?, ?, ?, ?, ?)',
          [
            newUser.id, 
            userData.business_name || userData.name,
            JSON.stringify(services),
            userData.service_description || null,
            userData.gst_number || null,
            identityDocPath || null // NEW: Store identity document path
          ]
        )
        console.log('Vendor data saved with identity document')
      }

      console.log('Registration completed successfully for:', userData.email)
      
      res.status(201).json({
        success: true,
        message: 'Registration successful! You can now login with your email or phone number.',
        data: {
          id: newUser.id,
          role: userData.role,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          status: 'pending'
        }
      })

    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error stack:', error.stack)
      
      // NEW: Clean up uploaded files on error
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
        message: 'Registration failed. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  },

  // Login endpoint - accepts email OR phone number as username
  async login(req, res) {
    try {
      const { username, password, role } = req.body

      console.log('Login attempt:', { username, role, hasPassword: !!password })

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email/Phone and password are required'
        })
      }

      // Find user by email OR phone number
      const user = await User.findByEmailOrPhone(username)
      
      console.log('User found:', user ? { id: user.id, name: user.name, role: user.role, hasPassword: !!user.password } : 'No user found')
      
      if (!user) {
        console.log('Login failed: User not found')
        return res.status(401).json({
          success: false,
          message: 'Login failed. Please try again.'
        })
      }

      // Check if role matches (if role is provided)
      if (role && user.role !== role) {
        console.log('Login failed: Role mismatch', { expected: role, actual: user.role })
        return res.status(401).json({
          success: false,
          message: 'Login failed. Please try again.'
        })
      }

      // Check if user has a password
      if (!user.password) {
        console.log('Login failed: No password set for user')
        return res.status(401).json({
          success: false,
          message: 'Login failed. Account not properly configured.'
        })
      }

      // Compare password with hashed password
      console.log('Comparing passwords...')
      const isPasswordValid = await bcrypt.compare(password, user.password)
      
      console.log('Password valid:', isPasswordValid)
      
      if (!isPasswordValid) {
        console.log('Login failed: Invalid password')
        return res.status(401).json({
          success: false,
          message: 'Login failed. Please try again.'
        })
      }

      if (user.status !== 'approved' && user.status !== 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been rejected. Please contact support.'
        })
      }

      console.log('Login successful for user:', user.id)

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          phone: user.phone,
          status: user.status
        }
      })

    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      })
    }
  },

  // Get all registrations
  async getAllRegistrations(req, res) {
    try {
      const { role, status, limit } = req.query
      const filters = {}
      
      if (role) filters.role = role
      if (status) filters.status = status  
      if (limit) filters.limit = limit

      const users = await User.findAll(filters)
      
      res.json({
        success: true,
        data: users,
        count: users.length
      })

    } catch (error) {
      console.error('Get registrations error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch registrations'
      })
    }
  },

  // Get single registration
  async getRegistration(req, res) {
    try {
      const { id } = req.params
      const user = await User.findById(id)
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.json({
        success: true,
        data: user
      })

    } catch (error) {
      console.error('Get registration error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to fetch registration'
      })
    }
  },

  // Update registration status
  async updateStatus(req, res) {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        })
      }

      await User.updateStatus(id, status)

      res.json({
        success: true,
        message: 'Status updated successfully'
      })

    } catch (error) {
      console.error('Update status error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update status'
      })
    }
  }
}

module.exports = registrationController