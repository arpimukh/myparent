import { useState } from 'react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing! You will receive our latest updates.')
      setEmail('')
    }
  }

  return (
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
                    className="bg-gradient-secondary px-6 py-3 text-white font-semibold hover:bg-secondary-dark transition-colors"
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
  )
}

export default Footer