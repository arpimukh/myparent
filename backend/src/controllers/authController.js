const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by email OR phone number
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1',
      [username, username]
    );

    if (users.length === 0) {
      return res.json({ 
        success: false, 
        message: 'Login failed. Please try again.' 
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ 
        success: false, 
        message: 'Login failed. Please try again.' 
      });
    }

    // Login successful
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed. Please try again.' 
    });
  }
};