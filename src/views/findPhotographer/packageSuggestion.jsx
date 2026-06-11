import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { getServiceProviders } from '../../services/booking';


/* ─── Package Card ───────────────────────────────────────────────── */
const PackageCard = ({ pkg, index, onBookInstantly, onCustomizeTeam }) => {
  // Flatten team → one row per provider (skip skills with no providers)
  const total = pkg.team.reduce((sum, team) => {
    return (
      sum +
      team.providers.reduce(
        (providerSum, p) => providerSum + (p.price_with_commission || 0),
        0
      )
    );
  }, 0);
  const coverImage =
    pkg.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80';

  return (
    <div className="pkg-card" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Cover Image */}
      <div className="pkg-image-wrap">
        <img src={coverImage} alt="Package cover" className="pkg-image" />
        <div className="pkg-image-overlay" />
        <div className="pkg-badge">{pkg.name}</div>
      </div>

      {/* Details */}
      <div className="pkg-details">
        {pkg.team.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '13px', flex: 1 }}>
            No providers available for this package.
          </p>
        ) : (
          <div className="pkg-members">
            {pkg.team.map((teamMember, index) => (
              <div key={index} className="pkg-team-section">
                <div className="pkg-team-header">
                  <div>
                    <strong>
                      {teamMember.skill.charAt(0).toUpperCase() +
                        teamMember.skill.slice(1)}
                    </strong>
                  </div>

                  <div className="pkg-required-count">
                    Required: {teamMember.required_count}
                  </div>
                </div>

                {teamMember.providers.length > 0 ? (
                  teamMember.providers.map((provider) => (
                    <div
                      key={provider.id}
                      className="pkg-member-row"
                    >
                      <div className="pkg-member-left">
                        <img
                          src={
                            provider.profile_picture ||
                            "https://ui-avatars.com/api/?name=" +
                            provider.first_name
                          }
                          alt={provider.first_name}
                          className="pkg-avatar"
                        />

                        <div className="pkg-member-info">
                          <span className="pkg-member-name">
                            {provider.first_name} {provider.last_name}
                          </span>

                          <span className="pkg-member-role">
                            {teamMember.skill}
                          </span>
                        </div>
                      </div>

                      <span className="pkg-member-price">
                        ₹{provider.price_with_commission}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="pkg-empty-provider">
                    No provider assigned
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Divider + total */}
        <div className="pkg-total-row">
          <span className="pkg-total-label">Total</span>
          <span className="pkg-total-value">₹{total.toFixed(2)}</span>
        </div>

        {/* Action buttons */}
        <div className="pkg-actions">
          <button className="su-btn-primary" onClick={() => onBookInstantly(pkg)}>
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

  // Real data from navigation state (no mock fallback needed)
  const packages = location.state?.packages || [];

  const handleBookInstantly = (pkg) => {
    navigate('/select-package', { state: { package: pkg } });
  };
  const filters = location.state?.filters;

  const handleCustomizeTeam = async (pkg) => {
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
          package: pkg,
          mode: 'customize',
        },
      });
    } catch (err) {
      console.error(err);
    }
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
  .pkg-header-info {
  margin-bottom: 16px;
}

.pkg-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #222;
}

.pkg-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #666;
}

.pkg-team-section {
  padding: 12px 0;
  border-bottom: 1px solid #f1f1f1;
}

.pkg-team-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.pkg-required-count {
  color: #666;
  font-size: 12px;
}

.pkg-empty-provider {
  padding: 8px 0;
  color: #999;
  font-size: 13px;
  font-style: italic;
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