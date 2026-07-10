import React, { useState, useEffect } from 'react';
import ViewsLayout from '../Layout';
import '../index.css';
import { BsCameraFill, BsStarFill } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { FiEdit2, FiMapPin, FiCheck } from 'react-icons/fi';
import { LuCalendar, LuClock } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRazorpay } from '../../hooks/useRazorpay';
import { placeOrder, getOrderDetails, updateDraftOrder } from '../../services/order';
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
const fmt = (val) => (val !== null && val !== undefined && val !== '' ? val : '—');
const money = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

const getFeatureIcon = (key) => {
  switch (key) {
    case 'edited_photos': return '📸';
    case 'reels': return '🎬';
    case 'highlight': return '✨';
    case 'video': return '🎥';
    default: return '✔️';
  }
};
const formatFeatureName = (key) => key?.replaceAll('_', ' ')?.replace(/\b\w/g, (c) => c.toUpperCase());

/* ── Stepper ── */
const STEPS = [
  { n: '01', label: 'Event Details', status: 'done' },
  { n: '02', label: 'Package Suggestion', status: 'done' },
  { n: '03', label: 'Customize Team', status: 'done' },
  { n: '04', label: 'Review & Confirm', status: 'active' },
];
const Stepper = () => (
  <div className="rb-stepper">
    {STEPS.map((s, i) => (
      <React.Fragment key={s.n}>
        <div className="rb-step">
          <span className={`rb-step-dot rb-step-dot--${s.status}`}>{s.status === 'done' ? '✓' : s.n}</span>
          <span className={`rb-step-label rb-step-label--${s.status}`}>{s.label}</span>
        </div>
        {i < STEPS.length - 1 && <span className="rb-step-line" />}
      </React.Fragment>
    ))}
  </div>
);

/* ── Reusable field ── */
const FieldBox = ({ label, children }) => (
  <div className="rb-field">
    <label>{label}</label>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="rb-info-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

/* ── Map preview ── */
const MapPreview = ({ lat, lng }) => {
  if (!lat || !lng) {
    return <div className="rb-map-empty">No location data</div>;
  }
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div className="rb-map-wrap">
      <iframe title="Event Location" src={mapSrc} width="100%" height="100%" style={{ border: 'none', display: 'block' }} loading="lazy" />
      <div className="rb-map-coords">{lat.toFixed(5)}, {lng.toFixed(5)}</div>
    </div>
  );
};

