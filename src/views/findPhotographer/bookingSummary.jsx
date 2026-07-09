import React, { useState, useEffect } from 'react';
import ViewsLayout from '../Layout';
import { BsCameraFill, BsStarFill } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { LuCalendar, LuClock, LuStar } from 'react-icons/lu';
import { FiMapPin, FiCreditCard, FiPackage, FiEdit2 } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrderDetails } from '../../services/order';
import { getProfile } from '../../services/profile';

/* ── Helpers ── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const fmtTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};
const fmtDateTime = (iso) => {
  if (!iso) return '—';
  return `${fmtDate(iso)}, ${fmtTime(iso)}`;
};
const fmt = (val) => (val !== null && val !== undefined && val !== '' ? val : '—');
const fmtMoney = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

const getFeatureIcon = (key) => {
  switch (key) {
    case 'edited_photos': return '📸';
    case 'reels':         return '🎬';
    case 'highlight':     return '✨';
    case 'video':         return '🎥';
    default:              return '✔️';
  }
};
const formatFeatureName = (key) =>
  key?.replaceAll('_', ' ')?.replace(/\b\w/g, (c) => c.toUpperCase());

/* ── Status pill ── */
const StatusPill = ({ value, map }) => {
  const cfg = map?.[value] || { bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{
      fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '20px',
      background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap',
    }}>
      {value || '—'}
    </span>
  );
};

const ORDER_STATUS = {
  draft:     { bg: '#FFF3D6', color: '#b45309' },
  confirmed: { bg: '#dcfce7', color: '#15803d' },
  completed: { bg: '#dbeafe', color: '#1d4ed8' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c' },
};
const PAYMENT_STATUS = {
  completed: { bg: '#dcfce7', color: '#15803d' },
  pending:   { bg: '#FFF3D6', color: '#b45309' },
  failed:    { bg: '#fee2e2', color: '#b91c1c' },
};

/* ── Reusable row ── */
const Row = ({ label, value, right = false }) => (
  <div className="bs-row" style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #f5f5f5', gap: '10px',
  }}>
    <span style={{ fontSize: '12px', color: '#999', fontWeight: 500, flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', textAlign: right ? 'right' : 'left', maxWidth: '60%', wordBreak: 'break-word' }}>
      {value}
    </span>
  </div>
);

/* ── Card ── */
const Card = ({ title, icon, children, accent, style = {} }) => (
  <div className="bs-card" style={{
    background: '#fff', borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden', ...style,
  }}>
    {title && (
      <div className="bs-card-head" style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: accent ? `${accent}08` : 'transparent',
      }}>
        {icon && <span style={{ color: accent || '#E8A317', flexShrink: 0 }}>{icon}</span>}
        <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{title}</p>
      </div>
    )}
    <div className="bs-card-body">
      {children}
    </div>
  </div>
);

