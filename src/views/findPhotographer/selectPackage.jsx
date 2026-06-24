import React, { useEffect, useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { draftOrder, getEditingPackage } from '../../services/order';
import { createPortal } from 'react-dom';

/* ─── Tier accent colors ─────────────────────────────────────────── */
const TIER_COLORS = {
  silver: { accent: '#9ca3af', glow: 'rgba(156,163,175,0.25)', chip: '#9ca3af' },
  gold: { accent: '#f5a623', glow: 'rgba(245,166,35,0.28)', chip: '#f5a623' },
  platinum: { accent: '#818cf8', glow: 'rgba(129,140,248,0.28)', chip: '#1f2937' },
};

const getTierKey = (name = '') => {
  const key = name.toLowerCase().trim();
  if (key.includes('silver')) return 'silver';
  if (key.includes('platinum')) return 'platinum';
  if (key.includes('gold')) return 'gold';
  return 'gold'; // fallback
};

const getTierColors = (name) => TIER_COLORS[getTierKey(name)];

const getFeatureIcon = (key = '') => {
  const k = key.toLowerCase();
  if (k.includes('photo')) return '📸';
  if (k.includes('reel')) return '🎬';
  if (k.includes('highlight')) return '✨';
  if (k.includes('video')) return '🎥';
  if (k.includes('revision')) return '🔁';
  if (k.includes('deliver')) return '🕒';
  if (k.includes('album')) return '📖';
  if (k.includes('gallery') || k.includes('cloud')) return '☁️';
  return '✔️';
};

const formatFeatureName = (key) =>
  key?.replaceAll('_', ' ')?.replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const STEPS = [
  { label: 'Event Details', status: 'done' },
  { label: 'Package Suggestion', status: 'done' },
  { label: 'Select Editing Package', status: 'active' },
  { label: 'Review & Confirm', status: 'upcoming' },
];

/* ─── Stepper ─────────────────────────────────────────────────────── */
const Stepper = () => (
  <div className="ep-stepper">
    {STEPS.map((s, i) => (
      <React.Fragment key={s.label}>
        <div className="ep-step">
          <span
            className={`ep-step-dot ${s.status === 'done' ? 'ep-step-dot--done' : s.status === 'active' ? 'ep-step-dot--active' : ''
              }`}
          >
            {s.status === 'done' ? '✓' : i + 1}
          </span>
          <span className="ep-step-text">
            <span className="ep-step-label">{s.label}</span>
            <span className={`ep-step-sub ep-step-sub--${s.status}`}>
              {s.status === 'done' ? 'Completed' : s.status === 'active' ? 'In Progress' : 'Upcoming'}
            </span>
          </span>
        </div>
        {i < STEPS.length - 1 && <span className="ep-step-line" />}
      </React.Fragment>
    ))}
  </div>
);

/* ─── Editing Package Card ───────────────────────────────────────── */
const EditingPackageCard = ({ pkg, index, onBookNow, bookingId }) => {
  const tierKey = getTierKey(pkg.name);
  const colors = getTierColors(pkg.name);
  const isPopular = tierKey === 'gold';
  const images = pkg.images || [];
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const nextImage = () => {
    setSelectedImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div
      className={`ep-card ${isPopular ? 'ep-card--popular' : ''}`}
      style={{ animationDelay: `${index * 0.1}s`, '--accent': colors.accent }}
    >
      {isPopular && <span className="ep-popular-badge">★ MOST POPULAR</span>}

      <div className="ep-gallery-strip">
        <span className="ep-tier-chip" style={{ background: colors.chip }}>
          {tierKey.toUpperCase()}
        </span>
        {images.length > 0 ? (
          images.slice(0, 4).map((img, idx) => (
            <div
              className="ep-gallery-seg"
              key={img.id}
              onClick={() => {
                setSelectedImage(idx);
                setShowGallery(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              <img src={img.url} alt={pkg.name} />
            </div>
          ))
        ) : (
          <div className="ep-gallery-seg ep-gallery-seg--empty">No image</div>
        )}
        {showGallery &&
  createPortal(
    <div
      className="gallery-modal"
      onClick={() => setShowGallery(false)}
    >
      <div
        className="gallery-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="gallery-close"
          onClick={() => setShowGallery(false)}
        >
          ✕
        </button>

        <button
          className="gallery-arrow gallery-arrow-left"
          onClick={prevImage}
        >
          ❮
        </button>

        <img
          src={images[selectedImage]?.url}
          alt=""
          className="gallery-full-image"
        />

        <button
          className="gallery-arrow gallery-arrow-right"
          onClick={nextImage}
        >
          ❯
        </button>

        <div className="gallery-counter">
          {selectedImage + 1} / {images.length}
        </div>
      </div>
    </div>,
    document.body
  )}
      </div>

      <div className="ep-body">
        <h3 className="ep-name">{pkg.name}</h3>
        <div className="ep-price">₹{Number(pkg.price).toLocaleString('en-IN')}</div>

        {pkg.features?.length > 0 && (
          <div className="ep-stat-grid">
            {pkg.features.map((f) => (
              <div className="ep-stat-box" key={f.id}>
                <span className="ep-stat-icon">{getFeatureIcon(f.feature_key)}</span>
                <div>
                  <div className="ep-stat-value">{f.quantity ?? f.label}</div>
                  <div className="ep-stat-label">{formatFeatureName(f.feature_key)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pkg.features?.length > 0 && (
          <div className="ep-included">
            <span className="ep-included-title">What's Included</span>
            <div className="ep-included-list">
              {pkg.features.map((f) => (
                <span className="ep-included-item" key={f.id}>
                  <span className="ep-included-check">✓</span>
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ep-btn-row">
        {/* <button
          className="su-btn-primary-outline ep-btn-half"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          View Details
        </button> */}
        <button
          className="su-btn-primary ep-btn-half"
          disabled={bookingId === pkg.id}
          onClick={(e) => {
            e.stopPropagation();
            onBookNow(pkg);
          }}
        >
          {bookingId === pkg.id ? 'Booking…' : 'Select Package'}
        </button>
      </div>
    </div>
  );
};

/* ─── Sidebar ─────────────────────────────────────────────────────── */
const Sidebar = ({ photographyPackage, filters, navigate }) => {
  const coverImage = photographyPackage?.images?.[0]?.url;
  const days =
    filters?.start_datetime && filters?.end_datetime
      ? Math.max(
        1,
        Math.round(
          (new Date(filters.end_datetime) - new Date(filters.start_datetime)) / (1000 * 60 * 60 * 24)
        )
      )
      : null;

  return (
    <aside className="ep-sidebar">
      <div className="ep-sidebar-card">
        <span className="ep-sidebar-title">Your Selected Photography Package</span>

        {photographyPackage && (
          <div className="ep-selected-pkg">
            <div className="ep-selected-pkg-img">
              {coverImage ? <img src={coverImage} alt={photographyPackage.name} /> : null}
            </div>
            <div>
              <div className="ep-selected-pkg-name">{photographyPackage.name}</div>
              <button className="ep-view-link" onClick={() => navigate(-1)}>
                View Details ↗
              </button>
            </div>
          </div>
        )}

        <div className="ep-summary-block">
          <span className="ep-summary-heading">Event Summary</span>
          <div className="ep-summary-row">
            <span>📅 Date</span>
            <span>{formatDate(filters?.start_datetime)}</span>
          </div>
          <div className="ep-summary-row">
            <span>🕒 Duration</span>
            <span>{days ? `${days} Day${days > 1 ? 's' : ''}` : '—'}</span>
          </div>
          <div className="ep-summary-row">
            <span>📍 Location</span>
            <span>{filters?.city || filters?.state || '—'}</span>
          </div>
        </div>
      </div>

      <div className="ep-sidebar-card">
        <span className="ep-sidebar-title">Need Help?</span>
        <p className="ep-help-text">Our team is here to help you choose the perfect package.</p>
        <a className="ep-help-btn ep-help-btn--primary" href="tel:+919876543210">
          📞 +91 98765 43210
        </a>
        <button className="ep-help-btn">💬 Chat with us</button>
        <p className="ep-secure-text">🔒 Your information is secure and encrypted</p>
      </div>
    </aside>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const SelectEditingPackage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [editingPackages, setEditingPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  const photographyPackage = location.state?.package;
  const filters = location.state?.filters;
  const packageId = location.state?.packageId ?? photographyPackage?.id ?? null;
  const customServiceProviders = location.state?.serviceProviders;
  const teamProviders = location.state?.teamProviders;

  useEffect(() => {
    let cancelled = false;

    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await getEditingPackage();
        if (!cancelled) setEditingPackages(res?.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPackages();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBookNow = async (editingPkg) => {
    try {
      setBookingId(editingPkg.id);
      const payload = {
        ...(packageId
          ? { event_package_id: packageId }
          : { event_category_id: filters?.category_id ?? null }),
        start_at: filters?.start_datetime ?? null,
        end_at: filters?.end_datetime ?? null,
        address: {
          lat: filters?.lat ?? null,
          lng: filters?.lng ?? null,
          place_id: filters?.place_id || undefined,
          address_line1: filters?.address_line1 || undefined,
          address_line2: filters?.address_line2 || undefined,
          address_line3: filters?.address_line3 || undefined,
          city: filters?.city || undefined,
          state: filters?.state || undefined,
          state_code: filters?.state_code || undefined,
          country: filters?.country || undefined,
          country_code: filters?.country_code || undefined,
          postal_code: filters?.postal_code || undefined,
          timezone: filters?.timezone || undefined,
        },
        service_providers:
          customServiceProviders?.length > 0
            ? customServiceProviders
            : photographyPackage?.team?.flatMap(
              (tm) =>
                tm.providers?.map((p) => ({
                  service_provider_id: p.id,
                  skill: tm.skill ?? 'photographer',
                })) || []
            ) ?? [],
        editing_items: [{ editing_package_id: editingPkg.id }],
      };
      const response = await draftOrder(payload);

      navigate('/requestBook', {
        state: {
          order: response?.data?.data,
          payload,
          editingPackage: editingPkg,
          package: photographyPackage,
          teamProviders,
          filters,
        },
      });
    } catch (err) {
      console.error('draftOrder with editing failed:', err);
    } finally {
      setBookingId(null);
    }
  };

  return (
    <ViewsLayout>
      <style>{STYLES}</style>
      <div className="ep-page">
        {/* <Stepper /> */}

        <div className="ep-layout">
          <Sidebar photographyPackage={photographyPackage} filters={filters} navigate={navigate} />

          <main className="ep-main">
            <h1 className="ep-heading">Choose Your Editing Package</h1>
            <p className="ep-subheading">
              Professional editing that brings your memories to life. Select the perfect package
              that matches your needs and storytelling style.
            </p>

            {loading ? (
              <div className="ep-loading">
                <span className="ep-spin">⏳</span> Loading packages…
              </div>
            ) : editingPackages.length === 0 ? (
              <div className="ep-empty">No editing packages available.</div>
            ) : (
              <div className="ep-grid">
                {editingPackages.map((pkg, i) => (
                  <EditingPackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={i}
                    onBookNow={handleBookNow}
                    bookingId={bookingId}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </ViewsLayout>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.ep-page {
  width: 100%;
  padding: 20px 24px 60px;
}

/* ── Stepper ── */
.ep-stepper {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 8px 24px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}
.ep-step { display: flex; align-items: center; gap: 10px; }
.ep-step-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.ep-step-dot--done { background: #ff9c2b; color: #fff; }
.ep-step-dot--active { background: #ff9c2b; color: #fff; box-shadow: 0 0 0 4px rgba(255,156,43,0.18); }
.ep-step-text { display: flex; flex-direction: column; }
.ep-step-label { font-size: 13px; font-weight: 700; color: #1a1a1a; }
.ep-step-sub { font-size: 11px; }
.ep-step-sub--done { color: #999; }
.ep-step-sub--active { color: #ff9c2b; font-weight: 600; }
.ep-step-sub--upcoming { color: #bbb; }
.ep-step-line { flex: 1; height: 1px; background: #f0d9b8; min-width: 30px; max-width: 80px; }

/* ── Layout ── */
.ep-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  align-items: start;
}

/* ── Sidebar ── */
.ep-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 20px; }
.ep-sidebar-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding: 16px;
}
.ep-sidebar-title { display: block; font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
.ep-selected-pkg { display: flex; gap: 10px; padding-bottom: 14px; margin-bottom: 14px; border-bottom: 1px solid #f5f5f5; }
.ep-selected-pkg-img { width: 58px; height: 58px; border-radius: 10px; overflow: hidden; background: #f3f4f6; flex-shrink: 0; }
.ep-selected-pkg-img img { width: 100%; height: 100%; object-fit: cover; }
.ep-selected-pkg-name { font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
.ep-view-link { background: none; border: none; padding: 0; font-size: 11.5px; font-weight: 600; color: #ff9c2b; cursor: pointer; }

.ep-summary-heading { display: block; font-size: 11px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 10px; }
.ep-summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; color: #444; padding: 6px 0; }
.ep-summary-row span:first-child { color: #888; }
.ep-summary-row span:last-child { font-weight: 600; color: #1a1a1a; }

.ep-help-text { font-size: 12px; color: #888; margin: 0 0 12px; line-height: 1.5; }
.ep-help-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  border: 1px solid #eee;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  margin-bottom: 8px;
  text-decoration: none;
}
.ep-help-btn--primary { background: #fff7ea; border-color: #ffe6bf; color: #8a6d3b; }
.ep-secure-text { font-size: 11px; color: #aaa; text-align: center; margin: 10px 0 0; }

/* ── Main ── */
.ep-main { min-width: 0; }
.ep-heading { font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px; letter-spacing: -0.01em; }
.ep-subheading { font-size: 13.5px; color: #888; margin: 0 0 24px; max-width: 640px; line-height: 1.5; }
.ep-loading, .ep-empty { display: flex; justify-content: center; align-items: center; gap: 10px; min-height: 200px; color: #aaa; font-size: 14px; }
.ep-spin { display: inline-block; animation: spin 0.8s linear infinite; }

.ep-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* ── Card ── */
.ep-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  animation: fadeSlideUp 0.4s ease both;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}
.ep-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.12); }
.ep-card--popular { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(245,166,35,0.15), 0 8px 28px rgba(0,0,0,0.1); }

.ep-popular-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  padding: 5px 14px;
  border-radius: 0 0 10px 10px;
  z-index: 2;
}

.ep-gallery-strip {
  position: relative;
  display: flex;
  height: 130px;
  gap: 2px;
}
.ep-gallery-seg { flex: 1; overflow: hidden; background: #f3f4f6; }
.ep-gallery-seg img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ep-gallery-seg--empty { display: flex; align-items: center; justify-content: center; color: #ccc; font-size: 11px; }
.ep-tier-chip {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 6px;
  z-index: 2;
}

.ep-body { padding: 16px; flex: 1; display: flex; flex-direction: column; }
.ep-name { font-size: 17px; font-weight: 700; color: #1a1a1a; margin: 0 0 4px; }
.ep-price { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 14px; }

.ep-stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
}
.ep-stat-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border-radius: 10px;
  padding: 8px 10px;
}
.ep-stat-icon { font-size: 16px; }
.ep-stat-value { font-size: 13px; font-weight: 700; color: #1a1a1a; }
.ep-stat-label { font-size: 10.5px; color: #888; }

.ep-included { border-top: 1px solid #f2f2f2; padding-top: 12px; margin-top: auto; }
.ep-included-title { display: block; font-size: 11px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
.ep-included-list { display: flex; flex-direction: column; gap: 6px; }
.ep-included-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #444; }
.ep-included-check { color: #22c55e; font-weight: 700; }

.ep-btn-row { display: flex; gap: 8px; padding: 0 16px 16px; }
.ep-btn-half { flex: 1; padding: 10px 12px; font-size: 13px; text-align: center; }
.gallery-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-modal-content {
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-full-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.gallery-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.gallery-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: white;
  font-size: 28px;
  cursor: pointer;
}

.gallery-arrow-left {
  left: 20px;
}

.gallery-arrow-right {
  right: 20px;
}

.gallery-counter {
  position: absolute;
  bottom: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 900px) {
  .ep-layout { grid-template-columns: 1fr; }
  .ep-sidebar { position: static; }
}
@media (max-width: 640px) {
  .ep-grid { grid-template-columns: 1fr; }
  .ep-stepper { flex-wrap: wrap; }
}
`;

export default SelectEditingPackage;