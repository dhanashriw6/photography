import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiUser, FiLock, FiChevronRight, FiHome,
    FiImage, FiPackage, FiShoppingBag, FiCreditCard, FiStar, FiChevronDown
} from 'react-icons/fi';

import MyOrders             from './myOrders';
import ViewsLayout from '../Layout';


const MENU = [
    // { key: 'profile',   label: 'Profile Information', icon: <FiUser      size={17} /> },
    // { key: 'portfolio', label: 'Portfolio',            icon: <FiImage     size={17} /> },
    // { key: 'package',   label: 'Package',              icon: <FiPackage   size={17} /> },
    { key: 'myOrder',    label: 'My Orders',               icon: <FiShoppingBag size={17} /> },
    // {key : 'bankDetails', label : 'Bank Details', icon : <FiCreditCard size={17} />},
    // { key: 'wallet',    label: 'Wallet',               icon: <FiCreditCard size={17} /> },
    // { key: 'reviews',   label: 'Reviews & Disputes',   icon: <FiStar      size={17} /> },
    // { key: 'password',  label: 'Change Password',      icon: <FiLock      size={17} /> },
];

const CustomerEditProfile = () => {
    const [active, setActive]   = useState('myOrder');
    const navigate              = useNavigate();
    const completion            = 64;

    const renderContent = () => {
        switch (active) {
            
            case 'myOrder':    return <MyOrders />;

            default:          return null;
        }
    };

    const activeItem = MENU.find(item => item.key === active);

    return (
        <ViewsLayout>
            <div style={{ width: '100%', margin: '0 auto', padding: '0 16px 40px', fontFamily: 'inherit' }} className="md:!px-10 md:!pb-[60px]">

                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0 20px', fontSize: '13px', color: '#888', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontFamily: 'inherit', fontSize: '13px', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <FiHome size={13} /> Home
                    </button>
                    <FiChevronRight size={13} />
                    <span style={{ color: '#1a1a1a', fontWeight: 600 }}>Edit Profile</span>
                </div>

                <div
                    style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', alignItems: 'start' }}
                    className="md:!grid-cols-[240px_1fr] md:!gap-7"
                >

                    {/* ════ LEFT SIDEBAR ════ */}
                    <div
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                        className="md:sticky md:top-6"
                    >

                        {/* Progress card */}
                        <div style={{
                            background: 'var(--color-orange)',
                            borderRadius: '16px',
                            padding: '16px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            boxShadow: '0 4px 20px rgba(232,163,23,0.3)',
                        }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <svg width="52" height="52" viewBox="0 0 56 56">
                                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                                    <circle
                                        cx="28" cy="28" r="22" fill="none"
                                        stroke="#fff" strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 22}`}
                                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - completion / 100)}`}
                                        transform="rotate(-90 28 28)"
                                    />
                                    <text x="28" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="inherit">{completion}%</text>
                                </svg>
                            </div>
                            <div>
                                <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 700, color: '#fff' }}>Complete Profile</p>
                                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                                    Your profile is {completion}% completed.
                                </p>
                            </div>
                        </div>

                        {/* Mobile dropdown — hidden on desktop */}
                        <div className="md:hidden" style={{ position: 'relative' }}>
                            <select
                                value={active}
                                onChange={(e) => setActive(e.target.value)}
                                style={{
                                    width: '100%',
                                    appearance: 'none',
                                    background: '#fff',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '14px',
                                    padding: '15px 40px 15px 18px',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: 'var(--color-black)',
                                    fontFamily: 'inherit',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                    cursor: 'pointer',
                                }}
                            >
                                {MENU.map(item => (
                                    <option key={item.key} value={item.key}>{item.label}</option>
                                ))}
                            </select>
                            <FiChevronDown
                                size={18}
                                style={{
                                    position: 'absolute', right: '16px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--color-orange)',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>

                        {/* Desktop nav menu — hidden on mobile */}
                        <div
                            className="hidden md:block"
                            style={{
                                background: '#fff',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: '1px solid #f0f0f0',
                            }}
                        >
                            {MENU.map((item, i) => {
                                const isActive = active === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setActive(item.key)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '15px 18px',
                                            background: isActive ? '#FFF3D6' : 'transparent',
                                            border: 'none',
                                            borderLeft: isActive ? '3px solid var(--color-orange)' : '3px solid transparent',
                                            borderBottom: i < MENU.length - 1 ? '1px solid #f5f5f5' : 'none',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: isActive ? 700 : 500,
                                            color: isActive ? 'var(--color-orange)' : '#555',
                                            fontFamily: 'inherit',
                                            textAlign: 'left',
                                            transition: 'all 0.18s ease',
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#fafafa'; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <span style={{ color: isActive ? 'var(--color-orange)' : '#bbb', display: 'flex', flexShrink: 0 }}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ════ RIGHT CONTENT ════ */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '24px 18px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        border: '1px solid #f0f0f0',
                        minHeight: '500px',
                    }}
                    className="md:!p-[32px_36px]"
                    >
                        {renderContent()}
                    </div>

                </div>
            </div>
        </ViewsLayout>
    );
};

export default CustomerEditProfile;