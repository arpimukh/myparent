const express = require('express')

const { pool } = require('../config/database')
const dashboardController = require('../controllers/dashboardController')
const parentDashboardController = require('../controllers/parentDashboardController')

const router = express.Router()

// Daughter dashboard routes
router.get('/daughter/:id', dashboardController.getDaughterDashboard)
//router.post('/daughter/:id/add-parent', dashboardController.addParent)
router.put('/service/:id/status', dashboardController.updateServiceStatus)
router.get('/parent/:id', parentDashboardController.getParentDashboard)

// Vendor management routes
router.get('/vendors', dashboardController.getAllVendors)
//router.post('/vendors', dashboardController.addVendor)
//router.get('/client-services', dashboardController.getClientServices)
//router.put('/client-service/:id/status', dashboardController.updateClientServiceStatus)

// Get parents associated with daughter
router.get('/daughter/:id/parents', async (req, res) => {
  try {
    const { id } = req.params
    
    // First check if parent_daughter_relationships table exists and has data
    const [rows] = await pool.execute(`   SELECT p.user_id, p.name, p.phone, IFNULL(COUNT(c.client_id), 0) as active_service_count,
       p.medical_conditions, p.address
FROM parent_care_services.parents p
LEFT JOIN parent_care_services.client_services c 
ON p.user_id = c.client_id AND c.daughter_id = 22
WHERE p.daughter_id = 22
GROUP BY p.user_id, p.name, p.phone, p.medical_conditions, p.address
LIMIT 5;
       `, [id]) 
      
     
    
    // Format data for dashboard
    const parents = rows.map(parent => ({
      clientId: `CL${String(parent.user_id).padStart(3, '0')}`,
     // clientPhoto: parent.photo_path,
      clientName: parent.name,
      contactNo: parent.phone,
      activeService: parent.active_service_count,
      notes: parent.medical_conditions,
      address: parent.address
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


module.exports = router