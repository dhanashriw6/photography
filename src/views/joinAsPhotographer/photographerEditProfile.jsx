import React, { useState } from 'react';
import PhotographerLayout from './PhotographerLayout';
import { useNavigate } from 'react-router-dom';
import {
    FiUser, FiLock, FiChevronRight, FiHome,
    FiImage, FiPackage, FiShoppingBag, FiCreditCard, FiStar
} from 'react-icons/fi';
import ProfileInformation from './profileInfo';     
import Portfolio          from './portfolio';
import Package            from './package';
import Orders             from './orders';
import Wallet             from './wallet';
import ReviewsDisputes    from './reviewsDisputes';
import ChangePassword     from './changePassword';

const MENU = [
    { key: 'profile',   label: 'Profile Information', icon: <FiUser      size={17} /> },
    { key: 'portfolio', label: 'Portfolio',            icon: <FiImage     size={17} /> },
    { key: 'package',   label: 'Package',              icon: <FiPackage   size={17} /> },
    { key: 'orders',    label: 'Orders',               icon: <FiShoppingBag size={17} /> },
    { key: 'wallet',    label: 'Wallet',               icon: <FiCreditCard size={17} /> },
    { key: 'reviews',   label: 'Reviews & Disputes',   icon: <FiStar      size={17} /> },
    { key: 'password',  label: 'Change Password',      icon: <FiLock      size={17} /> },
];

const PhotographerEditProfile = () => {
    const [active, setActive]   = useState('profile');
    const navigate              = useNavigate();
    const completion            = 64;

    const renderContent = () => {
        switch (active) {
            case 'profile':   return <ProfileInformation onSave={() => {}} onCancel={() => navigate(-1)} />;
            case 'portfolio': return <Portfolio />;
            case 'package':   return <Package />;
            case 'orders':    return <Orders />;
            case 'wallet':    return <Wallet />;
            case 'reviews':   return <ReviewsDisputes />;
            case 'password':  return <ChangePassword />;
            default:          return null;
        }
    };

    return (
        <PhotographerLayout>
            <div style={{ width: '100%', margin: '0 auto', padding: '0 40px 60px', fontFamily: 'inherit' }}>

                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0 24px', fontSize: '13px', color: '#888' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontFamily: 'inherit', fontSize: '13px', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <FiHome size={13} /> Home
                    </button>
                    <FiChevronRight size={13} />
                    <span style={{ color: '#1a1a1a', fontWeight: 600 }}>Edit Profile</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '28px', alignItems: 'start' }}>

                    {/* ════ LEFT SIDEBAR ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '24px' }}>

                        {/* Progress card */}
                        <div style={{
                            background: 'var(--color-orange)',
                            borderRadius: '16px',
                            padding: '18px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            boxShadow: '0 4px 20px rgba(232,163,23,0.3)',
                        }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <svg width="56" height="56" viewBox="0 0 56 56">
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

                        {/* Nav menu */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0',
                        }}>
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
                        padding: '32px 36px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        border: '1px solid #f0f0f0',
                        minHeight: '500px',
                    }}>
                        {renderContent()}
                    </div>

                </div>
            </div>
        </PhotographerLayout>
    );
};

export default PhotographerEditProfile;