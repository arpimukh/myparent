import { useState } from 'react'

const FormModal = ({ isOpen, onClose, selectedRole }) => {
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    aadhar: '',
    voter_id: '',
    pan: '',
    photo: null,
    identity_doc: null,
    
    // Parent-specific fields
    medical_conditions: '',
    emergency_contact: '',
    
    // Daughter-specific fields
    parent_name: '',
    relationship: '',
    
    // Vendor-specific fields
    services: [],
    service_description: '',
    gst_number: ''
  })
  
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('✅ Photo selected:', file.name)
      setFormData(prev => ({ ...prev, photo: file }))
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }))
      }
    }
  }

  const handleIdentityDocChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('✅ Identity doc selected:', file.name)
      setFormData(prev => ({ ...prev, identity_doc: file }))
      if (errors.identity_doc) {
        setErrors(prev => ({ ...prev, identity_doc: '' }))
      }
      if (errors.identity) {
        setErrors(prev => ({ ...prev, identity: '' }))
      }
    }
  }

  const formatAadhar = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 12) {
      return numbers.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim()
    }
    return value
  }

  const handleAadharChange = (e) => {
    const formatted = formatAadhar(e.target.value)
    setFormData(prev => ({ ...prev, aadhar: formatted }))
    if (errors.identity) {
      setErrors(prev => ({ ...prev, identity: '' }))
    }
    if (errors.aadhar) {
      setErrors(prev => ({ ...prev, aadhar: '' }))
    }
  }

  const handleRelationshipSelect = (relationship) => {
    setFormData(prev => ({ ...prev, relationship }))
    if (errors.relationship) {
      setErrors(prev => ({ ...prev, relationship: '' }))
    }
  }

  const handleServiceToggle = (service) => {
    const currentServices = formData.services || []
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service]
    
    console.log('Services updated:', newServices)
    setFormData(prev => ({ ...prev, services: newServices }))
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    console.log('🔍 Validating form for role:', selectedRole)
    console.log('📋 Form data:', formData)

    // Common validations
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.photo) newErrors.photo = 'Profile photo is required'

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Role-specific validations
    if (selectedRole === 'parent') {
      if (!formData.aadhar.trim()) newErrors.aadhar = 'Aadhar number is required'
    }

    if (selectedRole === 'daughter') {
      if (!formData.parent_name.trim()) newErrors.parent_name = 'Parent name is required'
      if (!formData.relationship) newErrors.relationship = 'Relationship is required'
      if (!formData.pan.trim()) newErrors.pan = 'PAN number is required'
      if (!formData.aadhar.trim()) newErrors.aadhar = 'Aadhar number is required'
    }

    if (selectedRole === 'vendor') {
      console.log('📦 Vendor validation:')
      console.log('  - Services:', formData.services)
      console.log('  - Identity doc:', formData.identity_doc?.name)
      console.log('  - Aadhar:', formData.aadhar)
      console.log('  - Voter ID:', formData.voter_id)
      console.log('  - PAN:', formData.pan)
      
      if (!formData.services || formData.services.length === 0) {
        newErrors.services = 'Please select at least one service'
      }
      // For vendor, require at least one identity document NUMBER
      if (!formData.aadhar.trim() && !formData.voter_id.trim() && !formData.pan.trim()) {
        newErrors.identity = 'At least one identity document (Aadhar/Voter ID/PAN) is required'
      }
      // Identity doc FILE is required for vendors
      if (!formData.identity_doc) {
        newErrors.identity_doc = 'Identity document file is required'
      }
    }

    // Format validations (only if field has value)
    if (formData.aadhar && formData.aadhar.trim() && !/^\d{4}\s\d{4}\s\d{4}$/.test(formData.aadhar)) {
      newErrors.aadhar = 'Invalid Aadhar format (XXXX XXXX XXXX)'
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number'
    }

    setErrors(newErrors)
    console.log('❌ Validation errors:', newErrors)
    console.log('✅ Validation result:', Object.keys(newErrors).length === 0 ? 'PASSED' : 'FAILED')
    
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🚀 ============ REGISTRATION STARTED ============')
    console.log('📝 Selected role:', selectedRole)
    
    if (!validateForm()) {
      console.log('⛔ Validation failed - showing errors to user')
      alert('Please fix all errors before submitting:\n\n' + Object.values(errors).join('\n'))
      return
    }

    console.log('✅ Validation passed - proceeding with submission')
    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      
      // FIXED: For vendor, send to different endpoint and don't include 'role'
      if (selectedRole === 'vendor') {
        // Vendor-specific submission to /api/vendor-details/register
        submitData.append('name', formData.name)
        submitData.append('phone', formData.phone)
        submitData.append('email', formData.email)
        submitData.append('password', formData.password)
        submitData.append('address', formData.address)
        submitData.append('aadhar', formData.aadhar || '')
        submitData.append('voter_id', formData.voter_id || '')
        submitData.append('pan', formData.pan || '')
        submitData.append('services', JSON.stringify(formData.services))
        submitData.append('service_description', formData.service_description || '')
        submitData.append('gst_number', formData.gst_number || '')
        
        if (formData.photo) {
          submitData.append('photo', formData.photo)
          console.log('✅ Photo attached:', formData.photo.name)
        }
        
        if (formData.identity_doc) {
          submitData.append('identity_doc', formData.identity_doc)
          console.log('✅ Identity doc attached:', formData.identity_doc.name)
        }
      } else {
        // Parent/Daughter submission to /api/auth/register
        submitData.append('role', selectedRole)
        submitData.append('name', formData.name)
        submitData.append('phone', formData.phone)
        submitData.append('email', formData.email)
        submitData.append('password', formData.password)
        submitData.append('address', formData.address)
        submitData.append('aadhar', formData.aadhar)
        submitData.append('voter_id', formData.voter_id || '')
        submitData.append('pan', formData.pan || '')

        if (formData.photo) {
          submitData.append('photo', formData.photo)
        }

        // Role-specific data
        if (selectedRole === 'parent') {
          submitData.append('medical_conditions', formData.medical_conditions || '')
          submitData.append('emergency_contact', formData.emergency_contact || '')
        } else if (selectedRole === 'daughter') {
          submitData.append('parent_name', formData.parent_name)
          submitData.append('relationship', formData.relationship)
        }
      }

      // Determine API endpoint
      const apiUrl = selectedRole === 'vendor'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/vendor-details/register`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/auth/register`

      console.log('📡 Submitting to:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: submitData,
      })

      console.log('📥 Response status:', response.status)
      const result = await response.json()
      console.log('📥 Response data:', result)

      if (result.success) {
        console.log('🎉 Registration successful!')
        alert(`Registration Successful! Thank you for joining our parent care community. We will contact you shortly to complete the verification process.`)
        onClose()
        // Reset form
        setFormData({
          name: '', phone: '', email: '', password: '', confirmPassword: '', address: '', aadhar: '', voter_id: '', pan: '', photo: null, identity_doc: null,
          medical_conditions: '', emergency_contact: '', parent_name: '', relationship: '',
          services: [], service_description: '', gst_number: ''
        })
        setPhotoPreview(null)
        setErrors({})
      } else {
        console.error('❌ Registration failed:', result.message)
        alert(`Registration failed: ${result.message}`)
      }
    } catch (error) {
      console.error('❌ Registration error:', error)
      alert('Registration failed. Please check your connection and try again.\n\nError: ' + error.message)
    } finally {
      setIsSubmitting(false)
      console.log('🏁 ============ REGISTRATION ENDED ============')
    }
  }

  const renderForm = () => {
    switch (selectedRole) {
      case 'parent':
        return renderParentForm()
      case 'daughter':
        return renderDaughterForm()
      case 'vendor':
        return renderVendorForm()
      default:
        return null
    }
  }

  const renderParentForm = () => (
    <form onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div style={{ marginBottom: '30px', paddingBottom: '25px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          📋 Personal Information
        </h3>
        {renderPersonalInfoFields()}
      </div>

      {/* Photo & Documents Section */}
      <div style={{ marginBottom: '30px', paddingBottom: '25px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          📸 Photo & Documents
        </h3>
        {renderPhotoAndDocuments()}
      </div>

      {/* Care Requirements Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          🏥 Care Requirements
        </h3>
        {renderCareRequirements()}
      </div>

      <button type="submit" disabled={isSubmitting} style={{
        width: '100%', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        color: 'white', padding: '15px', borderRadius: '10px', fontSize: '16px',
        fontWeight: '600', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
        opacity: isSubmitting ? 0.7 : 1
      }}>
        {isSubmitting ? 'Registering...' : 'Complete Parent Registration'}
      </button>
    </form>
  )

  const renderDaughterForm = () => (
    <form onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div style={{ marginBottom: '30px', paddingBottom: '25px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          📋 Personal Information
        </h3>
        {renderPersonalInfoFields()}
      </div>

      {/* Family Relationship Section */}
      <div style={{ marginBottom: '30px', paddingBottom: '25px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          👨‍👩‍👧‍👦 Family Relationship
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Parent's Name <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="text"
            name="parent_name"
            value={formData.parent_name}
            onChange={handleInputChange}
            placeholder="Name of parent requiring care"
            style={{
              width: '100%', padding: '12px 15px',
              border: `2px solid ${errors.parent_name ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
            required
          />
          {errors.parent_name && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.parent_name}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Relationship <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
            {['Daughter', 'Son', 'Daughter-in-law', 'Son-in-law'].map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() => handleRelationshipSelect(rel.toLowerCase())}
                style={{
                  padding: '12px 8px', border: '2px solid #e2e8f0', borderRadius: '8px',
                  textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s',
                  fontSize: '14px', fontWeight: '500',
                  background: formData.relationship === rel.toLowerCase() ? '#fed7aa' : 'white',
                  borderColor: formData.relationship === rel.toLowerCase() ? '#ed8936' : '#e2e8f0',
                  color: formData.relationship === rel.toLowerCase() ? '#9c4221' : '#4a5568'
                }}
              >
                {rel}
              </button>
            ))}
          </div>
          {errors.relationship && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.relationship}</span>}
        </div>
      </div>

      {/* Photo & Documents Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          📸 Photo & Documents
        </h3>
        {renderPhotoAndDocuments(true)}
      </div>

      <button type="submit" disabled={isSubmitting} style={{
        width: '100%', background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
        color: 'white', padding: '15px', borderRadius: '10px', fontSize: '16px',
        fontWeight: '600', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
        opacity: isSubmitting ? 0.7 : 1
      }}>
        {isSubmitting ? 'Registering...' : 'Complete Daughter Registration'}
      </button>
    </form>
  )

  const renderVendorForm = () => (
    <form onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div style={{ marginBottom: '30px', paddingBottom: '25px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          📋 Personal Information
        </h3>
        {renderPersonalInfoFields('vendor')}
      </div>

      {/* Services Offered Section */}
      <div style={{ marginBottom: '30px', paddingBottom: '25px', borderBottom: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          🛠️ Services Offered
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Select Services You Provide <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: '15px', maxHeight: '300px', overflowY: 'auto', padding: '5px' }}>
            {[
              'Care giver',
              'Care giver agency',
              'Nanny agency',
              'Nanny',
              'Critical care giver',
              'Cook',
              'Maid',
              'Nurse',
              'Doctor',
              'Yoga practitioner',
              'Physiotherapist',
              'Dentist',
              'Medicine dealer',
              'Medical store',
              'Travel agent',
              'Delivery person',
              'Care manager',
              'Plumber',
              'Barber',
              'Electrician',
              'Grocery dealer'
            ].map((service) => (
              <div
                key={service}
                onClick={() => handleServiceToggle(service)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '15px',
                  border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: formData.services?.includes(service) ? '#f7faff' : 'white',
                  borderColor: formData.services?.includes(service) ? '#9f7aea' : '#e2e8f0'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.services?.includes(service) || false}
                  onChange={() => {}}
                  style={{ width: '18px', height: '18px', accentColor: '#9f7aea', pointerEvents: 'none' }}
                />
                <label style={{ cursor: 'pointer', fontWeight: formData.services?.includes(service) ? '600' : 'normal', pointerEvents: 'none' }}>
                  {service}
                </label>
              </div>
            ))}
          </div>
          {errors.services && <span style={{ color: '#e53e3e', fontSize: '12px', display: 'block', marginTop: '8px' }}>{errors.services}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Service Description
          </label>
          <textarea
            name="service_description"
            value={formData.service_description}
            onChange={handleInputChange}
            placeholder="Describe your services and experience"
            rows="3"
            style={{
              width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc',
              outline: 'none', resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Documents Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
          📸 Documents
        </h3>
        {renderVendorDocuments()}
      </div>

      <button type="submit" disabled={isSubmitting} style={{
        width: '100%', background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
        color: 'white', padding: '15px', borderRadius: '10px', fontSize: '16px',
        fontWeight: '600', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
        opacity: isSubmitting ? 0.7 : 1,
        transition: 'all 0.3s'
      }}>
        {isSubmitting ? 'Registering...' : 'Complete Vendor Registration'}
      </button>
    </form>
  )

  const renderPersonalInfoFields = (type = 'personal') => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Full Name <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            style={{
              width: '100%', padding: '12px 15px',
              border: `2px solid ${errors.name ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
            required
          />
          {errors.name && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.name}</span>}
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Contact Number <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone number"
            style={{
              width: '100%', padding: '12px 15px',
              border: `2px solid ${errors.phone ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
            required
          />
          {errors.phone && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.phone}</span>}
        </div>
      </div>

      {/* Email Address Field */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          Email Address <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email address"
          style={{
            width: '100%', padding: '12px 15px',
            border: `2px solid ${errors.email ? '#e53e3e' : '#e2e8f0'}`,
            borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
          }}
          required
        />
        {errors.email && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.email}</span>}
      </div>

      {/* Password and Confirm Password Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Password <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create password"
            minLength="8"
            style={{
              width: '100%', padding: '12px 15px',
              border: `2px solid ${errors.password ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
            required
          />
          {errors.password && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.password}</span>}
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Confirm Password <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            minLength="8"
            style={{
              width: '100%', padding: '12px 15px',
              border: `2px solid ${errors.confirmPassword ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
            required
          />
          {errors.confirmPassword && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.confirmPassword}</span>}
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          Address <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Complete address with pincode"
          rows="3"
          style={{
            width: '100%', padding: '12px 15px',
            border: `2px solid ${errors.address ? '#e53e3e' : '#e2e8f0'}`,
            borderRadius: '8px', fontSize: '16px', background: '#f7fafc',
            outline: 'none', resize: 'vertical'
          }}
          required
        />
        {errors.address && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.address}</span>}
      </div>
    </>
  )

  const renderPhotoAndDocuments = (requirePan = false) => (
    <>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          Profile Photo <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <div style={{
          border: `2px dashed ${errors.photo ? '#e53e3e' : '#cbd5e0'}`,
          borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer'
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
            id="photo-upload"
            required
          />
          <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" style={{ 
                width: '100px', height: '100px', objectFit: 'cover', 
                borderRadius: '50%', margin: '0 auto 10px' 
              }} />
            ) : (
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
            )}
            <p style={{ color: '#718096' }}>
              Click to upload photo
            </p>
          </label>
        </div>
        {errors.photo && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.photo}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Aadhar Number <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleAadharChange}
            placeholder="XXXX XXXX XXXX"
            maxLength="14"
            style={{
              width: '100%', padding: '12px 15px',
              border: `2px solid ${errors.aadhar ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
            required
          />
          {errors.aadhar && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.aadhar}</span>}
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Voter ID Number
          </label>
          <input
            type="text"
            name="voter_id"
            value={formData.voter_id}
            onChange={handleInputChange}
            placeholder="Voter ID (Optional)"
            style={{
              width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          PAN Number {requirePan && <span style={{ color: '#e53e3e' }}>*</span>}
        </label>
        <input
          type="text"
          name="pan"
          value={formData.pan}
          onChange={handleInputChange}
          placeholder="PAN (Optional)"
          maxLength="10"
          style={{
            width: '100%', padding: '12px 15px',
            border: `2px solid ${errors.pan ? '#e53e3e' : '#e2e8f0'}`,
            borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
          }}
          required={requirePan}
        />
        {errors.pan && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.pan}</span>}
      </div>
    </>
  )

  const renderCareRequirements = () => (
    <>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          Medical Conditions (if any)
        </label>
        <textarea
          name="medical_conditions"
          value={formData.medical_conditions}
          onChange={handleInputChange}
          placeholder="Describe any medical conditions or special care requirements"
          rows="3"
          style={{
            width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
            borderRadius: '8px', fontSize: '16px', background: '#f7fafc',
            outline: 'none', resize: 'vertical'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          Emergency Contact
        </label>
        <input
          type="text"
          name="emergency_contact"
          value={formData.emergency_contact}
          onChange={handleInputChange}
          placeholder="Emergency contact person and number"
          style={{
            width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
            borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
          }}
        />
      </div>
    </>
  )

  const renderVendorDocuments = () => (
    <>
      {/* Profile Photo Upload */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          Profile Photo <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <div style={{
          border: `2px dashed ${errors.photo ? '#e53e3e' : '#cbd5e0'}`,
          borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer'
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
            id="photo-upload"
            required
          />
          <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" style={{ 
                width: '100px', height: '100px', objectFit: 'cover', 
                borderRadius: '50%', margin: '0 auto 10px' 
              }} />
            ) : (
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
            )}
            <p style={{ color: '#718096' }}>
              Click to upload profile photo
            </p>
            {formData.photo && (
              <p style={{ color: '#48bb78', marginTop: '8px', fontWeight: '600' }}>
                ✓ {formData.photo.name}
              </p>
            )}
          </label>
        </div>
        {errors.photo && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.photo}</span>}
      </div>

      {/* Identity Document Upload */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
          Identity Doc <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <div style={{
          border: `2px dashed ${errors.identity_doc ? '#e53e3e' : '#cbd5e0'}`,
          borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer'
        }}>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleIdentityDocChange}
            style={{ display: 'none' }}
            id="identity-doc-upload"
            required
          />
          <label htmlFor="identity-doc-upload" style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
            <p style={{ color: '#718096' }}>
              Click to upload identity document (Aadhar/PAN/Voter ID)
            </p>
            {formData.identity_doc && (
              <p style={{ color: '#48bb78', marginTop: '8px', fontWeight: '600' }}>
                ✓ {formData.identity_doc.name}
              </p>
            )}
          </label>
        </div>
        {errors.identity_doc && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.identity_doc}</span>}
      </div>

      {/* Identity Numbers - At least one required */}
      <div style={{ marginBottom: '15px', padding: '12px', background: '#fffaf0', borderRadius: '8px', border: '1px solid #fbd38d' }}>
        <p style={{ fontSize: '14px', color: '#744210', marginBottom: '0' }}>
          📌 Please provide at least one identity number (Aadhar, Voter ID, or PAN)
        </p>
      </div>
      {errors.identity && <div style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '15px' }}>{errors.identity}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Aadhar Number
          </label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleAadharChange}
            placeholder="XXXX XXXX XXXX"
            maxLength="14"
            style={{
              width: '100%', padding: '12px 15px',
              border: `2px solid ${errors.aadhar ? '#e53e3e' : '#e2e8f0'}`,
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
          />
          {errors.aadhar && <span style={{ color: '#e53e3e', fontSize: '12px' }}>{errors.aadhar}</span>}
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            Voter ID Number
          </label>
          <input
            type="text"
            name="voter_id"
            value={formData.voter_id}
            onChange={handleInputChange}
            placeholder="Voter ID"
            style={{
              width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            PAN Number
          </label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleInputChange}
            placeholder="PAN"
            maxLength="10"
            style={{
              width: '100%', padding: '12px 15px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568', fontSize: '14px' }}>
            GST Number (if applicable)
          </label>
          <input
            type="text"
            name="gst_number"
            value={formData.gst_number}
            onChange={handleInputChange}
            placeholder="GST Registration Number"
            style={{
              width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '16px', background: '#f7fafc', outline: 'none'
            }}
          />
        </div>
      </div>
    </>
  )

  const getFormConfig = () => {
    switch (selectedRole) {
      case 'parent':
        return { icon: '👴', title: 'Parent Registration', subtitle: 'Register as a care recipient', badge: 'CLIENT ROLE', badgeColor: '#c6f6d5', badgeTextColor: '#22543d' }
      case 'daughter':
        return { icon: '👩', title: 'Daughter Registration', subtitle: 'Register as a family caregiver', badge: 'DAUGHTER ROLE', badgeColor: '#fed7aa', badgeTextColor: '#9c4221' }
      case 'vendor':
        return { icon: '🏢', title: 'Vendor Registration', subtitle: 'Register as a service provider', badge: 'VENDOR ROLE', badgeColor: '#e9d8fd', badgeTextColor: '#553c9a' }
      default:
        return { icon: '📝', title: 'Registration', subtitle: 'Complete your registration', badge: 'USER ROLE', badgeColor: '#e2e8f0', badgeTextColor: '#4a5568' }
    }
  }

  const config = getFormConfig()

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.8)', zIndex: 1000, display: 'flex',
      justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        maxWidth: '700px', width: '100%', maxHeight: '90vh',
        overflow: 'auto', position: 'relative'
      }}>
        <button onClick={onClose} disabled={isSubmitting} style={{
          position: 'absolute', top: '15px', right: '20px', background: 'none',
          border: 'none', fontSize: '28px', cursor: 'pointer', color: '#718096'
        }}>
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{config.icon}</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '8px' }}>
            {config.title}
          </h2>
          <p style={{ color: '#718096', marginBottom: '15px' }}>
            {config.subtitle}
          </p>
          <span style={{
            display: 'inline-block', padding: '8px 16px',
            background: config.badgeColor, color: config.badgeTextColor,
            borderRadius: '25px', fontSize: '12px', fontWeight: '600',
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {config.badge}
          </span>
        </div>

        {renderForm()}
      </div>
    </div>
  )
}

export default FormModal