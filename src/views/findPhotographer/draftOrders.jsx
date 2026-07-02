import React, { useEffect, useMemo, useRef, useState } from 'react';
import ViewsLayout from '../Layout';
import { getDraftOrders } from '../../services/order';
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiFileText,
    FiArrowRight,
    FiFileText as FiDraftIcon,
    FiAlertCircle,
    FiSearch,
    FiMoreVertical,
    FiTrash2,
    FiInfo,
} from 'react-icons/fi';
import { BsCurrencyRupee } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

// Drafts are auto-deleted 1 hour after creation (see footer note).
// There's no explicit expiry field from the API yet, so we derive it
// from created_at. Swap this out once the backend sends a real
// `expires_at` field.
const EXPIRING_SOON_THRESHOLD_MS = 20 * 60 * 1000;

const ACCENT = '#E8A317';
const ACCENT_DARK = '#B7791F';
const DANGER = '#E0473C';

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

const getExpiryInfo = (createdAt, expiresAt, now) => {
    const createdMs = new Date(createdAt).getTime();
    const expiresAtMs = new Date(expiresAt).getTime();

    const totalLifetime = Math.max(1, expiresAtMs - createdMs);
    const remainingMs = expiresAtMs - now;

    const percentRemaining = Math.min(
        100,
        Math.max(0, (remainingMs / totalLifetime) * 100)
    );

    const clamped = Math.max(0, remainingMs);

    const hrs = Math.floor(clamped / (1000 * 60 * 60));
    const mins = Math.floor((clamped % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((clamped % (1000 * 60)) / 1000);

    return {
        remainingMs: clamped,
        percentRemaining,
        expired: remainingMs <= 0,
        isExpiringSoon:
            remainingMs > 0 &&
            remainingMs <= EXPIRING_SOON_THRESHOLD_MS,
        label: `${pad(hrs)} : ${pad(mins)} : ${pad(secs)}`,
    };
};

const ExpiryRing = ({ percentRemaining, isExpiringSoon }) => {
    const size = 60;
    const stroke = 5;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentRemaining / 100) * circumference;
    const ringColor = isExpiringSoon ? DANGER : ACCENT;

    return (
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#eee"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.6s linear' }}
                />
            </svg>
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: ringColor,
                }}
            >
                {Math.round(percentRemaining)}%
            </div>
        </div>
    );
};

const StatCard = ({ icon, value, label, accent }) => (
    <div
        style={{
            background: '#fff',
            borderRadius: '14px',
            border: '1px solid #f1f1f1',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            minWidth: '200px',
            flex: 1,
        }}
    >
        <div
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: accent.bg,
                color: accent.fg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            {icon}
        </div>
        <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>
                {value}
            </div>
            <div style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{label}</div>
        </div>
    </div>
);

