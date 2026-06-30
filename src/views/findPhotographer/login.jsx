import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { loginAsPhotographer } from '../../services/auth';
import { getKycStatus } from '../../services/kyc'
import ViewsLayout from '../Layout';

const login = () => {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');

    if (!phoneNo.trim() || !password.trim()) {
      setError('Please enter your phone number and password.');
      return;
    }
    if (!phoneNo.trim()) {
      setError('Phone number is required');
    } else if (!/^\d+$/.test(phoneNo)) {
      setError('Only numbers are allowed');
    } else if (phoneNo.length !== 10) {
      setError('Phone number must be exactly 10 digits');
    }

    const payload = {
      phone_no: phoneNo.trim(),
      phone_code: phoneCode,
      password,
    };

    try {
      setLoading(true);
      const res = await loginAsPhotographer(payload);

      const { access_token, refresh_token, user } = res?.data?.data || {};
      if (access_token) localStorage.setItem('authToken', access_token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);
      if (user?.first_name) localStorage.setItem('firstName', user.first_name);
if (user?.last_name) localStorage.setItem('lastName', user.last_name);
      navigate('/home');

      // Check KYC status and route accordingly
      // try {
      //   const kycRes = await getKycStatus();
      //   const kycStatus = kycRes?.data?.data?.status || 'pending';

      //   if (kycStatus === 'pending') {
      //     navigate('/join-as-photographer/verification-ip');   // in progress page
      //   } else {
      //     navigate('/join-as-photographer/kyc-verification');  // normal kyc page
      //   }
      // } catch {
      //   navigate('/join-as-photographer/kyc-verification');    // fallback
      // }

    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        navigate('/login');
        return;
      }

      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setError(msg);
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
            Login
          </h1>

          {/* Error banner */}
          {error && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#fee2e2', color: '#b91c1c', fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '24px 20px',
            }}>

              {/* Phone Number */}
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPhoneNo(value);
                    }}
                  />
                </div>
                <p className="su-field-hint">Enter the number used during registration</p>
              </div>

              {/* Password */}
              <div className="su-field" style={{ gridColumn: 'span 2' }}>
                <label>Password</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    style={{ flex: 1 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    maxLength={16}
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#aaa', padding: 0, display: 'flex', flexShrink: 0,
                  }}>
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div style={{ gridColumn: 'span 2', marginTop: '4px', display: 'flex' }}>
                <label className="su-checkbox-row">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit */}
              <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
                <button
                  type="submit"
                  className="su-btn-primary"
                  style={{ width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  disabled={loading}
                >
                  {loading ? 'Logging in…' : 'Login'}
                </button>
              </div>

            </div>
          </form>

          <p style={{
            textAlign: 'center', fontSize: '13px', color: '#111',
            fontWeight: 700, cursor: 'pointer', marginTop: '20px',
          }}
            onClick={() => navigate('/otp-verification')}
          >
            Forgot Password?
          </p>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '20px' }}>
            Don't have an account?{' '}
            <a href="/find-photographer" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
              Sign Up
            </a>
          </p>

        </div>
      </div>
    </ViewsLayout>
  );
};

export default login;