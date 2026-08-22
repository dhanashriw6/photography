import React, { useState } from 'react'
import { joinPhotographerAndCustomer } from '../../services/preLaunch'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiVideo,
  FiLock,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
  FiX
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import '../index.css'

const EVENT_TYPES = [
  'Wedding',
  'Pre-Wedding',
  'Birthday',
  'Engagement',
  'Maternity',
  'Corporate Event',
  'Baby Shower',
  'Other'
]

const REQUIREMENTS = [
  'Photographer only',
  'Photographer + Videographer',
  'Drone Coverage',
  'Full Team (Photo + Video + Drone)',
  'Not sure yet'
]

const initialState = {
  full_name: '',
  email: '',
  phone_code: '+91',
  mobile_number: '',
  city: '',
  event_type: '',
  event_date: '',
  requirement: '',
}

const FIELD_SPACING = 24

const SuccessModal = ({ onClose, onGoHome }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
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
        Thank You! Your requirement has been received.
      </h3>

      <p className="text-sm text-gray-500 mb-6" style={{ padding: '15px' }}>
        Our team will connect you with suitable photographers shortly.
      </p>

      <div className="w-full flex justify-center">
        <button
          type="button"
          onClick={onGoHome}
          className="su-btn-primary w-fit flex items-center justify-center"
        >
          Done
        </button>
      </div>
    </div>
  </div>
)

