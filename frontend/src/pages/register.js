import { useState } from 'react'
import Head from 'next/head'
import RegistrationCards from '../components/Registration/RegistrationCards'
import FormModal from '../components/Registration/FormModal'

export default function Register() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  const openForm = (role) => {
    setSelectedRole(role)
    setIsModalOpen(true)
  }

  const closeForm = () => {
    setIsModalOpen(false)
    setSelectedRole(null)
  }

  return (
    <>
      <Head>
        <title>Register - Parent Care Services</title>
        <meta name="description" content="Register for Parent Care Services - Choose your role" />
      </Head>
      
      <div className="min-h-screen bg-gradient-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Parent Care Services Registration
            </h1>
            <p className="text-xl opacity-90">
              Choose your role to get started with our comprehensive care platform
            </p>
          </div>
          
          <RegistrationCards onOpenForm={openForm} />
          
          <FormModal 
            isOpen={isModalOpen}
            onClose={closeForm}
            selectedRole={selectedRole}
          />
        </div>
      </div>
    </>
  )
}