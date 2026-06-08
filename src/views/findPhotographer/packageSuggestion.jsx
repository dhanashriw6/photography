import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { getServiceProviders } from '../../services/booking';

/* ─── Mock data for preview (replace with real data from location.state) ── */
const MOCK_PACKAGES = [
  {
    id: 1,
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
    members: [
      { id: 1, name: 'John', role: 'Photographer', avatar: 'https://i.pravatar.cc/32?img=1', price: 120 },
      { id: 2, name: 'John', role: 'Videographer', avatar: 'https://i.pravatar.cc/32?img=2', price: 120 },
    ],
  },
  {
    id: 2,
    cover_image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80',
    members: [
      { id: 1, name: 'John', role: 'Photographer', avatar: 'https://i.pravatar.cc/32?img=3', price: 120 },
      { id: 2, name: 'John', role: 'Videographer', avatar: 'https://i.pravatar.cc/32?img=4', price: 120 },
      { id: 3, name: 'John', role: 'Candid', avatar: 'https://i.pravatar.cc/32?img=5', price: 120 },
      { id: 4, name: 'John', role: 'Cinematic', avatar: 'https://i.pravatar.cc/32?img=6', price: 120 },
    ],
  },
  {
    id: 3,
    cover_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
    members: [
      { id: 1, name: 'John', role: 'Photographer', avatar: 'https://i.pravatar.cc/32?img=7', price: 120 },
      { id: 2, name: 'John', role: 'Videographer', avatar: 'https://i.pravatar.cc/32?img=8', price: 120 },
      { id: 3, name: 'John', role: 'Candid', avatar: 'https://i.pravatar.cc/32?img=9', price: 120 },
      { id: 4, name: 'John', role: 'Cinematic', avatar: 'https://i.pravatar.cc/32?img=10', price: 120 },
      { id: 5, name: 'John', role: 'Drone', avatar: 'https://i.pravatar.cc/32?img=11', price: 120 },
    ],
  },
];

/* ─── Package Card ───────────────────────────────────────────────── */
const PackageCard = ({ pkg, index, onBookInstantly, onCustomizeTeam }) => {
  const total = pkg.members.reduce((sum, m) => sum + (m.price || 0), 0);

  return (
    <div
      className="pkg-card"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Cover Image */}
      <div className="pkg-image-wrap">
        <img
          src={pkg.cover_image}
          alt="Package cover"
          className="pkg-image"
        />
        <div className="pkg-image-overlay" />
        {/* Package number badge */}
        <div className="pkg-badge">Package {index + 1}</div>
      </div>

      {/* Details */}
      <div className="pkg-details">
        {/* Members list */}
        <div className="pkg-members">
          {pkg.members.map((member, i) => (
            <div key={member.id || i} className="pkg-member-row">
              <div className="pkg-member-left">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="pkg-avatar"
                />
                <div className="pkg-member-info">
                  <span className="pkg-member-name">{member.name}</span>
                  <span className="pkg-member-role">{member.role}</span>
                </div>
              </div>
              <span className="pkg-member-price">
                ${member.price?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Divider + total */}
        <div className="pkg-total-row">
          <span className="pkg-total-label">Total</span>
          <span className="pkg-total-value">${total.toFixed(2)}</span>
        </div>

        {/* Action buttons */}
        <div className="pkg-actions">
          <button
            className="su-btn-primary"
            onClick={() => onBookInstantly(pkg)}
          >
            Book Instantly
          </button>
          <button
            className="su-btn-primary-outline"
            onClick={() => onCustomizeTeam(pkg)}
          >
            Customize team
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const packageSuggestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Use real data from navigation state, fall back to mock
  const packages = location.state?.packages?.length
    ? location.state.packages
    : MOCK_PACKAGES;

  const handleBookInstantly = (pkg) => {
    navigate('/select-package', { state: { package: pkg } });
  };
    const filters = location.state?.filters;

  const handleCustomizeTeam = (pkg) => {
    navigate('/customize-team', { state: { package: pkg } });
  };

 const handleSkip = async () => {
    try {
      const response = await getServiceProviders({
        category_id: filters?.category_id,
        lat: filters?.lat,
        lng: filters?.lng,
        start_datetime: filters?.start_datetime,
        end_datetime: filters?.end_datetime,
      });

      navigate("/find-best", {
        state: {
          providers: response?.data?.data,
          filters,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ViewsLayout>
      <style>{STYLES}</style>

      <div className="pkg-page">
        <h1 className="pkg-heading">Package Suggestion</h1>

        <div className="pkg-list">
          {packages.map((pkg, i) => (
            <PackageCard
              key={pkg.id || i}
              pkg={pkg}
              index={i}
              onBookInstantly={handleBookInstantly}
              onCustomizeTeam={handleCustomizeTeam}
            />
          ))}
        </div>

        {/* Skip CTA */}
        <div className="pkg-skip-wrap">
          <button
            className="su-btn-primary"
            style={{ minWidth: '200px' }}
            onClick={handleSkip}
          >
            Skip and Explore More
          </button>
        </div>
      </div>
    </ViewsLayout>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pkg-page {
  width: 100%;
  
  margin: 0 auto;
  padding: 20px 40px;
}

.pkg-heading {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 28px;
  letter-spacing: -0.01em;
}

.pkg-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Card ── */
.pkg-card {
  display: flex;
  flex-direction: row;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  animation: fadeSlideUp 0.45s ease both;
  transition: box-shadow 0.2s, transform 0.2s;
}
.pkg-card:hover {
  box-shadow: 0 6px 28px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

/* ── Image ── */
.pkg-image-wrap {
  position: relative;
  width: 230px;
  min-width: 230px;
  flex-shrink: 0;
  overflow: hidden;
}
.pkg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pkg-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.08), transparent);
  pointer-events: none;
}
.pkg-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}

/* ── Details ── */
.pkg-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 18px 20px 16px;
  gap: 0;
}

/* ── Members ── */
.pkg-members {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.pkg-member-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pkg-member-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pkg-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  flex-shrink: 0;
}
.pkg-member-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.pkg-member-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}
.pkg-member-role {
  font-size: 11px;
  color: #888;
  font-weight: 400;
}
.pkg-member-price {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}

/* ── Total row ── */
.pkg-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  margin-top: 12px;
  padding-top: 10px;
}
.pkg-total-label {
  font-size: 12px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.pkg-total-value {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

/* ── Actions ── */
.pkg-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.pkg-actions .su-btn-primary,
.pkg-actions .su-btn-primary-outline {
  flex: 1;
  min-width: 120px;
  padding: 9px 16px;
  font-size: 13px;
  text-align: center;
  white-space: nowrap;
}

/* ── Skip ── */
.pkg-skip-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* ── Responsive ── */
@media (max-width: 560px) {
  .pkg-card { flex-direction: column; }
  .pkg-image-wrap { width: 100%; min-width: unset; height: 180px; }
  .pkg-actions { flex-direction: column; }
  .pkg-actions .su-btn-primary,
  .pkg-actions .su-btn-primary-outline { flex: unset; width: 100%; }
}
`;

export default packageSuggestion;