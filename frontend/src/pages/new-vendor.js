import { useState } from 'react'
import Head from 'next/head'

export default function NewVendor() {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    services:'',
    Description: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Updated to use Node.js backend API
      const response = await fetch('http://localhost:5001/api/vendors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitted(true)
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            contactNumber: '',
            email: '',
            Description: ''
          })
          setSubmitted(false)
        }, 5000)
      } else {
        setError(data.message || 'Failed to submit registration. Please try again.')
      }
    } catch (err) {
      console.error('Submission error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Vendor Registration - Parent Care s</title>
        <meta name="description" content="Join our network of compassionate care  providers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            Compassionate Parent Care Vendor s
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: '0.9', maxWidth: '600px', margin: '0 auto' }}>
            Join our network of trusted  providers and help families care for their loved ones
          </p>
        </div>
      </section>

      {/* About Section */}
    {
    /*  <section style={{ padding: '64px 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px', color: '#333' }}>
            About Us
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            lineHeight: '1.8', 
            color: '#555', 
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            Our mission is to provide peace of mind to families by offering reliable, professional care s tailored to
            your parent's unique needs. We understand the challenges of ensuring your loved ones receive the support
            they deserve while maintaining their independence and dignity. With years of experience and a compassionate
            team, we're here to bridge the gap between family care and professional assistance, making daily life easier and
            more enjoyable for your parents.
          </p>
        </div>
      </section>*/}

      {/* Vendor Registration Form */}
      <section style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: '16px',
              color: '#667eea'
            }}>
              Join Us as a Vendor
            </h2>
            <p style={{ 
              textAlign: 'center', 
              color: '#666', 
              marginBottom: '40px',
              fontSize: '1.1rem'
            }}>
              Fill out the form below and we'll get back to you soon
            </p>

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Full Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Contact Number Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Contact Number <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter your contact number"
                  pattern="[0-9]{10}"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                <small style={{ color: '#666', fontSize: '0.875rem' }}>10-digit mobile number</small>
              </div>

              {/* Email Field (Optional) */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Email <span style={{ color: '#999', fontWeight: '400' }}>(Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter your email address"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
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
          </div>
        </div>

              {/* Service Description Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  Service Description <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Describe the services you can provide (e.g., healthcare assistance, home cleaning, meal preparation, etc.)"
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    opacity: loading ? 0.6 : 1
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Error Message */}
              {error && (
                <p style={{ 
                  textAlign: 'center', 
                  marginBottom: '24px', 
                  color: '#ef4444',
                  fontSize: '1rem',
                  fontWeight: '500',
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '8px'
                }}>
                  ⚠ {error}
                </p>
              )}

              {/* Success Message */}
              {submitted && (
                <p style={{ 
                  textAlign: 'center', 
                  marginBottom: '24px', 
                  color: '#10b981',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  padding: '12px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '8px'
                }}>
                  ✓ Expect a callback soon from us
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  background: loading 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
                  }
                }}
              >
                {loading ? 'Submitting...' : 'Get Callback'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}