const DraftOrders = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [draftOrders, setDraftOrders] = useState([]);
    const [now, setNow] = useState(Date.now());
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('expiry_soonest');
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const fetchDraftOrders = async () => {
        try {
            setLoading(true);
            const res = await getDraftOrders();
            setDraftOrders(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDraftOrders();
    }, []);

    // Tick every second so countdowns/rings stay live.
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Close the kebab menu when clicking outside of it.
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const ordersWithExpiry = useMemo(
        () =>
            draftOrders.map((order) => ({
                ...order,
                __expiry: getExpiryInfo(
                    order.created_at,
                    order.expires_at,
                    now
                ),
            })),
        [draftOrders, now]
    );

    const visibleOrders = useMemo(() => {
        let list = ordersWithExpiry.filter((order) => !order.__expiry.expired);

        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (order) =>
                    order.event_name?.toLowerCase().includes(q) ||
                    order.order_number?.toLowerCase().includes(q)
            );
        }

        const sorted = [...list];
        switch (sortBy) {
            case 'expiry_soonest':
                sorted.sort((a, b) => a.__expiry.remainingMs - b.__expiry.remainingMs);
                break;
            case 'expiry_latest':
                sorted.sort((a, b) => b.__expiry.remainingMs - a.__expiry.remainingMs);
                break;
            case 'amount_high':
                sorted.sort((a, b) => Number(b.total_amount) - Number(a.total_amount));
                break;
            case 'amount_low':
                sorted.sort((a, b) => Number(a.total_amount) - Number(b.total_amount));
                break;
            case 'newest':
                sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            default:
                break;
        }
        return sorted;
    }, [ordersWithExpiry, search, sortBy]);

    const stats = useMemo(() => {
        const active = ordersWithExpiry.filter((o) => !o.__expiry.expired);
        const expiringSoon = active.filter((o) => o.__expiry.isExpiringSoon);
        const totalValue = active.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        return {
            activeCount: active.length,
            expiringSoonCount: expiringSoon.length,
            totalValue,
        };
    }, [ordersWithExpiry]);

    return (
        <ViewsLayout>
            <div
                style={{
                    minHeight: '100vh',
                    background: '#f8f8f8',
                    padding: '40px 24px',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}
                >
                    {/* Header row: title + stat cards */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '20px',
                            marginBottom: '30px',
                        }}
                    >
                        <div>
                            <h1
                                style={{
                                    fontSize: '30px',
                                    fontWeight: 800,
                                    marginBottom: '8px',
                                    color: '#1a1a1a',
                                }}
                            >
                                Draft Orders
                            </h1>
                            <p style={{ color: '#777', fontSize: '14px', margin: 0 }}>
                                Continue where you left off.
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '14px',
                            }}
                        >
                            <StatCard
                                icon={<FiDraftIcon size={18} />}
                                value={stats.activeCount}
                                label="Drafts in progress"
                                accent={{ bg: '#FFF4D6', fg: ACCENT_DARK }}
                            />

                            <StatCard
                                icon={<BsCurrencyRupee size={18} />}
                                value={`₹${stats.totalValue.toLocaleString('en-IN')}`}
                                label="Total value of all drafts"
                                accent={{ bg: '#FFF4D6', fg: ACCENT_DARK }}
                            />
                        </div>
                    </div>

                    {/* Search + sort */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '14px',
                            marginBottom: '24px',
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                minWidth: '240px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: '#fff',
                                border: '1px solid #eee',
                                borderRadius: '10px',
                                padding: '10px 14px',
                            }}
                        >
                            <FiSearch color="#999" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search drafts by event or order ID..."
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: '14px',
                                    background: 'transparent',
                                }}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: '#fff',
                                border: '1px solid #eee',
                                borderRadius: '10px',
                                padding: '10px 14px',
                            }}
                        >
                            <span style={{ fontSize: '13px', color: '#888', whiteSpace: 'nowrap' }}>
                                Sort by:
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    background: 'transparent',
                                }}
                            >
                                <option value="expiry_soonest">Expiry (Soonest)</option>
                                <option value="expiry_latest">Expiry (Latest)</option>
                                <option value="amount_high">Amount (High to Low)</option>
                                <option value="amount_low">Amount (Low to High)</option>
                                <option value="newest">Newest First</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '300px',
                            }}
                        >
                            Loading drafts...
                        </div>
                    ) : visibleOrders.length === 0 ? (
                        <div
                            style={{
                                background: '#fff',
                                borderRadius: '16px',
                                padding: '50px',
                                textAlign: 'center',
                            }}
                        >
                            <h3>No Draft Orders Found</h3>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                                gap: '20px',
                                width: '100%',
                                marginBottom: '24px',
                            }}
                        >
                            {visibleOrders.map((order) => {
                                const { percentRemaining, isExpiringSoon, label } = order.__expiry;

                                return (
                                    <div
                                        key={order.id}
                                        style={{
                                            background: '#fff',
                                            borderRadius: '18px',
                                            padding: '18px',
                                            boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                                            border: isExpiringSoon
                                                ? `1px solid ${DANGER}33`
                                                : '1px solid #f1f1f1',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {/* Header */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '18px',
                                                gap: '10px',
                                            }}
                                        >
                                            <div style={{ minWidth: 0 }}>
                                                <h3
                                                    style={{
                                                        margin: 0,
                                                        fontSize: '18px',
                                                        fontWeight: 700,
                                                        color: '#1a1a1a',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {order.event_name}
                                                </h3>
                                                <p
                                                    style={{
                                                        margin: '6px 0 0',
                                                        fontSize: '12px',
                                                        color: '#888',
                                                    }}
                                                >
                                                    {order.order_number}
                                                </p>
                                            </div>

                                            <span
                                                style={{
                                                    background: '#FFF4D6',
                                                    color: ACCENT_DARK,
                                                    padding: '6px 12px',
                                                    borderRadius: '999px',
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Event Date */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <FiCalendar color={ACCENT} style={{ flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {formatDate(order.event_date)}
                                            </span>
                                        </div>

                                        {/* Event Time */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '12px',
                                            }}
                                        >
                                            <FiClock color={ACCENT} style={{ flexShrink: 0 }} />
                                            <span style={{ fontSize: '14px', color: '#555' }}>
                                                {formatTime(order.event_start_at)} – {formatTime(order.event_end_at)}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px',
                                                marginBottom: '18px',
                                            }}
                                        >
                                            <FiMapPin
                                                color={ACCENT}
                                                style={{ marginTop: '3px', flexShrink: 0 }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#555',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {order.location_label}
                                            </span>
                                        </div>

                                        {/* Total + Stage */}
                                        <div
                                            style={{
                                                borderTop: '1px solid #f2f2f2',
                                                paddingTop: '16px',
                                                marginBottom: '16px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <div>
                                                <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
                                                    Total
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '20px',
                                                        fontWeight: 800,
                                                        color: ACCENT,
                                                    }}
                                                >
                                                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
                                                    Stage
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        fontSize: '13px',
                                                        fontWeight: 700,
                                                        color: '#1a1a1a',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: '7px',
                                                            height: '7px',
                                                            borderRadius: '50%',
                                                            background: ACCENT,
                                                            display: 'inline-block',
                                                        }}
                                                    />
                                                    Draft
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expiry */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '14px',
                                                background: isExpiringSoon ? '#FDECEC' : '#FFF9EC',
                                                borderRadius: '12px',
                                                padding: '12px 14px',
                                                marginBottom: '18px',
                                            }}
                                        >
                                            <ExpiryRing
                                                percentRemaining={percentRemaining}
                                                isExpiringSoon={isExpiringSoon}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        fontSize: '11px',
                                                        color: '#888',
                                                        marginBottom: '2px',
                                                    }}
                                                >
                                                    Expires in
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '17px',
                                                        fontWeight: 800,
                                                        color: '#1a1a1a',
                                                        letterSpacing: '0.5px',
                                                    }}
                                                >
                                                    {label}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#aaa',
                                                        display: 'flex',
                                                        gap: '24px',
                                                        marginTop: '2px',
                                                    }}
                                                >
                                                    <span>HRS</span>
                                                    <span>MINS</span>
                                                    <span>SECS</span>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '2px',
                                                    color: isExpiringSoon ? DANGER : '#bbb',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <FiAlertCircle size={16} />
                                                <span
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        textAlign: 'center',
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                   Auto-delete
<br />
on expiry
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer: created + menu + CTA */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginTop: 'auto',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    color: '#888',
                                                    fontSize: '12px',
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <FiFileText style={{ flexShrink: 0 }} />
                                                <span
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Created on {formatDate(order.created_at)}
                                                </span>
                                            </div>



                                            <button
                                                onClick={() =>
                                                    navigate('/requestBook', {
                                                        state: { orderId: order.id },
                                                    })
                                                }
                                                style={{
                                                    border: 'none',
                                                    background: ACCENT,
                                                    color: '#fff',
                                                    padding: '10px 16px',
                                                    borderRadius: '10px',
                                                    fontWeight: 700,
                                                    fontSize: '13px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    whiteSpace: 'nowrap',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                Continue Draft
                                                <FiArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* How it works */}
                    <div
                        style={{
                            background: '#fff',
                            border: '1px solid #f1f1f1',
                            borderRadius: '14px',
                            padding: '18px 20px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '14px',
                        }}
                    >
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: '#FFF4D6',
                                color: ACCENT_DARK,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <FiInfo size={18} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '4px', fontSize: '14px' }}>
                                How it works
                            </div>
                            <div style={{ color: '#888', fontSize: '13px', lineHeight: 1.5 }}>
                                Drafts are automatically deleted after 1 hour from the time they were
                                created. Make sure to complete your booking before the timer runs out.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ViewsLayout>
    );
};

const menuItemStyle = {
    width: '100%',
    border: 'none',
    background: 'none',
    padding: '10px 14px',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#333',
    textAlign: 'left',
};

export default DraftOrders;