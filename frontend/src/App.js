import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const App = () => {
  const [callbackForm, setCallbackForm] = useState({ phone: '', name: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/registration/callback`, callbackForm);
      setMessage('✅ Callback request submitted! We will contact you within 24 hours.');
      setCallbackForm({ phone: '', name: '', message: '' });
    } catch (error) {
      setMessage('❌ Failed to submit request. Please try again.');
      console.error('Callback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    { 
      icon: '🏥', 
      title: 'Premium Healthcare', 
      desc: '24/7 health monitoring, medication management, and coordination with medical professionals for optimal health outcomes.',
      color: 'bg-red-50 border-red-200'
    },
    { 
      icon: '🏠', 
      title: 'Home Cleaning', 
      desc: 'Professional house cleaning and maintenance services to keep your parent\'s living space clean, safe, and comfortable.',
      color: 'bg-blue-50 border-blue-200'
    },
    { 
      icon: '👨‍🍳', 
      title: 'Cooking Services', 
      desc: 'Nutritious meal preparation tailored to dietary needs and preferences, ensuring healthy and delicious meals.',
      color: 'bg-green-50 border-green-200'
    },
    { 
      icon: '🚚', 
      title: 'Food Delivery', 
      desc: 'Fresh groceries and prepared meals delivered right to their door, maintaining nutrition and convenience.',
      color: 'bg-orange-50 border-orange-200'
    },
    { 
      icon: '📅', 
      title: 'Appointment Booking', 
      desc: 'Complete assistance with scheduling and accompanying to bank visits, medical check-ups, and personal errands.',
      color: 'bg-purple-50 border-purple-200'
    },
    { 
      icon: '🔧', 
      title: 'Home Repairs', 
      desc: 'Reliable home maintenance and appliance repair services to ensure a safe and functional living environment.',
      color: 'bg-yellow-50 border-yellow-200'
    },
    { 
      icon: '🧘', 
      title: 'Activity Planning', 
      desc: 'Organizing engaging activities including yoga sessions, social meetups, and recreational outings for wellbeing.',
      color: 'bg-pink-50 border-pink-200'
    }
  ];

  const registrationTypes = [
    {
      type: 'parent',
      icon: '👴',
      title: 'Parent Registration',
      subtitle: 'Register as a care recipient',
      description: 'Register to receive professional assistance and support services.',
      features: [
        'Access to all care services',
        '24/7 healthcare monitoring', 
        'Emergency contact system',
        'Personalized care plans',
        'Family connection features'
      ],
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      type: 'daughter',
      icon: '👩',
      title: 'Family Member Registration',
      subtitle: 'Register as a family caregiver',
      description: 'Register to coordinate and manage your parent\'s care needs.',
      features: [
        'Coordinate parent\'s care services',
        'Real-time updates and notifications',
        'Service scheduling and management', 
        'Emergency alerts and contacts',
        'Family communication hub'
      ],
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      type: 'vendor',
      icon: '🏢',
      title: 'Service Provider Registration',
      subtitle: 'Register as a care service provider',
      description: 'Register to offer your professional care services to families.',
      features: [
        'Join verified provider network',
        'Access to client referrals',
        'Professional profile showcase',
        'Flexible service offerings',
        'Secure payment processing'
      ],
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200'
    }
  ];

  const trustIndicators = [
    { icon: '❤️', number: '500+', label: 'Families Served', sublabel: 'Trust Our Care' },
    { icon: '🛡️', number: '100%', label: 'Verified Providers', sublabel: 'Background Checked' },
    { icon: '⏰', number: '24/7', label: 'Support Available', sublabel: 'Always Here' },
    { icon: '👥', number: '98%', label: 'Satisfaction Rate', sublabel: 'Happy Families' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Compassionate Care for Your
              <span className="text-yellow-300 block">Loved Ones</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Professional, reliable, and personalized care services to help your parents 
              live comfortably and safely at home with dignity and independence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowRegistration(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors transform hover:scale-105"
              >
                Get Started Today
              </button>
              <button
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Request Callback
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {trustIndicators.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="text-white font-bold text-xl">{item.number}</h3>
                  <p className="text-blue-200 font-semibold">{item.label}</p>
                  <p className="text-blue-300 text-sm">{item.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">About Our Mission</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 mb-6">
              We understand that caring for aging parents while managing your own responsibilities can be overwhelming. 
              Our comprehensive service platform bridges the gap between family care and professional assistance, 
              ensuring your parents receive the support they need while maintaining their independence and dignity.
            </p>
            <p className="text-lg text-gray-600">
              With years of experience and a team of dedicated professionals, we provide reliable, compassionate 
              care services tailored to each family's unique needs. From healthcare assistance to daily living support, 
              we're here to give you peace of mind and your parents the quality care they deserve.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Comprehensive Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From healthcare monitoring to daily assistance, we provide complete support 
              to help your parents maintain their independence while ensuring their safety and comfort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className={`${service.color} border-2 p-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}>
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      {showRegistration && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Registration Type</h2>
              <p className="text-xl text-gray-600">Select the option that best describes your role in the care process</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {registrationTypes.map((type) => (
                <div
                  key={type.type}
                  className={`${type.bgColor} ${type.borderColor} border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                  onClick={() => setSelectedUserType(type.type)}
                >
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{type.icon}</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{type.title}</h2>
                    <p className="text-gray-600 mb-4">{type.subtitle}</p>
                    <p className="text-gray-700">{type.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {type.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 px-6 bg-gradient-to-r ${type.color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                    Register as {type.type === 'parent' ? 'Parent' : type.type === 'daughter' ? 'Family Member' : 'Service Provider'}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button 
                onClick={() => setShowRegistration(false)}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Close Registration Options
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get Started Today</h2>
            <p className="text-xl text-gray-600">Ready to provide the best care for your parent? Get in touch with us.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-2xl mr-4">📞</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone Support</h4>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-sm text-gray-500">Available 24/7 for emergencies</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-2xl mr-4">📧</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">support@parentcare.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 4 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-2xl mr-4">📍</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Service Areas</h4>
                    <p className="text-gray-600">Hyderabad, Telangana</p>
                    <p className="text-sm text-gray-500">Expanding to more cities soon</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-4">Why Choose Us?</h4>
                <ul className="text-blue-700 space-y-2">
                  <li>✓ Verified and trained care providers</li>
                  <li>✓ Family-focused approach</li>
                  <li>✓ Transparent pricing</li>
                  <li>✓ 24/7 emergency support</li>
                  <li>✓ Regular updates to family members</li>
                </ul>
              </div>
            </div>

            {/* Callback Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Request a Callback</h3>
              
              <form onSubmit={handleCallbackSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={callbackForm.message}
                    onChange={(e) => setCallbackForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Tell us about your care requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors transform hover:scale-105"
                >
                  {loading ? 'Submitting...' : 'Request Callback'}
                </button>
              </form>

              {message && (
                <div className={`mt-6 p-4 rounded-lg text-center ${
                  message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4 text-center">
                We'll call you back within 24 hours to discuss your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Parent Care Services</h3>
              <p className="text-gray-300 mb-4 max-w-md">
                Providing compassionate, professional care services to help your parents 
                live comfortably and safely at home with dignity and independence.
              </p>
              <div className="flex space-x-4">
                <div className="text-2xl cursor-pointer hover:text-blue-400 transition-colors">📘</div>
                <div className="text-2xl cursor-pointer hover:text-pink-400 transition-colors">📷</div>
                <div className="text-2xl cursor-pointer hover:text-blue-400 transition-colors">🐦</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Healthcare Monitoring</li>
                <li>Home Cleaning</li>
                <li>Meal Preparation</li>
                <li>Appointment Booking</li>
                <li>Home Repairs</li>
                <li>Activity Planning</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>📞 +91 98765 43210</p>
                <p>📧 support@parentcare.com</p>
                <p>📍 Hyderabad, Telangana</p>
                <p>🕒 24/7 Support Available</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Parent Care Services. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for families who care</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
