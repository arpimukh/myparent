import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const DaughterDashboard = () => {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [parents, setParents] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const userRole = localStorage.getItem('userRole')
    
    if (!user || userRole !== 'daughter') {
      router.push('/login')
      return
    }

    setUserData(user)
    fetchDashboardData(user.id)
  }, [])

  const fetchDashboardData = async (userId) => {
    try {
      // Fetch parents
      const parentsRes = await fetch(`http://localhost:5001/api/daughter/${userId}/parents`)
      const parentsData = await parentsRes.json()
      
      if (parentsData.success) {
        setParents(parentsData.data || [])
      }

      // Fetch services
      const servicesRes = await fetch(`http://localhost:5001/api/daughter/${userId}/services`)
      const servicesData = await servicesRes.json()
      
      if (servicesData.success) {
        setServices(servicesData.data || [])
      }

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Main Content - No separate header, will use layout header */}
      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
            Daughter Profile Management
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
            Manage your parents' care services and coordinate with trusted vendors for their wellbeing
          </p>
        </div>

        {/* Profile Information Card */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', marginBottom: '25px' }}>
            Profile Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', background: '#f7fafc', padding: '25px', borderRadius: '10px' }}>
            <div>
              <div style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                Profile Type
              </div>
              <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                Daughter
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                Daughter Name
              </div>
              <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                {userData?.name || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                ID
              </div>
              <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                D{String(userData?.id).padStart(3, '0')}
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                Contact No
              </div>
              <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                {userData?.phone || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Responsible For Section */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748' }}>
              Responsible For
            </h2>
            <button style={{ background: '#48bb78', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              + ADD PARENT
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>CLIENT ID</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>CLIENT PHOTO</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>CLIENT NAME</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>CONTACT NO</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>ACTIVE SERVICE</th>
                </tr>
              </thead>
              <tbody>
                {parents.length > 0 ? parents.map((parent, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{parent.clientId}</td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '16px' }}>
                        {parent.clientName?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', fontWeight: '500' }}>{parent.clientName}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{parent.contactNo}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>
                      <span style={{ padding: '6px 12px', background: '#e6f7ff', color: '#1890ff', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                        {parent.activeService}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#718096' }}>
                      No parents registered yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Services Section */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', marginBottom: '25px' }}>
            Active Services
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>CLIENT ID</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>CLIENT NAME</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>CONTACT NO</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>ACTIVE SERVICE</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>VENDOR NAME</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>VENDOR CONTACT NO</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', fontWeight: '600' }}>SERVICE STATUS</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? services.map((service, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{service.clientId}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{service.clientName}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{service.contactNo}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{service.activeService}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{service.vendorName}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{service.vendorContactNo}</td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{service.serviceStatus}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#718096' }}>
                      No active services yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DaughterDashboard