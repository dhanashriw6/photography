import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import PhotographerLayout from './PhotographerLayout';
import { signUpAsPhotographer } from '../../services/auth';

/* ── Tag Input ── */
const TagInput = ({ label, tags, setTags, placeholder }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const val = input.trim().replace(/,$/, '');
      if (val && !tags.includes(val)) setTags([...tags, val]);
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

  return (
    <div className="su-field">
      <label>{label}</label>
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        gap: '6px', padding: '8px 13px', minHeight: '46px',
        border: '1.5px solid #d1d5db', borderRadius: '8px',
        background: '#fff', cursor: 'text', boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
        onClick={e => e.currentTarget.querySelector('input').focus()}
        onFocusCapture={e => {
          e.currentTarget.style.borderColor = '#f5a623';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)';
        }}
        onBlurCapture={e => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {tags.map((tag, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            background: '#FFF3D6', color: '#1a1a1a',
            borderRadius: '6px', padding: '2px 8px', fontSize: '13px', fontWeight: 600,
          }}>
            {tag}
            <button type="button" onClick={() => removeTag(i)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#888', padding: 0, lineHeight: 1, fontSize: '14px',
              display: 'flex', alignItems: 'center',
            }}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: '14px', color: '#111', minWidth: '80px', flex: 1,
            padding: '2px 0', fontFamily: 'inherit',
          }}
        />
      </div>
      <p className="su-field-hint">Type and press Enter to add</p>
    </div>
  );
};

const SignUpPhotographer = () => {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [firstName, setFirstName]     = useState('');
  const [lastName, setLastName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [phoneCode, setPhoneCode]     = useState('+91');
  const [phoneNo, setPhoneNo]         = useState('');
  const [skill, setSkill]             = useState('photographer');
  const [showPassword, setShowPassword] = useState(false);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    // Basic client-side validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() ||
        !password.trim() || !phoneNo.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      first_name: firstName.trim(),
      last_name:  lastName.trim(),
      email:      email.trim(),
      password,
      phone_code: phoneCode,
      phone_no:   phoneNo.trim(),
      user_type:  'service_provider',
      skills:     [skill],
    };

    try {
      setLoading(true);
      const res = await signUpAsPhotographer(payload);

      // Save tokens so all subsequent API calls are authenticated
      const { access_token, refresh_token } = res?.data?.data || {};
      if (access_token)  localStorage.setItem('authToken',     access_token);
      if (refresh_token) localStorage.setItem('refreshToken',  refresh_token);

      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/join-as-photographer/login'), 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        'Signup failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhotographerLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">
          <h1 style={{
            textAlign: 'center', fontSize: '36px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '28px', letterSpacing: '-0.01em',
          }}>
            Sign Up
          </h1>

          {/* Error / Success banners */}
          {error && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#fee2e2', color: '#b91c1c', fontSize: '13px',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#dcfce7', color: '#15803d', fontSize: '13px',
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>

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
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#aaa', padding: 0, display: 'flex', flexShrink: 0,
                  }}>
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Phone — full width */}
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
                    onChange={e => setPhoneNo(e.target.value)}
                  />
                </div>
                <p className="su-field-hint">Enter valid number for OTP verification</p>
              </div>

              {/* Skills */}
              <div className="su-field">
                <label>Skills<sup style={{ color: '#ef4444' }}>*</sup></label>
                <select
                  className="su-country"
                  value={skill}
                  onChange={e => setSkill(e.target.value)}
                >
                  <option value="photographer">Photographer</option>
                  <option value="videographer">Videographer</option>
                  <option value="drone_photographer">Drone Photographer</option>
                  <option value="drone_videographer">Drone Videographer</option>
                </select>
              </div>

              {/* Submit */}
              <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
                <button
                  type="submit"
                  className="su-btn-primary"
                  style={{ width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  disabled={loading}
                >
                  {loading ? 'Creating account…' : 'Sign Up'}
                </button>
              </div>
            </div>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '20px' }}>
            Already have an account?{' '}
            <a href="/join-as-photographer/login" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </PhotographerLayout>
  );
};

export default SignUpPhotographer;