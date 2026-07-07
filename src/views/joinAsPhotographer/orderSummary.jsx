import React, { useEffect, useState } from 'react';
import ViewsLayout from '../Layout';
import { LuCalendar, LuClock, LuStar } from 'react-icons/lu';
import { FiMapPin } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPhotographerOrderDetails } from '@/services/order';

/* ── Info row used inside detail cards ── */
const InfoRow = ({ icon, label, value, bold }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0', borderBottom: '1px solid #f5f5f5' }}>
        {icon && <span style={{ color: '#E8A317', flexShrink: 0 }}>{icon}</span>}
        <span style={{ fontSize: '13px', color: '#999', fontWeight: 500, minWidth: icon ? 'auto' : '80px' }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: bold ? 700 : 600, marginLeft: icon ? 'auto' : '0', flex: icon ? 'unset' : 1 }}>{value}</span>
    </div>
);

/* ── Label-value pair for right-column cards ── */
const DetailPair = ({ label, value }) => (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '13px', color: '#999', fontWeight: 500, minWidth: '68px' }}>{label}:</span>
        <span style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: 600 }}>{value}</span>
    </div>
);

/* ── Status badge ── */
const STATUS_COLORS = {
    scheduled: { background: '#E3EEFF', color: '#2563EB' },
    confirmed: { background: '#E2F6EE', color: '#0D9488' },
    completed: { background: '#E2F6EE', color: '#0D9488' },
    cancelled: { background: '#FDE6E5', color: '#E0473C' },
};
const StatusBadge = ({ status }) => {
    if (!status) return null;
    const style = STATUS_COLORS[status.toLowerCase()] || { background: '#F0F0F0', color: '#666' };
    return (
        <span style={{
            ...style,
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '999px',
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
        }}>
            {status}
        </span>
    );
};

/* ── Map placeholder ── */
const MapPreview = () => (
    <div style={{ borderRadius: '12px', overflow: 'hidden', height: '200px', position: 'relative', background: '#e8edf0', border: '1px solid #eee' }}>
        <img
            src="https://tile.openstreetmap.org/13/4823/3084.png"
            alt="map"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 20, height: 20, borderRadius: '50%',
            background: '#e53935', border: '3px solid #fff',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }} />
    </div>
);

/* ── Card wrapper ── */
const Card = ({ title, right, children, style = {} }) => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '20px 22px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        ...style,
    }}>
        {(title || right) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                {title && <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{title}</p>}
                {right}
            </div>
        )}
        {children}
    </div>
);

const formatDateTime = (iso) => {
    if (!iso) return { date: '-', time: '-' };
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
};

const formatCurrency = (amount, currency = 'INR') => {
    const num = Number(amount);
    if (Number.isNaN(num)) return '-';
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(num);
    } catch {
        return `${currency} ${num.toFixed(2)}`;
    }
};

const OrderSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // The booking id is passed via router state from YourOrderList
    // (navigate('/order-summary', { state: { orderId } })) rather than a URL param.
    const orderId = location.state?.orderId;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError('No order selected.');
            return;
        }

        let cancelled = false;

        const fetchOrderDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getPhotographerOrderDetails(orderId);
                // Handle either an axios response ({ data: { data: {...} } })
                // or an already-unwrapped body ({ data: {...} }).
                const payload = response?.data?.data ?? response?.data ?? response ?? null;
                if (!cancelled) setBooking(payload);
            } catch (err) {
                console.error('Failed to fetch order details:', err);
                if (!cancelled) setError('Failed to load order details.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchOrderDetails();
        return () => { cancelled = true; };
    }, [orderId]);

    if (loading) {
        return (
            <ViewsLayout>
                <div style={{ background: '#f7f7f5', minHeight: '100vh', padding: '80px 0', textAlign: 'center', color: '#999' }}>
                    Loading order details...
                </div>
            </ViewsLayout>
        );
    }

    if (error || !booking) {
        return (
            <ViewsLayout>
                <div style={{ background: '#f7f7f5', minHeight: '100vh', padding: '80px 0', textAlign: 'center', color: '#E0473C' }}>
                    {error || 'Order not found.'}
                </div>
            </ViewsLayout>
        );
    }

    const order = booking.order || {};
    const orderItem = booking.order_item || {};
    const customer = booking.customer || {};
    const address = booking.event_address || {};
    const currency = order.currency || 'INR';

    const start = formatDateTime(booking.event_start_at);
    const end = formatDateTime(booking.event_end_at);
    const bookingCreated = formatDateTime(booking.created_at);

    const eventTypeName = order.category?.name || orderItem.snapshot_package_name || '-';
    const packageName = orderItem.snapshot_package_name || order.snapshot_event_package_name || 'Package';
    const packagePrice = formatCurrency(orderItem.snapshot_price, currency);
    const totalPrice = formatCurrency(orderItem.snapshot_price, currency);

    const customerName = [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Guest';
    const customerPhoto = customer.profile_picture?.url;

    const addressLines = [address.address_line1, address.address_line2, address.address_line3]
        .filter(Boolean)
        .join(', ');
    const fullAddress = [addressLines, address.city, address.state, address.postal_code, address.country]
        .filter(Boolean)
        .join(', ') || booking.location_label || 'Address not available';

    return (
        <ViewsLayout>
            <div style={{
                background: '#f7f7f5',
                minHeight: '100vh',
                padding: '36px 0',
                fontFamily: 'inherit',
            }}>

                {/* ── Page Title ── */}
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: '0 0 32px',
                    letterSpacing: '-0.02em',
                }}>Order Summary</h1>

                {/* ── Two-column grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '560px 560px',
                    gap: '20px',
                    margin: '0 auto',
                    padding: '0 40px',
                }}>

                    {/* ════ LEFT COLUMN ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Event Details */}
                        <Card title="Event details" right={<StatusBadge status={booking.status} />}>
                            <InfoRow icon={<LuStar size={15} />} label="Event" value={eventTypeName} />
                            <InfoRow icon={<LuCalendar size={15} />} label="Start Date" value={start.date} />
                            <InfoRow icon={<LuCalendar size={15} />} label="End Date" value={end.date} />
                            <InfoRow icon={<LuClock size={15} />} label="Start Time" value={start.time} />
                            <InfoRow icon={<LuClock size={15} />} label="End Time" value={end.time} />
                            {booking.duration_type && (
                                <InfoRow label="Duration Type" value={booking.duration_type} />
                            )}
                            {booking.customer_notes && (
                                <InfoRow label="Customer Notes" value={booking.customer_notes} />
                            )}
                        </Card>

                        {/* Package Details */}
                        <Card title="Package details">
                            <div style={{
                                border: '1.5px solid #f0f0f0',
                                borderRadius: '10px',
                                padding: '14px 16px',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                    <div>
                                        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>{packageName}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#999', lineHeight: 1.6 }}>
                                            {orderItem.snapshot_photographer_name ? `Photographer: ${orderItem.snapshot_photographer_name}` : ''}
                                            {orderItem.duration_type ? ` · ${orderItem.duration_type}` : ''}
                                        </p>
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#1a1a1a', whiteSpace: 'nowrap', marginLeft: '16px' }}>{packagePrice}</span>
                                </div>
                                {orderItem.notes && (
                                    <div style={{ borderTop: '1px dashed #eee', marginTop: '12px', paddingTop: '12px' }}>
                                        <span style={{ fontSize: '13px', color: '#555' }}>{orderItem.notes}</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Event Address */}
                        <Card title="Event Address">
                            <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#555', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                <FiMapPin size={14} color="#E8A317" style={{ marginTop: '2px', flexShrink: 0 }} />
                                {fullAddress}
                            </p>
                            <MapPreview />
                        </Card>
                    </div>

                    {/* ════ RIGHT COLUMN ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Booking Details */}
                        <Card title="Booking Details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>Booking Id</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{booking.booking_number || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>Order Number</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{order.order_number || '-'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>Booking Date</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{bookingCreated.date}</span>
                            </div>
                        </Card>


                        {/* Client Information */}
                        <Card title="Client Information">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    overflow: 'hidden', border: '2px solid #f0f0f0',
                                    flexShrink: 0,
                                    background: '#f4f4f4',
                                }}>
                                    {customerPhoto && (
                                        <img
                                            src={customerPhoto}
                                            alt={customerName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>{customerName}</span>
                            </div>
                            <DetailPair label="Name" value={customerName} />
                            <DetailPair label="Email" value={customer.email || '-'} />
                            <DetailPair label="Phone" value={customer.phone_no || '-'} />
                        </Card>

                        {/* Pricing Details */}
                        <Card title="Pricing details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</span>
                            </div>

                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>{packageName}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{packagePrice}</span>
                                </div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: '2px',
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>{totalPrice}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                {/* <button
                                    onClick={() => navigate(-1)}
                                    style={{
                                        flex: 1,
                                        background: '#fff',
                                        color: '#E8A317',
                                        border: '2px solid #E8A317',
                                        borderRadius: '50px',
                                        padding: '12px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s, color 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#FFF3D6'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                                >
                                    Edit Order
                                </button> */}
                                <button
                                    onClick={() => navigate('/join-as-photographer/edit-profile')}
                                    style={{
                                        flex: 1,
                                        background: '#E8A317',
                                        color: '#fff',
                                        border: '2px solid #E8A317',
                                        borderRadius: '50px',
                                        padding: '12px',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#c98f10'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#E8A317'; }}
                                >
                                    Back to Home
                                </button>
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </ViewsLayout>
    );
};

export default OrderSummary;