import React, { useEffect, useState } from 'react';
import thankyoubadge from '../../assets/Images/thankyoubadge.png';
import { useNavigate } from 'react-router-dom';
import PhotographerLayout from './PhotographerLayout';
import { getKycStatus } from '../../services/kyc';

const STATUS_CONFIG = {
    approved: {
        heading: 'Your KYC is Verified!',
        sub: 'Great news! Your identity has been successfully verified. Your account is fully active.',
        color: '#16a34a',
    },
    pending: {
        heading: 'Your KYC verification is in progress.',
        sub: 'Good news. Your account is now active and ready to use.',
        color: 'var(--color-orange)',
    },
    rejected: {
        heading: 'Your KYC Verification Failed.',
        sub: 'Unfortunately, your KYC was not approved. Please re-submit your documents.',
        color: '#dc2626',
    },
    not_submitted: {
        heading: 'KYC Not Submitted.',
        sub: 'Please complete your KYC verification to activate your account.',
        color: '#6b7280',
    },
};

const VerificationIP = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKycStatus = async () => {
            try {
                const res = await getKycStatus();
                const kycStatus = res?.data?.data?.status || 'pending';
                setStatus(kycStatus);
            } catch (err) {
                console.error('KYC status fetch error:', err);
                setStatus('pending');
            } finally {
                setLoading(false);
            }
        };

        fetchKycStatus();
    }, []);

    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

    return (
        <PhotographerLayout>
            <div>
                <div
                    className='views-card'
                    style={{
                        background: '#fff',
                        borderRadius: '20px',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                        padding: '48px 56px',
                        maxWidth: '860px',
                        width: '100%',
                        textAlign: 'center',
                        animation: 'ty-fadeIn 0.5s ease both',
                    }}
                >
                    {/* Badge Icon */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '28px',
                            animation: 'ty-popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.15s both',
                        }}
                    >
                        {loading ? (
                            <div
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '50%',
                                    background: '#f3f4f6',
                                    animation: 'pulse 1.2s ease-in-out infinite',
                                }}
                            />
                        ) : (
                            <img
                                src={thankyoubadge}
                                alt="KYC status badge"
                                style={{ width: '90px', height: '90px', objectFit: 'contain' }}
                            />
                        )}
                    </div>

                    {/* Heading */}
                    {loading ? (
                        <div
                            style={{
                                height: '36px',
                                width: '60%',
                                margin: '0 auto 12px',
                                borderRadius: '8px',
                                background: '#f3f4f6',
                                animation: 'pulse 1.2s ease-in-out infinite',
                            }}
                        />
                    ) : (
                        <h1
                            style={{
                                fontSize: '36px',
                                fontWeight: 700,
                                color: config.color,
                                margin: '0 0 12px',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {config.heading}
                        </h1>
                    )}

                    {/* Sub-text */}
                    {loading ? (
                        <div
                            style={{
                                height: '16px',
                                width: '45%',
                                margin: '0 auto 32px',
                                borderRadius: '6px',
                                background: '#f3f4f6',
                                animation: 'pulse 1.2s ease-in-out infinite',
                            }}
                        />
                    ) : (
                        <p
                            style={{
                                fontSize: '14px',
                                color: '#555',
                                margin: '0 0 32px',
                                lineHeight: 1.6,
                                fontWeight: 400,
                            }}
                        >
                            {config.sub}
                        </p>
                    )}

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: '24px' }} />

                    {/* Action Links */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
                        <a
                            href="/join-as-photographer/home"
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => (e.target.style.color = '#E8A317')}
                            onMouseLeave={e => (e.target.style.color = '#1a1a1a')}
                        >
                            Go to Dashboard
                        </a>

                        {status === 'rejected' && (
                            <a
                                href="/join-as-photographer/kyc"
                                style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#dc2626',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '3px',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.target.style.color = '#991b1b')}
                                onMouseLeave={e => (e.target.style.color = '#dc2626')}
                            >
                                Re-submit KYC
                            </a>
                        )}
                    </div>
                </div>

                <style>{`
                    @keyframes ty-fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes ty-popIn {
                        from { opacity: 0; transform: scale(0.6); }
                        to   { opacity: 1; transform: scale(1); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50%      { opacity: 0.4; }
                    }
                `}</style>
            </div>
        </PhotographerLayout>
    );
};

export default VerificationIP;