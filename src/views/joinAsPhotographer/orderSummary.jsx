import React from 'react';
import ViewsLayout from '../Layout';
import { BsCameraFill, BsStarFill } from 'react-icons/bs';
import { LuCalendar, LuClock, LuStar } from 'react-icons/lu';
import { FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

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
const Card = ({ title, children, style = {} }) => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '20px 22px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        ...style,
    }}>
        {title && (
            <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{title}</p>
        )}
        {children}
    </div>
);

const OrderSummary = () => {
    const navigate = useNavigate();

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
                    // alignItems: 'start',
                    // maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '0 40px',
                }}>

                    {/* ════ LEFT COLUMN ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Event Details */}
                        <Card title="Event details">
                            <InfoRow icon={<LuStar size={15} />} label="Event" value="wedding" />
                            <InfoRow icon={<LuCalendar size={15} />} label="Start Date" value="29 May 2025" />
                            <InfoRow icon={<LuCalendar size={15} />} label="End Date" value="31 May 2025" />
                            <InfoRow icon={<LuClock size={15} />} label="Start Time" value="0500 Am" />
                            <InfoRow icon={<LuClock size={15} />} label="End Time" value="12:00 Am" />
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
                                        <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>Full Package</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#999', lineHeight: 1.6 }}>
                                            package includes (1 highlight , 2 reels , 300edited photos)
                                        </p>
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#1a1a1a', whiteSpace: 'nowrap', marginLeft: '16px' }}>$124.00</span>
                                </div>

                                <div style={{ borderTop: '1px dashed #eee', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Add ons (dron shoot)</span>
                                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>$10.00</span>
                                </div>
                            </div>
                        </Card>

                        {/* Event Address */}
                        <Card title="Event Address">
                            <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#555', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                <FiMapPin size={14} color="#E8A317" style={{ marginTop: '2px', flexShrink: 0 }} />
                                4, Manhar Para -4 Near Thorala Police chowki, Rajkot, Gujarat - 360003, India
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
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>NH29248429752458</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>Booking Date</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>3 Oct 2025</span>
                            </div>
                        </Card>


                        {/* Client Information */}
                        <Card title="Client Information">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    overflow: 'hidden', border: '2px solid #f0f0f0',
                                    flexShrink: 0,
                                }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                                        alt="Guest"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Guest 1</span>
                            </div>
                            <DetailPair label="Name" value="John Doe" />
                            <DetailPair label="Gender" value="Male" />
                            <DetailPair label="Age" value="30" />
                        </Card>

                        {/* Pricing Details */}
                        <Card title="Pricing details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price</span>
                            </div>

                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { label: 'Full package', value: '$124.00' },
                                    { label: 'Add ons', value: '$10.00' },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>{row.label}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{row.value}</span>
                                    </div>
                                ))}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: '2px',
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>$134.00</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button
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
                                </button>
                                <button
                                    onClick={() => navigate('/')}
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