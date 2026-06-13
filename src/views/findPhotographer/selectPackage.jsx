import React, { useEffect, useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { draftOrder, getEditingPackage } from '../../services/order';

/* ─── Tier accent colors ─────────────────────────────────────────── */
const TIER_COLORS = {
  silver: { accent: '#9ca3af', glow: 'rgba(156,163,175,0.25)' },
  gold: { accent: '#f5a623', glow: 'rgba(245,166,35,0.28)' },
  platinum: { accent: '#818cf8', glow: 'rgba(129,140,248,0.28)' },
};

const getTierColors = (name = '') => {
  const key = name.toLowerCase().trim();
  if (key.includes('silver')) return TIER_COLORS.silver;
  if (key.includes('gold')) return TIER_COLORS.gold;
  if (key.includes('platinum')) return TIER_COLORS.platinum;
  return TIER_COLORS.gold; // fallback
};

const getFeatureIcon = (key) => {
  switch (key) {
    case "edited_photos":
      return "📸";
    case "reels":
      return "🎬";
    case "highlight":
      return "✨";
    case "video":
      return "🎥";
    default:
      return "✔️";
  }
};

const formatFeatureName = (key) => {
  return key
    ?.replaceAll("_", " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ─── Editing Package Card ───────────────────────────────────────── */
const EditingPackageCard = ({
  pkg,
  index,
  selected,
  onSelect,
  onBookNow,
  bookingId
}) => {
  const colors = getTierColors(pkg.name);
  const isSelected = selected === pkg.id;

  const coverImage = pkg.images?.[0]?.url;

  return (
    <div
      className="ep-card"
      style={{
        animationDelay: `${index * 0.12}s`,
        outline: isSelected
          ? `2.5px solid ${colors.accent}`
          : "2.5px solid transparent",
        boxShadow: isSelected
          ? `0 0 0 4px ${colors.glow}, 0 8px 32px rgba(0,0,0,0.13)`
          : "0 4px 20px rgba(0,0,0,0.08)",
      }}
      onClick={() => onSelect(pkg.id)}
    >
      <div className="ep-image-wrap">
        {coverImage ? (
          <img
            src={coverImage}
            alt={pkg.name}
            className="ep-image"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#f3f4f6",
            }}
          />
        )}

        <div className="ep-overlay" />

        <span className="ep-tier-label">
          {pkg.name}
        </span>

        <span className="ep-price">
          ₹{Number(pkg.price).toLocaleString("en-IN")}
        </span>
      </div>

      {/* Gallery */}
      {pkg.images?.length > 1 && (
        <div className="ep-gallery">
          {pkg.images.slice(0, 3).map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt=""
              className="ep-thumb"
            />
          ))}
        </div>
      )}

      {/* Features */}
      <div className="ep-features">
        {pkg.features?.map((feature) => (
          <div
            key={feature.id}
            className="ep-feature-card"
          >
            <div className="ep-feature-icon">
              {getFeatureIcon(feature.feature_key)}
            </div>

            <div>
              <div className="ep-feature-title">
                {formatFeatureName(
                  feature.feature_key
                )}
              </div>

              <div className="ep-feature-value">
                {feature.label}
              </div>
            </div>
          </div>
        ))}
      </div>



      <div className="ep-btn-wrap">
        <button
          className="su-btn-primary"
          style={{ width: '100%', opacity: bookingId === pkg.id ? 0.7 : 1, cursor: bookingId === pkg.id ? 'not-allowed' : 'pointer' }}
          disabled={bookingId === pkg.id}
          onClick={(e) => {
            e.stopPropagation();
            onBookNow(pkg);
          }}
        >
          {bookingId === pkg.id ? 'Booking…' : 'Book Now'}
        </button>
      </div>
    </div>
  );
};
/* ─── Main Component ─────────────────────────────────────────────── */
const SelectEditingPackage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [editingPackages, setEditingPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  const photographyPackage = location.state?.package;
  const filters = location.state?.filters;

  useEffect(() => {
    let cancelled = false;                        // ← prevents double-set on StrictMode

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
    return () => { cancelled = true; };           // cleanup
  }, []);

  const handleBookNow = async (editingPkg) => {
    try {
      setBookingId(editingPkg.id);

      const payload = {
        event_package_id: photographyPackage?.id ?? null,
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
        // re-attach the photographers from the photography package
        service_providers: photographyPackage?.team?.flatMap((tm) =>
          tm.providers?.map((p) => ({
            service_provider_id: p.id,
            skill: tm.skill ?? 'photographer',
          })) || []
        ) ?? [],
        editing_items: [
          { editing_package_id: editingPkg.id },
        ],
      };

      const response = await draftOrder(payload);

      navigate('/requestBook', {
        state: {
          order: response?.data?.data,
          payload,
          editingPackage: editingPkg,
          package: photographyPackage,
          filters,
        },
      });
    } catch (err) {
      console.error('draftOrder with editing failed:', err);
    } finally {
      setBookingId(null);
    }
  };

  return (                                        // ← always return JSX, use loading inside
    <ViewsLayout>
      <style>{STYLES}</style>
      <div className="ep-page">
        <div className="ep-container">
          <h1 className="ep-heading">Select Editing Package</h1>

          {loading ? (
            <div style={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', minHeight: '200px',
              color: '#aaa', fontSize: '15px', gap: '10px',
            }}>
              <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>⏳</span>
              Loading packages…
            </div>
          ) : editingPackages.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 0',
              color: '#aaa', fontSize: '15px',
            }}>
              No editing packages available.
            </div>
          ) : (
            <div className="ep-grid">
              {editingPackages.map((pkg, i) => (
                <EditingPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={i}
                  selected={selected}
                  onSelect={setSelected}
                  onBookNow={handleBookNow}
                  bookingId={bookingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ViewsLayout>
  );
};

/* ─── Styles (unchanged) ─────────────────────────────────────────── */
const STYLES = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ep-page {
  width: 100%;
  padding: 24px 16px 48px;
  display: flex;
  justify-content: center;
}
.ep-container {
  width: 100%;
  max-width: 1400px;
  padding: 28px 24px 32px;
  background: #fff;
}
.ep-heading {
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 28px;
  letter-spacing: -0.01em;
}
.ep-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(340px, 1fr)
  );
  gap: 24px;
}
  .ep-gallery {
  display: flex;
  gap: 8px;
  padding: 12px 14px 0;
}

.ep-thumb {
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.ep-feature-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f9fafb;
  padding: 10px;
  border-radius: 10px;
}

.ep-feature-icon {
  font-size: 18px;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ep-feature-title {
  font-size: 12px;
  font-weight: 600;
  color: #111827;
}

.ep-feature-value {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.ep-summary {
  margin: 0 14px 14px;
  padding: 10px;
  border-radius: 10px;
  background: #f3f4f6;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-align: center;
}
.ep-card {
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, outline 0.15s;
  animation: fadeSlideUp 0.4s ease both;
  display: flex;
  flex-direction: column;
}
.ep-card:hover { transform: translateY(-3px); }
.ep-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}
.ep-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}
.ep-card:hover .ep-image { transform: scale(1.04); }
.ep-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%);
  pointer-events: none;
}
.ep-tier-label {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.5);
}
.ep-price {
  position: absolute;
  bottom: 12px;
  left: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.55);
}
.ep-features {
  padding: 14px 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.ep-feature-row {
  display: flex;
  align-items: flex-start;
  gap: 7px;
}
.ep-star { font-size: 12px; flex-shrink: 0; margin-top: 1px; }
.ep-feature-text { font-size: 12px; color: #374151; line-height: 1.4; }
.ep-btn-wrap { padding: 4px 14px 16px; }
.ep-btn-wrap .su-btn-primary { font-size: 13px; padding: 10px 16px; border-radius: 50px; }
@media (max-width: 640px) {
  .ep-grid { grid-template-columns: 1fr; }
  .ep-image-wrap { aspect-ratio: 16 / 7; }
}
@media (min-width: 641px) and (max-width: 820px) {
  .ep-grid { grid-template-columns: repeat(2, 1fr); }
}
`;

export default SelectEditingPackage;