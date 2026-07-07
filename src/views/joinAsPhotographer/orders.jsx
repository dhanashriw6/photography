import React, { useMemo, useRef, useState, useEffect } from 'react';
import '../index.css';
import {
    FiSearch,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiClipboard,
    FiChevronDown,
    FiEye,
    FiMessageCircle,
    FiDownload,
    FiMoreVertical,
    FiMoreHorizontal,
    FiChevronsLeft,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getPhotographerBookings } from '../../services/order';
import ServerError from '../ServerError';

const ACCENT = '#f5a623';
const ACCENT_TEXT = '#B7791F';

const STATUS_STYLES = {
    'Pending Approval': { background: '#FFF3D6', color: '#B7791F' },
    Upcoming: { background: '#E3EEFF', color: '#2563EB' },
    Completed: { background: '#E2F6EE', color: '#0D9488' },
    Cancelled: { background: '#FDE6E5', color: '#E0473C' },
};

const SORT_OPTIONS = ['Newest First', 'Oldest First', 'Amount: High to Low', 'Amount: Low to High'];
const EVENT_TYPE_OPTIONS = ['All Events', 'Wedding', 'Engagement', 'Baby Shoot', 'Corporate', 'Pre-Wedding'];
const PAYOUT_OPTIONS = ['All Status', 'Paid', 'Pending'];
const PAGE_SIZE_OPTIONS = ['10 per page', '25 per page', '50 per page'];

const formatDate = (iso) => {
    if (!iso) return { date: '-', time: '-' };
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleDateString('en-IN', { weekday: 'short' }) + ', ' +
            d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
};

// Maps a raw booking object from the API into the shape the table/stat cards use.
// NOTE: the bookings API doesn't currently return `client`, `package`, `amount`,
// or `status` — those are filled with fallbacks below until the API adds them.
const mapBookingToOrder = (booking) => {
    const now = new Date();
    const start = booking.event_start_date ? new Date(booking.event_start_date) : null;
    const end = booking.event_end_date ? new Date(booking.event_end_date) : start;
    const bucket = end && end < now ? 'past' : 'upcoming';
    const status = bucket === 'past' ? 'Completed' : 'Upcoming';

    return {
        id: booking.booking_number ?? String(booking.id),
        bookingId: booking.id,
        eventName: booking.event_name || booking.event_category_name || 'Untitled Event',
        client: booking.client_name || '-',
        date: booking.event_start_date,
        endDate: booking.event_end_date,
        package: booking.event_category_name || '-',
        amount: typeof booking.amount === 'number' ? booking.amount : null,
        status,
        bucket,
    };
};

