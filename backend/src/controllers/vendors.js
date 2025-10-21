const { pool } = require('../config/database');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    })
  }

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