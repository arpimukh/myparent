import { useState } from 'react'

const Login = ({ role, onClose, onSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          role: role
        }),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('userRole', result.user.role)
        onSuccess(result.user)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Login failed. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleConfig = () => {
    switch (role) {
      case 'parent':
        return { icon: '👴', title: 'Parent Login', color: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }
      case 'daughter':
        return { icon: '👩', title: 'Daughter Login', color: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' }
      case 'vendor':
        return { icon: '🏢', title: 'Vendor Login', color: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)' }
      default:
        return { icon: '👤', title: 'Login', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    }
  }

  const config = getRoleConfig()

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.8)', zIndex: 1000, display: 'flex',
      justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        maxWidth: '400px', width: '100%', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '20px', background: 'none',
            border: 'none', fontSize: '28px', cursor: 'pointer', color: '#718096'
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{config.icon}</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '8px' }}>
            {config.title}
          </h2>
          <p style={{ color: '#718096' }}>Enter your login credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
              style={{
                width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
                borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              style={{
                width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
                borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#e53e3e', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%', background: config.color, color: 'white',
              padding: '15px', borderRadius: '10px', fontSize: '16px', fontWeight: '600',
              border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login