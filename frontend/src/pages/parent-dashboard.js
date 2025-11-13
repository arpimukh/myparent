import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

const ParentDashboard = () => {
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loggedInParent, setLoggedInParent] = useState(null)
  const [searchFilters, setSearchFilters] = useState({
    parentName: '',
    serviceType: ''
  })

  // Real-time data states
 // const [services, setServices] = useState([])
  const [events, setEvents] = useState([])
  const [isLoadingParents, setIsLoadingParents] = useState(true)
  const [parentError, setParentError] = useState(null)

  // Verification modal state
  const [verificationModal, setVerificationModal] = useState({
    isOpen: false,
    parentId: null,
    parentName: '',
    file: null
  })

  const [clientServices, setClientServices] = useState([])
  const [closedServices, setClosedServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [servicesError, setServicesError] = useState(null)

  // Search results page state
  const [showSearchResults, setShowSearchResults] = useState(false)
   useEffect(() => {
     const user = JSON.parse(localStorage.getItem('user') || 'null')
     const userRole = localStorage.getItem('userRole')
    
     if (!user || userRole !== 'parent') {
       router.push('/login')
       return
     }

     setUserData(user)
     fetchParent(user.id)
    // fetchClientServices(user.id)
     //fetchDashboardData(user.id)
   }, [])

// Fetch parents from backend
const fetchParent = async (userId) => {
  setIsLoadingParents(true)
  setParentError(null)
  console.log('🔍 Fetching parent data for user ID:', userId)
  try {
     const response = await fetch(`http://localhost:5001/api/dashboard/parent/${userId}`, {
        method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }                   
    })

   const result = await response.json()
   console.log('📦 Parent API response:', result)
  //  const result = {
  //     success: true, 
  //     data: { 
  //       parent: [
  //         { 
  //           id: 1,
  //           name: 'John Doe',
  //           daughter_id: 101,
  //           daughter_name: 'Jane Doe'
  //         }
  //       ],  
  //       serviceList: [  
  //         {
  //           clientId: 201,
  //           ServiceName: 'Home Care Services',
  //           ServiceDescription: 'Comprehensive home care for elderly clients.',
  //           vendorName: 'Sarah Thompson',
  //           vendorContact: '9922345678',
  //           serviceStatus: 'Active',
  //           creationDate: '21/10/2025'
  //         }
  //       ],
  //       events: [
  //         {
  //           id: 301,
  //           title: 'Health Workshop',

  //           description: 'A workshop on elderly health care.',  
  //           venue: 'Community Center',
  //           event_date: '2025-11-15'
  //         }
  //       ]
  //     }
  //   }

    console.log('📦 Parents API response:', result)

    if (result.success) {
      // Map the backend data to the format we need
      const parentsData = result.data.parent[0];
      const serviceList = result.data.serviceList;
      const events = result.data.events;
      
      console.log('📊 Mapped parents:', parentsData)
      setUserData(parentsData)
      setClientServices(clientServices)
      setEvents(events)
    } else {
      setParentError(result.message || 'Failed to fetch parents')
    }
  } catch (error) {
    console.error('❌ Error fetching parents:', error)
    setParentError('Failed to load parents. Please try again.')
  } finally {
    setIsLoadingParents(false)
  }
}

  // // Fetch client services from backend
  // const fetchClientServices = async () => {
  //   setIsLoadingServices(true)
  //   setServicesError(null)
    
  //   try {
  //     // const response = await fetch('http://localhost:5001/api/client-services', {
  //     //   headers: {
  //     //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  //     //   }
  //     // })

  //    // const result = await response.json()
  //     const result = {
  //       success: true,
  //       data: [
  //         {
  //           clientId: 201,
  //           ServiceName: 'Home Care Services',
  //           ServiceDescription: 'Comprehensive home care for elderly clients.',
  //           vendorName: 'Sarah Thompson', 

  //           vendorContact: '9922345678',
  //           serviceStatus: 'Active',
  //           creationDate: '21/10/2025'
  //         }
  //       ]
  //     }
      
  //     console.log('📋 Client services fetched:', result)

  //     if (result.success && result.data.length > 0) {
  //       setClientServices(result.data)
  //     } else {
  //       // Use dummy data if no data from backend
  //       setClientServices([
  //         {
  //           ServiceName: 'Home Care Services',
  //           ServiceDescription: 'Comprehensive home care for elderly clients.',
  //           vendorName: 'Sarah Thompson',
  //           vendorContact: '9922345678',
  //           waitingDays: '5',
  //           creationDate: '21/10/2025'
  //         }
  //       ])
  //     }
  //   } catch (error) {
  //     console.error('❌ Error fetching client services:', error)
  //     setServicesError('Failed to load client services. Please try again.')
  //   } finally {
  //     setIsLoadingServices(false)
  //   }
  // }

  const fetchClosedClientServicesLast30Days = async () => {
    setIsLoadingServices(true)
    setServicesError(null)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/client-services`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      const result = await response.json()
      console.log('📋 Client services fetched:', result)

      if (result.success && result.data.length > 0) {
        setClosedServices(result.data)
      } else {
        // Use dummy data if no data from backend
        setClosedServices([
          {
            ServiceName: 'Home Care Services',
            ServiceDescription: 'Comprehensive home care for elderly clients.',
            vendorName: 'Sarah Thompson',
            vendorContact: '9922345678',
            waitingDays: '5',
            creationDate: '21/10/2025',
            completionDate: '25/10/2025'
          }
        ])
      }
    } catch (error) {
      console.error('❌ Error fetching client services:', error)
      setServicesError('Failed to load client services. Please try again.')
    } finally {
      setIsLoadingServices(false)
    }
  }
  // // Check for logged-in parent on component mount
  // useEffect(() => {
  //   const checkParentAuth = () => {
  //     const parentDetails = JSON.parse(localStorage.getItem('user') || 'null')
  //     const userRole = localStorage.getItem('userRole')

  //     console.log('🔍 Checking parent authentication...')
  //     console.log('User role:', userRole)
  //     console.log('Parent details:', parentDetails)

  //   //   if (userRole === 'parent' && parentDetails) {
  //   //     try {
  //   //       const parsedParent = JSON.parse(parentDetails)
  //   //       setLoggedInParent(parsedParent)
  //   //       console.log('✅ Parent authenticated:', parsedParent)
  //   //     } catch (error) {
  //   //       console.error('❌ Error parsing parent details:', error)
  //   //     }
  //   //   } else {
  //   //     console.log('⚠️ No parent logged in')
  //   //   }
  //   // }
  //   if (!parentDetails || userRole !== 'parent') {
  //     router.push('/login')
  //     return
  //   }
  //   setUserData(parentDetails)
  //   checkParentAuth()
  //   fetchParents()
  //   fetchClientServices()
  // }
  // }, [])

  // Search functionality - Open in separate view
  const handleSearch = () => {
    let filtered = parents

    if (searchFilters.parentName) {
      filtered = filtered.filter(parent =>
        parent.parentName.toLowerCase().includes(searchFilters.parentName.toLowerCase())
      )
    }

    if (searchFilters.serviceType) {
      filtered = filtered.filter(parent =>
        parent.service.toLowerCase().includes(searchFilters.serviceType.toLowerCase())
      )
    }

    setFilteredParents(filtered)
    setShowSearchResults(true)
    console.log('🔍 Search results:', filtered)
  }

  // Back to main view
  const handleBackToMain = () => {
    setShowSearchResults(false)
    setSearchFilters({ parentName: '', serviceType: '' })
    setFilteredParents(parents)
  }

  // Reset search
  const handleResetSearch = () => {
    setSearchFilters({ parentName: '', serviceType: '' })
    setFilteredParents(parents)
  }

  const handleAddNewParent = () => {
    alert('Add New Parent functionality would open a form here')
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('parentDetails')
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
        const updatedServices = [...clientServices]
        updatedServices[index].serviceStatus = newStatus
        setClientServices(updatedServices)
        console.log('✅ Status updated successfully')
      } else {
        alert('Failed to update status: ' + result.message)
      }
    } catch (error) {
      console.error('❌ Error updating status:', error)
      // Update locally even if API fails
      const updatedServices = [...clientServices]
      updatedServices[index].serviceStatus = newStatus
      setClientServices(updatedServices)
    }
  }

  // Check if a parent row matches the logged-in parent
  const isLoggedInParentRow = (parentId) => {
    return loggedInParent && loggedInParent.parentId === parentId
  }

  // Refresh data
  const handleRefresh = () => {
    fetchParents()
    fetchClientServices()
  }

  // Open verification modal
  const openVerificationModal = (parentId, parentName) => {
    setVerificationModal({
      isOpen: true,
      parentId,
      parentName,
      file: null
    })
  }

  // Close verification modal
  const closeVerificationModal = () => {
    setVerificationModal({
      isOpen: false,
      parentId: null,
      parentName: '',
      file: null
    })
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is a zip
      if (!file.name.endsWith('.zip')) {
        alert('Please upload a ZIP file')
        return
      }
      setVerificationModal(prev => ({ ...prev, file }))
    }
  }

  // Submit verification
  const handleVerificationSubmit = async () => {
    if (!verificationModal.file) {
      alert('Please select a ZIP file to upload')
      return
    }

    const formData = new FormData()
    formData.append('verification_doc', verificationModal.file)
    formData.append('parent_id', verificationModal.parentId)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/dashboard/parent-details/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        alert('Parent verified successfully!')
        closeVerificationModal()
        // Refresh parents list
        fetchParents()
      } else {
        alert('Verification failed: ' + result.message)
      }
    } catch (error) {
      console.error('❌ Verification error:', error)
      alert('Verification failed. Please try again.')
    }
  }

  // Render Search Results Page
  if (showSearchResults) {
    return (
      <>
        <Head>
          <title>Search Results - Parent Management</title>
        </Head>
        
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 20px'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
              <button
                onClick={handleBackToMain}
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ← Back to Main
              </button>
            </div>

            <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                Search Results
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
                Found {filteredParents.length} parent(s)
              </p>
            </div>

            {/* Search Results Table */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 2fr 1fr 1.5fr 1fr',
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
                <div>VERIFIED</div>
              </div>

              {filteredParents.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  background: '#f7fafc'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
                  <p style={{ color: '#718096', fontSize: '16px' }}>No parents found matching your search</p>
                </div>
              ) : (
                filteredParents.map((parent, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 2fr 1fr 1.5fr 1fr',
                    padding: '15px',
                    borderBottom: '1px solid #f0f0f0',
                    background: index % 2 === 0 ? '#fafafa' : 'white',
                    fontSize: '14px',
                    alignItems: 'center'
                  }}>
                    <div>{parent.service}</div>
                    <div style={{ fontWeight: '600' }}>{parent.parentName}</div>
                    <div style={{ fontWeight: '600' }}>{parent.parentId}</div>
                    <div>{parent.contactNumber}</div>
                    <div>
                      {parent.isVerified ? (
                        <span style={{
                          background: '#c6f6d5',
                          color: '#22543d',
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'inline-block'
                        }}>
                          ✓ Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => openVerificationModal(parent.parentId, parent.parentName)}
                          style={{
                            background: '#ed8936',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Main Page
  return (
    <>
      <Head>
        <title>Parent Management - Parent Care Services</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header - Title in one line, no refresh button */}
          <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
              Parent Dashboard
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
              Streamline your parent relationships and service management with our comprehensive platform
            </p>
          </div>

          {/* Logged In Parent Info Card */}
          {loggedInParent && (
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
                  Logged In Parent Details
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
                        Parent ID
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {userData.id}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Parent Name
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {userData.name}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Email
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#4299e1', marginTop: '5px' }}>
                        {userData.email}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Contact Number
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {userData.phone}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Service Type
                      </label>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748', marginTop: '5px' }}>
                        {userData.serviceType}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Login Time
                      </label>
                      <div style={{ fontSize: '14px', color: '#718096', marginTop: '5px' }}>
                        {new Date(userData.loginTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                
                {userData.address && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                    <label style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Address
                    </label>
                    <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '5px' }}>
                      {userData.address}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
           {/* Profile Information Card */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', marginBottom: '25px' }}>
            Profile Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', background: '#f7fafc', padding: '25px', borderRadius: '10px' }}>
            <div>
              <div style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                Parent Id/Name
              </div>
              <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                {userData?.id || 'N/A'}|{userData?.name || 'N/A'}
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
            <div>
              <div style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                Emergency Contact
              </div>
              <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                {userData?.emergency_contact_name || 'N/A'}  | {userData?.emergency_contact || 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>
                Alotted Daughter:
              </div>
              <div style={{ color: '#2d3748', fontSize: '16px', fontWeight: '600' }}>
                {userData?.daughter_id || 'N/A'}  | {userData?.daughter_name || 'N/A'}
              </div>
            </div>
          </div>
        </div>

          {/* Active Service Queue Section */}
          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748' }}>
               Active Service Requests 
            </h2>
            <button style={{ background: '#48bb78', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
              + New Service Request
            </button>
          </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr  1fr 1fr',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '5px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '600',
              fontSize: '12px'
            }}>
              
              <div>SERVICE TYPE</div>
              <div>SERVICE DESCRIPTION</div>
              <div>VENDOR Details</div>
              <div>APPOINTMENT DATE</div>
              <div>CREATED ON</div>
              <div>ESCALATE</div> {/*this column contains escalate button*/}
              
              {/* <div>DAUGHTER CONTACT NO</div>
              <div>SERVICE STATUS</div> */}
            </div>

            {/* Loading State */}
            {isLoadingServices && (
              <div style={{
                padding: '5px',
                textAlign: 'center',
                background: '#f7fafc',
                borderRadius: '0 0 10px 10px'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                <p style={{ color: '#718096' }}>Loading client services...</p>
              </div>
            )}

            {/* Client Services Table Rows - Always show dummy data */}
            {!isLoadingServices && clientServices.map((service, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr  1fr 1fr',
                padding: '5px',
                borderBottom: '1px solid #f0f0f0',
                alignItems: 'center',
                background: index % 2 === 0 ? '#fafafa' : 'white',
                fontSize: '13px'
              }}>
              {/* service_location:|service_charge|created_at|booking_date|special_instructions|service_location|service_type  */}
                <div >{service.service_type}</div>
                <div>{service.special_instructions}<br/> charge: {service.service_charge}
                <br/>
                </div>
                <div style={{ fontWeight: '600' }}>{service.vendor_name}</div>
                <div style={{ fontWeight: '600' }}>{service.vendorContact}</div>
                <div>{service.waitingDays}</div>
                <div>{service.creationDate}</div>
                <div>
                  <button
                onClick={() => handleServiceStatusChange(index, 'Escalated')}
                style={{
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Escalate
              </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed Service Queue Section */}
          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2d3748', marginBottom: '25px' }}>
             Closed Service Requests 
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1.5fr 1.5fr 1.5fr  1.5fr 1fr',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '5px',
              borderRadius: '10px 10px 0 0',
              fontWeight: '600',
              fontSize: '12px'
            }}>
              
              <div>SERVICE NAME</div>
              <div>SERVICE DESCRIPTION</div>
              <div>VENDOR NAME</div>
              <div>VENDOR CONTACT NO</div>
              <div>SERVICE INITIATED ON</div>
              <div>SERVICE COMPLETED ON</div>
              <div>REOPEN</div> {/*this column contains escalate button*/}
              
              {/* <div>DAUGHTER CONTACT NO</div>
              <div>SERVICE STATUS</div> */}
            </div>

            {/* Loading State */}
            {isLoadingServices && (
              <div style={{
                padding: '5px',
                textAlign: 'center',
                background: '#f7fafc',
                borderRadius: '0 0 10px 10px'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                <p style={{ color: '#718096' }}>Loading client services...</p>
              </div>
            )}

            {/* Client Services Table Rows - Always show dummy data */}
            {!isLoadingServices && closedServices.map((closedService, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr 1.5fr 1fr .5fr  1fr 1fr',
                padding: '5px',
                borderBottom: '1px solid #f0f0f0',
                alignItems: 'center',
                background: index % 2 === 0 ? '#fafafa' : 'white',
                fontSize: '13px'
              }}>
               
                <div >{closedService.ServiceName}</div>
                <div>{closedService.ServiceDescription}</div>
                <div style={{ fontWeight: '600' }}>{closedService.vendorName}</div>
                <div style={{ fontWeight: '600' }}>{closedService.vendorContact}</div>
                <div>{closedService.creationDate}</div>
                <div>{closedService.completionDate}</div>
                <div>
                  <button
                onClick={() => handleServiceStatusChange(index, 'Close')}
                style={{
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Re-open
              </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {verificationModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '10px' }}>
              Verify Parent
            </h2>
            <p style={{ color: '#718096', marginBottom: '30px' }}>
              {verificationModal.parentName}
            </p>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', marginBottom: '10px', fontWeight: '600' }}>
                Upload Verification Document (ZIP file)
              </label>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px dashed #cbd5e0',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
              {verificationModal.file && (
                <p style={{ marginTop: '10px', color: '#48bb78', fontSize: '14px' }}>
                  ✓ {verificationModal.file.name}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeVerificationModal}
                style={{
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleVerificationSubmit}
                disabled={!verificationModal.file}
                style={{
                  background: verificationModal.file ? '#48bb78' : '#cbd5e0',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: verificationModal.file ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ParentDashboard