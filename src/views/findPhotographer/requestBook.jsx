import React, { useState, useEffect } from 'react';
import ViewsLayout from '../Layout';
import '../index.css';
import { BsCameraFill, BsStarFill } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { FiEdit2 } from 'react-icons/fi';
import { LuCalendar, LuClock } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRazorpay } from '../../hooks/useRazorpay';
import { placeOrder, getOrderDetails } from '../../services/order';
import { getProfile } from '../../services/profile';

/* ── Helpers ── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const fmtTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

const fmt = (val) => (val !== null && val !== undefined && val !== '' ? val : '—');

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

/* ── useWindowWidth hook ── */
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return width;
};

/* ── Reusable field ── */
const FieldBox = ({ label, children, style = {} }) => (
  <div className="su-field" style={style}>
    <label>{label}</label>
    {children}
  </div>
);

/* ── OpenStreetMap iframe ── */
const MapPreview = ({ lat, lng }) => {
  if (!lat || !lng) {
    return (
      <div style={{
        borderRadius: '10px', height: '160px', background: '#f0f0f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#bbb', fontSize: '13px',
      }}>
        No location data
      </div>
    );
  }
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', height: '200px', position: 'relative' }}>
      <iframe title="Event Location" src={mapSrc} width="100%" height="100%"
        style={{ border: 'none', display: 'block' }} loading="lazy" />
      <div style={{
        position: 'absolute', bottom: '8px', left: '8px',
        background: 'rgba(0,0,0,0.6)', color: '#fff',
        fontSize: '11px', padding: '3px 8px', borderRadius: '6px',
      }}>
        {lat.toFixed(5)}, {lng.toFixed(5)}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #f5f5f5',
  }}>
    <span style={{ fontSize: '12px', color: '#999', fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>{value}</span>
  </div>
);

/* ── Single Provider Card ── */
const SingleProviderCard = ({ item }) => {
  const name   = item.snapshot_photographer_name || 'Photographer';
  const avatar = item.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ background: 'var(--color-orange)', height: '80px' }} />
      <div style={{
        background: '#fff', padding: '0 24px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ marginTop: '-44px', position: 'relative', marginBottom: '12px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: '4px solid #fff', overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}>
            <img src={avatar} alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            position: 'absolute', bottom: '5px', right: '5px',
            width: '13px', height: '13px', borderRadius: '50%',
            background: '#22c55e', border: '2px solid #fff',
          }} />
        </div>

        <p style={{ margin: '0 0 8px', fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>
          {name}
        </p>

        {item.is_verified_user && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            background: '#FFF3D6', border: '1px solid var(--color-orange)',
            borderRadius: '50px', padding: '4px 12px', marginBottom: '18px',
            fontSize: '12px', fontWeight: 700, color: 'var(--color-orange)',
          }}>
            <MdVerified size={13} color="var(--color-orange)" />
            Verified photographer
          </div>
        )}

        <div style={{
          display: 'flex', width: '100%',
          border: '1.5px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px', borderRight: '1.5px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '3px' }}>
              <BsCameraFill size={13} color="#E8A317" />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>
                {item.events_completed > 0 ? `${item.events_completed}+` : '0'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 500 }}>Events completed</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '3px' }}>
              <BsStarFill size={13} color="#E8A317" />
              <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>
                {item.avg_rating ?? '—'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 500 }}>Rating</p>
          </div>
        </div>

        <div style={{
          marginTop: '14px', width: '100%',
          background: '#fafafa', borderRadius: '10px', padding: '12px 14px',
        }}>
          <InfoRow label="Package"    value={fmt(item.snapshot_package_name)} />
          <InfoRow label="Price"      value={`₹${parseFloat(item.snapshot_price).toLocaleString('en-IN')}`} />
          <InfoRow label="Commission" value={`₹${parseFloat(item.commission_amount).toLocaleString('en-IN')}`} />
          <InfoRow label="Tax"        value={`₹${parseFloat(item.tax_amount).toLocaleString('en-IN')}`} />
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>
              ₹{parseFloat(item.total_amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Bulk Provider Row Card ── */
const BulkProviderRow = ({ item }) => {
  const name   = item.snapshot_photographer_name || 'Photographer';
  const avatar = item.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

  return (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '16px 18px',
      border: '1px solid #ececec', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0 }}>
        <img src={avatar} alt={name}
          style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', marginBottom: '2px' }}>
            {name}
          </div>
          {item.snapshot_package_name && (
            <div style={{ fontSize: '12px', color: '#888' }}>{item.snapshot_package_name}</div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
            {item.is_verified_user && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                fontSize: '11px', fontWeight: 600, color: 'var(--color-orange)',
              }}>
                <MdVerified size={11} color="var(--color-orange)" /> Verified
              </span>
            )}
            {item.avg_rating && (
              <span style={{ fontSize: '11px', color: '#888' }}>
                ⭐ {item.avg_rating} ({item.review_count})
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>
          ₹{parseFloat(item.total_amount).toLocaleString('en-IN')}
        </div>
        {item.events_completed > 0 && (
          <div style={{ fontSize: '11px', color: '#aaa' }}>{item.events_completed}+ events</div>
        )}
      </div>
    </div>
  );
};

/* ── Editing Package Card ── */
const EditingItemCard = ({ item }) => {
  const features = item.snapshot_features || [];
  const tierName = item.snapshot_package_name || 'Editing Package';

  const accentColor =
    tierName.toLowerCase().includes('platinum') ? '#818cf8' :
    tierName.toLowerCase().includes('gold')     ? '#f5a623' :
    '#9ca3af';

  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: `1.5px solid ${accentColor}22`,
      boxShadow: `0 4px 20px ${accentColor}22`,
      overflow: 'hidden',
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
        borderBottom: `1.5px solid ${accentColor}22`,
        padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Editing Package
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', marginTop: '1px' }}>
              {tierName}
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.05em', padding: '4px 12px', borderRadius: '20px',
          background: item.status === 'pending' ? '#fff7ed' : '#f0fdf4',
          color:      item.status === 'pending' ? '#c2410c'  : '#15803d',
          border:     `1px solid ${item.status === 'pending' ? '#fed7aa' : '#bbf7d0'}`,
          flexShrink: 0,
        }}>
          {item.status ?? 'pending'}
        </div>
      </div>

      {features.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '10px', padding: '16px 20px',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: '#f9fafb', borderRadius: '10px', padding: '10px 12px',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              }}>
                {getFeatureIcon(f.feature_key)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {formatFeatureName(f.feature_key)}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginTop: '1px' }}>
                  {f.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '0 20px 18px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        <InfoRow label="Package Price" value={`₹${parseFloat(item.snapshot_price).toLocaleString('en-IN')}`} />
        <InfoRow label="Tax"           value={`₹${parseFloat(item.tax_amount).toLocaleString('en-IN')}`} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', marginTop: '2px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>Total</span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
            ₹{parseFloat(item.total_amount).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const RequestBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const width    = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1200;

  const orderId = location.state?.orderId ?? null;
  const [order, setOrder]               = useState(location.state?.order || {});
  const person                          = location.state?.person || null;

  const { openCheckout } = useRazorpay();
  const [loading, setLoading]           = useState(false);
  const [orderFetching, setOrderFetching] = useState(false);
  const [user, setUser]                 = useState(null);
  const [addons, setAddons]             = useState('');
  const [venue, setVenue]               = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        setOrderFetching(true);
        const res = await getOrderDetails(orderId);
        setOrder(res?.data?.data || {});
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        setOrderFetching(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res?.data?.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    setVenue(order.event_address?.address_line1 ?? '');
    setAddressDetail(
      [order.event_address?.address_line2, order.event_address?.city, order.event_address?.state]
        .filter(Boolean).join(', ')
    );
  }, [order]);

  const handlePay = async () => {
    if (!order.id) { alert('Order details are incomplete.'); return; }
    setLoading(true);
    try {
      const response = await placeOrder(order.id);
      const data = response?.data?.data;
      if (!data) { alert('Failed to initiate payment. Please try again.'); return; }
      openCheckout({
        ...data,
        prefill: {
          name:    user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Customer',
          email:   user?.email    || '',
          contact: user?.phone_no || '',
        },
        onSuccess: () => navigate('/thank-you', { state: { order } }),
        onDismiss: () => alert('Payment was cancelled or closed.'),
      });
    } catch (err) {
      console.error('Payment placement failed:', err);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isBulk      = (order.service_provider_items?.length ?? 0) > 1 || !!order.event_package_id;
  const serviceItems = order.service_provider_items || [];
  const editingItems = order.editing_items          || [];
  const hasEditing   = editingItems.length > 0;

  const lat = order.event_lat ?? order.event_address?.lat;
  const lng = order.event_lng ?? order.event_address?.lng;

  const category       = order.category?.name ?? '—';
  const orderNumber    = order.order_number    ?? '—';
  const status         = order.status          ?? '—';
  const currency       = order.currency        ?? 'INR';
  const subtotal       = order.subtotal        ?? '0';
  const discountAmount = order.discount_amount ?? '0';
  const taxAmount      = order.tax_amount      ?? '0';
  const totalAmount    = order.total_amount    ?? '0';

  if (orderFetching) {
    return (
      <ViewsLayout>
        <div style={{
          background: '#f7f7f5', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <p style={{ color: '#aaa', fontSize: '15px' }}>⏳ Loading order details…</p>
        </div>
      </ViewsLayout>
    );
  }

  return (
    <ViewsLayout>
      <div style={{ background: '#f7f7f5', minHeight: '100vh', padding: isMobile ? '24px 0 40px' : '36px 0' }}>

        {/* ── Title ── */}
        <h1 style={{
          textAlign: 'center',
          fontSize: isMobile ? '24px' : '36px',
          fontWeight: 700, color: '#1a1a1a',
          margin: '0 0 4px', letterSpacing: '-0.02em',
          padding: '0 16px',
        }}>
          Request to Booking
        </h1>

        {/* ── Status badges ── */}
        <div style={{
          textAlign: 'center', marginBottom: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', flexWrap: 'wrap', padding: '0 16px',
        }}>
          <span style={{ fontSize: '13px', color: '#888' }}>{orderNumber}</span>
          <span style={{
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.06em', padding: '3px 10px', borderRadius: '20px',
            background: status === 'draft' ? '#FFF3D6' : '#dcfce7',
            color:      status === 'draft' ? '#b45309'  : '#15803d',
          }}>
            {status}
          </span>
          {isBulk && (
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
              background: '#ede9fe', color: '#6d28d9',
            }}>
              {order.snapshot_event_package_name || 'Package Booking'}
            </span>
          )}
          {hasEditing && (
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
              background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0',
            }}>
              Editing Package Included
            </span>
          )}
        </div>

        {/* ── Two-column grid (stacks on mobile/tablet) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 40px',
        }}>

          {/* ════ LEFT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Booking Details */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              padding: isMobile ? '18px 16px' : '22px 24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                Your Booking Details
              </p>

              <FieldBox label="Event Category">
                <div className="rb-field-display">
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{category}</span>
                </div>
              </FieldBox>

              {/* Start/End Date — stack on very small screens */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: width < 400 ? '1fr' : '1fr 1fr',
                gap: '12px', marginTop: '16px',
              }}>
                <FieldBox label="Start Date">
                  <div className="rb-field-display">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LuCalendar size={15} color="#E8A317" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                        {fmtDate(order.event_start_at)}
                      </span>
                    </div>
                    <FiEdit2 size={13} color="#bbb" />
                  </div>
                </FieldBox>
                <FieldBox label="End Date">
                  <div className="rb-field-display">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LuCalendar size={15} color="#E8A317" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                        {fmtDate(order.event_end_at)}
                      </span>
                    </div>
                    <FiEdit2 size={13} color="#bbb" />
                  </div>
                </FieldBox>
              </div>

              <div style={{ marginTop: '16px' }}>
                <FieldBox label="Time">
                  <div className="rb-field-display" style={{ flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <LuClock size={15} color="#E8A317" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{fmtTime(order.event_start_at)}</span>
                      <span style={{ color: '#bbb', fontSize: '13px' }}>to</span>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{fmtTime(order.event_end_at)}</span>
                    </div>
                    <FiEdit2 size={13} color="#bbb" style={{ flexShrink: 0 }} />
                  </div>
                </FieldBox>
              </div>

              {order.snapshot_event_package_name && (
                <div style={{ marginTop: '16px' }}>
                  <FieldBox label="Your Package">
                    <div className="rb-field-display">
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                        {order.snapshot_event_package_name}
                      </span>
                    </div>
                  </FieldBox>
                </div>
              )}

              <div style={{ marginTop: '16px' }}>
                <FieldBox label="AddOns">
                  <div className="rb-field-display" style={{ alignItems: 'flex-start' }}>
                    <textarea
                      className="rb-inline-textarea"
                      value={addons}
                      onChange={e => setAddons(e.target.value)}
                      placeholder="Write what you'd like to add to your package"
                    />
                    <FiEdit2 size={13} color="#bbb" style={{ marginLeft: '8px', flexShrink: 0, marginTop: '2px' }} />
                  </div>
                </FieldBox>
              </div>
            </div>

            {/* ── Photographer(s) ── */}
            {isBulk ? (
              <div style={{
                background: '#fff', borderRadius: '16px',
                padding: isMobile ? '18px 16px' : '20px 24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                  Your Team · {serviceItems.length} Provider{serviceItems.length !== 1 ? 's' : ''}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {serviceItems.map((item) => (
                    <BulkProviderRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              serviceItems.length > 0 && <SingleProviderCard item={serviceItems[0]} />
            )}

            {/* ── Editing Package ── */}
            {hasEditing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {editingItems.map((item) => (
                  <EditingItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Map */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              padding: isMobile ? '16px' : '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                Event Location
              </p>
              <MapPreview lat={lat} lng={lng} />
              {(order.event_address?.city || order.event_address?.state) && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <InfoRow label="City"        value={fmt(order.event_address?.city)} />
                  <InfoRow label="State"       value={fmt(order.event_address?.state)} />
                  <InfoRow label="Country"     value={fmt(order.event_address?.country)} />
                  <InfoRow label="Postal Code" value={fmt(order.event_address?.postal_code)} />
                </div>
              )}
            </div>

            {/* Add Event Location */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              padding: isMobile ? '16px' : '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <p style={{ margin: '0 0 20px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                Add Event Location
              </p>
              <div style={{ marginBottom: '16px' }}>
                <FieldBox label="Venue Name">
                  <input type="text" value={venue}
                    onChange={e => setVenue(e.target.value)} placeholder="Venue name" />
                </FieldBox>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <FieldBox label="Address Details">
                  <input type="text" value={addressDetail}
                    onChange={e => setAddressDetail(e.target.value)}
                    placeholder="Area name, street name" />
                </FieldBox>
              </div>
            </div>

            {/* Price Summary */}
            <div style={{
              background: '#fff', borderRadius: '16px',
              padding: isMobile ? '16px' : '20px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>
              <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                Price Summary
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{currency}</span>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {serviceItems.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Photography / Videography
                    </div>
                    {serviceItems.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#555', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.snapshot_photographer_name}
                          {item.snapshot_package_name && (
                            <span style={{ color: '#aaa', fontSize: '11px' }}> · {item.snapshot_package_name}</span>
                          )}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                          ₹{parseFloat(item.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {hasEditing && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                      Editing
                    </div>
                    {editingItems.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#555' }}>{item.snapshot_package_name}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>
                          ₹{parseFloat(item.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Subtotal', value: subtotal },
                    { label: 'Discount', value: discountAmount },
                    { label: 'Tax',      value: taxAmount },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>
                        ₹{parseFloat(row.value).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: '2px',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
                    ₹{parseFloat(totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                className="su-btn-primary"
                style={{ marginTop: '16px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default RequestBook;