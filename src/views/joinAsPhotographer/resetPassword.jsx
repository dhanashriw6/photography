import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import PhotographerLayout from './PhotographerLayout';
import { resetPassword } from '../../services/auth';

const ResetPassword = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // reset_token passed from OTPVerification via navigate state
  const reset_token = location?.state?.reset_token;

  const [password,     setPassword]     = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  const handleReset = async (e) => {
    e?.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter a new password.'); return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }
    if (password !== confirmPass) {
      setError('Passwords do not match.'); return;
    }
    if (!reset_token) {
      setError('Session expired. Please restart the forgot password flow.'); return;
    }

    const payload = {
      reset_token,
      new_password: password,
    };

    try {
      setLoading(true);
      await resetPassword(payload);
      navigate('/join-as-photographer/login');
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message        ||
        'Reset failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhotographerLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">

          <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '28px', letterSpacing: '-0.01em' }}>
            Reset Password
          </h1>

          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#fee2e2', color: '#b91c1c', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleReset}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>

              {/* New Password */}
              <div className="su-field" style={{ gridColumn: 'span 2' }}>
                <label>New Password<sup style={{ color: '#ef4444' }}>*</sup></label>
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
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer',
                      color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="su-field" style={{ gridColumn: 'span 2' }}>
                <label>Confirm Password<sup style={{ color: '#ef4444' }}>*</sup></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    style={{ flex: 1 }}
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    maxLength={16}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer',
                      color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                    {showConfirm ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
                <button type="submit" className="su-btn-primary"
                  style={{ width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset Password'}
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    </PhotographerLayout>
  );
};

export default ResetPassword;