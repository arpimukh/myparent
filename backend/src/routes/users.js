const express = require('express')
const registrationController = require('../controllers/registrationController')
const User = require('../models/User')
const { pool } = require('../config/database')

const router = express.Router()

// Get all registrations
router.get('/registrations', registrationController.getAllRegistrations)

// Get single registration
router.get('/registrations/:id', registrationController.getRegistration)

// Update registration status
router.patch('/registrations/:id/status', registrationController.updateStatus)

// ============ DAUGHTER DASHBOARD ROUTES ============

// Get daughter profile with full information
router.get('/daughter/:id/profile', async (req, res) => {
  try {
    const { id } = req.params
    
    // Get daughter info with relationship details
    const [daughterRows] = await pool.execute(`
      SELECT u.*, d.parent_name, d.relationship 
      FROM users u
      LEFT JOIN daughters d ON u.id = d.user_id
      WHERE u.id = ? AND u.role = 'daughter'
    `, [id])
    
    if (daughterRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Daughter not found'
      })
    }
    
    const daughter = daughterRows[0]
    
    res.json({
      success: true,
      data: {
        profile: {
          profileType: 'Daughter',
          daughterName: daughter.name,
          id: `D${String(daughter.id).padStart(3, '0')}`,
          contactNo: daughter.phone
        },
        fullData: daughter
      }
    })
    
  } catch (error) {
    console.error('Get daughter profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daughter profile'
    })
  }
})

