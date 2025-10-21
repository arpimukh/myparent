const express = require('express')
const router = express.Router()
const vendorController = require('../controllers/vendorController')

// POST route for vendor registration
router.post('/register', vendorController.registerVendor)

// GET route to fetch all vendor registrations (admin)
router.get('/registrations', vendorController.getAllVendors)

// GET route to fetch vendor by ID
router.get('/registrations/:id', vendorController.getVendorById)

// PUT route to update vendor status
router.put('/registrations/:id/status', vendorController.updateVendorStatus)

// DELETE route to delete vendor registration
router.delete('/registrations/:id', vendorController.deleteVendor)

module.exports = router