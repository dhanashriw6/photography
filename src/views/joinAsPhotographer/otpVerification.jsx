import React, { useState, useEffect, useRef } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import PhotographerLayout from './PhotographerLayout';
import { forgotPassword, verifyOtp } from '../../services/auth';

const OTPVerification = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const startTimer = () => {
    setTimer(60);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Send OTP → call forgotPassword API ──────────────────────────────────────
  const handleSendOTP = async () => {
    setError('');
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    const payload = {
      phone_no:   phone.trim(),
      phone_code: phoneCode,
    };

    try {
      setLoading(true);
      await forgotPassword(payload);
      setOtpSent(true);
      startTimer();
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message        ||
        'Failed to send OTP. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResend = () => {
    if (timer === 0) handleSendOTP();
  };

  // ── Verify OTP → call verifyOtp API ─────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!otpSent) {
      setError('Please send OTP first.');
      return;
    }
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    const payload = {
      phone_no:   phone.trim(),
      phone_code: phoneCode,
      otp,
    };

    try {
      setVerifying(true);
      const res = await verifyOtp(payload);

      // Extract reset_token from response
      const reset_token = res?.data?.data?.reset_token;

      // Pass it to the next screen via navigation state
      navigate('/join-as-photographer/reset-password', {
        state: { reset_token },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message        ||
        'OTP verification failed. Please try again.';
      setError(msg);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const formatTime = (s) => `00:${String(s).padStart(2, '0')}`;

  return (
    <PhotographerLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">
          <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '28px', letterSpacing: '-0.01em' }}>
            OTP Verification
          </h1>

          <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '20px' }}>
            Please enter your registered mobile number below.
          </p>

          {/* Error banner */}
          {error && (
            <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#fee2e2', color: '#b91c1c', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {/* Phone + Send OTP row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div className="su-field" style={{ flex: 1 }}>
              <label>Phone Number<sup style={{ color: '#ef4444' }}>*</sup></label>
              <div className="su-phone-row">
                <select className="su-country" value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input className="su-number" type="tel" value={phone}
                  onChange={e => setPhone(e.target.value)} placeholder="12345 67890" />
              </div>
            </div>

            <button type="button" onClick={handleSendOTP} disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
                padding: '11px 24px', backgroundColor: '#FFAE00', color: '#fff',
                border: 'none', borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending…' : 'Send OTP'} <FiSend size={15} />
            </button>
          </div>

          <p className="su-field-hint" style={{ marginBottom: '20px' }}>
            Enter valid number for OTP verification
          </p>

          {/* Enter OTP field */}
          {otpSent && (
            <>
              <div className="su-field" style={{ marginBottom: '6px' }}>
                <label>Enter OTP</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="text" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/, '').slice(0, 6))}
                    placeholder="Enter OTP" style={{ flex: 1 }} maxLength={6} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#888', flexShrink: 0, paddingRight: '4px' }}>
                    {formatTime(timer)}
                  </span>
                </div>
              </div>

              <p className="su-field-hint" style={{ marginBottom: '12px' }}>
                An OTP will be sent to your text message.
              </p>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginBottom: '24px' }}>
                Haven't received OTP?{' '}
                <span onClick={handleResend}
                  style={{ color: timer === 0 ? '#111' : '#bbb', fontWeight: 700,
                    cursor: timer === 0 ? 'pointer' : 'default' }}>
                  Resend
                </span>
              </p>
            </>
          )}

          {/* Submit */}
          <button type="button" className="su-btn-primary" onClick={handleSubmit} disabled={verifying}
            style={{ width: '100%', marginBottom: '16px',
              opacity: verifying ? 0.7 : 1, cursor: verifying ? 'not-allowed' : 'pointer' }}>
            {verifying ? 'Verifying…' : 'Submit'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#1a1a1a',
            cursor: 'pointer', margin: 0 }}
            onClick={() => navigate('/join-as-photographer/login')}>
            Back to Login
          </p>
        </div>
      </div>
    </PhotographerLayout>
  );
};

export default OTPVerification;