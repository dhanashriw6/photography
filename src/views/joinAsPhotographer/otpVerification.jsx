import React, { useState, useEffect, useRef } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import PhotographerLayout from './PhotographerLayout';

const OTPVerification = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [phone, setPhone] = useState('12345 67890');
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const startTimer = () => {
    setTimer(10);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = () => {
    setOtpSent(true);
    startTimer();
  };

  const handleResend = () => {
    if (timer === 0) startTimer();
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const formatTime = (s) => `00:${String(s).padStart(2, '0')}`;

  return (
    <PhotographerLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">
          <h1 style={{
            textAlign: 'center', fontSize: '36px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '28px', letterSpacing: '-0.01em',
          }}>
            OTP Verification
          </h1>

          <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '20px' }}>
            Please enter your registered mobile number below.
          </p>

          {/* Phone + Send OTP row */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div className="su-field" style={{ flex: 1 }}>
              <label>Phone Number<sup style={{ color: '#ef4444' }}>*</sup></label>
              <div className="su-phone-row">
                <select className="su-country" defaultValue="+91">
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  className="su-number"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="12345 67890"
                />
              </div>
            </div>

            <button
              type="button"
              className=""
              onClick={handleSendOTP}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', padding: '11px 24px', backgroundColor: '#FFAE00', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
            >
              Send OTP <FiSend size={15} />
            </button>
          </div>

          <p className="su-field-hint" style={{ marginBottom: '20px' }}>
            Enter valid number for OTP verification
          </p>

          {/* Enter OTP field */}
          {otpSent && (
            <>
              <div className="su-field" style={{ marginBottom: '6px',  }}>
                <label>Enter OTP</label>
                <div style={{ display: 'flex', alignItems: 'center', gap:"5px" }}>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/, '').slice(0, 6))}
                    placeholder="Enter OTP"
                    style={{ flex: 1 }}
                    maxLength={6}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#888', flexShrink: 0, paddingRight: '4px' }}>
                    {formatTime(timer)}
                  </span>
                </div>
              </div>

              <p className="su-field-hint" style={{ marginBottom: '12px' }}>
                An OTP will be sent to your text message..
              </p>

              <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginBottom: '24px' }}>
                Haven't received OTP?{' '}
                <span
                  onClick={handleResend}
                  style={{
                    color: timer === 0 ? '#111' : '#bbb',
                    fontWeight: 700,
                    cursor: timer === 0 ? 'pointer' : 'default',
                  }}
                >
                  Resend
                </span>
              </p>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="su-btn-primary"
            style={{ width: '100%', marginBottom: '16px' }}
            onClick={() => navigate('/join-as-photographer/kyc-verification')}
          >
            Submit
          </button>

          {/* Back to Login */}
          <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#1a1a1a', cursor: 'pointer', margin: 0 }}
            onClick={() => navigate('/join-as-photographer/login')}
          >
            Back to Login
          </p>
        </div>
      </div>
    </PhotographerLayout>
  );
};

export default OTPVerification;