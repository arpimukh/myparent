const Services = () => {
  const services = [
    {
      icon: '🏥',
      title: 'Premium Healthcare Assistance',
      description: 'Professional healthcare support including medication management, health monitoring, and coordination with medical professionals to ensure optimal health outcomes.'
    },
    {
      icon: '🧹',
      title: 'Home Cleaning Services',
      description: 'Comprehensive house cleaning and maintenance services to keep your parent\'s living space clean, safe, and comfortable. Regular or one-time cleaning available.'
    },
    {
      icon: '🍽️',
      title: 'Cooking & Food Delivery',
      description: 'Nutritious meal preparation and delivery services tailored to dietary needs and preferences. Fresh, healthy meals delivered right to their door.'
    },
    {
      icon: '📅',
      title: 'Appointment Booking & Errands',
      description: 'Complete assistance with scheduling and accompanying to bank visits, medical check-ups, and handling various personal errands and administrative tasks.'
    },
    {
      icon: '🔧',
      title: 'Home & Appliance Repair',
      description: 'Reliable home maintenance and appliance repair services to ensure a safe and functional living environment. Quick response to maintenance needs.'
    },
    {
      icon: '🧘',
      title: 'Activity & Social Planning',
      description: 'Organizing engaging activities including yoga sessions, social meetups, recreational outings, and hobby groups to promote physical and mental wellbeing.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-indigo-500"
            >
              <div className="text-5xl mb-4 text-indigo-500">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services