const PreLaunchCustomer = () => {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const navigate = useNavigate()

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validate = () => {
    const next = {}

    if (!form.full_name.trim()) {
      next.full_name = 'Full name is required'
    }

    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }

    if (!form.mobile_number.trim()) {
      next.mobile_number = 'Mobile number is required'
    } else if (!/^\d{7,15}$/.test(form.mobile_number.trim())) {
      next.mobile_number = 'Enter a valid mobile number'
    }

    if (!form.city.trim()) {
      next.city = 'City / event location is required'
    }

    if (!form.event_type) {
      next.event_type = 'Please select an event type'
    }

    if (!form.event_date) {
      next.event_date = 'Please select an event date'
    }

    if (!form.requirement) {
      next.requirement = 'Please select your requirement'
    }

    setErrors(next)

    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setStatus(null)
    setErrorMessage('')

    if (!validate()) return

    const payload = {
      lead_type: 'customer',
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone_code: form.phone_code,
      mobile_number: form.mobile_number.trim(),
      city: form.city.trim(),
      event_type: form.event_type,
      event_date: form.event_date,
      requirement: form.requirement,
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

        const message =
          res?.data?.error?.message ||
          res?.error?.message ||
          res?.data?.message ||
          res?.message ||
          'Something went wrong while submitting your request. Please try again later.'

        setErrorMessage(message)
      }
    } catch (err) {
      console.error('Customer lead submission failed:', err)

      setStatus('error')

      const message =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.message ||
        'Something went wrong while submitting your request. Please try again later.'

      setErrorMessage(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="views-shell flex-1 flex justify-center px-4 py-10 md:py-14"
      style={{ fontFamily: "'Quicksand', sans-serif" }}
    >
      <div className="w-full max-w-xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight"
            style={{ marginTop: '20px' }}
          >
            Let's Create Beautiful Memories Together
          </h1>

          <p
            className="text-gray-500 text-sm md:text-base"
            style={{ marginBottom: '10px' }}
          >
            Find the perfect photographer for your special moments.
          </p>
        </div>

        {/* Card */}
        <div className="views-card" style={{ marginTop: 0 }}>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#FFF3D6] border border-[#f5a623]/30 flex items-center justify-center text-[#E8A317] text-xl shrink-0">
              <FiCalendar size={22} />
            </div>

            <div>
              <h2
                className="text-xl font-bold text-slate-900"
                style={{ margin: 0 }}
              >
                Find a <span className="text-[#E8A317]">Photographer</span>
              </h2>

              <p
                className="text-xs md:text-sm text-gray-500"
                style={{ margin: '2px 0 0' }}
              >
                Find the perfect photographer for your event
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid #f0f0f0',
              margin: '0 0 24px'
            }}
          />

          {/* API Error */}
          {status === 'error' && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3.5 flex items-start gap-3">
              <FiAlertCircle className="text-red-600 text-lg mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold text-red-900">
                  Submission Failed
                </p>

                <p className="text-red-700 text-xs mt-0.5">
                  {errorMessage ||
                    'Something went wrong while submitting your request. Please try again later.'}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Full Name */}
            <div
              className="su-field"
              style={{ marginBottom: FIELD_SPACING }}
            >
              <label style={{ display: 'block', marginBottom: 8 }}>
                Full Name <sup style={{ color: '#ef4444' }}>*</sup>
              </label>

              <div className="relative flex items-center">
                <FiUser
                  size={17}
                  className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10"
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={handleChange('full_name')}
                  style={{
                    paddingLeft: '38px',
                    ...(errors.full_name
                      ? { borderColor: '#ef4444' }
                      : {})
                  }}
                />
              </div>

              {errors.full_name && (
                <p className="su-error" style={{ marginTop: 6 }}>
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Email */}
            <div
              className="su-field"
              style={{ marginBottom: FIELD_SPACING }}
            >
              <label style={{ display: 'block', marginBottom: 8 }}>
                Email <sup style={{ color: '#ef4444' }}>*</sup>
              </label>

              <div className="relative flex items-center">
                <FiMail
                  size={17}
                  className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10"
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange('email')}
                  style={{
                    paddingLeft: '38px',
                    ...(errors.email
                      ? { borderColor: '#ef4444' }
                      : {})
                  }}
                />
              </div>

              {errors.email && (
                <p className="su-error" style={{ marginTop: 6 }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div
              className="su-field"
              style={{ marginBottom: FIELD_SPACING }}
            >
              <label style={{ display: 'block', marginBottom: 8 }}>
                Mobile Number <sup style={{ color: '#ef4444' }}>*</sup>
              </label>

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
                  <FiPhone
                    size={17}
                    className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10"
                  />

                  <input
                    className="su-number"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={form.mobile_number}
                    onChange={handleChange('mobile_number')}
                    style={{
                      paddingLeft: '38px',
                      ...(errors.mobile_number
                        ? { borderColor: '#ef4444' }
                        : {})
                    }}
                  />
                </div>
              </div>

              {errors.mobile_number && (
                <p className="su-error" style={{ marginTop: 6 }}>
                  {errors.mobile_number}
                </p>
              )}
            </div>

            {/* City */}
            <div
              className="su-field"
              style={{ marginBottom: FIELD_SPACING }}
            >
              <label style={{ display: 'block', marginBottom: 8 }}>
                City / Event Location{' '}
                <sup style={{ color: '#ef4444' }}>*</sup>
              </label>

              <div className="relative flex items-center">
                <FiMapPin
                  size={17}
                  className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10"
                />

                <input
                  type="text"
                  placeholder="Enter city or event location"
                  value={form.city}
                  onChange={handleChange('city')}
                  style={{
                    paddingLeft: '38px',
                    ...(errors.city
                      ? { borderColor: '#ef4444' }
                      : {})
                  }}
                />
              </div>

              {errors.city && (
                <p className="su-error" style={{ marginTop: 6 }}>
                  {errors.city}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div
              className="su-field"
              style={{ marginBottom: FIELD_SPACING }}
            >
              <label style={{ display: 'block', marginBottom: 8 }}>
                Event Type <sup style={{ color: '#ef4444' }}>*</sup>
              </label>

              <div className="relative flex items-center">
                <FiCalendar
                  size={17}
                  className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10"
                />

                <select
                  value={form.event_type}
                  onChange={handleChange('event_type')}
                  style={{
                    paddingLeft: '38px',
                    ...(errors.event_type
                      ? { borderColor: '#ef4444' }
                      : {})
                  }}
                >
                  <option value="">Select event type</option>

                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {errors.event_type && (
                <p className="su-error" style={{ marginTop: 6 }}>
                  {errors.event_type}
                </p>
              )}
            </div>

            {/* Event Date */}
            <div
              className="su-field"
              style={{ marginBottom: FIELD_SPACING }}
            >
              <label style={{ display: 'block', marginBottom: 8 }}>
                Event Date <sup style={{ color: '#ef4444' }}>*</sup>
              </label>

              <div className="relative flex items-center">
                <FiClock
                  size={17}
                  className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10"
                />

                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.event_date}
                  onChange={handleChange('event_date')}
                  style={{
                    paddingLeft: '38px',
                    ...(errors.event_date
                      ? { borderColor: '#ef4444' }
                      : {})
                  }}
                />
              </div>

              {errors.event_date && (
                <p className="su-error" style={{ marginTop: 6 }}>
                  {errors.event_date}
                </p>
              )}
            </div>

            {/* Requirement */}
            <div
              className="su-field"
              style={{ marginBottom: FIELD_SPACING }}
            >
              <label style={{ display: 'block', marginBottom: 8 }}>
                Requirement <sup style={{ color: '#ef4444' }}>*</sup>
              </label>

              <div className="relative flex items-center">
                <FiVideo
                  size={17}
                  className="absolute left-3.5 text-[#f5a623] pointer-events-none z-10"
                />

                <select
                  value={form.requirement}
                  onChange={handleChange('requirement')}
                  style={{
                    paddingLeft: '38px',
                    ...(errors.requirement
                      ? { borderColor: '#ef4444' }
                      : {})
                  }}
                >
                  <option value="">
                    Select your requirement
                  </option>

                  {REQUIREMENTS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {errors.requirement && (
                <p className="su-error" style={{ marginTop: 6 }}>
                  {errors.requirement}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="su-btn-primary w-1/2 flex items-center justify-center gap-2"
                style={{ marginTop: 8 }}
                onClick={() => navigate('/')}
              >
                Go Back
              </button>

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
                  <span>Submit</span>
                )}
              </button>
            </div>

            <div
              className="flex items-center justify-center gap-1.5 text-xs text-gray-400"
              style={{ marginTop: 14 }}
            >
              <FiLock size={13} className="text-gray-400" />
              <span>
                We will connect you with the best photographers.
              </span>
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

export default PreLaunchCustomer