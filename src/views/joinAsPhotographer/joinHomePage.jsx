import React, { useState, useEffect, useCallback } from 'react';
import PhotographerLayout from './PhotographerLayout';
import AvailabilityCalendar from './AvailabilityCalendar';
import { getBookingCounts, getUpcomingBookings } from '../../services/booking';

/* ─── responsive helper ────────────────────────────────────────────────────── */
const useIsNarrow = (breakpoint) => {
    const getMatch = () => (typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false);
    const [isNarrow, setIsNarrow] = useState(getMatch);
    useEffect(() => {
        const onResize = () => setIsNarrow(getMatch());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakpoint]);
    return isNarrow;
};

/* ─── status badge meta for bookings ──────────────────────────────────────── */
const STATUS_META = {
    scheduled: { label: 'Upcoming', color: '#d97706', bg: '#fef3c7' },
    completed: { label: 'Completed', color: '#15803d', bg: '#dcfce7' },
    cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2' },
};
const statusMeta = (s) => STATUS_META[s] || { label: s ? s[0].toUpperCase() + s.slice(1) : 'Unknown', color: '#6b7280', bg: '#f3f4f6' };

/* ─── formatting helpers ──────────────────────────────────────────────────── */
const formatDateLine = (startIso, endIso) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const datePart = start.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const timeFmt = (d) => d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return `${datePart} • ${timeFmt(start)} – ${timeFmt(end)}`;
};

const initials = (first, last) => `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();

const AVATAR_COLORS = ['#f5a623', '#2563eb', '#9333ea', '#15803d', '#dc2626', '#0891b2'];
const avatarColorFor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ─── simple inline icons (no external icon dependency) ───────────────────── */
const IconBag = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l1 13H5L6 7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
);

const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
    </svg>
);

/* ─── stat box ─────────────────────────────────────────────────────────────── */
const StatBox = ({ icon, label, value, isNarrow }) => (
    <div style={{ ...statCard, padding: isNarrow ? '14px' : '18px', flex: 1, minWidth: isNarrow ? '100%' : '220px' }}>
        <div style={statIconWrap}>{icon}</div>
        <div>
            <p style={statLabel}>{label}</p>
            <p style={statValue}>{value}</p>
        </div>
    </div>
);

/* ─── upcoming booking row ─────────────────────────────────────────────────── */
const BookingRow = ({ booking, isNarrow }) => {
    const meta = statusMeta(booking.status);
    const customerName = `${booking.customer?.first_name || ''} ${booking.customer?.last_name || ''}`.trim();
    const title = booking.snapshot_package_name || booking.event_package_name || booking.category?.name || 'Booking';

    return (
        <div style={{ ...bookingRow, flexWrap: isNarrow ? 'wrap' : 'nowrap' }}>
            <div style={{ ...avatarStyle, background: avatarColorFor(booking.customer?.id || booking.id) }}>
                {initials(booking.customer?.first_name, booking.customer?.last_name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={bookingTitle}>{title}</p>
                <p style={bookingSub}>{formatDateLine(booking.event_start_at, booking.event_end_at)}</p>
                <p style={bookingMeta}>
                    {customerName}
                    {booking.location_label ? <span> · {booking.location_label}</span> : null}
                </p>
            </div>
            <span style={{ ...statusBadge, color: meta.color, background: meta.bg, marginLeft: isNarrow ? 'auto' : 0 }}>
                {meta.label}
            </span>
        </div>
    );
};

/* ─── page ─────────────────────────────────────────────────────────────────── */
const JoinHomePage = () => {
    const isNarrow = useIsNarrow(640);

    const [counts, setCounts] = useState({ total_bookings: 0, upcoming_bookings: 0 });
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);

    const fetchCounts = useCallback(async () => {
        try {
            const res = await getBookingCounts();
            setCounts(res?.data?.data || { total_bookings: 0, upcoming_bookings: 0 });
        } catch (e) {
            console.error('Failed to load booking counts', e);
        }
    }, []);

    const fetchUpcoming = useCallback(async () => {
        try {
            setLoadingUpcoming(true);
            const res = await getUpcomingBookings();
            setUpcomingBookings(res?.data?.data || []);
        } catch (e) {
            console.error('Failed to load upcoming bookings', e);
        } finally {
            setLoadingUpcoming(false);
        }
    }, []);

    useEffect(() => {
        fetchCounts();
        fetchUpcoming();
    }, [fetchCounts, fetchUpcoming]);

    return (
        <PhotographerLayout>
            <div style={{ background: '#f9fafb', minHeight: '100vh', width: '100%', padding: isNarrow ? '14px' : '28px', boxSizing: 'border-box' }}>

                {/* Stat boxes */}
                <div style={{ display: 'flex', gap: isNarrow ? '10px' : '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <StatBox icon={<IconBag />} label="Total Bookings" value={counts.total_bookings} isNarrow={isNarrow} />
                    <StatBox icon={<IconClock />} label="Upcoming Bookings" value={counts.upcoming_bookings} isNarrow={isNarrow} />
                </div>

                {/* Calendar */}
                <div style={{ marginBottom: '24px' }}>
                    <AvailabilityCalendar />
                </div>

                {/* Upcoming Bookings (full width, no notifications panel) */}
                <div style={{ ...card, padding: isNarrow ? '14px' : '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <h3 style={{ margin: 0, fontSize: isNarrow ? '15px' : '17px', fontWeight: 800, color: '#1a1a1a' }}>Upcoming Bookings</h3>
                        <a href="#" style={viewAllLink}>View All</a>
                    </div>

                    {loadingUpcoming && (
                        <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#9ca3af', padding: '12px 0' }}>Loading…</p>
                    )}

                    {!loadingUpcoming && upcomingBookings.length === 0 && (
                        <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#9ca3af', padding: '12px 0' }}>No upcoming bookings.</p>
                    )}

                    {!loadingUpcoming && upcomingBookings.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {upcomingBookings.map((b) => (
                                <BookingRow key={b.id} booking={b} isNarrow={isNarrow} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PhotographerLayout>
    );
};

/* ─── styles ───────────────────────────────────────────────────────────────── */
const card = {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    border: '1px solid #f3f4f6',
    boxSizing: 'border-box',
};

const statCard = {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    border: '1px solid #f3f4f6',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
};

const statIconWrap = {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#fdf0db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
};

const statLabel = {
    margin: 0,
    fontSize: '12.5px',
    color: '#9ca3af',
    fontWeight: 600,
};

const statValue = {
    margin: '2px 0 0',
    fontSize: '22px',
    fontWeight: 800,
    color: '#1a1a1a',
};

const viewAllLink = {
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#f5a623',
    textDecoration: 'none',
};

const bookingRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid #f3f4f6',
    borderRadius: '10px',
    padding: '10px 12px',
    background: '#fafafa',
};

const avatarStyle = {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
};

const bookingTitle = {
    margin: 0,
    fontSize: '13.5px',
    fontWeight: 700,
    color: '#1a1a1a',
};

const bookingSub = {
    margin: '2px 0 0',
    fontSize: '12px',
    color: '#6b7280',
};

const bookingMeta = {
    margin: '2px 0 0',
    fontSize: '11.5px',
    color: '#9ca3af',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
};

const statusBadge = {
    fontSize: '10.5px',
    fontWeight: 700,
    borderRadius: '6px',
    padding: '4px 9px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
};

export default JoinHomePage;