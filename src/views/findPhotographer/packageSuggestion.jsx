import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { getServiceProviders } from '../../services/booking';

const encodeFilters = (filters) => {
  try {
    return filters
      ? btoa(unescape(encodeURIComponent(JSON.stringify(filters))))
      : '';
  } catch {
    return '';
  }
};

/* ─── Package Card (vertical) ────────────────────────────────────── */
const PackageCard = ({ pkg, index, onBookInstantly, onCustomizeTeam }) => {
  const [activeImg, setActiveImg] = useState(0);
const timerRef = useRef(null);


  const images = pkg.images || [];
  useEffect(() => {
  if (images.length <= 1) return;
  timerRef.current = setInterval(() => {
    setActiveImg((prev) => (prev + 1) % images.length);
  }, 2500);
  return () => clearInterval(timerRef.current);
}, [images.length]);

  const coverUrl =
    images[activeImg]?.url ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80';

  const total = pkg.team.reduce(
    (sum, t) =>
      sum + t.providers.reduce((ps, p) => ps + (p.price_with_commission || 0), 0),
    0
  );

  const initials = (f, l) =>
    ((f?.[0] || '') + (l?.[0] || '')).toUpperCase();

  return (
    <div className="pkg-card" style={{ animationDelay: `${index * 0.08}s` }}>
      {/* ── Gallery ── */}
      <div className="pkg-gallery"
  onMouseEnter={() => clearInterval(timerRef.current)}
  onMouseLeave={() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(
      () => setActiveImg((prev) => (prev + 1) % images.length),
      2500
    );
  }}
>
  <img src={coverUrl} alt="Package cover" className="pkg-gallery-main" />

  <div className="pkg-badge">{pkg.name}</div>
  <div className="pkg-duration-badge">
    {pkg.time_required} {pkg.time_unit}
  </div>

  {images.length > 1 && (
    <div className="pkg-dots">
      {images.map((_, i) => (
        <span
          key={i}
          className={`pkg-dot ${i === activeImg ? 'pkg-dot--active' : ''}`}
          onClick={() => setActiveImg(i)}
        />
      ))}
    </div>
  )}
</div>

      {/* ── Body ── */}
      <div className="pkg-body">
        <p className="pkg-category">{pkg.category?.name}</p>

        {pkg.team.length === 0 ? (
          <p className="pkg-empty-msg">No providers available.</p>
        ) : (
          <div className="pkg-team">
            {pkg.team.map((t, i) => (
              <div key={i} className="pkg-skill-section">
                <div className="pkg-skill-header">
                  <span className="pkg-skill-name">
                    {t.skill.charAt(0).toUpperCase() + t.skill.slice(1)}
                  </span>
                  <span className="pkg-skill-req">×{t.required_count}</span>
                </div>

                {t.providers.length > 0 ? (
                  t.providers.map((p) => (
                    <div key={p.id} className="pkg-provider-row">
                      <div className="pkg-provider-left">
                        <div className="pkg-avatar">
                          {p.profile_picture ? (
                            <img src={p.profile_picture} alt={p.first_name} />
                          ) : (
                            initials(p.first_name, p.last_name)
                          )}
                        </div>
                        <div>
                          <div className="pkg-provider-name">
                            {p.first_name} {p.last_name}
                          </div>
                          <div className="pkg-provider-role">{t.skill}</div>
                        </div>
                      </div>
                      <span className="pkg-provider-price">
                        ₹{p.price_with_commission?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="pkg-no-provider">No provider assigned</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Total + actions pinned to bottom */}
        <div className="pkg-footer">
          <div className="pkg-total-row">
            <span className="pkg-total-label">Total</span>
            <span className="pkg-total-value">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="pkg-actions">
            <button className="su-btn-primary" onClick={() => onBookInstantly(pkg)}>
              Book Instantly
            </button>
            <button
              className="su-btn-primary-outline"
              onClick={() => onCustomizeTeam(pkg)}
            >
              Customize Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const packageSuggestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const packages = location.state?.packages || [];
  const filters = location.state?.filters;

  const handleBookInstantly = (pkg) => {
    const params = new URLSearchParams({
      f: encodeFilters(filters),
      pkgId: pkg.id,
    });
    navigate(`/select-package?${params.toString()}`, {
      state: { package: pkg, filters },
    });
  };

  const handleCustomizeTeam = async (pkg) => {
    try {
      const response = await getServiceProviders({
        category_id: filters?.category_id,
        lat: filters?.lat,
        lng: filters?.lng,
        start_datetime: filters?.start_datetime,
        end_datetime: filters?.end_datetime,
      });
      const params = new URLSearchParams({
        f: encodeFilters(filters),
        pkgId: pkg.id,
        mode: 'customize',
      });
      navigate(`/find-best?${params.toString()}`, {
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
      const params = new URLSearchParams({ f: encodeFilters(filters) });
      navigate(`/find-best?${params.toString()}`, {
        state: { providers: response?.data?.data, filters },
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

        <div className="pkg-grid">
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
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pkg-page {
  width: 100%;
  margin: 0 auto;
  padding: 20px 24px;
}

.pkg-heading {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  letter-spacing: -0.01em;
}

/* ── Grid: 3 columns on wide, 2 on medium, 1 on mobile ── */
.pkg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* ── Card (vertical) ── */
.pkg-card {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  border: 1px solid #f0f0f0;
  animation: fadeSlideUp 0.4s ease both;
  transition: box-shadow 0.2s, transform 0.2s;
}
.pkg-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.11);
  transform: translateY(-3px);
}

/* ── Gallery ── */
.pkg-gallery {
  position: relative;
  width: 100%;
  height: 250px;
  flex-shrink: 0;
  overflow: hidden;
  background: #f5f5f5;
}
.pkg-gallery-main {
  width: 100%;
  height: 100%;
  object-fit:contain;
  display: block;
  transition: opacity 0.2s;
}
.pkg-badge {
  position: absolute;
  top: 9px;
  left: 9px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  max-width: calc(100% - 80px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pkg-duration-badge {
  position: absolute;
  top: 9px;
  right: 9px;
  background: rgba(0,0,0,0.45);
  color: #fff;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}
.pkg-dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}
.pkg-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.45);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.pkg-dot--active {
  background: #fff;
  transform: scale(1.3);
}
/* ── Body ── */
.pkg-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 14px 14px;
}
.pkg-category {
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
}
.pkg-empty-msg {
  color: #bbb;
  font-size: 12px;
  flex: 1;
}

/* ── Team ── */
.pkg-team {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.pkg-skill-section {
  padding: 8px 0;
  border-bottom: 1px solid #f2f2f2;
}
.pkg-skill-section:last-child { border-bottom: none; }
.pkg-skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.pkg-skill-name {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}
.pkg-skill-req {
  font-size: 10px;
  color: #888;
  background: #f5f5f5;
  padding: 2px 7px;
  border-radius: 20px;
}
.pkg-provider-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}
.pkg-provider-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pkg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e8eeff;
  color: #4a5adf;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border: 1.5px solid #f0f0f0;
}
.pkg-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pkg-provider-name {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}
.pkg-provider-role {
  font-size: 10px;
  color: #999;
}
.pkg-provider-price {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}
.pkg-no-provider {
  font-size: 11px;
  color: #ccc;
  font-style: italic;
  padding: 3px 0;
}

/* ── Footer (total + actions) ── */
.pkg-footer {
  margin-top: auto;
  padding-top: 10px;
}
.pkg-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  margin-bottom: 10px;
}
.pkg-total-label {
  font-size: 11px;
  color: #999;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.pkg-total-value {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}
.pkg-actions {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.pkg-actions .su-btn-primary,
.pkg-actions .su-btn-primary-outline {
  width: 100%;
  padding: 8px 12px;
  font-size: 12px;
  text-align: center;
}

/* ── Skip ── */
.pkg-skip-wrap {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .pkg-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 540px) {
  .pkg-page { padding: 14px; }
  .pkg-grid { grid-template-columns: 1fr; }
  .pkg-gallery { height: 200px; }
}
`;

export default packageSuggestion;