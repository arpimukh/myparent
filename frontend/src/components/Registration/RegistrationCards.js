const RegistrationCards = ({ onOpenForm }) => {
  const cards = [
    {
      type: 'parent',
      icon: '👴',
      title: 'Parent Registration',
      description: 'Register as a care recipient to receive professional assistance and support services.',
      features: [
        'Access to all care services',
        '24/7 healthcare monitoring',
        'Emergency contact system',
        'Personalized care plans',
        'Family connection features'
      ],
      buttonText: 'Register as Parent',
      bgColor: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    },
    {
      type: 'daughter',
      icon: '👩',
      title: 'Daughter Registration',
      description: 'Register as a family caregiver to coordinate and manage your parent\'s care needs.',
      features: [
        'Coordinate parent\'s care services',
        'Real-time updates and notifications',
        'Service scheduling and management',
        'Emergency alerts and contacts',
        'Family communication hub'
      ],
      buttonText: 'Register as Daughter',
      bgColor: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    },
    {
      type: 'vendor',
      icon: '🏢',
      title: 'Vendor Registration',
      description: 'Register as a service provider to offer your professional care services to families in need.',
      features: [
        'Join our verified provider network',
        'Access to client referrals',
        'Professional profile showcase',
        'Flexible service offerings',
        'Secure payment processing'
      ],
      buttonText: 'Register as Vendor',
      bgColor: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '32px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {cards.map((card) => (
        <div
          key={card.type}
          onClick={() => onOpenForm(card.type)}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px 35px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)'
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{card.icon}</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', color: '#2d3748' }}>
            {card.title}
          </h2>
          <p style={{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '25px' }}>
            {card.description}
          </p>
          
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '25px', padding: 0 }}>
            {card.features.map((feature, index) => (
              <li key={index} style={{
                padding: '8px 0',
                color: '#4a5568',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px'
              }}>
                <span style={{ color: '#48bb78', fontWeight: 'bold', marginRight: '10px', fontSize: '16px' }}>
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
          
          <button style={{
            background: card.bgColor,
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            width: '100%'
          }}>
            {card.buttonText}
          </button>
        </div>
      ))}
    </div>
  )
}

export default RegistrationCards