import { useState } from 'react'
import Link from 'next/link'

const Layout = ({ children }) => {
  const [email, setEmail] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
  ]

  const handleCityChange = (e) => {
    const city = e.target.value
    setSelectedCity(city)
    if (city) {
      setTimeout(() => {
        alert(`Great! Services for ${city} are now available.`)
      }, 500)
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing! You will receive our latest updates.')
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span className="text-sm">Helpline: +91 900-783-3933</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span className="text-sm">care@parentcare.com</span>
              </div>
              
              {/* City Selector */}
              <div className="flex items-center gap-2">
                <span>📍</span>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  className="bg-white text-gray-800 px-4 py-2 rounded text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select your city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <Link 
                href="/register" 
                className="bg-yellow-400 text-indigo-600 px-4 py-2 rounded text-sm font-semibold hover:bg-yellow-300 transition-all hover:scale-105"
              >
                Register Now
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Are you already a member?</span>
              <Link 
                href="/login" 
                className="bg-white text-indigo-600 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition-all"
              >
                Member Login
              </Link>
              <Link 
                href="#payment" 
                className="bg-yellow-400 text-indigo-600 px-4 py-2 rounded text-sm font-semibold hover:bg-yellow-300 transition-all hover:scale-105"
              >
                Pay Online
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          {/* Newsletter Section */}
          <div className="bg-gray-100 text-gray-800 py-12 -mx-4">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div>
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <span>📧</span>
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Stay updated with the latest news and updates from ParentCare Services
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex rounded-full overflow-hidden shadow-lg max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-6 py-3 border-none outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Follow ParentCare On</h3>
                  <div className="flex justify-center gap-4">
                    <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform">
                      f
                    </a>
                    <a href="#" className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform">
                      in
                    </a>
                    <a href="#" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform">
                      ▶
                    </a>
                    <a href="#" className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform">
                      📷
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-6 text-center">
            <p>&copy; 2024 Compassionate Parent Care Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout