const { pool } = require('../config/database');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    })
  }

  try {
    const { name, contactNumber, email, services,serviceDescription } = req.body

    // Validation
    if (!name || !contactNumber ||!services || !serviceDescription) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, contact number, and service description are required' 
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
      VALUES (?, ?, ?, ?, NOW())
    `

    const [result] = await pool.execute(query, [
      name,
      contactNumber,
      email || null,
      services,
      serviceDescription
    ])

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Vendor registration submitted successfully',
      data: {
        id: result.insertId,
        name,
        contactNumber,
        email: email || null,
        services
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