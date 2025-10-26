const CitySelection = ({ selectedCity, setSelectedCity }) => {
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
  
    return (
      <section className="bg-gradient-primary text-white py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            📍 Please select your city.
          </h2>
          <div className="max-w-md mx-auto relative">
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full px-6 py-4 rounded-full text-gray-800 text-lg appearance-none cursor-pointer shadow-lg"
            >
              <option value="">Select your city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600">
              ▼
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default CitySelection