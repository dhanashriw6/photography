import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import PhotographerLayout from './PhotographerLayout';

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
  const [agreed, setAgreed] = useState(false);
  const [shootOutside, setShootOutside] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cantShootTags, setCantShootTags] = useState(['Patel', 'Aahir', 'brahman']);
  const [cityTags, setCityTags] = useState(['Rajkot', 'Ahmedabad', 'Morbi']);
  const navigate = useNavigate();

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>

            {/* First Name */}
            <div className="su-field">
              <label>First Name</label>
              <input type="text" placeholder="John" />
              <p className="su-field-hint">Must match identification documents.</p>
            </div>

            {/* Last Name */}
            <div className="su-field">
              <label>Last Name</label>
              <input type="text" placeholder="Doe" />
              <p className="su-field-hint">Must match identification documents.</p>
            </div>

            {/* Email */}
            <div className="su-field">
              <label>Email</label>
              <input type="email" placeholder="johndoe@gmail.com" />
            </div>

            {/* Password */}
            <div className="su-field">
              <label>Password</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ flex: 1 }}
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
                <select className="su-country" defaultValue="+91">
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input className="su-number" type="tel" placeholder="12345 67890" />
              </div>
              <p className="su-field-hint">Enter valid number for OTP verification</p>
            </div>

            {/* Where you can't shoot — tag input, full width */}
            <div style={{ gridColumn: 'span 2' }}>
              <TagInput
                label="Which caste you can't shoot"
                tags={cantShootTags}
                setTags={setCantShootTags}
                placeholder="e.g. Patel, Aahir..."
              />
            </div>

            {/* Current Address */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Current Address</label>
              <input type="text" placeholder="Gujrat, India" />
            </div>

            {/* Pincode */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Pincode / Zipcode</label>
              <input type="text" placeholder="360003" />
            </div>

            {/* Permanent Address */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Permanent Address</label>
              <input type="text" placeholder="Gujrat, India" />
            </div>

            {/* Permanent Pincode */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Pincode / Zipcode</label>
              <input type="text" placeholder="360003" />
            </div>

            {/* Shoot outside checkbox */}
            <div style={{ gridColumn: 'span 2', display: 'flex' }}>
              <label className="su-checkbox-row">
                <input
                  type="checkbox"
                  checked={shootOutside}
                  onChange={e => setShootOutside(e.target.checked)}
                />
                <span>You agree to shoot outside your city</span>
              </label>
            </div>

            {/* In which city you can shoot — tag input, full width */}
            <div style={{ gridColumn: 'span 2' }}>
              <TagInput
                label="In Which city you can shoot"
                tags={cityTags}
                setTags={setCityTags}
                placeholder="e.g. Rajkot, Surat..."
              />
            </div>

            {/* Terms */}
            <div style={{ gridColumn: 'span 2', marginTop: '4px', display: 'flex' }}>
              <label className="su-checkbox-row">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <span>
                  I agree to the{' '}
                  <a>terms &amp; conditions</a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
              <button type="submit" className="su-btn-primary" style={{ width: '100%' }} onClick={() => navigate('/join-as-photographer/login')}>
                Sign Up
              </button>
            </div>

          </div>

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