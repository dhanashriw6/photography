import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  return (
    <ViewsLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>

     

        {/* Card */}
        <div className="views-card">
          <h1 style={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: '28px',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit',
          }}>
            Sign Up
          </h1>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '24px 20px',
          }}>

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

            {/* Phone */}
            <div className="su-field">
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

            {/* Cast */}
            <div className="su-field">
              <label>Cast</label>
              <input type="text" placeholder="Patel" />
            </div>

            {/* Gender */}
            <div className="su-field">
              <label>Gender</label>
              <select defaultValue="">
                <option value="" disabled>Choose Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Address */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Address</label>
              <input type="text" placeholder="Gujrat, India" />
            </div>

            {/* Pincode */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Pincode / Zipcode</label>
              <input type="text" placeholder="360003" />
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
            <div style={{ gridColumn: 'span 2', marginTop: '4px',  }}>
              <button type="submit" className="su-btn-primary" style={{width:"100%"}} onClick={() => navigate('/style-prefer')}>Sign Up</button>
            </div>

          </div>

          {/* Login link */}
          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#666',
            marginTop: '20px',
          }}>
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