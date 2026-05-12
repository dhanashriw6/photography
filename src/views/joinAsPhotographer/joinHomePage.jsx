import React, { useState, useEffect } from 'react';
import PhotographerLayout from './PhotographerLayout';
import headerBgImage from '../../assets/Images/headerBgImage.jpg';
import { getProfile } from '../../services/profile';

/* ─── Circular Progress ────────────────────────────────────────────────────── */
const CircularProgress = ({ pct = 64, size = 110, stroke = 9 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="#f5a623" strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
        </svg>
    );
};

/* ─── Mini Calendar ────────────────────────────────────────────────────────── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay = (y, m) => new Date(y, m, 1).getDay();

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

// Sample events — day number → type
const EVENTS = { 2: 'leave', 10: 'booking', 19: 'booking', 26: 'booking', 2: 'booking-faded' };
const BOOKINGS_HIGHLIGHT = new Set([10, 19, 26]);
const LEAVE_DAYS = new Set([2]);

const Calendar = () => {
    const today = new Date();
    const [cur, setCur] = useState({ y: 2026, m: 2 }); // March 2026 (0-indexed)

    const { y, m } = cur;
    const daysInMonth = getDaysInMonth(y, m);
    const firstDay = getFirstDay(y, m);
    const daysInPrev = getDaysInMonth(y, m - 1 < 0 ? 11 : m - 1);

    const prev = () => setCur(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 });
    const next = () => setCur(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 });
    const goToday = () => setCur({ y: today.getFullYear(), m: today.getMonth() });

    // Build grid cells
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: daysInPrev - firstDay + i + 1, cur: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) cells.push({ day: i, cur: false });

    const isToday = (d, isCur) => isCur && d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1a1a1a' }}>
                    {MONTH_NAMES[m]} – {y}
                </h3>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button onClick={prev} style={navBtn}>‹</button>
                    <button onClick={goToday} style={{ ...navBtn, padding: '4px 10px', fontSize: '12px' }}>Today</button>
                    <button onClick={next} style={navBtn}>›</button>
                </div>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: '4px' }}>
                {DAYS.map(d => (
                    <div key={d} style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', padding: '4px 0' }}>{d}</div>
                ))}
            </div>

            {/* Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
                {cells.map((cell, i) => {
                    const isBook = cell.cur && BOOKINGS_HIGHLIGHT.has(cell.day);
                    const isLeave = cell.cur && LEAVE_DAYS.has(cell.day);
                    const isFaded = !cell.cur;
                    const todayCell = isToday(cell.day, cell.cur);

                    return (
                        <div key={i} style={{
                            textAlign: 'center', padding: '4px 2px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                        }}>
                            <div style={{
                                width: '28px', height: '28px',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: todayCell ? 700 : 500,
                                color: isFaded ? '#d1d5db' : todayCell ? '#fff' : '#374151',
                                background: todayCell ? '#f5a623' : 'transparent',
                            }}>
                                {cell.day}
                            </div>
                            {isBook && (
                                <span style={{
                                    fontSize: '9px', fontWeight: 700, background: '#f5a623',
                                    color: '#fff', borderRadius: '4px', padding: '1px 5px',
                                    letterSpacing: '0.3px',
                                }}>Booking</span>
                            )}
                            {isLeave && (
                                <span style={{
                                    fontSize: '9px', fontWeight: 700, background: '#fde68a',
                                    color: '#92400e', borderRadius: '4px', padding: '1px 5px',
                                }}>Leave</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const navBtn = {
    background: '#fff', border: '1.5px solid #e5e7eb',
    borderRadius: '6px', cursor: 'pointer',
    padding: '4px 8px', fontSize: '14px', fontWeight: 700, color: '#374151',
    lineHeight: 1,
};

/* ─── Stat Card ────────────────────────────────────────────────────────────── */
const StatCard = ({ value, label, icon, accent = '#f5a623' }) => (
    <div style={{
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: '14px',
        padding: '16px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flex: 1, minWidth: 0,
    }}>
        <div>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1a1a1a' }}>{value}</p>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#555', fontWeight: 500 }}>{label}</p>
        </div>
        <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
        }}>
            {icon}
        </div>
    </div>
);

/* ─── Notification Item ────────────────────────────────────────────────────── */
const NotifItem = ({ avatar, title, subtitle, time }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
    }}>
        <div style={{
            width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden',
            background: '#e5e7eb', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
        }}>
            {avatar || '📷'}
        </div>
        <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{title}</p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>{subtitle}</p>
        </div>
        <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0 }}>{time}</span>
    </div>
);

