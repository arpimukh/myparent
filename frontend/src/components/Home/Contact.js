import { useState } from 'react'
import Link from 'next/link'

const Contact = () => {
  const [phone, setPhone] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!phone.trim()) {
      setError('Phone number is required')
      return
    }
    
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/
    if (!phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number')
      return
    }
    
    setError('')
    setSuccess(true)
    setPhone('')
    
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <section className="py-20 bg-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
          Get Started Today
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Ready to provide the best care for your parent? Contact us to discuss your specific needs.
        </p>
        
        <div className="mb-8">
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            Complete Registration
          </Link>
        </div>

        <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Request a Callback</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-left">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 border-2 rounded-lg transition-colors ${
                  error ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
                } outline-none`}
                required
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {success && <p className="text-green-600 text-sm mt-2">Thank you! We will call you back within 24 hours.</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              Get Callback
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact