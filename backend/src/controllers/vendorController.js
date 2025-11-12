const { pool } = require('../config/database');

// Register a new vendor
const registerVendor = async (req, res) => {
  try {
    const { name, contactNumber, email, services, serviceDescription } = req.body

    // Validation
    if (!name || !contactNumber || !services|| !serviceDescription) {
      return res.status(400).json({
        success: false,
        message: 'Name, contact number, services and service description are required'
      })
    }

    // Validate contact number (10 digits)
    if (!/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Contact number must be 10 digits'
      })
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }

    // Insert data into vendor_registrations table
    const query = `
      INSERT INTO vendor_registrations 
      (name, contact_number, email, service_type, service_description, created_at) 
      VALUES (?, ?, ?,?, ?, NOW())
    `

    const [result] = await pool.execute(query, [
      name,
      contactNumber,
      email || null,
      services,
      serviceDescription
    ])

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Vendor registration submitted successfully',
      data: {
        id: result.insertId,
        name,
        contactNumber,
        email: email || null,
        services,
        serviceDescription
      }
    })

  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to submit registration. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get all vendor registrations with optional filtering
const getAllVendors = async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query

    // Build query based on filters
    let query = 'SELECT * FROM vendor_registrations'
    const params = []

    if (status) {
      query += ' WHERE status = ?'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    // Execute query
    const [rows] = await pool.execute(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM vendor_registrations'
    if (status) {
      countQuery += ' WHERE status = ?'
    }
    const [countResult] = await pool.execute(
      countQuery,
      status ? [status] : []
    )

    return res.status(200).json({
      success: true,
      data: rows,
      total: countResult[0].total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor registrations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Get vendor by ID
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params

    const query = 'SELECT * FROM vendor_registrations WHERE id = ?'
    const [rows] = await pool.execute(query, [id])

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor registration not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    })

  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Update vendor status
const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validate status
    const validStatuses = ['pending', 'contacted', 'approved', 'rejected']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, contacted, approved, rejected'
      })
    }

    const query = 'UPDATE vendor_registrations SET status = ? WHERE id = ?'
    const [result] = await pool.execute(query, [status, id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor registration not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Vendor status updated successfully',
      data: { id, status }
    })

  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update vendor status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// Delete vendor registration
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params

    const query = 'DELETE FROM vendor_registrations WHERE id = ?'
    const [result] = await pool.execute(query, [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor registration not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Vendor registration deleted successfully'
    })

  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete vendor registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

module.exports = {
  registerVendor,
  getAllVendors,
  getVendorById,
  updateVendorStatus,
  deleteVendor
}