/* ─── Main Dashboard ───────────────────────────────────────────────────────── */
const PhotographerDashboard = () => {
    const [profileName, setProfileName] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                const data = res?.data;
                // Adjust the field name below to match your API response shape
                const name = data?.name || data?.full_name || data?.firstName || '';
                setProfileName(name);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };
        fetchProfile();
    }, []);

    const recentEvents = [
        { orderDate: '00/00/0000', details: 'Full Day (wedding)', eventDate: '00/00/0000' },
        { orderDate: '00/00/0000', details: 'Full Day (wedding)', eventDate: '00/00/0000' },
        { orderDate: '00/00/0000', details: 'Full Day (wedding)', eventDate: '00/00/0000' },
        { orderDate: '00/00/0000', details: 'Full Day (wedding)', eventDate: '00/00/0000' },
    ];

    const notifications = [
        { title: 'Recived New order', subtitle: 'By John', time: '2 hours ago', avatar: '🧑' },
        { title: 'Ana Added Review', subtitle: 'Lorem...', time: '2 hours ago', avatar: '👩' },
        { title: 'John Added Review', subtitle: 'Lorem...', time: '2 hours ago', avatar: '👨' },
    ];

    return (
        <PhotographerLayout>
            <div style={{
                background: '#f9fafb',
                minHeight: '100vh',
                width: '100%'
            }}>

                {/* ── Hero / Header Banner ── */}
                <div style={{
                    background: `url(${headerBgImage}) center/cover no-repeat`,
                    padding: '32px 28px 28px',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '140px',
                    width: '100%'
                }}>
                  

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Approved badge */}
                        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                            <span style={{
                                background: '#fff', color: '#16a34a',
                                fontSize: '11px', fontWeight: 700,
                                borderRadius: '20px', padding: '4px 10px',
                                display: 'flex', alignItems: 'center', gap: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}>
                                <span style={{ color: '#16a34a' }}>●</span> Approved
                            </span>
                        </div> */}

                        {/* Greeting */}
                        <h1 style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                            Hello {profileName || 'John'}
                        </h1>
                        <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#555', fontWeight: 500 }}>
                            welcome to your Dashboard
                        </p>

                        {/* Stat cards row */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <StatCard value="$123.00" label="Total Cash" icon="💰" />
                            <StatCard value="100" label="Total Orders" icon="📋" />
                            <StatCard value="50" label="Active Orders" icon="✅" />
                            <StatCard value="50" label="Pending Orders" icon="🔄" />
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Row 1 — Profile completion + Recent Events */}
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>

                        {/* Profile completion */}
                        <div style={card}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '12px' }}>
                                <CircularProgress pct={64} />
                                <span style={{
                                    position: 'absolute', fontSize: '18px', fontWeight: 800, color: '#1a1a1a',
                                }}>64%</span>
                            </div>
                            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1a1a1a', textAlign: 'center' }}>
                                Complete Profile
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center', lineHeight: 1.4 }}>
                                Your profile is 64% completed.
                            </p>
                        </div>

                        {/* Recent Events */}
                        <div style={card}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>Your Recent Events</h3>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['OrderDate', 'Event Details', 'Event Date'].map(h => (
                                            <th key={h} style={{
                                                textAlign: 'left', fontSize: '12px', fontWeight: 700,
                                                color: '#6b7280', paddingBottom: '10px',
                                                borderBottom: '1px solid #f3f4f6',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentEvents.map((ev, i) => (
                                        <tr key={i}>
                                            <td style={td}>{ev.orderDate}</td>
                                            <td style={td}>{ev.details}</td>
                                            <td style={td}>{ev.eventDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                                <button style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#f5a623', fontSize: '13px', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', gap: '4px', padding: 0,
                                }}>
                                    View All Orders →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 — Upcoming Booking + Calendar */}
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px' }}>

                        {/* Upcoming Booking */}
                        <div style={card}>
                            <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>
                                Upcoming Booking
                            </h3>
                            <div style={{
                                width: '100%', height: '120px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #fde68a, #f5a623)',
                                marginBottom: '12px', overflow: 'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '36px',
                            }}>
                                📷
                            </div>
                            <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Full Day Shoot</p>
                            <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#9ca3af' }}>Tue, 10 March 2026</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555' }}>
                                    <span>🕐</span> 05:00 Am – 05:00 Am
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#555' }}>
                                    <span>👤</span> John
                                </div>
                            </div>
                            <button style={{
                                width: '100%', padding: '10px',
                                background: '#f5a623', color: '#fff',
                                border: 'none', borderRadius: '8px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                            }}>
                                See Details
                            </button>
                        </div>

                        {/* Calendar */}
                        <div style={card}>
                            <Calendar />
                        </div>
                    </div>

                    {/* Row 3 — Recent Notifications */}
                    <div style={card}>
                        <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#1a1a1a' }}>
                            Recent Notification
                        </h3>
                        <div>
                            {notifications.map((n, i) => (
                                <NotifItem key={i} {...n} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </PhotographerLayout>
    );
};

/* ─── Shared styles ────────────────────────────────────────────────────────── */
const card = {
    background: '#fff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    border: '1px solid #f3f4f6',
};

const td = {
    padding: '10px 0',
    fontSize: '13px', color: '#374151',
    borderBottom: '1px solid #f9fafb',
};

export default PhotographerDashboard;