const StatCard = ({ icon, iconBg, iconColor, value, label, sub }) => (
    <div
        style={{
            background: '#fff',
            border: '1px solid #f1f1f1',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flex: 1,
            minWidth: '180px',
        }}
    >
        <div
            style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: iconBg,
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            {icon}
        </div>
        <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>{label}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>{value}</div>
            <div style={{ fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap' }}>{sub}</div>
        </div>
    </div>
);

const Dropdown = ({ label, value, options, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div style={{ position: 'relative', minWidth: '160px' }} ref={ref}>
            {label && (
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', fontWeight: 600 }}>
                    {label}
                </div>
            )}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #e2e2e2',
                    background: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#333',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {value}
                </span>
                <FiChevronDown
                    size={14}
                    style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
                />
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        background: '#fff',
                        border: '1.5px solid #e2e2e2',
                        borderRadius: '8px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
                        overflow: 'hidden',
                        zIndex: 30,
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            style={{
                                padding: '9px 12px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                color: value === opt ? ACCENT : '#444',
                                fontWeight: value === opt ? 700 : 500,
                                background: value === opt ? '#FFF8EB' : 'transparent',
                            }}
                            onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = '#FAFAFA'; }}
                            onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const RowActions = ({ order, onView }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const iconBtnStyle = {
        border: 'none',
        background: 'none',
        padding: '6px',
        color: '#999',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '6px',
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <button type="button" title="View details" onClick={onView} style={iconBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = ACCENT}
                onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                <FiEye size={16} />
            </button>
            <button type="button" title="Chat with client" style={iconBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = ACCENT}
                onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                <FiMessageCircle size={16} />
            </button>
            <button type="button" title="Download invoice" style={iconBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.color = ACCENT}
                onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                <FiDownload size={16} />
            </button>

            <div style={{ position: 'relative' }} ref={ref}>
                <button type="button" onClick={() => setOpen((v) => !v)} style={iconBtnStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = ACCENT}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#999'}>
                    <FiMoreVertical size={16} />
                </button>

                {open && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            right: 0,
                            background: '#fff',
                            border: '1px solid #eee',
                            borderRadius: '10px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            overflow: 'hidden',
                            zIndex: 40,
                            minWidth: '170px',
                        }}
                    >
                        {[
                            { icon: <FiEye size={14} />, label: 'View Details', onClick: onView },
                            { icon: <FiMessageCircle size={14} />, label: 'Chat with Client' },
                            { icon: <FiDownload size={14} />, label: 'Download Invoice' },
                            { icon: <FiMoreHorizontal size={14} />, label: 'More Options' },
                        ].map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => { item.onClick?.(); setOpen(false); }}
                                style={{
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
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const YourOrderList = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('Newest First');
    const [eventType, setEventType] = useState('All Events');
    const [payoutStatus, setPayoutStatus] = useState('All Status');
    const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'past'
    const [pageSize, setPageSize] = useState('10 per page');
    const [page, setPage] = useState(1);

    const [rawBookings, setRawBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchCustomerOrders() {
            setLoading(true);
            setError(null);
            try {
                const response = await getPhotographerBookings();
                // Handle either shape: axios response ({ data: { data: [...] } })
                // or an already-unwrapped body ({ data: [...] }).
                const list = Array.isArray(response?.data?.data)
                    ? response.data.data
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response)
                            ? response
                            : [];
                if (!cancelled) {
                    setRawBookings(list);
                }
            } catch (err) {
                if (!cancelled) setError(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchCustomerOrders();
        return () => { cancelled = true; };
    }, []);

    // Transform raw API bookings into the order shape the table/cards render.
    const orders = useMemo(() => rawBookings.map(mapBookingToOrder), [rawBookings]);

    const stats = useMemo(() => {
        const total = orders.length;
        const pending = orders.filter((o) => o.status === 'Pending Approval').length;
        const upcoming = orders.filter((o) => o.bucket === 'upcoming').length;
        const completed = orders.filter((o) => o.status === 'Completed').length;
        const cancelled = orders.filter((o) => o.status === 'Cancelled').length;
        return { total, pending, upcoming, completed, cancelled };
    }, [orders]);

    const filtered = useMemo(() => {
        let list = orders.filter((o) => o.bucket === tab);

        if (eventType !== 'All Events') {
            list = list.filter(
                (o) =>
                    o.eventName.toLowerCase().includes(eventType.toLowerCase()) ||
                    o.package.toLowerCase().includes(eventType.toLowerCase())
            );
        }

        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (o) =>
                    o.id.toLowerCase().includes(q) ||
                    o.eventName.toLowerCase().includes(q) ||
                    o.client.toLowerCase().includes(q)
            );
        }

        const sorted = [...list];
        switch (sortBy) {
            case 'Oldest First':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'Amount: High to Low':
                sorted.sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
                break;
            case 'Amount: Low to High':
                sorted.sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0));
                break;
            default:
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return sorted;
    }, [orders, search, sortBy, eventType, tab]);

    const totalCount = orders.length;

    return (
        <div>
            <h2 className="pe-title" style={{ marginBottom: '4px' }}>
                Order Management
            </h2>
            <p style={{ color: '#888', fontSize: '14px', margin: '0 0 22px' }}>
                Track and manage all your photography orders in one place.
            </p>

            {/* Stat cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
                <StatCard
                    icon={<FiClipboard size={18} />}
                    iconBg="#FFF3D6" iconColor="#B7791F"
                    value={stats.total} label="Total Orders" sub="All time orders"
                />
                <StatCard
                    icon={<FiClock size={18} />}
                    iconBg="#FFF3D6" iconColor="#B7791F"
                    value={stats.pending} label="Pending Approval" sub="Awaiting your approval"
                />
                <StatCard
                    icon={<FiCalendar size={18} />}
                    iconBg="#FFF3D6" iconColor="#B7791F"
                    value={stats.upcoming} label="Upcoming Shoots" sub="In the next 30 days"
                />
                <StatCard
                    icon={<FiCheckCircle size={18} />}
                    iconBg="#E2F6EE" iconColor="#0D9488"
                    value={stats.completed} label="Completed" sub="Successfully completed"
                />
                <StatCard
                    icon={<FiXCircle size={18} />}
                    iconBg="#FDE6E5" iconColor="#E0473C"
                    value={stats.cancelled} label="Cancelled" sub="Cancelled orders"
                />
            </div>

            {/* Filter bar */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end',
                    gap: '12px',
                    background: '#fff',
                    border: '1px solid #f1f1f1',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    marginBottom: '18px',
                }}
            >
                <div style={{ flex: 2, minWidth: '220px' }}>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px', fontWeight: 600 }}>&nbsp;</div>
                    <div
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            border: '1.5px solid #e2e2e2', borderRadius: '8px',
                            padding: '9px 12px',
                        }}
                    >
                        <FiSearch color="#999" size={15} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by order ID, event or client..."
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent' }}
                        />
                    </div>
                </div>

                <Dropdown label="Sort by" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
                <Dropdown label="Event Type" value={eventType} options={EVENT_TYPE_OPTIONS} onChange={setEventType} />
                <Dropdown label="Payout Status" value={payoutStatus} options={PAYOUT_OPTIONS} onChange={setPayoutStatus} />

                <div style={{ display: 'flex', gap: '4px', background: '#f4f4f4', borderRadius: '8px', padding: '4px' }}>
                    {['upcoming', 'past'].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => { setTab(t); setPage(1); }}
                            style={{
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                background: tab === t ? '#fff' : 'transparent',
                                color: tab === t ? ACCENT : '#777',
                                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #f1f1f1', borderRadius: '14px', overflow: 'hidden' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '110px 1.3fr 1.1fr 1.1fr 1fr 0.9fr 1.1fr 110px',
                        gap: '8px',
                        padding: '12px 18px',
                        background: '#FAFAFA',
                        borderBottom: '1px solid #f1f1f1',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#999',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}
                >
                    <div>Order ID</div>
                    <div>Event Name</div>
                    <div>Client</div>
                    <div>Date</div>
                    <div>Package</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div style={{ textAlign: 'right' }}>Actions</div>
                </div>

                {loading ? (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#bbb', fontSize: '14px' }}>
                        Loading orders...
                    </div>
                ) : error ? (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#E0473C', fontSize: '14px' }}>
                        Failed to load orders. Please try again.
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: '#bbb', fontSize: '14px' }}>
                        No orders found.
                    </div>
                ) : (
                    filtered.map((order) => {
                        const { date, time } = formatDate(order.date);
                        const badge = STATUS_STYLES[order.status] || STATUS_STYLES.Upcoming;
                        return (
                            <div
                                key={order.id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '110px 1.3fr 1.1fr 1.1fr 1fr 0.9fr 1.1fr 110px',
                                    gap: '8px',
                                    padding: '14px 18px',
                                    borderBottom: '1px solid #f5f5f5',
                                    alignItems: 'center',
                                    fontSize: '13px',
                                    color: '#333',
                                }}
                            >
                                <div style={{ fontWeight: 600, color: '#444' }}>{order.id}</div>
                                <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{order.eventName}</div>
                                <div>{order.client}</div>
                                <div>
                                    <div>{date}</div>
                                    <div style={{ fontSize: '11px', color: '#999' }}>{time}</div>
                                </div>
                                <div>{order.package}</div>
                                <div style={{ fontWeight: 700 }}>
                                    {order.amount != null ? `₹${order.amount.toLocaleString('en-US')}.00` : '-'}
                                </div>
                                <div>
                                    <span
                                        style={{
                                            ...badge,
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            padding: '4px 10px',
                                            borderRadius: '999px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                                <RowActions
                                    order={order}
                                    onView={() => navigate('/order-summary', { state: { orderId: order.bookingId } })}
                                />
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginTop: '18px',
                }}
            >
                <div style={{ fontSize: '13px', color: '#888' }}>
                    Showing 1 to {filtered.length} of {totalCount} orders
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Dropdown value={pageSize} options={PAGE_SIZE_OPTIONS} onChange={setPageSize} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[FiChevronsLeft, FiChevronLeft].map((Icon, i) => (
                            <button
                                key={i}
                                type="button"
                                style={{
                                    width: '32px', height: '32px', border: '1px solid #e2e2e2',
                                    borderRadius: '8px', background: '#fff', color: '#999',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Icon size={14} />
                            </button>
                        ))}

                        {[1].map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPage(p)}
                                style={{
                                    width: '32px', height: '32px',
                                    border: page === p ? `1px solid ${ACCENT}` : '1px solid #e2e2e2',
                                    borderRadius: '8px',
                                    background: page === p ? '#FFF3D6' : '#fff',
                                    color: page === p ? ACCENT_TEXT : '#666',
                                    fontWeight: 700, fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                {p}
                            </button>
                        ))}

                        {[FiChevronRight, FiChevronsRight].map((Icon, i) => (
                            <button
                                key={i}
                                type="button"
                                style={{
                                    width: '32px', height: '32px', border: '1px solid #e2e2e2',
                                    borderRadius: '8px', background: '#fff', color: '#999',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Icon size={14} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        // <ServerError />
    );
};

export default YourOrderList;