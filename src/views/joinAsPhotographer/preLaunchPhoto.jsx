import React, { useState } from 'react'
import { joinPhotographerAndCustomer } from '../../services/preLaunch'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiAward,
  FiLink,
  FiLock,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
  FiX
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Select from "react-select";
import '../index.css';

const PHOTOGRAPHY_TYPES = [
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Pre-Wedding', label: 'Pre-Wedding' },
  { value: 'Engagement', label: 'Engagement' },
  { value: 'Portrait', label: 'Portrait' },
  { value: 'Event', label: 'Event' },
  { value: 'Maternity', label: 'Maternity' },
  { value: 'Product', label: 'Product' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Other', label: 'Other' },
]

const SKILL_OPTIONS = [
  { value: 'Photographer', label: 'Photographer' },
  { value: 'Videographer', label: 'Videographer' },
  { value: 'Candid Photographer', label: 'Candid Photographer' },
  { value: 'Cinematographer', label: 'Cinematographer' },
  { value: 'Drone', label: 'Drone' },
]

const EXPERIENCE_LEVELS = [
  'Less than 1 year',
  '1-2 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
]

const initialState = {
  full_name: '',
  email: '',
  phone_code: '+91',
  mobile_number: '',
  city: '',
  photography_type: [],
  skills: [],
  experience: '',
  portfolio_link: '',
}

const experienceToNumber = (label) => {
  const map = {
    'Less than 1 year': 0,
    '1-2 years': 1,
    '3-5 years': 3,
    '5-10 years': 5,
    '10+ years': 10,
  }
  return map[label] ?? 0
}

const FIELD_SPACING = 24 // px of space below every field group

const SuccessModal = ({ onClose, onGoHome }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4"
    style={{ background: 'rgba(15, 23, 42, 0.55)' }}
    role="dialog"
    aria-modal="true"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl px-6 py-8 text-center"
      onClick={(e) => e.stopPropagation()}
      style={{ padding: '10px' }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <FiX size={20} />
      </button>

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
        <FiCheckCircle className="text-green-600" size={30} />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Application Received!
      </h3>
      <p className="text-sm text-gray-500 mb-6" style={{ padding: '5px' }}>
        Our team will review your details and contact you regarding the next steps.
      </p>

      <button
        type="button"
        onClick={onGoHome}
        className="su-btn-primary w-full flex items-center justify-center "
      >
        Done
      </button>
    </div>
  </div>
)

const PreLaunchPhoto = () => {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'error' | null (success is handled by the modal)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const navigate = useNavigate()

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.full_name.trim()) next.full_name = 'Full name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.mobile_number.trim()) next.mobile_number = 'Mobile / WhatsApp number is required'
    else if (!/^\d{7,15}$/.test(form.mobile_number.trim())) next.mobile_number = 'Enter a valid mobile number'
    if (!form.city.trim()) next.city = 'City is required'
    if (!form.photography_type.length) next.photography_type = 'Please select at least one photography type'
    if (!form.skills.length) next.skills = 'Please select at least one skill'
    if (!form.experience) next.experience = 'Please select your experience'
    if (form.portfolio_link.trim() && !/^https?:\/\/\S+\.\S+/.test(form.portfolio_link.trim())) {
      next.portfolio_link = 'Enter a valid URL (starting with http:// or https://)'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (!validate()) return

    const payload = {
      lead_type: 'photographer',
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone_code: form.phone_code,
      mobile_number: form.mobile_number.trim(),
      city: form.city.trim(),
      photography_type: form.photography_type.join(', '),
      experience: experienceToNumber(form.experience),
      portfolio_link: form.portfolio_link.trim(),
      area_of_expertise: form.skills,
      source: 'landing_page',
    }
    try {
      setSubmitting(true)
      const res = await joinPhotographerAndCustomer(payload)
      const statusCode = res?.status ?? res?.data?.status

      if (statusCode === 200 || statusCode === 201) {
        setForm(initialState)
        setShowSuccessModal(true)
      } else {
        setStatus('error')

      }
    } catch (err) {
      console.error('Photographer lead submission failed:', err)
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="views-shell flex-1 flex justify-center px-4 py-10 md:py-14" style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <div className="w-full max-w-xl mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight" style={{ marginTop: '20px' }}>
            Let's Create Beautiful Memories Together
          </h1>
          <p className="text-gray-500 text-sm md:text-base" style={{ marginBottom: '10px' }}>
            Join our photographer network for your special moments.
          </p>
        </div>

        {/* Card Container */}
        <div className="views-card" style={{ marginTop: 0 }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#FFF3D6] border border-[#f5a623]/30 flex items-center justify-center text-[#E8A317] text-xl shrink-0">
              <FiCamera size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900" style={{ margin: 0 }}>
                Join as a <span className="text-[#E8A317]">Photographer</span>
              </h2>
              <p className="text-xs md:text-sm text-gray-500" style={{ margin: '2px 0 0' }}>
                Become a part of our trusted photographer network
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', margin: '0 0 24px' }} />

          {status === 'error' && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3.5 flex items-start gap-3">
              <FiAlertCircle className="text-red-600 text-lg mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-900">Submission Failed</p>
                <p className="text-red-700 text-xs mt-0.5">
                  Something went wrong while submitting your request. Please check your credentials or try again later.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Full Name <sup style={{ color: '#ef4444' }}>*</sup></label>
              <div className="relative flex items-center">
                <FiUser size={17} className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={handleChange('full_name')}
                  style={{ paddingLeft: '38px', ...(errors.full_name ? { borderColor: '#ef4444' } : {}) }}
                />
              </div>
              {errors.full_name && <p className="su-error" style={{ marginTop: 6 }}>{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Email <sup style={{ color: '#ef4444' }}>*</sup></label>
              <div className="relative flex items-center">
                <FiMail size={17} className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange('email')}
                  style={{ paddingLeft: '38px', ...(errors.email ? { borderColor: '#ef4444' } : {}) }}
                />
              </div>
              {errors.email && <p className="su-error" style={{ marginTop: 6 }}>{errors.email}</p>}
            </div>

            {/* Mobile / WhatsApp Number */}
            <div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Mobile / WhatsApp Number <sup style={{ color: '#ef4444' }}>*</sup></label>
              <div className="su-phone-row">
                <select
                  className="su-country"
                  value={form.phone_code}
                  onChange={handleChange('phone_code')}
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <div className="relative flex-1 flex items-center">
                  <FiPhone size={17} className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10" />
                  <input
                    className="su-number"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={form.mobile_number}
                    onChange={handleChange('mobile_number')}
                    style={{ paddingLeft: '38px', ...(errors.mobile_number ? { borderColor: '#ef4444' } : {}) }}
                  />
                </div>
              </div>
              {errors.mobile_number && <p className="su-error" style={{ marginTop: 6 }}>{errors.mobile_number}</p>}
            </div>

            {/* City */}
            <div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
              <label style={{ display: 'block', marginBottom: 8 }}>City <sup style={{ color: '#ef4444' }}>*</sup></label>
              <div className="relative flex items-center">
                <FiMapPin size={17} className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={form.city}
                  onChange={handleChange('city')}
                  style={{ paddingLeft: '38px', ...(errors.city ? { borderColor: '#ef4444' } : {}) }}
                />
              </div>
              {errors.city && <p className="su-error" style={{ marginTop: 6 }}>{errors.city}</p>}
            </div>

          {/* Photography Type */}
<div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
  <label style={{ display: 'block', marginBottom: 8 }}>Photography Type <sup style={{ color: '#ef4444' }}>*</sup></label>

  <Select
    isMulti
    options={PHOTOGRAPHY_TYPES}
    value={PHOTOGRAPHY_TYPES.filter((option) =>
      form.photography_type.includes(option.value)
    )}
    onChange={(selected) => {
      const vals = selected ? selected.map((item) => item.value) : []
      setForm((prev) => ({ ...prev, photography_type: vals }))
      if (errors.photography_type) setErrors((prev) => ({ ...prev, photography_type: undefined }))
    }}
    placeholder="Select photography type(s)..."
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    menuPortalTarget={document.body}
    menuPosition="fixed"
    styles={{
      control: (base, state) => ({
        ...base,
        minHeight: 46,
        borderRadius: 8,
        borderColor: errors.photography_type ? '#ef4444' : state.isFocused ? '#f5a623' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
        '&:hover': { borderColor: '#f5a623' },
      }),
      multiValue: (base) => ({ ...base, background: '#FFF3D6', borderRadius: 6 }),
      multiValueLabel: (base) => ({ ...base, color: '#1a1a1a', fontWeight: 600 }),
      multiValueRemove: (base) => ({
        ...base,
        cursor: 'pointer',
        ':hover': { background: '#FFE5A3', color: '#000' },
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      menu: (base) => ({ ...base, zIndex: 9999 }),
    }}
  />

  {errors.photography_type && <p className="su-error" style={{ marginTop: 6 }}>{errors.photography_type}</p>}
</div>

{/* Skills */}
<div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
  <label style={{ display: 'block', marginBottom: 8 }}>Skills <sup style={{ color: '#ef4444' }}>*</sup></label>

  <Select
    isMulti
    options={SKILL_OPTIONS}
    value={SKILL_OPTIONS.filter((option) =>
      form.skills.includes(option.value)
    )}
    onChange={(selected) => {
      const vals = selected ? selected.map((item) => item.value) : []
      setForm((prev) => ({ ...prev, skills: vals }))
      if (errors.skills) setErrors((prev) => ({ ...prev, skills: undefined }))
    }}
    placeholder="Select skill(s)..."
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    menuPortalTarget={document.body}
    menuPosition="fixed"
    styles={{
      control: (base, state) => ({
        ...base,
        minHeight: 46,
        borderRadius: 8,
        borderColor: errors.skills ? '#ef4444' : state.isFocused ? '#f5a623' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
        '&:hover': { borderColor: '#f5a623' },
      }),
      multiValue: (base) => ({ ...base, background: '#FFF3D6', borderRadius: 6 }),
      multiValueLabel: (base) => ({ ...base, color: '#1a1a1a', fontWeight: 600 }),
      multiValueRemove: (base) => ({
        ...base,
        cursor: 'pointer',
        ':hover': { background: '#FFE5A3', color: '#000' },
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      menu: (base) => ({ ...base, zIndex: 9999 }),
    }}
  />

  {errors.skills && <p className="su-error" style={{ marginTop: 6 }}>{errors.skills}</p>}
</div>

            {/* Experience */}
            <div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Experience <sup style={{ color: '#ef4444' }}>*</sup></label>
              <div className="relative flex items-center">
                <FiAward size={17} className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10" />
                <select
                  value={form.experience}
                  onChange={handleChange('experience')}
                  style={{ paddingLeft: '38px', ...(errors.experience ? { borderColor: '#ef4444' } : {}) }}
                >
                  <option value="">Select your experience</option>
                  {EXPERIENCE_LEVELS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              {errors.experience && <p className="su-error" style={{ marginTop: 6 }}>{errors.experience}</p>}
            </div>

            {/* Portfolio / Instagram Link */}
            <div className="su-field" style={{ marginBottom: FIELD_SPACING }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Portfolio / Instagram Link</label>
              <div className="relative flex items-center">
                <FiLink size={17} className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10" />
                <input
                  type="url"
                  placeholder="Enter portfolio or Instagram link"
                  value={form.portfolio_link}
                  onChange={handleChange('portfolio_link')}
                  style={{ paddingLeft: '38px', ...(errors.portfolio_link ? { borderColor: '#ef4444' } : {}) }}
                />
              </div>
              <p className="su-field-hint" style={{ marginTop: 6 }}>Add your portfolio website or Instagram profile link</p>
              {errors.portfolio_link && <p className="su-error" style={{ marginTop: 6 }}>{errors.portfolio_link}</p>}
            </div>

            {/* Submit Button */}
            <div className='flex justify-center gap-2'>
              <button type="button"
                className="su-btn-primary w-1/2 flex items-center justify-center gap-2"
                style={{ marginTop: 8 }} onClick={() => { navigate('/') }}>Go Back</button>
              <button
                type="submit"
                disabled={submitting}
                className="su-btn-primary w-1/2 flex items-center justify-center gap-2"
                style={{ marginTop: 8 }}
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin text-xl" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Join as a Photographer</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400" style={{ marginTop: 14 }}>
              <FiLock size={13} className="text-gray-400" />
              <span>Your information is safe with us and will not be shared.</span>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          onGoHome={() => {
            setShowSuccessModal(false)
            navigate('/')
          }}
        />
      )}
    </div>
  )
}

export default PreLaunchPhoto