/* ── Single provider card ── */
const SingleProviderCard = ({ item }) => {
  const name = item.snapshot_photographer_name || 'Photographer';
  const avatar = item.profile_picture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

  return (
    <div className="rb-card rb-single-provider">
      <div className="rb-single-banner" />
      <div className="rb-single-body">
        <div className="rb-single-avatar-wrap">
          <img src={avatar} alt={name} className="rb-single-avatar" />
          <span className="rb-single-online-dot" />
        </div>

        <p className="rb-single-name">{name}</p>

        {item.is_verified_user && (
          <div className="rb-verified-badge">
            <MdVerified size={13} /> Verified photographer
          </div>
        )}

        <div className="rb-stat-row">
          <div className="rb-stat-box">
            <div className="rb-stat-top"><BsCameraFill size={13} /><span>{item.events_completed > 0 ? `${item.events_completed}+` : '0'}</span></div>
            <p>Events completed</p>
          </div>
          <div className="rb-stat-box">
            <div className="rb-stat-top"><BsStarFill size={13} /><span>{item.avg_rating ?? '—'}</span></div>
            <p>Rating</p>
          </div>
        </div>

        <div className="rb-mini-summary">
          <InfoRow label="Package" value={fmt(item.snapshot_package_name)} />
          <InfoRow label="Price" value={money(item.price)} />
          {/* <InfoRow label="Commission" value={money(item.commission_amount)} /> */}
          <InfoRow label="Tax" value={money(item.tax_amount)} />
          <div className="rb-mini-total">
            <span>Total</span>
            <span>{money(item.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Bulk provider row ── */
const BulkProviderRow = ({ item }) => {
  const name = item.snapshot_photographer_name || 'Photographer';
  const avatar = item.profile_picture?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

  return (
    <div className="rb-bulk-row">
      <div className="rb-bulk-left">
        <img src={avatar} alt={name} className="rb-bulk-avatar" />
        <div>
          <div className="rb-bulk-name">{name}</div>
          {item.snapshot_package_name && <div className="rb-bulk-pkg">{item.snapshot_package_name}</div>}
          <div className="rb-bulk-tags">
            {item.is_verified_user && <span className="rb-tag-verified"><MdVerified size={11} /> Verified</span>}
            {item.avg_rating && <span className="rb-tag-rating">⭐ {item.avg_rating} ({item.review_count})</span>}
          </div>
        </div>
      </div>
      <div className="rb-bulk-right">
        <div className="rb-bulk-price">{money(item.total_amount)}</div>
        {item.events_completed > 0 && <div className="rb-bulk-events">{item.events_completed}+ events</div>}
      </div>
    </div>
  );
};

/* ── Editing package card ── */
const EditingItemCard = ({ item }) => {
  const features = item.snapshot_features || [];
  const tierName = item.snapshot_package_name || 'Editing Package';
  const tierKey =
    tierName.toLowerCase().includes('platinum') ? 'platinum' :
      tierName.toLowerCase().includes('gold') ? 'gold' : 'silver';

  return (
    <div className={`rb-card rb-editing-card rb-editing-card--${tierKey}`}>
      <div className="rb-editing-head">
        <div>
          <div className="rb-editing-eyebrow">Editing Package</div>
          <div className="rb-editing-tier">{tierName}</div>
        </div>
        <span className={`rb-status-chip rb-status-chip--${item.status === 'pending' ? 'pending' : 'ok'}`}>
          {item.status ?? 'pending'}
        </span>
      </div>

      {features.length > 0 && (
        <div className="rb-feature-grid">
          {features.map((f, i) => (
            <div key={i} className="rb-feature-box">
              <span className="rb-feature-icon">{getFeatureIcon(f.feature_key)}</span>
              <div>
                <div className="rb-feature-key">{formatFeatureName(f.feature_key)}</div>
                <div className="rb-feature-val">{f.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rb-editing-totals">
        <InfoRow label="Package Price" value={money(item.snapshot_price)} />
        <InfoRow label="Tax" value={money(item.tax_amount)} />
        <div className="rb-mini-total">
          <span>Total</span>
          <span>{money(item.total_amount)}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const RequestBook = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId ?? null;
  const [order, setOrder] = useState(location.state?.order || {});

  const { openCheckout } = useRazorpay();
  const [loading, setLoading] = useState(false);
  const [orderFetching, setOrderFetching] = useState(false);
  const [user, setUser] = useState(null);
  const [addons, setAddons] = useState('');
  const [venue, setVenue] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [noteStatus, setNoteStatus] = useState({ type: '', msg: '' });

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
    setAddons(order.notes ?? '');
  }, [order]);

  const handlePay = async () => {
    if (!order.id) { alert('Order details are incomplete.'); return; }
    setLoading(true);
    setNoteStatus({ type: '', msg: '' });
    try {
      // If a note has been added/changed, save it before proceeding to payment
      const trimmedNote = (addons ?? '').trim();
      const originalNote = (order.notes ?? '').trim();
      if (trimmedNote && trimmedNote !== originalNote) {
        try {
          await updateDraftOrder(order.id, { note: trimmedNote });
        } catch (noteErr) {
          console.error('Error updating draft note:', noteErr);
          setNoteStatus({ type: 'err', msg: 'Failed to save your note. Please try again.' });
          setLoading(false);
          return;
        }
      }

      const response = await placeOrder(order.id);
      const data = response?.data?.data;
      if (!data) { alert('Failed to initiate payment. Please try again.'); return; }
      openCheckout({
        ...data,
        prefill: {
          name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Customer',
          email: user?.email || '',
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

  const isBulk = (order.service_provider_items?.length ?? 0) > 1 || !!order.event_package_id;
  const serviceItems = order.service_provider_items || [];
  const editingItems = order.editing_items || [];
  const hasEditing = editingItems.length > 0;

  const lat = order.event_lat ?? order.event_address?.lat;
  const lng = order.event_lng ?? order.event_address?.lng;

  const category = order.category?.name ?? '—';
  const orderNumber = order.order_number ?? '—';
  const status = order.status ?? '—';
  const currency = order.currency ?? 'INR';
  const subtotal = order.subtotal ?? '0';
  const discountAmount = order.discount_amount ?? '0';
  const taxAmount = order.tax_amount ?? '0';
  const totalAmount = order.total_amount ?? '0';

  if (orderFetching) {
    return (
      <ViewsLayout>
        <style>{STYLES}</style>
        <div className="rb-loading-screen">⏳ Loading order details…</div>
      </ViewsLayout>
    );
  }



  return (
    <ViewsLayout>
      <style>{STYLES}</style>
      <div className="rb-page">
        <div className="rb-page-inner">
          {/* <Stepper /> */}

          <h1 className="rb-title">Request to Booking</h1>

          <div className="rb-badge-row">
            <span className="rb-order-number">{orderNumber}</span>
            <span className={`rb-status-chip rb-status-chip--${status === 'draft' ? 'pending' : 'ok'}`}>{status}</span>
            {isBulk && <span className="rb-badge-purple">{order.snapshot_event_package_name || 'Package Booking'}</span>}
            {hasEditing && <span className="rb-badge-green"><FiCheck size={11} /> Editing Package Included</span>}
          </div>

          <div className="rb-grid">
            {/* ════ LEFT COLUMN ════ */}
            <div className="rb-col">
              <div className="rb-card">
                <p className="rb-card-title">Your Booking Details</p>

                <FieldBox label="Event Category">
                  <div className="rb-field-display">
                    <span className="rb-field-value">{category}</span>
                  </div>
                </FieldBox>

                <div className="rb-date-grid">
                  <FieldBox label="Start Date">
                    <div className="rb-field-display">
                      <div className="rb-field-icon-text"><LuCalendar size={15} /><span>{fmtDate(order.event_start_at)}</span></div>
                      <FiEdit2 size={13} className="rb-field-edit" />
                    </div>
                  </FieldBox>
                  <FieldBox label="End Date">
                    <div className="rb-field-display">
                      <div className="rb-field-icon-text"><LuCalendar size={15} /><span>{fmtDate(order.event_end_at)}</span></div>
                      <FiEdit2 size={13} className="rb-field-edit" />
                    </div>
                  </FieldBox>
                </div>

                <FieldBox label="Time">
                  <div className="rb-field-display">
                    <div className="rb-field-icon-text">
                      <LuClock size={15} />
                      <span>{fmtTime(order.event_start_at)}</span>
                      <span className="rb-field-to">to</span>
                      <span>{fmtTime(order.event_end_at)}</span>
                    </div>
                    <FiEdit2 size={13} className="rb-field-edit" />
                  </div>
                </FieldBox>

                {order.snapshot_event_package_name && (
                  <FieldBox label="Your Package">
                    <div className="rb-field-display">
                      <span className="rb-field-value">{order.snapshot_event_package_name}</span>
                    </div>
                  </FieldBox>
                )}

                <FieldBox label="Add a Note">
                  <div className="rb-field-display rb-field-display--textarea">
                    <textarea
                      className="rb-inline-textarea"
                      value={addons}
                      onChange={(e) => setAddons(e.target.value)}
                      placeholder="Write what you'd like to add to your package"
                    />
                    <FiEdit2 size={13} className="rb-field-edit" />
                  </div>
                </FieldBox>
                {noteStatus.msg && (
                  <p style={{
                    marginTop: '8px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: noteStatus.type === 'ok' ? '#15803d' : '#b91c1c',
                  }}>
                    {noteStatus.msg}
                  </p>
                )}
              </div>

              {isBulk ? (
                <div className="rb-card">
                  <p className="rb-card-title">Your Team · {serviceItems.length} Provider{serviceItems.length !== 1 ? 's' : ''}</p>
                  <div className="rb-bulk-list">
                    {serviceItems.map((item) => <BulkProviderRow key={item.id} item={item} />)}
                  </div>
                </div>
              ) : (
                serviceItems.length > 0 && <SingleProviderCard item={serviceItems[0]} />
              )}

              {hasEditing && (
                <div className="rb-editing-list">
                  {editingItems.map((item) => <EditingItemCard key={item.id} item={item} />)}
                </div>
              )}
            </div>

            {/* ════ RIGHT COLUMN ════ */}
            <div className="rb-col rb-col--sticky">
              <div className="rb-card">
                <p className="rb-card-title"><FiMapPin size={14} /> Event Location</p>
                <MapPreview lat={lat} lng={lng} />
                {(order.event_address?.city || order.event_address?.state) && (
                  <div className="rb-address-list">
                    <InfoRow label="City" value={fmt(order.event_address?.city)} />
                    <InfoRow label="State" value={fmt(order.event_address?.state)} />
                    <InfoRow label="Country" value={fmt(order.event_address?.country)} />
                    <InfoRow label="Postal Code" value={fmt(order.event_address?.postal_code)} />
                  </div>
                )}
              </div>

              <div className="rb-card">
                <p className="rb-card-title">Add Event Location</p>
                <FieldBox label="Venue Name">
                  <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue name" />
                </FieldBox>
                <FieldBox label="Address Details">
                  <input type="text" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder="Area name, street name" />
                </FieldBox>
              </div>

              <div className="rb-card rb-price-card">
                <div className="rb-price-head">
                  <span>Price Summary</span>
                  <span>{currency}</span>
                </div>

                <div className="rb-price-body">
                  {serviceItems.length > 0 && (
                    <div className="rb-price-section">
                      <div className="rb-price-section-label">Photography / Videography</div>
                      {serviceItems.map((item) => (
                        <div key={item.id} className="rb-price-line">
                          <span>
                            {item.snapshot_photographer_name}
                            {item.snapshot_package_name && <em> · {item.snapshot_package_name}</em>}
                          </span>
                          <strong>{money(item.total_amount)}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasEditing && (
                    <div className="rb-price-section">
                      <div className="rb-price-section-label">Editing</div>
                      {editingItems.map((item) => (
                        <div key={item.id} className="rb-price-line">
                          <span>{item.snapshot_package_name}</span>
                          <strong>{money(item.total_amount)}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rb-price-breakdown">
                    <div className="rb-price-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
                    {/* <div className="rb-price-line"><span>Discount</span><strong>{money(discountAmount)}</strong></div> */}
                    <div className="rb-price-line"><span>Tax</span><strong>{money(taxAmount)}</strong></div>
                  </div>

                  <div className="rb-price-total">
                    <span>Total</span>
                    <span>{money(totalAmount)}</span>
                  </div>
                </div>

                <button className="rb-pay-btn" onClick={handlePay} disabled={loading}>
                  {loading ? 'Processing…' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewsLayout>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
.rb-loading-screen { background: #f7f7f5; min-height: 100vh; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 15px; }
.rb-page { background: #f7f7f5; min-height: 100vh; padding: 32px 0 56px; }
.rb-page-inner {
 
  padding: 0 32px;
  box-sizing: border-box;
}
/* Stepper */
.rb-stepper { display: flex; align-items: center; gap: 14px; padding-bottom: 22px; margin-bottom: 22px; border-bottom: 1px solid #ececec; flex-wrap: wrap; }
.rb-step { display: flex; align-items: center; gap: 10px; }
.rb-step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; flex-shrink: 0; }
.rb-step-dot--done { background: var(--color-orange); color: #fff; }
.rb-step-dot--active { background: #fff; border: 2.5px solid var(--color-orange); color: var(--color-orange); }
.rb-step-label { font-size: 12.5px; font-weight: 600; }
.rb-step-label--done { color: #aaa; }
.rb-step-label--active { color: #1a1a1a; font-weight: 700; }
.rb-step-line { flex: 1; height: 1px; background: #f0d9b8; min-width: 24px; max-width: 70px; }

.rb-title { text-align: center; font-size: 32px; font-weight: 700; color: #1a1a1a; margin: 0 0 12px; letter-spacing: -0.02em; }
.rb-badge-row { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
.rb-order-number { font-size: 13px; color: #888; }
.rb-status-chip { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 10px; border-radius: 20px; }
.rb-status-chip--pending { background: #FFF3D6; color: #b45309; }
.rb-status-chip--ok { background: #dcfce7; color: #15803d; }
.rb-badge-purple { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: #ede9fe; color: #6d28d9; }
.rb-badge-green { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

/* Layout */
.rb-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 32px;
}
.rb-col { display: flex; flex-direction: column; gap: 16px; }
.rb-col--sticky { position: sticky; top: 20px; align-self: start; }

.rb-card { background: #fff; border-radius: 16px; padding: 22px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.rb-card-title { display: flex; align-items: center; gap: 6px; margin: 0 0 16px; font-weight: 700; font-size: 15px; color: #1a1a1a; }

/* Fields */
.rb-field { margin-bottom: 16px; }
.rb-field:last-child { margin-bottom: 0; }
.rb-field label { display: block; font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.rb-field input { width: 100%; border: 1.5px solid #eee; border-radius: 10px; padding: 10px 12px; font-size: 14px; color: #1a1a1a; outline: none; box-sizing: border-box; }
.rb-field input:focus { border-color: var(--color-orange); }
.rb-field-display { display: flex; align-items: center; justify-content: space-between; gap: 8px; border: 1.5px solid #f0f0f0; border-radius: 10px; padding: 10px 12px; background: #fafafa; }
.rb-field-display--textarea { align-items: flex-start; }
.rb-field-value { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.rb-field-icon-text { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: #1a1a1a; flex-wrap: wrap; }
.rb-field-icon-text svg { color: var(--color-orange); flex-shrink: 0; }
.rb-field-to { color: #bbb; font-size: 13px; font-weight: 400; }
.rb-field-edit { color: #bbb; flex-shrink: 0; cursor: pointer; }
.rb-inline-textarea { flex: 1; border: none; outline: none; background: transparent; resize: none; font-size: 13.5px; color: #1a1a1a; font-family: inherit; min-height: 40px; }
.rb-date-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.rb-info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
.rb-info-row span { color: #999; font-weight: 500; font-size: 12px; }
.rb-info-row strong { color: #1a1a1a; font-weight: 600; }

/* Map */
.rb-map-empty { border-radius: 10px; height: 160px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 13px; }
.rb-map-wrap { border-radius: 10px; overflow: hidden; height: 200px; position: relative; }
.rb-map-coords { position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.6); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 6px; }
.rb-address-list { margin-top: 12px; }

/* Single provider */
.rb-single-provider { padding: 0; overflow: hidden; }
.rb-single-banner { background: var(--color-orange); height: 70px; }
.rb-single-body { padding: 0 24px 24px; display: flex; flex-direction: column; align-items: center; }
.rb-single-avatar-wrap { margin-top: -40px; position: relative; margin-bottom: 12px; }
.rb-single-avatar { width: 78px; height: 78px; border-radius: 50%; border: 4px solid #fff; object-fit: cover; box-shadow: 0 4px 16px rgba(0,0,0,0.15); display: block; }
.rb-single-online-dot { position: absolute; bottom: 4px; right: 4px; width: 13px; height: 13px; border-radius: 50%; background: #22c55e; border: 2px solid #fff; }
.rb-single-name { margin: 0 0 8px; font-weight: 800; font-size: 19px; color: #1a1a1a; }
.rb-verified-badge { display: inline-flex; align-items: center; gap: 4px; background: #FFF3D6; border: 1px solid var(--color-orange); border-radius: 50px; padding: 4px 12px; margin-bottom: 16px; font-size: 12px; font-weight: 700; color: var(--color-orange); }
.rb-stat-row { display: flex; width: 100%; border: 1.5px solid #f0f0f0; border-radius: 12px; overflow: hidden; }
.rb-stat-box { flex: 1; text-align: center; padding: 14px 10px; border-right: 1.5px solid #f0f0f0; }
.rb-stat-box:last-child { border-right: none; }
.rb-stat-top { display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 3px; color: #E8A317; }
.rb-stat-top span { font-weight: 800; font-size: 19px; color: #1a1a1a; }
.rb-stat-box p { margin: 0; font-size: 11px; color: #999; font-weight: 500; }
.rb-mini-summary { margin-top: 14px; width: 100%; background: #fafafa; border-radius: 10px; padding: 12px 14px; }
.rb-mini-total { display: flex; justify-content: space-between; padding-top: 8px; margin-top: 2px; font-weight: 700; }
.rb-mini-total span:last-child { font-size: 14px; font-weight: 800; color: #1a1a1a; }

/* Bulk providers */
.rb-bulk-list { display: flex; flex-direction: column; gap: 12px; }
.rb-bulk-row { background: #fafafa; border-radius: 14px; padding: 14px 16px; border: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
.rb-bulk-left { display: flex; gap: 12px; align-items: center; min-width: 0; }
.rb-bulk-avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.rb-bulk-name { font-weight: 700; font-size: 14.5px; color: #1a1a1a; }
.rb-bulk-pkg { font-size: 12px; color: #888; margin-top: 1px; }
.rb-bulk-tags { display: flex; gap: 10px; margin-top: 4px; flex-wrap: wrap; }
.rb-tag-verified { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 600; color: var(--color-orange); }
.rb-tag-rating { font-size: 11px; color: #888; }
.rb-bulk-right { text-align: right; flex-shrink: 0; }
.rb-bulk-price { font-size: 17px; font-weight: 800; color: #1a1a1a; }
.rb-bulk-events { font-size: 11px; color: #aaa; }

/* Editing card */
.rb-editing-list { display: flex; flex-direction: column; gap: 12px; }
.rb-editing-card { padding: 0; }
.rb-editing-card--silver { border: 1.5px solid #e5e7eb; }
.rb-editing-card--gold { border: 1.5px solid #fde8c8; }
.rb-editing-card--platinum { border: 1.5px solid #ddd6fe; }
.rb-editing-head { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; border-bottom: 1.5px solid #f3f3f3; }
.rb-editing-eyebrow { font-size: 11px; font-weight: 700; color: var(--color-orange); text-transform: uppercase; letter-spacing: 0.06em; }
.rb-editing-tier { font-size: 16px; font-weight: 800; color: #1a1a1a; margin-top: 1px; }
.rb-feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; padding: 16px 20px; }
.rb-feature-box { display: flex; align-items: center; gap: 10px; background: #f9fafb; border-radius: 10px; padding: 10px 12px; }
.rb-feature-icon { width: 32px; height: 32px; border-radius: 8px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
.rb-feature-key { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; }
.rb-feature-val { font-size: 13px; font-weight: 700; color: #111; margin-top: 1px; }
.rb-editing-totals { padding: 0 20px 18px; }

/* Price summary */
.rb-price-card { display: flex; flex-direction: column; }
.rb-price-head { display: flex; justify-content: space-between; margin-bottom: 14px; font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.05em; }
.rb-price-body { border-top: 1px solid #f0f0f0; padding-top: 12px; display: flex; flex-direction: column; gap: 14px; }
.rb-price-section { display: flex; flex-direction: column; gap: 6px; }
.rb-price-section-label { font-size: 11px; font-weight: 700; color: #bbb; text-transform: uppercase; letter-spacing: 0.05em; }
.rb-price-line { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 13px; }
.rb-price-line span { color: #555; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rb-price-line em { color: #aaa; font-size: 11px; font-style: normal; }
.rb-price-line strong { flex-shrink: 0; color: #1a1a1a; font-weight: 700; }
.rb-price-breakdown { border-top: 1px solid #f0f0f0; padding-top: 10px; display: flex; flex-direction: column; gap: 8px; }
.rb-price-total { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 10px; }
.rb-price-total span:first-child { font-size: 14px; font-weight: 700; color: #1a1a1a; }
.rb-price-total span:last-child { font-size: 17px; font-weight: 800; color: #1a1a1a; }

.rb-pay-btn { margin-top: 18px; width: 100%; background: var(--color-orange); color: #fff; border: none; border-radius: 12px; padding: 13px; font-size: 14.5px; font-weight: 700; cursor: pointer; }
.rb-pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* Responsive */
@media (max-width: 1100px) {
  .rb-grid { grid-template-columns: 1fr; }
  .rb-col--sticky { position: static; }
}
@media (max-width: 600px) {
  .rb-page-inner { padding: 0 16px; }
  .rb-title { font-size: 24px; }
  .rb-card { padding: 18px 16px; }
  .rb-date-grid { grid-template-columns: 1fr; }
}
`;

export default RequestBook;