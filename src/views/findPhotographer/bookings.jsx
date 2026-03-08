import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuCalendar, LuClock } from 'react-icons/lu';
import { BsStarFill } from 'react-icons/bs';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const bookings = [
    { id: 'NH2924001', photographer: 'John Miller', date: '29 May 2025', time: '01:00 PM – 07:00 PM', event: 'Wedding', pkg: 'Full Package', price: '$124.00', status: 'upcoming', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
    { id: 'NH2924002', photographer: 'Olivia Davis', date: '14 Jun 2025', time: '10:00 AM – 04:00 PM', event: 'Fashion Shoot', pkg: 'Half Day', price: '$200.00', status: 'upcoming', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
    { id: 'NH2924003', photographer: 'Emma Johnson', date: '3 Oct 2024', time: '09:00 AM – 06:00 PM', event: 'Birthday Party', pkg: 'Full Package', price: '$134.00', status: 'completed', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    { id: 'NH2924004', photographer: 'Michael Brown', date: '20 Sep 2024', time: '02:00 PM – 05:00 PM', event: 'Corporate Event', pkg: 'Half Day', price: '$175.00', status: 'cancelled', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
];

const statusConfig = {
    upcoming:  { label: 'Upcoming',  bg: '#EFF6FF', color: '#2563EB' },
    completed: { label: 'Completed', bg: '#F0FDF4', color: '#16A34A' },
    cancelled: { label: 'Cancelled', bg: '#FEF2F2', color: '#DC2626' },
};

const Bookings = () => {
    const [tab, setTab] = useState('All');
    const navigate = useNavigate();

    const filtered = tab === 'All' ? bookings : bookings.filter(b => b.status === tab.toLowerCase());

    return (
        <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>My Bookings</h2>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#888' }}>Manage and review all your photography bookings.</p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: '8px 20px', borderRadius: '50px', border: 'none',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.2s',
                        background: tab === t ? '#E8A317' : '#f5f5f5',
                        color: tab === t ? '#fff' : '#555',
                    }}>{t}</button>
                ))}
            </div>

            {/* Booking cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#bbb', fontSize: '14px' }}>
                        No bookings found.
                    </div>
                )}
                {filtered.map(b => {
                    const sc = statusConfig[b.status];
                    return (
                        <div key={b.id} style={{
                            background: '#fff', borderRadius: '14px',
                            border: '1.5px solid #f0f0f0', padding: '18px 20px',
                            display: 'flex', gap: '16px', alignItems: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            transition: 'box-shadow 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.09)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
                        >
                            <img src={b.img} alt={b.photographer} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #f0f0f0' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                    <div>
                                        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{b.photographer}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{b.event} · {b.pkg}</p>
                                    </div>
                                    <span style={{ background: sc.bg, color: sc.color, fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px' }}>{sc.label}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666' }}>
                                        <LuCalendar size={13} color="#E8A317" /> {b.date}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#666' }}>
                                        <LuClock size={13} color="#E8A317" /> {b.time}
                                    </span>
                                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a', marginLeft: 'auto' }}>{b.price}</span>
                                </div>
                            </div>
                            {b.status !== 'cancelled' && (
                                <button
                                    onClick={() => navigate('/booking-summary')}
                                    style={{
                                        background: '#fff', border: '1.5px solid #E8A317',
                                        color: '#E8A317', borderRadius: '50px',
                                        padding: '8px 16px', fontSize: '12px', fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FFF3D6'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                >View</button>
                            )}
                            {b.status === "completed" && (
                                <button
                                    onClick={() => navigate('/review')}
                                    style={{
                                        background: '#fff', border: '1.5px solid #E8A317',
                                        color: '#E8A317', borderRadius: '50px',
                                        padding: '8px 16px', fontSize: '12px', fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FFF3D6'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                >Review</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Bookings;