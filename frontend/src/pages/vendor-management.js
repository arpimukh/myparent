import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const VendorManagement = () => {
  const router = useRouter()
  const [loggedInVendor, setLoggedInVendor] = useState(null)
  const [searchFilters, setSearchFilters] = useState({
    vendorName: '',
    serviceType: ''
  })

  // Real-time data states
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [isLoadingVendors, setIsLoadingVendors] = useState(true)
  const [vendorError, setVendorError] = useState(null)

  const [clientServices, setClientServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [servicesError, setServicesError] = useState(null)

  // Fetch vendors from backend
  const fetchVendors = async () => {
    setIsLoadingVendors(true)
    setVendorError(null)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/vendor-details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      const result = await response.json()
      console.log('📦 Vendors fetched:', result)

      if (result.success) {
        // Map the backend data to the format we need
        const mappedVendors = result.data.map(vendor => ({
          service: vendor.services ? vendor.services.join(', ') : 'N/A',
          vendorName: vendor.name,
          vendorId: vendor.vendor_id || vendor.id,
          contactNumber: vendor.phone,
          email: vendor.email,
          address: vendor.address,
          allServices: vendor.services || []
        }))
        
        setVendors(mappedVendors)
        setFilteredVendors(mappedVendors)
      } else {
        setVendorError(result.message || 'Failed to fetch vendors')
      }
    } catch (error) {
      console.error('❌ Error fetching vendors:', error)
      setVendorError('Failed to load vendors. Please try again.')
    } finally {
      setIsLoadingVendors(false)
    }
  }

  // Fetch client services from backend (if you have this endpoint)
  const fetchClientServices = async () => {
    setIsLoadingServices(true)
    setServicesError(null)
    
    try {
      // Replace with your actual client services endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/client-services`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      const result = await response.json()
      console.log('📋 Client services fetched:', result)

      if (result.success) {
        setClientServices(result.data)
      } else {
        setServicesError(result.message || 'Failed to fetch client services')
      }
    } catch (error) {
      console.error('❌ Error fetching client services:', error)
      setServicesError('Failed to load client services.')
      // Keep empty array if endpoint doesn't exist yet
      setClientServices([])
    } finally {
      setIsLoadingServices(false)
    }
  }

  // Check for logged-in vendor on component mount
  useEffect(() => {
    const checkVendorAuth = () => {
      const vendorDetails = localStorage.getItem('vendorDetails')
      const userRole = localStorage.getItem('userRole')

      console.log('🔍 Checking vendor authentication...')
      console.log('User role:', userRole)
      console.log('Vendor details:', vendorDetails)

      if (userRole === 'vendor' && vendorDetails) {
        try {
          const parsedVendor = JSON.parse(vendorDetails)
          setLoggedInVendor(parsedVendor)
          console.log('✅ Vendor authenticated:', parsedVendor)
        } catch (error) {
          console.error('❌ Error parsing vendor details:', error)
        }
      } else {
        console.log('⚠️ No vendor logged in')
        // Uncomment to redirect to login if vendor is not authenticated
        // router.push('/login')
      }
    }

    checkVendorAuth()
    fetchVendors()
    fetchClientServices()
  }, [])

  // Search functionality
  const handleSearch = () => {
    let filtered = vendors

    if (searchFilters.vendorName) {
      filtered = filtered.filter(vendor =>
        vendor.vendorName.toLowerCase().includes(searchFilters.vendorName.toLowerCase())
      )
    }

    if (searchFilters.serviceType) {
      filtered = filtered.filter(vendor =>
        vendor.service.toLowerCase().includes(searchFilters.serviceType.toLowerCase())
      )
    }

    setFilteredVendors(filtered)
    console.log('🔍 Search results:', filtered)
  }

  // Reset search
  const handleResetSearch = () => {
    setSearchFilters({ vendorName: '', serviceType: '' })
    setFilteredVendors(vendors)
  }

  const handleAddNewVendor = () => {
    alert('Add New Vendor functionality would open a form here')
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('vendorDetails')
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
      router.push('/login')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4FC3F7'
      case 'Assign': return '#F06292'
      case 'Close': return '#FFB74D'
      default: return '#9E9E9E'
    }
  }

  const handleServiceStatusChange = async (index, newStatus) => {
    const service = clientServices[index]
    
    try {
      // Update status in backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/client-services/${service.clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ serviceStatus: newStatus })
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        const updatedServices = [...clientServices]
        updatedServices[index].serviceStatus = newStatus
        setClientServices(updatedServices)
        console.log('✅ Status updated successfully')
      } else {
        alert('Failed to update status: ' + result.message)
      }
    } catch (error) {
      console.error('❌ Error updating status:', error)
      alert('Failed to update status')
    }
  }

  // Check if a vendor row matches the logged-in vendor
  const isLoggedInVendorRow = (vendorId) => {
    return loggedInVendor && loggedInVendor.vendorId === vendorId
  }

  // Refresh data
  const handleRefresh = () => {
    fetchVendors()
    fetchClientServices()
  }

  return (
    <>
      <Head>
        <title>Vendor Management - Parent Care Services</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}></div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  Vendor Management System
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
                  Streamline your vendor relationships and service management with our comprehensive platform
                </p>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <button
                  onClick={handleRefresh}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '2px solid white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Logged In Vendor Info Card */}
          {loggedInVendor && (
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              border: '3px solid #48bb78'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>🔐</span>
                  Logged In Vendor Details
                </h2>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Logout
                </button>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                padding: '25px',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Vendor ID
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {loggedInVendor.vendorId}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Vendor Name
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {loggedInVendor.vendorName}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Email
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#4299e1', marginTop: '5px' }}>
                        {loggedInVendor.email}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Contact Number
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {loggedInVendor.contactNumber}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Service Type
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {loggedInVendor.serviceType}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Login Time
                      </label>
                      <div style={{ fontSize: '14px', color: '#718096', marginTop: '5px' }}>
                        {new Date(loggedInVendor.loginTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {loggedInVendor.address && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                    <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Address
                    </label>
                    <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '5px' }}>
                      {loggedInVendor.address}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Vendors Section */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
              Search Vendors
            </h2>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'end', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ flex: 1, maxWidth: '300px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                  VENDOR NAME
                </label>
                <input
                  type="text"
                  placeholder="Enter vendor name..."
                  value={searchFilters.vendorName}
                  onChange={(e) => setSearchFilters({...searchFilters, vendorName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ flex: 1, maxWidth: '300px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                  SERVICE TYPE
                </label>
                <input
                  type="text"
                  placeholder="Enter service type..."
                  value={searchFilters.serviceType}
                  onChange={(e) => setSearchFilters({...searchFilters, serviceType: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
              </div>
              
              <button
                onClick={handleSearch}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                SEARCH
              </button>

              <button
                onClick={handleResetSearch}
                style={{
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                RESET
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleAddNewVendor}
                style={{
                  background: '#4FC3F7',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + ADD NEW VENDOR
              </button>
            </div>

            {/* Vendors Table */}
            <div style={{ marginTop: '30px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 2fr',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '15px',
                borderRadius: '10px 10px 0 0',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                <div>SERVICE</div>
                <div>VENDOR NAME</div>
                <div>VENDOR ID</div>
                <div>CONTACT NUMBER</div>
              </div>

              {/* Loading State */}
              {isLoadingVendors && (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  background: '#f7fafc',
                  borderRadius: '0 0 10px 10px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                  <p style={{ color: '#718096' }}>Loading vendors...</p>
                </div>
              )}

              {/* Error State */}
              {vendorError && !isLoadingVendors && (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  background: '#fff5f5',
                  borderRadius: '0 0 10px 10px',
                  border: '2px solid #fc8181'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
                  <p style={{ color: '#c53030', fontWeight: '600' }}>{vendorError}</p>
                  <button
                    onClick={fetchVendors}
                    style={{
                      marginTop: '15px',
                      background: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* No Vendors State */}
              {!isLoadingVendors && !vendorError && filteredVendors.length === 0 && (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  background: '#f7fafc',
                  borderRadius: '0 0 10px 10px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
                  <p style={{ color: '#718096', fontSize: '16px' }}>No vendors found</p>
                </div>
              )}

              {/* Vendor Rows */}
              {!isLoadingVendors && !vendorError && filteredVendors.map((vendor, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 2fr',
                  padding: '15px',
                  borderBottom: '1px solid #f0f0f0',
                  background: isLoggedInVendorRow(vendor.vendorId) 
                    ? 'linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)' 
                    : (index % 2 === 0 ? '#fafafa' : 'white'),
                  fontSize: '14px',
                  fontWeight: isLoggedInVendorRow(vendor.vendorId) ? '700' : 'normal',
                  border: isLoggedInVendorRow(vendor.vendorId) ? '2px solid #48bb78' : 'none',
                  borderRadius: isLoggedInVendorRow(vendor.vendorId) ? '8px' : '0',
                  marginBottom: isLoggedInVendorRow(vendor.vendorId) ? '2px' : '0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isLoggedInVendorRow(vendor.vendorId) && <span>👤</span>}
                    {vendor.service}
                  </div>
                  <div style={{ fontWeight: '600' }}>{vendor.vendorName}</div>
                  <div style={{ fontWeight: '600' }}>{vendor.vendorId}</div>
                  <div>{vendor.contactNumber}</div>
                </div>
              ))}
            </div>

            {/* Showing results count */}
            {!isLoadingVendors && !vendorError && filteredVendors.length > 0 && (
              <div style={{
                marginTop: '15px',
                textAlign: 'center',
                color: '#718096',
                fontSize: '14px'
              }}>
                Showing {filteredVendors.length} of {vendors.length} vendors
              </div>
            )}
          </div>

          {/* Client Services Management Section */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              Client Services Management
            </h2>

            {/* Client Services Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '0.8fr 1.5fr 1.5fr 1fr 1fr 1.5fr 1.2fr 1fr',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '600',
              fontSize: '12px'
            }}>
              <div>CLIENT ID</div>
              <div>CLIENT NAME</div>
              <div>ACTIVE SERVICE</div>
              <div>DAUGHTER NAME</div>
              <div>DAUGHTER ID</div>
              <div>VENDOR NAME</div>
              <div>CONTACT NUMBER</div>
              <div>SERVICE STATUS</div>
            </div>

            {/* Loading State */}
            {isLoadingServices && (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#f7fafc',
                borderRadius: '0 0 10px 10px'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                <p style={{ color: '#718096' }}>Loading client services...</p>
              </div>
            )}

            {/* Error State */}
            {servicesError && !isLoadingServices && (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#fff5f5',
                borderRadius: '0 0 10px 10px'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
                <p style={{ color: '#c53030', fontWeight: '600' }}>{servicesError}</p>
              </div>
            )}

            {/* No Services State */}
            {!isLoadingServices && !servicesError && clientServices.length === 0 && (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#f7fafc',
                borderRadius: '0 0 10px 10px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📋</div>
                <p style={{ color: '#718096', fontSize: '16px' }}>No client services found</p>
              </div>
            )}

            {/* Client Services Table Rows */}
            {!isLoadingServices && !servicesError && clientServices.map((service, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '0.8fr 1.5fr 1.5fr 1fr 1fr 1.5fr 1.2fr 1fr',
                padding: '15px',
                borderBottom: '1px solid #f0f0f0',
                alignItems: 'center',
                background: index % 2 === 0 ? '#fafafa' : 'white',
                fontSize: '13px'
              }}>
                <div style={{ fontWeight: '600' }}>{service.clientId}</div>
                <div style={{ fontWeight: '600' }}>{service.clientName}</div>
                <div>{service.activeService}</div>
                <div>{service.daughterName}</div>
                <div style={{ fontWeight: '600' }}>{service.daughterId}</div>
                <div>{service.vendorName}</div>
                <div>{service.contactNumber}</div>
                <div>
                  <select
                    value={service.serviceStatus}
                    onChange={(e) => handleServiceStatusChange(index, e.target.value)}
                    style={{
                      background: getStatusColor(service.serviceStatus),
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontWeight: '600',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Assign">Assign</option>
                    <option value="Close">Close</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default VendorManagement