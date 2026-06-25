import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { signUpAsPhotographer } from '../../services/auth';

const SignUp = () => {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────
  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneCode, setPhoneCode]   = useState('+91');
  const [phoneNo, setPhoneNo]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // ── UI state ────────────────────────────────────────────────
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [errorType, setErrorType] = useState('');
  const [success, setSuccess]   = useState('');

  // ── Submit ──────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e?.preventDefault();

    setError('');
    setErrorType('');
    setSuccess('');
    setFieldErrors({});

    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!/^[A-Za-z\s]+$/.test(firstName.trim())) {
      errors.firstName = 'Only alphabets are allowed';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z\s]+$/.test(lastName.trim())) {
      errors.lastName = 'Only alphabets are allowed';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (password.length > 16) {
      errors.password = 'Password cannot exceed 16 characters';
    }

    if (!phoneNo.trim()) {
      errors.phoneNo = 'Phone number is required';
    } else if (!/^\d+$/.test(phoneNo)) {
      errors.phoneNo = 'Only numbers are allowed';
    } else if (phoneNo.length !== 10) {
      errors.phoneNo = 'Phone number must be exactly 10 digits';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password,
      phone_code: phoneCode,
      phone_no: phoneNo.trim(),
      user_type: 'customer',
    };

    try {
      setLoading(true);
      const res = await signUpAsPhotographer(payload);
      const { access_token, refresh_token } = res?.data?.data || {};
      if (access_token) localStorage.setItem('authToken', access_token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error?.code;
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message;
      if (status === 409 || code === 'CONFLICT') {
        setErrorType('conflict');
        setError(msg || 'An account with this email or phone number already exists.');
      } else {
        setErrorType('general');
        setError(msg || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ViewsLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">
          <h1 style={{
            textAlign: 'center', fontSize: '36px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '28px', letterSpacing: '-0.01em',
          }}>
            Sign Up
          </h1>

          {/* ── Error Banner ── */}
          {error && (
            <div style={{
              marginBottom: '16px', padding: '12px 14px', borderRadius: '8px',
              background: errorType === 'conflict' ? '#FFF7ED' : '#fee2e2',
              border: `1px solid ${errorType === 'conflict' ? '#FDBA74' : '#fca5a5'}`,
              color: errorType === 'conflict' ? '#9a3412' : '#b91c1c',
              fontSize: '13px', lineHeight: '1.6',
            }}>
              {error}
              {errorType === 'conflict' && (
                <span>
                  {' '}Please{' '}
                  <a href="/login" style={{ color: '#c2410c', fontWeight: 700, textDecoration: 'underline' }}>
                    log in
                  </a>
                  {' '}instead, or use a different email and phone number.
                </span>
              )}
            </div>
          )}

          {/* ── Success Banner ── */}
          {success && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#dcfce7', color: '#15803d', fontSize: '13px',
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '24px 20px',
            }}>

              {/* First Name */}
              <div className="su-field">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
                <p className="su-field-hint">Must match identification documents.</p>
                {fieldErrors.firstName && <p className="su-error">{fieldErrors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="su-field">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
                <p className="su-field-hint">Must match identification documents.</p>
                {fieldErrors.lastName && <p className="su-error">{fieldErrors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="su-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {fieldErrors.email && <p className="su-error">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="su-field">
                <label>Password</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    style={{ flex: 1 }}
                    maxLength={16}
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#aaa', padding: 0, display: 'flex', flexShrink: 0,
                    }}
                  >
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="su-error">{fieldErrors.password}</p>}
              </div>

              {/* Phone */}
              <div className="su-field" style={{ gridColumn: 'span 2' }}>
                <label>Phone Number<sup style={{ color: '#ef4444' }}>*</sup></label>
                <div className="su-phone-row">
                  <select
                    className="su-country"
                    value={phoneCode}
                    onChange={e => setPhoneCode(e.target.value)}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input
                    className="su-number"
                    type="tel"
                    placeholder="12345 67890"
                    value={phoneNo}
                    maxLength={10}
                    onChange={e => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <p className="su-field-hint">Enter valid number for OTP verification</p>
                {fieldErrors.phoneNo && <p className="su-error">{fieldErrors.phoneNo}</p>}
              </div>

              {/* Submit */}
               <button className='su-btn-primary' onClick={() => navigate('/')}>Back</button>
              
                <button
                  type="submit"
                  className="su-btn-primary"
                  style={{
                    width: '100%',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={loading}
                >
                  {loading ? 'Creating account…' : 'Sign Up'}
                </button>
              

            </div>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '20px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default SignUp;