// Get daughter basic info (existing route - keep for compatibility)
router.get('/daughter/:id', async (req, res) => {
  try {
    const { id } = req.params
    const daughter = await User.findById(id)
    
    if (!daughter) {
      return res.status(404).json({ success: false, message: 'Daughter not found' })
    }
    
    res.json({ success: true, data: daughter })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get parents associated with daughter
router.get('/daughter/:id/parents', async (req, res) => {
  try {
    const { id } = req.params
    
    // First check if parent_daughter_relationships table exists and has data
    const [relationshipCheck] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM parent_daughter_relationships 
      WHERE daughter_id = ?
    `, [id])
    
    let rows
    
    if (relationshipCheck[0].count > 0) {
      // If relationships exist, use them
      [rows] = await pool.execute(`
        SELECT u.id, u.name, u.phone, u.photo_path,
               'Home Care Services' as active_service 
        FROM users u 
        JOIN parent_daughter_relationships pdr ON u.id = pdr.parent_id 
        WHERE pdr.daughter_id = ? AND u.role = 'parent'
      `, [id])
    } else {
      // Otherwise, return all parents as sample data (for testing)
      [rows] = await pool.execute(`
        SELECT u.id, u.name, u.phone, u.photo_path,
               'Home Care Services' as active_service 
        FROM users u 
        WHERE u.role = 'parent'
        LIMIT 5
      `)
    }
    
    // Format data for dashboard
    const parents = rows.map(parent => ({
      clientId: `CL${String(parent.id).padStart(3, '0')}`,
      clientPhoto: parent.photo_path,
      clientName: parent.name,
      contactNo: parent.phone,
      activeService: parent.active_service
    }))
    
    res.json({ success: true, data: parents })
  } catch (error) {
    console.error('Get parents error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get active services for daughter
router.get('/daughter/:id/services', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if service_assignments table exists
    const [tableCheck] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'service_assignments'
    `)
    
    let services = []
    
    if (tableCheck[0].count > 0) {
      // If table exists, query it
      const [rows] = await pool.execute(`
        SELECT sa.*, 
               u1.name as client_name, 
               u1.phone as client_contact,
               u1.id as client_id,
               u2.name as vendor_name, 
               u2.phone as vendor_contact
        FROM service_assignments sa
        JOIN users u1 ON sa.client_id = u1.id
        LEFT JOIN users u2 ON sa.vendor_id = u2.id
        WHERE sa.daughter_id = ?
      `, [id])
      
      services = rows.map(service => ({
        clientId: `CL${String(service.client_id).padStart(3, '0')}`,
        clientName: service.client_name,
        contactNo: service.client_contact,
        activeService: service.service_type || 'Home Care Services',
        vendorName: service.vendor_name || '-',
        vendorContactNo: service.vendor_contact || '-',
        serviceStatus: service.status || 'Active'
      }))
    } else {
      // Return sample/mock data for testing
      services = [
        {
          clientId: 'CL001',
          clientName: 'Sample Parent 1',
          contactNo: '+1-555-0001',
          activeService: 'Home Care Services',
          vendorName: 'Compassionate Care Partners',
          vendorContactNo: '+1-555-CARE-001',
          serviceStatus: 'Active'
        },
        {
          clientId: 'CL002',
          clientName: 'Sample Parent 2',
          contactNo: '+1-555-0002',
          activeService: 'Physical Therapy',
          vendorName: '-',
          vendorContactNo: '-',
          serviceStatus: 'Assign'
        }
      ]
    }
    
    res.json({ success: true, data: services })
  } catch (error) {
    console.error('Get services error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get all vendors (with optional filters)
router.get('/vendors', async (req, res) => {
  try {
    const { serviceType, location } = req.query
    
    let sql = `
      SELECT u.id, u.name, u.phone, u.address, 
             v.services, v.business_name
      FROM users u
      JOIN vendors v ON u.id = v.user_id
      WHERE u.role = 'vendor' AND u.status = 'approved'
    `
    const params = []
    
    // Add service type filter if provided
    if (serviceType) {
      sql += ` AND JSON_CONTAINS(v.services, ?)`
      params.push(JSON.stringify(serviceType))
    }
    
    // Add location filter if provided
    if (location) {
      sql += ` AND u.address LIKE ?`
      params.push(`%${location}%`)
    }
    
    const [rows] = await pool.execute(sql, params)
    
    // Format vendor data
    const vendors = rows.map(vendor => ({
      id: vendor.id,
      name: vendor.business_name || vendor.name,
      contactNo: vendor.phone,
      location: vendor.address,
      services: JSON.parse(vendor.services || '[]'),
      businessName: vendor.business_name
    }))
    
    res.json({ success: true, data: vendors })
  } catch (error) {
    console.error('Get vendors error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Get clients with services (for admin dashboard)
router.get('/clients-with-services', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT u.id, u.name, u.phone, u.photo_path,
             'Home Care Services' as active_service,
             d.name as daughter_name, 
             d.id as daughter_id,
             'Compassionate Care Partners' as vendor_name,
             '+1-555-CARE-001' as vendor_contact,
             'active' as status
      FROM users u
      LEFT JOIN daughters dt ON u.id = dt.user_id
      LEFT JOIN users d ON dt.user_id = d.id
      WHERE u.role = 'parent'
    `)
    
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('Get clients error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// Add parent to daughter's responsibility
router.post('/daughter/:daughterId/add-parent', async (req, res) => {
  try {
    const { daughterId } = req.params
    const { parentId } = req.body
    
    // Check if relationship already exists
    const [existing] = await pool.execute(
      'SELECT * FROM parent_daughter_relationships WHERE parent_id = ? AND daughter_id = ?',
      [parentId, daughterId]
    )
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'This parent is already assigned to you'
      })
    }
    
    // Create relationship
    await pool.execute(
      'INSERT INTO parent_daughter_relationships (parent_id, daughter_id) VALUES (?, ?)',
      [parentId, daughterId]
    )
    
    res.json({
      success: true,
      message: 'Parent added successfully'
    })
    
  } catch (error) {
    console.error('Add parent error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add parent'
    })
  }
})

// Assign vendor to service
router.post('/services/assign', async (req, res) => {
  try {
    const { clientId, serviceType, vendorId, daughterId } = req.body
    
    // Check if service_assignments table exists, if not create it
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS service_assignments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        client_id INT NOT NULL,
        daughter_id INT NOT NULL,
        vendor_id INT,
        service_type VARCHAR(255) NOT NULL,
        status ENUM('Active', 'Assign', 'Close') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (daughter_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
    
    // Insert or update service assignment
    await pool.execute(
      `INSERT INTO service_assignments (client_id, daughter_id, vendor_id, service_type, status) 
       VALUES (?, ?, ?, ?, 'Active')
       ON DUPLICATE KEY UPDATE vendor_id = ?, status = 'Active'`,
      [clientId, daughterId, vendorId, serviceType, vendorId]
    )
    
    res.json({
      success: true,
      message: 'Vendor assigned successfully'
    })
    
  } catch (error) {
    console.error('Assign vendor error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to assign vendor'
    })
  }
})

// Update service status
router.patch('/services/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    if (!['Active', 'Assign', 'Close'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      })
    }
    
    await pool.execute(
      'UPDATE service_assignments SET status = ? WHERE id = ?',
      [status, id]
    )
    
    res.json({
      success: true,
      message: 'Service status updated successfully'
    })
    
  } catch (error) {
    console.error('Update service status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update service status'
    })
  }
})

module.exports = router