/* ── Map ── */
const MapPreview = ({ lat, lng }) => {
  if (!lat || !lng) return (
    <div style={{ borderRadius: '10px', height: '160px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '13px' }}>
      No location data
    </div>
  );
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', height: '200px', position: 'relative', border: '1px solid #eee' }}>
      <iframe title="Event Location" src={src} width="100%" height="100%" style={{ border: 'none', display: 'block' }} loading="lazy" />
      <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}>
        {lat.toFixed(5)}, {lng.toFixed(5)}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════ */
const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query    = new URLSearchParams(location.search);
  const orderId  = query.get('orderId') || location.state?.orderId || location.state?.order?.id;

  const [order, setOrder]     = useState(null);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) { setError('No order ID provided.'); setLoading(false); return; }
      try {
        setLoading(true);
        const [orderRes, profileRes] = await Promise.allSettled([getOrderDetails(orderId), getProfile()]);
        if (orderRes.status === 'fulfilled') setOrder(orderRes.value?.data?.data);
        else { console.error(orderRes.reason); setError('Failed to fetch booking details.'); }
        if (profileRes.status === 'fulfilled') setUser(profileRes.value?.data?.data);
      } catch (err) {
        console.error(err);
        setError('An error occurred while loading booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  if (loading) return (
    <ViewsLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f7f7f5', color: '#888', fontSize: '16px' }}>
        <span style={{ animation: 'spin 1s linear infinite', marginRight: '10px', display: 'inline-block' }}>⏳</span>
        Loading booking summary...
      </div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </ViewsLayout>
  );

  if (error || !order) return (
    <ViewsLayout>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f7f7f5', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{error || 'Booking details not found.'}</p>
        <button onClick={() => navigate('/home')} className="su-btn-primary" style={{ padding: '10px 24px', borderRadius: '50px' }}>Back to Home</button>
      </div>
    </ViewsLayout>
  );

  const lat           = order.event_lat ?? order.event_address?.lat;
  const lng           = order.event_lng ?? order.event_address?.lng;
  const serviceItems  = order.service_provider_items || [];
  const editingItems  = order.editing_items || [];
  const hasEditing    = editingItems.length > 0;
  const hasPayment    = !!order.payment;

  const addressString = [
    order.event_address?.address_line1,
    order.event_address?.address_line2,
    order.event_address?.address_line3,
    order.event_address?.city,
    order.event_address?.state,
    order.event_address?.postal_code,
    order.event_address?.country,
  ].filter(Boolean).join(', ') || 'No address specified';

  return (
    <ViewsLayout>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .bs-page { padding: 36px 16px; }
        .bs-title { font-size: 28px; }
        .bs-badges { gap: 10px; margin-bottom: 32px; }

        .bs-grid {
          display: grid;
          grid-template-columns: minmax(0, 560px) minmax(0, 560px);
          gap: 20px;
          margin: 0 auto;
          padding: 0 24px;
          justify-content: center;
          max-width: 1180px;
        }

        .bs-card-head { padding: 16px 20px; border-bottom: 1px solid #f5f5f5; }
        .bs-card-body { padding: 18px 20px; }

        .bs-provider-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
        .bs-provider-meta { flex: 1; min-width: 0; }
        .bs-provider-price { text-align: right; flex-shrink: 0; }

        @media (max-width: 1200px) {
          .bs-grid {
            grid-template-columns: minmax(0, 1fr);
            max-width: 600px;
            padding: 0;
          }
        }

        @media (max-width: 640px) {
          .bs-page { padding: 24px 0; }
          .bs-title { font-size: 22px; }
          .bs-badges { gap: 8px; margin-bottom: 22px; flex-wrap: wrap; }
          .bs-grid { gap: 14px; padding: 0 12px; }
          .bs-card-head { padding: 13px 14px; }
          .bs-card-body { padding: 14px 14px; }
          .bs-row span:first-child { font-size: 11px; }
          .bs-row span:last-child { font-size: 12.5px; }
        }

        @media (max-width: 420px) {
          .bs-provider-card { flex-wrap: wrap; }
          .bs-provider-price { text-align: left; margin-left: 60px; }
        }
      `}</style>
      <div className="bs-page" style={{ background: '#f7f7f5', minHeight: '100vh', fontFamily: 'inherit' }}>

        {/* ── Page header ── */}
        <h1 className="bs-title" style={{ textAlign: 'center', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Booking Summary
        </h1>

        {/* Order number + status badges */}
        <div className="bs-badges" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#888', fontFamily: 'monospace' }}>{order.order_number}</span>
          <StatusPill value={order.status} map={ORDER_STATUS} />
          {hasPayment && <StatusPill value={`Payment: ${order.payment.status}`} map={{ [`Payment: ${order.payment.status}`]: PAYMENT_STATUS[order.payment.status] || {} }} />}
          {hasEditing && (
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', whiteSpace: 'nowrap' }}>
              ✂️ Editing Included
            </span>
          )}
        </div>

        {/* ── Two-column grid (collapses to one column under 1200px) ── */}
        <div className="bs-grid">

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── Event Details ── */}
            <Card title="Event Details" icon={<LuStar size={15} />}>
              <Row label="Category"   value={order.category?.name || '—'} />
              <Row label="Event Date" value={fmtDate(order.event_date)} />
              <Row label="Start"      value={fmtDateTime(order.event_start_at)} />
              <Row label="End"        value={fmtDateTime(order.event_end_at)} />
              {order.snapshot_event_package_name && (
                <Row label="Package" value={order.snapshot_event_package_name} />
              )}
              {order.notes && (
                <Row label="Notes" value={order.notes} />
              )}
            </Card>

            {/* ── Photography / Videography Items ── */}
            {serviceItems.length > 0 && (
              <Card title={`Photography · ${serviceItems.length} Provider${serviceItems.length > 1 ? 's' : ''}`} icon={<BsCameraFill size={14} />} accent="#E8A317">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {serviceItems.map((item, idx) => {
                    const name   = item.snapshot_photographer_name || 'Photographer';
                    const avatar = item.profile_picture.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
                    return (
                      <div key={item.id} style={{
                        border: '1.5px solid #f0f0f0', borderRadius: '14px',
                        overflow: 'hidden',
                      }}>
                        {/* Provider header */}
                        <div className="bs-provider-card" style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                          <img src={avatar} alt={name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f0f0', flexShrink: 0 }} />
                          <div className="bs-provider-meta">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>{name}</span>
                              {item.is_verified_user && <MdVerified size={14} color="#E8A317" title="Verified" />}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '3px', flexWrap: 'wrap' }}>
                              {item.avg_rating ? (
                                <span style={{ fontSize: '11px', color: '#888' }}>⭐ {item.avg_rating} ({item.review_count} reviews)</span>
                              ) : (
                                <span style={{ fontSize: '11px', color: '#bbb' }}>No reviews yet</span>
                              )}
                              {item.events_completed > 0 && (
                                <span style={{ fontSize: '11px', color: '#888' }}>{item.events_completed}+ events</span>
                              )}
                            </div>
                          </div>
                          <div className="bs-provider-price">
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>{fmtMoney(item.total_amount)}</div>
                            <div style={{ fontSize: '11px', color: '#aaa' }}>Total incl. tax</div>
                          </div>
                        </div>

                        {/* Provider details */}
                        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                          {item.snapshot_package_name && <Row label="Package"  value={item.snapshot_package_name} />}
                          <Row label="Price"      value={fmtMoney(item.price)} />
                          {/* <Row label="Commission" value={fmtMoney(item.commission_amount)} /> */}
                          <Row label="Tax"        value={fmtMoney(item.tax_amount)} />
                          <Row label="Duration"   value={fmt(item.duration_type)} />
                          <Row label="Joined"     value={fmtDate(item.joined_date)} />
                        </div>

                        {/* Tax snapshot */}
                        {item.tax_snapshot?.length > 0 && (
                          <div style={{ padding: '0 16px 12px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Tax Breakdown</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {item.tax_snapshot.map((t, i) => (
                                <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', color: '#374151' }}>
                                  <span style={{ fontWeight: 700 }}>{t.name}</span> {t.rate}% = {fmtMoney(t.amount)}
                                  {t.is_inclusive && <span style={{ color: '#aaa', marginLeft: '4px' }}>(incl.)</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Booking number if confirmed */}
                        {item.booking_number && (
                          <div style={{ margin: '0 16px 14px', padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Booking #</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', fontFamily: 'monospace' }}>{item.booking_number}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* ── Editing Items ── */}
            {hasEditing && (
              <Card title={`Editing · ${editingItems.length} Package${editingItems.length > 1 ? 's' : ''}`} icon={<FiEdit2 size={14} />} accent="#8b5cf6">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {editingItems.map((item) => {
                    const tierName    = item.snapshot_package_name || 'Editing Package';
                    const accentColor =
                      tierName.toLowerCase().includes('platinum') ? '#818cf8' :
                      tierName.toLowerCase().includes('gold')     ? '#f5a623' : '#9ca3af';
                    return (
                      <div key={item.id} style={{ border: `1.5px solid ${accentColor}33`, borderRadius: '14px', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ background: `${accentColor}10`, padding: '14px 16px', borderBottom: `1px solid ${accentColor}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✂️</div>
                            <div>
                              <div style={{ fontSize: '10px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Editing Package</div>
                              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>{tierName}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>{fmtMoney(item.total_amount)}</div>
                            <StatusPill value={item.status} map={{ pending: { bg: '#fff7ed', color: '#c2410c' }, delivered: { bg: '#dcfce7', color: '#15803d' } }} />
                          </div>
                        </div>

                        {/* Features */}
                        {item.snapshot_features?.length > 0 && (
                          <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                            {item.snapshot_features.map((f, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb', borderRadius: '9px', padding: '9px 10px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                                  {getFeatureIcon(f.feature_key)}
                                </div>
                                <div>
                                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    {formatFeatureName(f.feature_key)}
                                  </div>
                                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>{f.label}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Price rows */}
                        <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                          <Row label="Price" value={fmtMoney(item.snapshot_price)} />
                          <Row label="Tax"   value={fmtMoney(item.tax_amount)} />
                          {item.tax_snapshot?.length > 0 && (
                            <div style={{ paddingTop: '8px' }}>
                              <div style={{ fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Tax Breakdown</div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {item.tax_snapshot.map((t, i) => (
                                  <div key={i} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', color: '#374151' }}>
                                    <span style={{ fontWeight: 700 }}>{t.name}</span> {t.rate}% = {fmtMoney(t.amount)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.promised_at && <Row label="Promised By" value={fmtDateTime(item.promised_at)} />}
                          {item.delivered_at && <Row label="Delivered"   value={fmtDateTime(item.delivered_at)} />}
                          {item.delivery_notes && <Row label="Notes"     value={item.delivery_notes} />}
                          {item.delivery_url && (
                            <div style={{ paddingTop: '8px' }}>
                              <a href={item.delivery_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600, textDecoration: 'underline' }}>
                                View Delivery →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* ── Event Address ── */}
            <Card title="Event Address" icon={<FiMapPin size={14} />}>
              <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#555', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <FiMapPin size={14} color="#E8A317" style={{ marginTop: '2px', flexShrink: 0 }} />
                {addressString}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '14px' }}>
                {order.event_address?.city        && <Row label="City"      value={order.event_address.city} />}
                {order.event_address?.state        && <Row label="State"     value={order.event_address.state} />}
                {order.event_address?.country      && <Row label="Country"   value={order.event_address.country} />}
                {order.event_address?.postal_code  && <Row label="PIN"       value={order.event_address.postal_code} />}
                {order.event_address?.timezone     && <Row label="Timezone"  value={order.event_address.timezone} />}
              </div>
              <MapPreview lat={lat} lng={lng} />
            </Card>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── Booking Details ── */}
            <Card title="Booking Details" icon={<LuStar size={14} />}>
              <Row label="Order Number" value={order.order_number} />
              <Row label="Status" value={<StatusPill value={order.status} map={ORDER_STATUS} />} />
              <Row label="Category"     value={order.category?.name || '—'} />
              <Row label="Currency"     value={order.currency} />
              <Row label="Created"      value={fmtDateTime(order.created_at)} />
              {order.confirmed_at && <Row label="Confirmed"  value={fmtDateTime(order.confirmed_at)} />}
              {order.completed_at && <Row label="Completed"  value={fmtDateTime(order.completed_at)} />}
              {order.cancelled_at && <Row label="Cancelled"  value={fmtDateTime(order.cancelled_at)} />}
            </Card>

            {/* ── Payment Details ── */}
            {hasPayment && (
              <Card title="Payment Details" icon={<FiCreditCard size={14} />} accent="#10b981">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '12px 14px', background: order.payment.status === 'completed' ? '#f0fdf4' : '#fff7ed', borderRadius: '10px', border: `1px solid ${order.payment.status === 'completed' ? '#bbf7d0' : '#fed7aa'}`, flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: order.payment.status === 'completed' ? '#15803d' : '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {order.payment.status === 'completed' ? '✅ Payment Successful' : '⏳ Payment Pending'}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1a1a', marginTop: '4px' }}>
                      {fmtMoney(order.payment.amount)}
                    </div>
                  </div>
                  <StatusPill value={order.payment.status} map={PAYMENT_STATUS} />
                </div>
                <Row label="Payment ID" value={order.payment.id} />
                {order.payment.gateway_payment_id && (
                  <Row label="Gateway Ref" value={<span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{order.payment.gateway_payment_id}</span>} />
                )}
                <Row label="Currency" value={order.payment.currency} />
              </Card>
            )}

            {/* ── Provider Information ── */}
            {serviceItems.length > 0 && (
              <Card title="Provider Information" icon={<BsCameraFill size={14} />} accent="#E8A317">
                {serviceItems.map((item, idx) => {
                  const name   = item.snapshot_photographer_name || 'Photographer';
                  const avatar = item.profile_picture.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
                  return (
                    <div key={item.id} style={{ marginBottom: idx < serviceItems.length - 1 ? '16px' : '0', borderBottom: idx < serviceItems.length - 1 ? '1px solid #eee' : 'none', paddingBottom: idx < serviceItems.length - 1 ? '16px' : '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f0f0f0', flexShrink: 0 }}>
                          <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>{name}</span>
                            {item.is_verified_user && <MdVerified size={13} color="#E8A317" title="Verified" />}
                          </div>
                          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>
                            Joined {fmtDate(item.joined_date)}
                          </div>
                        </div>
                      </div>
                      <Row label="Rating"     value={item.avg_rating ? `⭐ ${item.avg_rating} (${item.review_count} reviews)` : 'New provider'} />
                      <Row label="Events"     value={item.events_completed > 0 ? `${item.events_completed}+` : '0 completed'} />
                      {item.booking_number && <Row label="Booking #" value={<span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{item.booking_number}</span>} />}
                    </div>
                  );
                })}
              </Card>
            )}

            {/* ── Client Information ── */}
            <Card title="Client Information">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f0f0f0', flexShrink: 0 }}>
                  <img
                    src={user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Guest')}`}
                    alt="Client"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>
                    {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '—'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa' }}>Client</div>
                </div>
              </div>
              <Row label="Email"   value={fmt(user?.email)} />
              <Row label="Contact" value={fmt(user?.phone_no)} />
            </Card>

            {/* ── Pricing Details ── */}
            <Card title="Pricing Details">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price ({order.currency || 'INR'})</span>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                {/* Per-provider lines */}
                {serviceItems.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Photography</div>
                    {serviceItems.map((item) => (
                      <Row key={item.id}
                        label={item.snapshot_photographer_name || 'Provider'}
                        value={fmtMoney(item.total_amount)}
                      />
                    ))}
                  </div>
                )}

                {/* Per-editing lines */}
                {hasEditing && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Editing</div>
                    {editingItems.map((item) => (
                      <Row key={item.id}
                        label={item.snapshot_package_name || 'Editing Package'}
                        value={fmtMoney(item.total_amount)}
                      />
                    ))}
                  </div>
                )}

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <Row label="Subtotal" value={fmtMoney(order.subtotal)} />
                  {/* <Row label="Discount" value={fmtMoney(order.discount_amount)} /> */}
                  <Row label="Tax"      value={fmtMoney(order.tax_amount)} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid #1a1a1a', paddingTop: '12px', marginTop: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>{fmtMoney(order.total_amount)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>

                <button
                  onClick={() => navigate('/home')}
                  style={{ flex: 1, background: '#E8A317', color: '#fff', border: '2px solid #E8A317', borderRadius: '50px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
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

export default BookingSummary;