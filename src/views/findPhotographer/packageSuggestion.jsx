import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { getServiceProviders, getPackage } from '../../services/booking';
import { createPortal } from 'react-dom';
import { getCategory } from '../../services/common';
import { AddressAutocomplete } from '../joinAsPhotographer/signUp';

const encodeFilters = (filters) => {
  try {
    return filters
      ? btoa(unescape(encodeURIComponent(JSON.stringify(filters))))
      : '';
  } catch {
    return '';
  }
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const replaceDatePart = (originalIso, newDateStr) => {
  if (!originalIso || !newDateStr) return originalIso;
  const orig = new Date(originalIso);
  const [y, m, d] = newDateStr.split('-').map(Number);
  const replaced = new Date(orig);
  replaced.setFullYear(y, m - 1, d);
  return replaced.toISOString();
};

const getPackageTotal = (pkg) =>
  (pkg.team || []).reduce(
    (sum, t) =>
      sum + (t.providers || []).reduce((ps, p) => ps + (p.price_with_commission || 0), 0),
    0
  );

const getPackageDurationDays = (pkg) =>
  pkg.time_unit?.toLowerCase().includes('day') ? pkg.time_required : null;


const initials = (f, l) => ((f?.[0] || '') + (l?.[0] || '')).toUpperCase();

/* ─── Package Card (horizontal) ──────────────────────────────────── */
const PackageCard = ({ pkg, index, onBookInstantly, onCustomizeTeam }) => {
  const [activeImg, setActiveImg] = useState(0);
  const timerRef = useRef(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = pkg.images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(timerRef.current);
  }, [images.length]);

  const coverUrl = images[activeImg]?.url;
  const thumb1 = images[1]?.url;
  const thumb2 = images[2]?.url;
  const extraCount = images.length > 3 ? images.length - 3 : 0;

  const providerCount = (pkg.team || []).reduce(
    (sum, t) => sum + (t.providers?.length || 0),
    0
  );

  const photographerCount = (pkg.team || [])
    .filter((t) => t.skill?.toLowerCase() === 'photographer')
    .reduce((sum, t) => sum + (t.providers?.length || 0), 0);

  const cinematographerCount = (pkg.team || [])
    .filter((t) => t.skill?.toLowerCase() === 'cinematographer')
    .reduce((sum, t) => sum + (t.providers?.length || 0), 0);

  const total = getPackageTotal(pkg);
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

  const allProviders = (pkg.team || []).flatMap((t) =>
    (t.providers || []).map((p) => ({ ...p, skill: t.skill }))
  );

  return (
    <div className="pkg-card-h" style={{ animationDelay: `${index * 0.08}s` }}>
      {/* ── Gallery ── */}
      <div
        className="pkg-gallery-h"
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={() => {
          if (images.length <= 1) return;
          timerRef.current = setInterval(
            () => setActiveImg((prev) => (prev + 1) % images.length),
            2500
          );
        }}
      >
        <div className="pkg-gallery-main-h">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={pkg.name}
              onClick={() => {
                setSelectedImage(activeImg);
                setShowGallery(true);
              }}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <div className="pkg-gallery-placeholder">No image</div>
          )}
        </div>
        <div className="pkg-gallery-side">
          <div className="pkg-gallery-thumb">
            {thumb1 ? (
              <img
                src={thumb1}
                alt=""
                onClick={() => {
                  setSelectedImage(1);
                  setShowGallery(true);
                }}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <div className="pkg-gallery-placeholder" />
            )}
          </div>

          <div className="pkg-gallery-thumb">
            {thumb2 ? (
              <img
                src={thumb2}
                alt=""
                onClick={() => {
                  setSelectedImage(2);
                  setShowGallery(true);
                }}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <div className="pkg-gallery-placeholder" />
            )}

            {extraCount > 0 && (
              <div className="pkg-img-count-badge">
                <span>🖼</span> {images.length}+
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Middle info ── */}
      <div className="pkg-info-h">
        <h3 className="pkg-name-h">{pkg.name}</h3>
        {pkg.category?.name && <p className="pkg-category-h">{pkg.category.name}</p>}

        <div className="pkg-meta-row-h">
          {pkg.time_required != null && (
            <span className="pkg-meta-item-h">
              {pkg.time_required} {pkg.time_unit}
            </span>
          )}
          {photographerCount > 0 && (
            <span className="pkg-meta-item-h">
              {photographerCount} Photographer{photographerCount > 1 ? 's' : ''}
            </span>
          )}
          {cinematographerCount > 0 && (
            <span className="pkg-meta-item-h">
              {cinematographerCount} Cinematographer{cinematographerCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {pkg.team && pkg.team.length > 0 && (
          <div className="pkg-team-composition-h">
            <span className="pkg-team-label-h">Team Composition</span>
            <div className="pkg-team-avatars-h">
              {allProviders.slice(0, 4).map((p) => (
                <div key={p.id} className="pkg-avatar-h" title={`${p.first_name} ${p.last_name}`}>
                  {p.profile_picture ? (
                    <img src={p.profile_picture} alt={p.first_name} />
                  ) : (
                    initials(p.first_name, p.last_name)
                  )}
                </div>
              ))}
              {allProviders.length > 4 && (
                <div className="pkg-avatar-h pkg-avatar-more-h">+{allProviders.length - 4}</div>
              )}
            </div>
            <span className="pkg-member-count-h">
              {providerCount} Member{providerCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* ── Right: price + actions ── */}
      <div className="pkg-price-h">
        <span className="pkg-total-label-h">Package Total</span>
        <span className="pkg-total-value-h">₹{total.toLocaleString('en-IN')}</span>

        {pkg.team && pkg.team.length > 0 && (
          <div className="pkg-breakdown-h">
            <span className="pkg-breakdown-title-h">Price Breakdown</span>
            {pkg.team.map((t, i) => {
              const skillTotal = (t.providers || []).reduce(
                (s, p) => s + (p.price_with_commission || 0),
                0
              );
              return (
                <div key={i} className="pkg-breakdown-row-h">
                  <span>{t.skill?.charAt(0).toUpperCase() + t.skill?.slice(1)}</span>
                  <span>₹{skillTotal.toLocaleString('en-IN')}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="pkg-actions-h">
          <button className="su-btn-primary" onClick={() => onBookInstantly(pkg)}>
            Book Instantly →
          </button>
          <button className="su-btn-primary-outline" onClick={() => onCustomizeTeam(pkg)}>
            Customize Team
          </button>
        </div>
      </div>
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
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

const packageSuggestion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialPackages = location.state?.packages || [];
  const initialFilters = location.state?.filters || {};

  const [packages, setPackages] = useState(initialPackages);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [categories, setCategories] = useState([]);
  const [editingSummary, setEditingSummary] = useState(false);
  const [applying, setApplying] = useState(false);

  // Reconstruct address from filters
  const getInitialAddress = (filters) => {
    if (!filters || !filters.place_id) return null;
    return {
      lat: filters.lat,
      lng: filters.lng,
      place_id: filters.place_id,
      address_line1: filters.address_line1 || '',
      address_line2: filters.address_line2 || '',
      address_line3: filters.address_line3 || '',
      city: filters.city || '',
      state: filters.state || '',
      state_code: filters.state_code || '',
      country: filters.country || '',
      country_code: filters.country_code || '',
      postal_code: filters.postal_code || '',
      timezone: filters.timezone || '',
    };
  };

  // Helper to extract time (HH:MM) from ISO string
  const getTimeFromIso = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  const initialAddress = getInitialAddress(initialFilters);
  const [summaryForm, setSummaryForm] = useState({
    categoryId: initialFilters.category_id || '',
    startDate: initialFilters.start_datetime
      ? initialFilters.start_datetime.split('T')[0]
      : (initialFilters.date || ''),
    endDate: initialFilters.end_datetime
      ? initialFilters.end_datetime.split('T')[0]
      : '',
    startTime: getTimeFromIso(initialFilters.start_datetime),
    endTime: getTimeFromIso(initialFilters.end_datetime),
    address: initialAddress,
  });

  const [budgetRange, setBudgetRange] = useState([
    initialFilters.budget_min || 5000,
    initialFilters.budget_max || 50000,
  ]);
  const [duration, setDuration] = useState(initialFilters.duration || null);

  // Helper to format times nicely for display
  const formatTime = (timeStr) => {
    if (!timeStr) return '—';
    const [h, m] = timeStr.split(':');
    if (!h || !m) return timeStr;
    const hrs = parseInt(h, 10);
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 || 12;
    return `${displayHrs}:${m} ${ampm}`;
  };

  const buildDateTime = (date, time) => {
    if (!date || !time) {
      return null;
    }
    const dateTime = new Date(`${date}T${time}:00`);
    if (isNaN(dateTime.getTime())) {
      console.error("Invalid date/time:", date, time);
      return null;
    }
    return dateTime.toISOString();
  };

  const matchesBudget = (pkg) => {
    const total = getPackageTotal(pkg);
    const max = budgetRange[1] >= 50000 ? Infinity : budgetRange[1];
    return total >= budgetRange[0] && total <= max;
  };

  const matchesDuration = (pkg) => {
    if (!duration) return true;
    const days = getPackageDurationDays(pkg);
    if (days == null) return true;
    if (duration === '4+ Days') return days >= 4;
    return days === parseInt(duration, 10);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res?.data?.data?.event_categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const handleApplyFilters = async () => {
    setApplying(true);
    try {
      const newStartDatetime = buildDateTime(summaryForm.startDate, summaryForm.startTime);
      const newEndDatetime = buildDateTime(summaryForm.endDate, summaryForm.endTime);

      const params = {
        ...activeFilters,
        category_id: summaryForm.categoryId,
        date: summaryForm.startDate,
        start_datetime: newStartDatetime,
        end_datetime: newEndDatetime,
        ...(summaryForm.address
          ? {
              lat: summaryForm.address.lat,
              lng: summaryForm.address.lng,
              place_id: summaryForm.address.place_id,
              address_line1: summaryForm.address.address_line1,
              address_line2: summaryForm.address.address_line2,
              address_line3: summaryForm.address.address_line3,
              city: summaryForm.address.city,
              state: summaryForm.address.state,
              state_code: summaryForm.address.state_code,
              country: summaryForm.address.country,
              country_code: summaryForm.address.country_code,
              postal_code: summaryForm.address.postal_code,
              timezone: summaryForm.address.timezone,
            }
          : {
              lat: undefined,
              lng: undefined,
              place_id: undefined,
              address_line1: undefined,
              address_line2: undefined,
              address_line3: undefined,
              city: undefined,
              state: undefined,
              state_code: undefined,
              country: undefined,
              country_code: undefined,
              postal_code: undefined,
              timezone: undefined,
            }),
        budget_min: budgetRange[0],
        budget_max: budgetRange[1] >= 50000 ? undefined : budgetRange[1],
        duration: duration || undefined,
      };

      const response = await getPackage(params);
      let result = response?.data?.data || [];

      result = result.filter((pkg) => {
        const total = getPackageTotal(pkg);
        const maxBudget = budgetRange[1] >= 50000 ? Infinity : budgetRange[1];
        const matchesB = total >= budgetRange[0] && total <= maxBudget;

        let matchesD = true;
        if (duration) {
          const days = getPackageDurationDays(pkg);
          if (days != null) {
            if (duration === '4+ Days') {
              matchesD = days >= 4;
            } else {
              matchesD = days === parseInt(duration, 10);
            }
          }
        }
        return matchesB && matchesD;
      });

      setPackages(result);
      setActiveFilters(params);
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
      setEditingSummary(false);
    }
  };

  const handleCancelEdit = () => {
    setSummaryForm({
      categoryId: activeFilters?.category_id || '',
      startDate: activeFilters?.start_datetime
        ? activeFilters.start_datetime.split('T')[0]
        : (activeFilters?.date || ''),
      endDate: activeFilters?.end_datetime
        ? activeFilters.end_datetime.split('T')[0]
        : '',
      startTime: getTimeFromIso(activeFilters?.start_datetime),
      endTime: getTimeFromIso(activeFilters?.end_datetime),
      address: getInitialAddress(activeFilters),
    });
    setBudgetRange([
      activeFilters?.budget_min || 5000,
      activeFilters?.budget_max || 50000,
    ]);
    setDuration(activeFilters?.duration || null);
    setEditingSummary(false);
  };

  const handleClearAll = () => {
    setBudgetRange([5000, 50000]);
    setDuration(null);
    const origAddress = getInitialAddress(location.state?.filters);
    setSummaryForm({
      categoryId: location.state?.filters?.category_id || '',
      startDate: location.state?.filters?.start_datetime
        ? location.state.filters.start_datetime.split('T')[0]
        : (location.state?.filters?.date || ''),
      endDate: location.state?.filters?.end_datetime
        ? location.state.filters.end_datetime.split('T')[0]
        : '',
      startTime: getTimeFromIso(location.state?.filters?.start_datetime),
      endTime: getTimeFromIso(location.state?.filters?.end_datetime),
      address: origAddress,
    });
    setEditingSummary(false);
    setPackages(initialPackages);
    setActiveFilters(location.state?.filters || {});
  };

  const handleBookInstantly = (pkg) => {
    const params = new URLSearchParams({ f: encodeFilters(activeFilters), pkgId: pkg.id });
    navigate(`/select-package?${params.toString()}`, { state: { package: pkg, filters: activeFilters } });
  };

  const handleCustomizeTeam = async (pkg) => {
    try {
      const response = await getServiceProviders({
        category_id: activeFilters?.category_id,
        lat: activeFilters?.lat,
        lng: activeFilters?.lng,
        start_datetime: activeFilters?.start_datetime,
        end_datetime: activeFilters?.end_datetime,
      });
      const params = new URLSearchParams({ f: encodeFilters(activeFilters), pkgId: pkg.id, mode: 'customize' });
      navigate(`/find-best?${params.toString()}`, {
        state: { providers: response?.data?.data, filters: activeFilters, package: pkg, mode: 'customize' },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async () => {
    try {
      const response = await getServiceProviders({
        category_id: activeFilters?.category_id,
        lat: activeFilters?.lat,
        lng: activeFilters?.lng,
        start_datetime: activeFilters?.start_datetime,
        end_datetime: activeFilters?.end_datetime,
      });
      const params = new URLSearchParams({ f: encodeFilters(activeFilters) });
      navigate(`/find-best?${params.toString()}`, { state: { providers: response?.data?.data, filters: activeFilters } });
    } catch (err) {
      console.error(err);
    }
  };

  const eventTypeName = packages[0]?.category?.name || 'Your Event';

  return (
    <ViewsLayout>
      <style>{STYLES}</style>

      <div className="pkg-page-h">
        <div className="pkg-layout-h">
          {/* ── Left sidebar ── */}
          <aside className="pkg-sidebar-h">
            <div className="pkg-sidebar-card-h">
              <div className="pkg-sidebar-header-h" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800 }}>Filters</span>
                {!editingSummary ? (
                  <button
                    className="pkg-edit-btn-h"
                    onClick={() => setEditingSummary(true)}
                    style={{ color: '#ff9c2b', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    ✏️ Edit
                  </button>
                ) : (
                  <button
                    className="pkg-clear-btn-h"
                    onClick={handleClearAll}
                    style={{ color: '#888' }}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {!editingSummary ? (
                // View Mode
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="pkg-summary-item-h">
                    <span className="pkg-summary-label-h">Event Type</span>
                    <span className="pkg-summary-value-h">{eventTypeName}</span>
                  </div>
                  <div className="pkg-summary-item-h">
                    <span className="pkg-summary-label-h">Start Date & Time</span>
                    <span className="pkg-summary-value-h">
                      {formatDate(activeFilters?.start_datetime)} at {formatTime(getTimeFromIso(activeFilters?.start_datetime))}
                    </span>
                  </div>
                  <div className="pkg-summary-item-h">
                    <span className="pkg-summary-label-h">End Date & Time</span>
                    <span className="pkg-summary-value-h">
                      {formatDate(activeFilters?.end_datetime)} at {formatTime(getTimeFromIso(activeFilters?.end_datetime))}
                    </span>
                  </div>
                  <div className="pkg-summary-item-h">
                    <span className="pkg-summary-label-h">Location</span>
                    <span className="pkg-summary-value-h text-ellipsis" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={activeFilters?.address_line1 || activeFilters?.city || activeFilters?.state || '—'}>
                      {activeFilters?.city || activeFilters?.state || activeFilters?.address_line1 || '—'}
                    </span>
                  </div>
                  <div className="pkg-summary-item-h">
                    <span className="pkg-summary-label-h">Budget Range</span>
                    <span className="pkg-summary-value-h">
                      ₹{budgetRange[0].toLocaleString('en-IN')} – ₹{budgetRange[1].toLocaleString('en-IN')}+
                    </span>
                  </div>
                  <div className="pkg-summary-item-h">
                    <span className="pkg-summary-label-h">Duration Filter</span>
                    <span className="pkg-summary-value-h">
                      {duration || 'Any Duration'}
                    </span>
                  </div>

                  <button
                    className="su-btn-primary-outline"
                    onClick={() => setEditingSummary(true)}
                    style={{ width: '100%', marginTop: '10px' }}
                  >
                    ✏️ Edit Filters
                  </button>
                </div>
              ) : (
                // Edit Mode
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Event Type */}
                  <div className="su-field">
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Event Type</label>
                    <select
                      className="pkg-summary-edit-input-h"
                      value={summaryForm.categoryId}
                      onChange={(e) => setSummaryForm((f) => ({ ...f, categoryId: e.target.value }))}
                      style={{ marginTop: '4px' }}
                    >
                      <option value="">Select Event</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dates Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="su-field">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Start Date</label>
                      <input
                        type="date"
                        className="pkg-summary-edit-input-h"
                        value={summaryForm.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSummaryForm((f) => ({ ...f, startDate: e.target.value }))}
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                    <div className="su-field">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>End Date</label>
                      <input
                        type="date"
                        className="pkg-summary-edit-input-h"
                        value={summaryForm.endDate}
                        min={summaryForm.startDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSummaryForm((f) => ({ ...f, endDate: e.target.value }))}
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  {/* Times Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="su-field">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Start Time</label>
                      <input
                        type="time"
                        className="pkg-summary-edit-input-h"
                        value={summaryForm.startTime}
                        onChange={(e) => setSummaryForm((f) => ({ ...f, startTime: e.target.value }))}
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                    <div className="su-field">
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>End Time</label>
                      <input
                        type="time"
                        className="pkg-summary-edit-input-h"
                        value={summaryForm.endTime}
                        onChange={(e) => setSummaryForm((f) => ({ ...f, endTime: e.target.value }))}
                        style={{ marginTop: '4px' }}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="su-field">
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Event Location</label>
                    <div style={{ marginTop: '4px' }}>
                      <AddressAutocomplete
                        label="Event Location"
                        value={summaryForm.address}
                        onAddressSelect={(val) => setSummaryForm((f) => ({ ...f, address: val }))}
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="pkg-filter-group-h" style={{ marginBottom: 0, marginTop: '8px' }}>
                    <span className="pkg-filter-label-h" style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>Budget Range</span>
                    <input
                      type="range"
                      min={5000}
                      max={50000}
                      step={1000}
                      value={budgetRange[1]}
                      onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
                      className="pkg-range-h"
                    />
                    <div className="pkg-range-labels-h">
                      <span>₹5,000</span>
                      <span>₹50,000+</span>
                    </div>
                    <div className="pkg-range-selected-h" style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>
                      ₹{budgetRange[0].toLocaleString('en-IN')} – ₹{budgetRange[1].toLocaleString('en-IN')}+
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="pkg-filter-group-h" style={{ marginBottom: 0 }}>
                    <span className="pkg-filter-label-h" style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>Duration</span>
                    <div className="pkg-pill-row-h">
                      {['1 Day', '2 Days', '3 Days', '4+ Days'].map((label) => (
                        <button
                          key={label}
                          className={`pkg-pill-h ${duration === label ? 'pkg-pill-h--active' : ''}`}
                          onClick={() => setDuration(label)}
                          style={{ padding: '5px 10px', fontSize: '11px' }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      className="su-btn-primary pkg-apply-btn-h"
                      onClick={handleApplyFilters}
                      disabled={applying}
                      style={{ flex: 1, margin: 0, padding: '10px' }}
                    >
                      {applying ? 'Applying…' : 'Apply'}
                    </button>
                    <button
                      className="su-btn-primary-outline"
                      onClick={handleCancelEdit}
                      style={{ flex: 1, padding: '10px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="pkg-main-h">
            <div className="pkg-main-header-h">
              <div>
                <h1 className="pkg-heading-h">
                  Suggested teams for your{' '}
                  <span className="pkg-heading-accent-h">{eventTypeName}</span>
                </h1>
                <p className="pkg-subheading-h">
                  Handpicked packages by our admin team to match your event.
                </p>
              </div>
            </div>

            <div className="pkg-list-h">
              {packages.length === 0 ? (
                <div className="pkg-empty-state-h">No packages found for your event yet.</div>
              ) : (
                packages.map((pkg, i) => (
                  <PackageCard
                    key={pkg.id || i}
                    pkg={pkg}
                    index={i}
                    onBookInstantly={handleBookInstantly}
                    onCustomizeTeam={handleCustomizeTeam}
                  />
                ))
              )}
            </div>
          </main>
        </div>

        {/* ── Sticky bottom bar ── */}
        <div className="pkg-bottom-bar-h">
          <div className="pkg-bottom-section-h">
            <span className="pkg-bottom-label-h">Your Selection</span>
          <span className="pkg-bottom-value-h">
  {eventTypeName} · {formatDate(activeFilters?.start_datetime)} ·{' '}
  {activeFilters?.city || activeFilters?.state || '—'}
</span>
          </div>
          <div className="pkg-bottom-section-h">
            <span className="pkg-bottom-label-h">Budget Range</span>
            <span className="pkg-bottom-value-h">
              ₹{budgetRange[0].toLocaleString('en-IN')} – ₹{budgetRange[1].toLocaleString('en-IN')}+
            </span>
          </div>
          <button className="su-btn-primary pkg-skip-btn-h" onClick={handleSkip}>
            Skip and Explore More →
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
  border-radius: 12px;
  object-fit: contain;
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
  backdrop-filter: blur(8px);
}

.gallery-arrow:hover {
  background: rgba(255,255,255,0.25);
}

.gallery-arrow-left {
  left: 20px;
}

.gallery-arrow-right {
  right: 20px;
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

.gallery-counter {
  position: absolute;
  bottom: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.pkg-page-h {
  width: 100%;
  padding-bottom: 90px;
}

.pkg-layout-h {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 24px;
  align-items: start;
  padding: 20px 24px;
}

/* ── Sidebar ── */
.pkg-sidebar-h {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;
}
.pkg-sidebar-card-h {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding: 18px 18px 20px;
}
.pkg-sidebar-header-h {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 14px;
}
.pkg-edit-btn-h, .pkg-clear-btn-h {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
}
.pkg-clear-btn-h {
  color: #ff9c2b;
}
.pkg-summary-item-h {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}
.pkg-summary-item-h:last-of-type { border-bottom: none; }
.pkg-summary-label-h {
  font-size: 11px;
  color: #999;
}
.pkg-summary-value-h {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}
.pkg-info-banner-h {
  margin-top: 12px;
  background: #fff7ea;
  border: 1px solid #ffe6bf;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 11.5px;
  line-height: 1.5;
  color: #8a6d3b;
}

.pkg-filter-group-h { margin-bottom: 18px; }
.pkg-filter-label-h {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}
.pkg-range-h {
  width: 100%;
  accent-color: #ff9c2b;
}
.pkg-range-labels-h {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
.pkg-range-selected-h {
  font-size: 11.5px;
  color: #666;
  margin-top: 6px;
  text-align: center;
}
.pkg-pill-row-h {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.pkg-pill-h {
  border: 1px solid #e2e2e2;
  background: #fff;
  border-radius: 20px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 500;
  color: #444;
  cursor: pointer;
  transition: all 0.15s;
}
.pkg-pill-h--active {
  background: #ff9c2b;
  border-color: #ff9c2b;
  color: #fff;
}
.pkg-apply-btn-h {
  width: 100%;
  margin-top: 4px;
}

/* ── Main ── */
.pkg-main-h { min-width: 0; }
.pkg-main-header-h {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.pkg-heading-h {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.01em;
  margin: 0;
}
.pkg-heading-accent-h { color: #ff9c2b; }
.pkg-subheading-h {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.pkg-list-h {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pkg-empty-state-h {
  padding: 60px 0;
  text-align: center;
  color: #aaa;
  font-size: 14px;
}

/* ── Card (horizontal) ── */
.pkg-card-h {
  display: grid;
  grid-template-columns: 280px 1fr 260px;
  gap: 20px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  animation: fadeSlideUp 0.4s ease both;
  transition: box-shadow 0.2s, transform 0.2s;
}
.pkg-card-h:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.pkg-gallery-h {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
}
.pkg-gallery-main-h {
  grid-row: 1 / 3;
  background: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}
.pkg-gallery-main-h img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pkg-gallery-side {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pkg-gallery-thumb {
  flex: 1;
  position: relative;
  background: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}
  .pkg-summary-edit-input-h {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  font-size: 12.5px;
  margin-top: 4px;
  font-family: inherit;
}
.pkg-gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pkg-gallery-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 11px;
  background: #f5f5f5;
}
.pkg-img-count-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.pkg-info-h {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.pkg-name-h {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 4px;
}
.pkg-category-h {
  font-size: 12px;
  color: #999;
  margin: 0 0 12px;
}
.pkg-meta-row-h {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
}
.pkg-meta-item-h {
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 4px;
}
.pkg-team-composition-h {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f2f2f2;
}
.pkg-team-label-h {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}
.pkg-team-avatars-h {
  display: flex;
}
.pkg-avatar-h {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e8eeff;
  color: #4a5adf;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  margin-left: -8px;
  overflow: hidden;
}
.pkg-avatar-h:first-child { margin-left: 0; }
.pkg-avatar-h img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.pkg-avatar-more-h {
  background: #f0f0f0;
  color: #888;
}
.pkg-member-count-h {
  display: block;
  font-size: 11.5px;
  color: #888;
  margin-top: 8px;
}

.pkg-price-h {
  display: flex;
  flex-direction: column;
  border-left: 1px solid #f2f2f2;
  padding-left: 18px;
}
.pkg-total-label-h {
  font-size: 11px;
  color: #999;
}
.pkg-total-value-h {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-top: 2px;
  margin-bottom: 12px;
}
.pkg-breakdown-h {
  background: #fafafa;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 14px;
}
.pkg-breakdown-title-h {
  display: block;
  font-size: 10.5px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.pkg-breakdown-row-h {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #444;
  padding: 2px 0;
}
.pkg-actions-h {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}
.pkg-actions-h .su-btn-primary,
.pkg-actions-h .su-btn-primary-outline {
  width: 100%;
  padding: 9px 12px;
  font-size: 13px;
  text-align: center;
}

/* ── Sticky bottom bar ── */
.pkg-bottom-bar-h {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 14px 28px;
  z-index: 30;
}
.pkg-bottom-section-h {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pkg-bottom-label-h {
  font-size: 10.5px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.pkg-bottom-value-h {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}
.pkg-skip-btn-h {
  margin-left: auto;
  white-space: nowrap;
  padding: 11px 22px;
}

/* ── Responsive ── */
@media (max-width: 1080px) {
  .pkg-card-h { grid-template-columns: 1fr; }
  .pkg-price-h { border-left: none; padding-left: 0; border-top: 1px solid #f2f2f2; padding-top: 14px; }
}
@media (max-width: 900px) {
  .pkg-layout-h { grid-template-columns: 1fr; }
  .pkg-sidebar-h { position: static; }
}
@media (max-width: 600px) {
  .pkg-layout-h { padding: 14px; }
  .pkg-gallery-h { height: 180px; }
  .pkg-bottom-bar-h { flex-wrap: wrap; gap: 12px; }
  .pkg-skip-btn-h { width: 100%; margin-left: 0; }
}
`;

export default packageSuggestion;