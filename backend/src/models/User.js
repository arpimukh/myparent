const { pool } = require('../config/database')

class User {
  static async create(userData) {
    const sql = `INSERT INTO users (role, name, phone, email, password, address, aadhar, voter_id, pan, photo_path) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    
    const [result] = await pool.execute(sql, [
      userData.role,
      userData.name,
      userData.phone,
      userData.email,
      userData.password,
      userData.address,
      userData.aadhar,
      userData.voter_id || null,
      userData.pan || null,
      userData.photo_path || null
    ])

    return { id: result.insertId, ...userData }
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?'
    const [rows] = await pool.execute(sql, [id])
    return rows[0]
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?'
    const [rows] = await pool.execute(sql, [email])
    return rows[0]
  }

  static async findByPhone(phone) {
    const sql = 'SELECT * FROM users WHERE phone = ?'
    const [rows] = await pool.execute(sql, [phone])
    return rows[0]
  }

  static async findByEmailOrPhone(username) {
    const sql = 'SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1'
    const [rows] = await pool.execute(sql, [username, username])
    return rows[0]
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM users WHERE 1=1'
    const params = []

    if (filters.role) {
      sql += ' AND role = ?'
      params.push(filters.role)
    }

    if (filters.status) {
      sql += ' AND status = ?'
      params.push(filters.status)
    }

    sql += ' ORDER BY created_at DESC'

    if (filters.limit) {
      sql += ' LIMIT ?'
      params.push(parseInt(filters.limit))
    }

    const [rows] = await pool.execute(sql, params)
    return rows
  }

  static async updateStatus(id, status) {
    const sql = 'UPDATE users SET status = ? WHERE id = ?'
    const [result] = await pool.execute(sql, [status, id])
    return result
  }

  static async update(id, userData) {
    const fields = []
    const values = []

    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`)
        values.push(userData[key])
      }
    })

    if (fields.length === 0) {
      throw new Error('No fields to update')
    }

    values.push(id)
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    const [result] = await pool.execute(sql, values)
    return result
  }

  static async delete(id) {
    const sql = 'DELETE FROM users WHERE id = ?'
    const [result] = await pool.execute(sql, [id])
    return result
  }
}

module.exports = User