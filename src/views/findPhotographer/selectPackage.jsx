import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';

/* ─── Mock editing packages (replace with API data) ──────────────── */
const MOCK_EDITING_PACKAGES = [
  {
    id: 'silver',
    tier: 'Silver',
    price: 10000,
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    features: [
      'Full Video',
      '200 edited Photos',
      '2 same day Edited photo',
    ],
  },
  {
    id: 'gold',
    tier: 'Gold',
    price: 20000,
    cover_image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80',
    features: [
      'Full Video',
      '250 edited Photos',
      '2 same day Edited Photo',
      '1 Reel',
    ],
  },
  {
    id: 'platinum',
    tier: 'Platinum',
    price: 30000,
    cover_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
    features: [
      'Full Video',
      '300 edited Photos',
      '5 same day Edited Photo',
      '2 Reel',
      '1 highlight',
    ],
  },
];

/* ─── Tier accent colors ─────────────────────────────────────────── */
const TIER_COLORS = {
  Silver: { accent: '#9ca3af', glow: 'rgba(156,163,175,0.25)', label: '#6b7280' },
  Gold:   { accent: '#f5a623', glow: 'rgba(245,166,35,0.28)',  label: '#b45309' },
  Platinum: { accent: '#818cf8', glow: 'rgba(129,140,248,0.28)', label: '#4338ca' },
};

/* ─── Editing Package Card ───────────────────────────────────────── */
const EditingPackageCard = ({ pkg, index, selected, onSelect, onBookNow }) => {
  const colors = TIER_COLORS[pkg.tier] || TIER_COLORS.Gold;
  const isSelected = selected === pkg.id;

  return (
    <div
      className="ep-card"
      style={{
        animationDelay: `${index * 0.12}s`,
        outline: isSelected ? `2.5px solid ${colors.accent}` : '2.5px solid transparent',
        boxShadow: isSelected
          ? `0 0 0 4px ${colors.glow}, 0 8px 32px rgba(0,0,0,0.13)`
          : '0 2px 16px rgba(0,0,0,0.10)',
      }}
      onClick={() => onSelect(pkg.id)}
    >
      {/* Cover image with overlay */}
      <div className="ep-image-wrap">
        <img src={pkg.cover_image} alt={pkg.tier} className="ep-image" />
        {/* Gradient overlay — darker at bottom for text legibility */}
        <div className="ep-overlay" />

        {/* Tier name top-left */}
        <span className="ep-tier-label">{pkg.tier}</span>

        {/* Price bottom-left */}
        <span className="ep-price">Rs.{pkg.price.toLocaleString('en-IN')}.00</span>
      </div>

      {/* Features list */}
      <div className="ep-features">
        {pkg.features.map((f, i) => (
          <div key={i} className="ep-feature-row">
            <span className="ep-star" style={{ color: colors.accent }}>★</span>
            <span className="ep-feature-text">{f}</span>
          </div>
        ))}
      </div>

      {/* Book Now button */}
      <div className="ep-btn-wrap">
        <button
          className="su-btn-primary"
          style={{ width: '100%' }}
          onClick={()=>navigate('/requestBook')}
        >
          Book Now
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

  // The chosen photography package passed from packageSuggestion
  const photographyPackage = location.state?.package;
  const filters = location.state?.filters;

  // Use API data if available, otherwise mock
  const editingPackages = location.state?.editingPackages?.length
    ? location.state.editingPackages
    : MOCK_EDITING_PACKAGES;

  const handleBookNow = (editingPkg) => {
    navigate('/booking-confirm', {
      state: {
        package: photographyPackage,
        editingPackage: editingPkg,
        filters,
      },
    });
  };

  return (
    <ViewsLayout>
      <style>{STYLES}</style>

      <div className="ep-page">
        {/* Dashed border container matching the design */}
        <div className="ep-container">
          <h1 className="ep-heading">Select Editing Package</h1>

          <div className="ep-grid">
            {editingPackages.map((pkg, i) => (
              <EditingPackageCard
                key={pkg.id}
                pkg={pkg}
                index={i}
                selected={selected}
                onSelect={setSelected}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
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

.ep-page {
  width: 100%;
  padding: 24px 16px 48px;
  display: flex;
  justify-content: center;
}

/* Outer dashed blue border wrapper */
.ep-container {
  width: 100%;
  max-width: 860px;
  
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

/* 3-column grid */
.ep-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

/* ── Card ── */
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
.ep-card:hover {
  transform: translateY(-3px);
}

/* ── Image ── */
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
.ep-card:hover .ep-image {
  transform: scale(1.04);
}
.ep-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.18) 0%,
    rgba(0,0,0,0.05) 40%,
    rgba(0,0,0,0.55) 100%
  );
  pointer-events: none;
}

/* Tier name — top left */
.ep-tier-label {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.5);
  letter-spacing: 0.01em;
}

/* Price — bottom left */
.ep-price {
  position: absolute;
  bottom: 12px;
  left: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.55);
}

/* ── Features ── */
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
.ep-star {
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 1px;
}
.ep-feature-text {
  font-size: 12px;
  color: #374151;
  line-height: 1.4;
}

/* ── Button ── */
.ep-btn-wrap {
  padding: 4px 14px 16px;
}
.ep-btn-wrap .su-btn-primary {
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 50px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .ep-grid {
    grid-template-columns: 1fr;
  }
  .ep-image-wrap {
    aspect-ratio: 16 / 7;
  }
}
@media (min-width: 641px) and (max-width: 820px) {
  .ep-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

export default SelectEditingPackage;