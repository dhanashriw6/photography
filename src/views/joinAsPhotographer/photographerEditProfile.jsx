import React, { useState } from 'react';
import PhotographerLayout from './PhotographerLayout';
import { useNavigate } from 'react-router-dom';
import {
    FiUser, FiLock, FiChevronRight, FiHome,
    FiImage, FiPackage, FiShoppingBag, FiCreditCard, FiStar, FiChevronDown
} from 'react-icons/fi';
import ProfileInformation from './profileInfo';
import Portfolio          from './portfolio';
import Package            from './package';
import Orders             from './orders';
import Wallet             from './wallet';
import ReviewsDisputes    from './reviewsDisputes';
import ChangePassword     from './changePassword';
import AddBankDetails     from './bankDetails';

const MENU = [
    { key: 'profile',     label: 'Profile Information', icon: <FiUser        size={17} /> },
    { key: 'portfolio',   label: 'Portfolio',           icon: <FiImage       size={17} /> },
    { key: 'package',     label: 'Package',             icon: <FiPackage     size={17} /> },
    { key: 'orders',      label: 'Orders',              icon: <FiShoppingBag size={17} /> },
    { key: 'bankDetails', label: 'Bank Details',        icon: <FiCreditCard  size={17} /> },
    { key: 'wallet',      label: 'Wallet',              icon: <FiCreditCard  size={17} /> },
    { key: 'reviews',     label: 'Reviews & Disputes',  icon: <FiStar        size={17} /> },
    { key: 'password',    label: 'Change Password',     icon: <FiLock        size={17} /> },
];

const PhotographerEditProfile = () => {
    const [active, setActive]         = useState('profile');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate                    = useNavigate();
    const completion                  = 64;

    const activeItem = MENU.find(m => m.key === active);

    const renderContent = () => {
        switch (active) {
            case 'profile':     return <ProfileInformation onSave={() => {}} onCancel={() => navigate(-1)} />;
            case 'portfolio':   return <Portfolio />;
            case 'package':     return <Package />;
            case 'orders':      return <Orders />;
            case 'bankDetails': return <AddBankDetails />;
            case 'wallet':      return <Wallet />;
            case 'reviews':     return <ReviewsDisputes />;
            case 'password':    return <ChangePassword />;
            default:            return null;
        }
    };

    const handleMenuSelect = (key) => {
        setActive(key);
        setMobileMenuOpen(false);
    };

    return (
        <PhotographerLayout>
            <div className="pe-container">

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

                {/* ── Mobile: section picker dropdown ── */}
                <div className="pe-mobile-picker">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(v => !v)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: '#fff',
                            border: '1.5px solid #E8A317',
                            borderRadius: mobileMenuOpen ? '12px 12px 0 0' : '12px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1a1a1a',
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#E8A317', display: 'flex' }}>{activeItem?.icon}</span>
                            {activeItem?.label}
                        </span>
                        <FiChevronDown
                            size={18}
                            style={{
                                color: '#E8A317',
                                transform: mobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                                flexShrink: 0,
                            }}
                        />
                    </button>

                    {mobileMenuOpen && (
                        <div style={{
                            background: '#fff',
                            border: '1.5px solid #E8A317',
                            borderTop: 'none',
                            borderRadius: '0 0 12px 12px',
                            overflow: 'hidden',
                        }}>
                            {MENU.filter(m => m.key !== active).map((item, i, arr) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => handleMenuSelect(item.key)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 16px',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#333',
                                        textAlign: 'left',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fffbf0'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span style={{ color: '#bbb', display: 'flex' }}>{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pe-grid">

                    {/* ════ LEFT SIDEBAR — desktop only ════ */}
                    <div className="pe-sidebar">

                        {/* Progress card */}
                        <div className="pe-progress-card">
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
                        <div className="pe-nav-menu">
                            {MENU.map((item, i) => {
                                const isActive = active === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setActive(item.key)}
                                        className={`pe-nav-btn ${isActive ? 'active' : ''}`}
                                        style={{ borderBottom: i < MENU.length - 1 ? undefined : 'none' }}
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
                    <div className="pe-content-card">
                        {renderContent()}
                    </div>

                </div>
            </div>
        </PhotographerLayout>
    );
};

export default PhotographerEditProfile;