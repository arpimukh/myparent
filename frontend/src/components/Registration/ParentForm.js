import { useState } from 'react'
import { useForm } from 'react-hook-form'

const ParentForm = ({ onSubmit, isSubmitting, onClose }) => {
  const [photoPreview, setPhotoPreview] = useState(null)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
      setValue('photo', file)
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
    setValue('aadhar', formatted)
  }

  const onFormSubmit = (data) => {
    const formData = new FormData()
    formData.append('role', 'parent')
    formData.append('name', data.name)
    formData.append('phone', data.phone)
    formData.append('address', data.address)
    formData.append('aadhar', data.aadhar)
    formData.append('voter_id', data.voter_id || '')
    formData.append('pan', data.pan || '')
    formData.append('medical_conditions', data.medical_conditions || '')
    formData.append('emergency_contact', data.emergency_contact || '')
    
    if (data.photo && data.photo[0]) {
      formData.append('photo', data.photo[0])
    }

    onSubmit(formData)
  }

  return (
    <div className="form-container parent bg-white rounded-2xl p-8 relative">
      <button 
        onClick={onClose}
        disabled={isSubmitting}
        className="absolute top-4 right-6 text-2xl text-gray-400 hover:text-gray-600 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all disabled:opacity-50"
      >
        ×
      </button>

      <div className="form-header text-center mb-8 pt-4">
        <div className="text-6xl mb-4">👴</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Parent Registration</h2>
        <p className="text-gray-600 mb-4">Register as a care recipient</p>
        <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
          CLIENT ROLE
        </span>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="form-section">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📋 Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Full name is required' })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all"
                placeholder="Enter full name"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone', { required: 'Phone number is required' })}
                type="tel"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all"
                placeholder="Phone number"
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('address', { required: 'Address is required' })}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all resize-vertical"
              placeholder="Complete address with pincode"
            />
            {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
          </div>
        </div>

        {/* Photo & Documents */}
        <div className="form-section">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📸 Photo & Documents
          </h3>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Photo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
              <input
                {...register('photo', { required: 'Profile photo is required' })}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-full mx-auto mb-2" />
                ) : (
                  <div className="text-4xl mb-2">📸</div>
                )}
                <p className="text-gray-600">Click to upload photo</p>
              </label>
            </div>
            {errors.photo && <span className="text-red-500 text-sm">{errors.photo.message}</span>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('aadhar', { 
                  required: 'Aadhar number is required',
                  pattern: {
                    value: /^\d{4}\s\d{4}\s\d{4}$/,
                    message: 'Invalid Aadhar format'
                  }
                })}
                onChange={handleAadharChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all"
                placeholder="XXXX XXXX XXXX"
                maxLength="14"
              />
              {errors.aadhar && <span className="text-red-500 text-sm">{errors.aadhar.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Voter ID Number
              </label>
              <input
                {...register('voter_id')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all"
                placeholder="Voter ID (Optional)"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PAN Number
            </label>
            <input
              {...register('pan')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all"
              placeholder="PAN (Optional)"
              maxLength="10"
            />
          </div>
        </div>

        {/* Care Requirements */}
        <div className="form-section">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏥 Care Requirements
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Medical Conditions (if any)
              </label>
              <textarea
                {...register('medical_conditions')}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all resize-vertical"
                placeholder="Describe any medical conditions or special care requirements"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                {...register('emergency_contact')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition-all"
                placeholder="Emergency contact person and number"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-secondary text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? 'Registering...' : 'Complete Parent Registration'}
        </button>
      </form>
    </div>
  )
}

export default ParentForm