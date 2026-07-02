import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiHome, FiAlertTriangle } from 'react-icons/fi';

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          background: '#fff',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          border: '1px solid #f3f3f3',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '110px',
            height: '110px',
            margin: '0 auto 30px',
            borderRadius: '50%',
            background: '#FFF5DE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiAlertTriangle size={55} color="#E8A317" />
        </div>

        {/* Error Code */}
        <h1
          style={{
            fontSize: '90px',
            fontWeight: 800,
            margin: 0,
            color: '#E8A317',
            lineHeight: 1,
          }}
        >
          500
        </h1>

        {/* Title */}
        <h2
          style={{
            fontSize: '34px',
            marginTop: '20px',
            marginBottom: '12px',
            color: '#1A1A1A',
            fontWeight: 700,
          }}
        >
          Internal Server Error
        </h2>

        {/* Description */}
        <p
          style={{
            color: '#777',
            fontSize: '16px',
            lineHeight: 1.8,
            maxWidth: '500px',
            margin: '0 auto 40px',
          }}
        >
          Oops! Something went wrong on our servers.
          <br />
          Our team has been notified and is working to fix the issue.
          Please try again in a few moments.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#E8A317',
              color: '#fff',
              border: 'none',
              padding: '14px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: '0 8px 24px rgba(232,163,23,0.35)',
            }}
          >
            <FiRefreshCw />
            Try Again
          </button>

          <button
            onClick={() => navigate('/join-as-photographer/home')}
            style={{
              background: '#fff',
              color: '#222',
              border: '1px solid #ddd',
              padding: '14px 30px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            <FiHome />
            Go Home
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '45px',
            color: '#999',
            fontSize: '13px',
          }}
        >
          If the problem persists, please contact our support team.
        </div>
      </div>
    </div>
  );
};

export default ServerError;