import React from 'react';
import ViewsLayout from '../Layout';
import thankyoubadge from '../../assets/Images/thankyoubadge.png';
import { useNavigate, useLocation } from 'react-router-dom';

const ThankYou = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order || {};
    return (
        <ViewsLayout>
            <div>
                {/* Card */}
                <div className='views-card' style={{
                    background: '#fff',
                    borderRadius: '20px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    padding: '48px 56px',
                    maxWidth: '860px',
                    width: '100%',
                    textAlign: 'center',
                    animation: 'ty-fadeIn 0.5s ease both',
                }}>

                    {/* Badge Icon */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '28px',
                        animation: 'ty-popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.15s both',
                    }}>
                        <img
                            src={thankyoubadge}
                            alt="Thank you badge"
                            style={{ width: '90px', height: '90px', objectFit: 'contain' }}
                        />
                    </div>

                    {/* Heading */}
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: 700,
                        color: 'var(--color-orange)',
                        margin: '0 0 12px',
                        letterSpacing: '-0.01em',
                    }}>
                        Thank You For Booking
                    </h1>

                    {/* Sub-text */}
                    <p style={{
                        fontSize: '14px',
                        color: '#555',
                        margin: '0 0 32px',
                        lineHeight: 1.6,
                        fontWeight: 400,
                    }}>
                        Good news. Your booking request has been sent.
                    </p>

                    {/* Divider */}
                    <div style={{
                        borderTop: '1px solid #f0f0f0',
                        marginBottom: '24px',
                    }} />

                    {/* Action Links */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                    }}>
                        {/* <a
                            href="#"
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => e.target.style.color = '#E8A317'}
                            onMouseLeave={e => e.target.style.color = '#1a1a1a'}
                        >
                            Download invoice
                        </a> */}
                        <a
                            href={`/booking-summary?orderId=${order.id || ''}`}
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => e.target.style.color = '#E8A317'}
                            onMouseLeave={e => e.target.style.color = '#1a1a1a'}
                        >
                            View Summary
                        </a>
                    </div>
                </div>

                {/* Animations */}
                <style>{`
          @keyframes ty-fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes ty-popIn {
            from { opacity: 0; transform: scale(0.6); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
            </div>
        </ViewsLayout>
    );
};

export default ThankYou;