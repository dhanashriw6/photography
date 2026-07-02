import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../index.css';
import ViewsLayout from '../Layout';
import {
  FiSearch, FiCalendar, FiClock, FiMapPin, FiUsers, FiX,
  FiEdit2, FiHeart, FiStar, FiArrowRight, FiMove,
} from 'react-icons/fi';
import { draftOrder } from '../../services/order';
import { getServiceProviders,getServiceProviderDetails  } from '../../services/booking';
import { getCategory } from '../../services/common';
import { AddressAutocomplete } from '../joinAsPhotographer/signUp';

/* ── helpers ── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const decodeFilters = (encoded) => {
  try {
    return encoded ? JSON.parse(decodeURIComponent(escape(atob(encoded)))) : null;
  } catch { return null; }
};

// Extract "HH:MM" out of an ISO datetime string
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

// Format "HH:MM" -> "h:MM AM/PM"
const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  if (!h || !m) return timeStr;
  const hrs = parseInt(h, 10);
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 || 12;
  return `${displayHrs}:${m} ${ampm}`;
};

// Combine a "YYYY-MM-DD" date and "HH:MM" time into an ISO datetime
const buildDateTime = (date, time) => {
  if (!date || !time) return null;
  const dateTime = new Date(`${date}T${time}:00`);
  if (isNaN(dateTime.getTime())) {
    console.error('Invalid date/time:', date, time);
    return null;
  }
  return dateTime.toISOString();
};

// Reconstruct an address object (for AddressAutocomplete) out of a filters object
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

const SKILL_LABELS = {
  photographer: 'Photographer',
  videographer: 'Videographer',
  drone_operator: 'Drone Operator',
  cinematographer: 'Cinematographer',
  editor: 'Editor',
};
const SKILL_EMOJI = {
  photographer: '📷',
  videographer: '🎥',
  drone_operator: '🚁',
  cinematographer: '🎬',
  editor: '🎞️',
};
const SKILL_COLORS = {
  photographer: { bg: '#fce7f3', text: '#be185d' },
  videographer: { bg: '#fef3c7', text: '#b45309' },
  drone_operator: { bg: '#dbeafe', text: '#1d4ed8' },
  cinematographer: { bg: '#ede9fe', text: '#6d28d9' },
  editor: { bg: '#dcfce7', text: '#15803d' },
};

const ROLE_OPTIONS = ['photographer', 'cinematographer', 'drone_operator', 'editor', 'videographer'];

/* ── Avatar (initials fallback, no external network call) ── */
const Avatar = ({ name, src, size = 52 }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  if (src) {
    return <img src={src} alt={name} className="fb-avatar-img" style={{ width: size, height: size }} />;
  }
  return (
    <div className="fb-avatar-fallback" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials}
    </div>
  );
};

/* ── Stepper ── */
const STEPS = [
  { n: '01', label: 'Event Details', status: 'done' },
  { n: '02', label: 'Package Suggestion', status: 'done' },
  { n: '03', label: 'Customize Team', status: 'active' },
  { n: '04', label: 'Review & Confirm', status: 'upcoming' },
];
const Stepper = () => (
  <div className="fb-stepper">
    {STEPS.map((s, i) => (
      <React.Fragment key={s.n}>
        <div className="fb-step">
          <span className={`fb-step-dot fb-step-dot--${s.status}`}>
            {s.status === 'done' ? '✓' : s.n}
          </span>
          <span className={`fb-step-label fb-step-label--${s.status}`}>{s.label}</span>
        </div>
        {i < STEPS.length - 1 && <span className="fb-step-line" />}
      </React.Fragment>
    ))}
  </div>
);

/* ── Sidebar (view/edit toggle, mirrors PackageSuggestion sidebar) ── */
const Sidebar = ({
  eventTypeName,
  categories,
  activeFilters,
  summaryForm, setSummaryForm,
  search, setSearch,
  roleFilter, toggleRole,
  budgetRange, setBudgetRange,
  applying,
  editingFilters,
  onEditFilters,
  onApplyFilters,
  onResetFilters,
  onCancelFilters,
}) => (
  <aside className="fb-sidebar">
    <div className="fb-sidebar-card">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a1a' }}>Filters</span>
        {!editingFilters ? (
          <button
            onClick={onEditFilters}
            style={{ fontSize: '12px', color: '#ff9c2b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ✏️ Edit
          </button>
        ) : (
          <button
            onClick={onResetFilters}
            style={{ fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Reset All
          </button>
        )}
      </div>

      {!editingFilters ? (
        /* ── View Mode: read-only filter summary ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="fb-filter-summary-item">
            <span className="fb-filter-summary-label">Event Type</span>
            <span className="fb-filter-summary-value">{eventTypeName}</span>
          </div>
          <div className="fb-filter-summary-item">
            <span className="fb-filter-summary-label">Start Date & Time</span>
            <span className="fb-filter-summary-value">
              {fmtDate(activeFilters?.start_datetime)} at {formatTime(getTimeFromIso(activeFilters?.start_datetime))}
            </span>
          </div>
          <div className="fb-filter-summary-item">
            <span className="fb-filter-summary-label">End Date & Time</span>
            <span className="fb-filter-summary-value">
              {fmtDate(activeFilters?.end_datetime)} at {formatTime(getTimeFromIso(activeFilters?.end_datetime))}
            </span>
          </div>
          <div className="fb-filter-summary-item">
            <span className="fb-filter-summary-label">Location</span>
            <span
              className="fb-filter-summary-value"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              title={activeFilters?.address_line1 || activeFilters?.city || activeFilters?.state || '—'}
            >
              {activeFilters?.city || activeFilters?.state || activeFilters?.address_line1 || '—'}
            </span>
          </div>
          <div className="fb-filter-summary-item">
            <span className="fb-filter-summary-label">Search</span>
            <span className="fb-filter-summary-value">{search ? search : 'Any'}</span>
          </div>
          <div className="fb-filter-summary-item">
            <span className="fb-filter-summary-label">Roles</span>
            <span className="fb-filter-summary-value">
              {roleFilter.size === ROLE_OPTIONS.length
                ? 'All Roles'
                : roleFilter.size === 0
                  ? 'None Selected'
                  : [...roleFilter].map((r) => SKILL_LABELS[r]).join(', ')}
            </span>
          </div>
          <div className="fb-filter-summary-item">
            <span className="fb-filter-summary-label">Budget Range (per day)</span>
            <span className="fb-filter-summary-value">
              ₹{budgetRange[0].toLocaleString('en-IN')} – ₹{budgetRange[1].toLocaleString('en-IN')}{budgetRange[1] >= 25000 ? '+' : ''}
            </span>
          </div>

          <button className="fb-edit-filters-btn" onClick={onEditFilters}>
            ✏️ Edit Filters
          </button>
        </div>
      ) : (
        /* ── Edit Mode: the actual controls ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Event Type */}
          <div>
            <span className="fb-sidebar-title">Event Type</span>
            <select
              className="fb-edit-input"
              value={summaryForm.categoryId}
              onChange={(e) => setSummaryForm((f) => ({ ...f, categoryId: e.target.value }))}
            >
              <option value="">Select Event</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="fb-edit-grid">
            <div>
              <span className="fb-sidebar-title">Start Date</span>
              <input
                type="date"
                className="fb-edit-input"
                value={summaryForm.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSummaryForm((f) => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div>
              <span className="fb-sidebar-title">End Date</span>
              <input
                type="date"
                className="fb-edit-input"
                value={summaryForm.endDate}
                min={summaryForm.startDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setSummaryForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Times */}
          <div className="fb-edit-grid">
            <div>
              <span className="fb-sidebar-title">Start Time</span>
              <input
                type="time"
                className="fb-edit-input"
                value={summaryForm.startTime}
                onChange={(e) => setSummaryForm((f) => ({ ...f, startTime: e.target.value }))}
              />
            </div>
            <div>
              <span className="fb-sidebar-title">End Time</span>
              <input
                type="time"
                className="fb-edit-input"
                value={summaryForm.endTime}
                onChange={(e) => setSummaryForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <span className="fb-sidebar-title">Event Location</span>
            <AddressAutocomplete
              label="Event Location"
              value={summaryForm.address}
              onAddressSelect={(val) => setSummaryForm((f) => ({ ...f, address: val }))}
            />
          </div>

          {/* Search */}
          <div>
            <span className="fb-sidebar-title">Search Providers</span>
            <div className="fb-search-box">
              <FiSearch size={14} color="#aaa" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter by Role */}
          <div>
            <span className="fb-sidebar-title">Filter by Role</span>
            <div className="fb-role-list">
              {ROLE_OPTIONS.map((r) => (
                <label className="fb-role-check" key={r}>
                  <input type="checkbox" checked={roleFilter.has(r)} onChange={() => toggleRole(r)} />
                  {SKILL_LABELS[r]}
                </label>
              ))}
            </div>
          </div>

          {/* Budget Range – single max slider, same pattern as packageSuggestion */}
          <div>
            <span className="fb-sidebar-title">Budget Range (per day)</span>
            <input
              type="range"
              min={0}
              max={25000}
              step={500}
              value={budgetRange[1]}
              onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
              className="fb-range-single"
              style={{ width: '100%', accentColor: '#ff9c2b', marginBottom: '6px' }}
            />
            <div className="fb-range-labels">
              <span>₹0</span>
              <span>₹25,000+</span>
            </div>
            <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>
              Selected: ₹{budgetRange[0].toLocaleString('en-IN')} – ₹{budgetRange[1].toLocaleString('en-IN')}{budgetRange[1] >= 25000 ? '+' : ''}
            </div>
          </div>

          {/* Apply / Cancel buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              onClick={onApplyFilters}
              disabled={applying}
              style={{
                flex: 1,
                background: applying ? '#ffd08a' : '#ff9c2b',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '11px',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: applying ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {applying ? 'Applying…' : '⚙ Apply Filters'}
            </button>
            <button
              onClick={onCancelFilters}
              style={{
                flex: 1,
                background: '#fff',
                color: '#555',
                border: '1.5px solid #e5e7eb',
                borderRadius: '10px',
                padding: '11px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  </aside>
);

/* ── Selected team row (compact, horizontal) ── */
const SelectedTeamRow = ({ name, src, skill, price, days, isLead, location, onRemove, removeDisabled }) => (
  <div className="fb-team-row">
    <Avatar name={name} src={src} size={44} />
    <div className="fb-team-row-info">
      <div className="fb-team-row-name">{name}</div>
      <div className="fb-team-row-skill">{SKILL_LABELS[skill] || skill}</div>
      <div className="fb-team-row-loc"><FiMapPin size={11} /> {location}</div>
      {isLead && <span className="fb-lead-tag">⭐ Lead</span>}
    </div>
    <div className="fb-team-row-right">
      <div className="fb-team-row-price">₹{price?.toLocaleString('en-IN') ?? '—'} / day</div>
      <span className="fb-avail-badge">Available</span>
      <div className="fb-team-row-days">{days} Day{days !== 1 ? 's' : ''}</div>
    </div>
    {!removeDisabled && (
      <button className="fb-row-remove" onClick={onRemove}><FiX size={14} /></button>
    )}
  </div>
);

/* ── Provider card (unified visual for both modes) ── */
const ProviderCard = ({
  name, src, skill, city, state, rating, reviewCount, distanceKm,
  price, isSelected, isLoading, showReplace, isFavorite, onToggleFavorite,
  onAdd, onRemove, onReplace, onBookNow, durationType,onViewDetails
}) => {
  const colors = SKILL_COLORS[skill] || { bg: '#f3f4f6', text: '#374151' };
  return (
    <div className={`fb-card ${isSelected ? 'fb-card--selected' : ''}`}>
      <div className="fb-card-media">
        {src ? <img src={src} alt={name} /> : <div className="fb-card-media-fallback">{name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</div>}
        <span className="fb-card-chip" style={{ background: colors.bg, color: colors.text }}>
          {SKILL_LABELS[skill] || skill}
        </span>
        {/* <button
          className={`fb-card-heart ${isFavorite ? 'fb-card-heart--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        >
          <FiHeart size={14} fill={isFavorite ? '#ef4444' : 'none'} />
        </button> */}
      </div>

      <div className="fb-card-body">
        <h3 className="fb-card-name" style={{ cursor: 'pointer' }}
    onClick={onViewDetails}>{name}</h3>
        <div className="fb-card-loc"><FiMapPin size={11} /> {city}, {state}</div>

        <div className="fb-card-rating">
          {reviewCount > 0 ? (
            <><FiStar size={12} fill="#f5a623" color="#f5a623" /> {rating} <span className="fb-card-rating-count">({reviewCount})</span></>
          ) : (
            <span className="fb-card-new">New Provider</span>
          )}
          {distanceKm != null && <span className="fb-card-distance">· {distanceKm} km</span>}
        </div>

        <div className="fb-card-price-row">
          <span className="fb-card-price">₹{price != null ? price.toLocaleString('en-IN') : '—'}<span className="fb-card-price-unit">/{durationType || 'day'}</span></span>          <span className="fb-avail-badge">Available</span>
        </div>
      </div>

      <div className="fb-card-actions">
        {isSelected ? (
          <button className="fb-btn-secondary" style={{ flex: 1 }} onClick={onRemove}>Remove</button>
        ) : showReplace ? (
          <>
            <button className="fb-btn-secondary" style={{ flex: 1 }} onClick={onReplace}>Replace</button>
            <button className="fb-btn-primary" style={{ flex: 1 }} onClick={onAdd}>Add</button>
          </>
        ) : (
          <button className="fb-btn-primary" style={{ flex: 1 }} onClick={onAdd}>Add</button>
        )}
        {isSelected && (
          <button className="fb-btn-primary" style={{ flex: 1, opacity: isLoading ? 0.7 : 1 }} disabled={isLoading} onClick={onBookNow}>
            {isLoading ? '…' : 'Book'}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Main ── */
const FindBest = () => {
  const [search, setSearch] = useState('');
  const [loadingKey, setLoadingKey] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [restoring, setRestoring] = useState(false);
  const [applying, setApplying] = useState(false);
  const [categories, setCategories] = useState([]);

  const [manuallyAdded, setManuallyAdded] = useState(new Set());
  const [selected, setSelected] = useState(new Map());
  const [favorites, setFavorites] = useState(new Set());

  const [roleFilter, setRoleFilter] = useState(new Set(ROLE_OPTIONS));
  const [budgetRange, setBudgetRange] = useState([0, 25000]);
  const [availability, setAvailability] = useState('any'); // UI-only: no live data field yet

  // View/Edit toggle for the sidebar filters (mirrors PackageSuggestion sidebar)
  const [editingFilters, setEditingFilters] = useState(false);
  const filterSnapshotRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const filtersFromState = location.state?.filters ?? null;
  const filtersFromUrl = decodeFilters(searchParams.get('f'));
  const initialFilters = filtersFromState ?? filtersFromUrl;

  // The currently-applied filters (event type, dates, location, etc.)
  const [activeFilters, setActiveFilters] = useState(initialFilters);

  // Draft form used while editing in the sidebar
  const [summaryForm, setSummaryForm] = useState({
    categoryId: initialFilters?.category_id || '',
    startDate: initialFilters?.start_datetime ? initialFilters.start_datetime.split('T')[0] : (initialFilters?.date || ''),
    endDate: initialFilters?.end_datetime ? initialFilters.end_datetime.split('T')[0] : '',
    startTime: getTimeFromIso(initialFilters?.start_datetime),
    endTime: getTimeFromIso(initialFilters?.end_datetime),
    address: getInitialAddress(initialFilters),
  });

  const statePackage = location.state?.package ?? null;
  const pkgIdFromUrl = searchParams.get('pkgId');
  const packageId = statePackage?.id ?? location.state?.packageId ?? (pkgIdFromUrl ? Number(pkgIdFromUrl) : null);

  const isPackageMode = !!packageId;

  useEffect(() => {
    if (location.state?.providers?.length) {
      setProviders(location.state.providers);
      return;
    }
    if (!initialFilters) return;
    setRestoring(true);
    getServiceProviders({
      category_id: initialFilters.category_id,
      lat: initialFilters.lat,
      lng: initialFilters.lng,
      start_datetime: initialFilters.start_datetime,
      end_datetime: initialFilters.end_datetime,
    })
      .then((res) => setProviders(res?.data?.data || []))
      .catch(console.error)
      .finally(() => setRestoring(false));
  }, []);

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

  const handleEditFilters = () => {
    filterSnapshotRef.current = {
      search,
      roleFilter: new Set(roleFilter),
      budgetRange: [...budgetRange],
      summaryForm: { ...summaryForm, address: summaryForm.address ? { ...summaryForm.address } : null },
    };
    setEditingFilters(true);
  };

  const handleCancelFilters = () => {
    if (filterSnapshotRef.current) {
      setSearch(filterSnapshotRef.current.search);
      setRoleFilter(filterSnapshotRef.current.roleFilter);
      setBudgetRange(filterSnapshotRef.current.budgetRange);
      setSummaryForm(filterSnapshotRef.current.summaryForm);
    }
    setEditingFilters(false);
  };

  const handleApplyFilters = async () => {
    setApplying(true);
    try {
      const newStartDatetime = buildDateTime(summaryForm.startDate, summaryForm.startTime);
      const newEndDatetime = buildDateTime(summaryForm.endDate, summaryForm.endTime);

      const newFilters = {
        ...activeFilters,
        category_id: summaryForm.categoryId,
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
          : {}),
      };

      const selectedRoles = [...roleFilter];
      const response = await getServiceProviders({
        category_id: newFilters.category_id,
        lat: newFilters.lat,
        lng: newFilters.lng,
        start_datetime: newFilters.start_datetime,
        end_datetime: newFilters.end_datetime,
      });

      setProviders(response?.data?.data || []);
      setActiveFilters(newFilters);
      setEditingFilters(false);
    } catch (err) {
      console.error('handleApplyFilters failed:', err);
    } finally {
      setApplying(false);
    }
  };

  const handleResetFilters = () => {
    setBudgetRange([0, 25000]);
    setRoleFilter(new Set(ROLE_OPTIONS));
    setSearch('');
    setSummaryForm({
      categoryId: initialFilters?.category_id || '',
      startDate: initialFilters?.start_datetime ? initialFilters.start_datetime.split('T')[0] : (initialFilters?.date || ''),
      endDate: initialFilters?.end_datetime ? initialFilters.end_datetime.split('T')[0] : '',
      startTime: getTimeFromIso(initialFilters?.start_datetime),
      endTime: getTimeFromIso(initialFilters?.end_datetime),
      address: getInitialAddress(initialFilters),
    });
  };

  const toggleRole = (r) => {
    setRoleFilter((prev) => {
      const next = new Set(prev);
      next.has(r) ? next.delete(r) : next.add(r);
      return next;
    });
  };

  const buildAddress = (filters) => ({
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
  });

  const matchesSearch = (name) => name.toLowerCase().includes(search.toLowerCase());
  const matchesBudget = (unitPrice) => {
    if (unitPrice == null) return true;

    const max = budgetRange[1] >= 25000 ? Infinity : budgetRange[1];

    return unitPrice >= budgetRange[0] && unitPrice <= max;
  };

  /* ── Package mode ── */
  const packageProviderIds = new Set(
    statePackage?.team?.flatMap((tm) => tm.providers?.map((p) => p.id) || []) || []
  );
  const providerIdToBaseSkill = new Map(
    statePackage?.team?.flatMap((tm) => tm.providers?.map((p) => [p.id, tm.skill]) || []) || []
  );
  const allSelectedIds = new Set([...packageProviderIds, ...manuallyAdded]);

  const selectedProviders = providers.filter(
    (p) => allSelectedIds.has(p.id) && matchesSearch(`${p.first_name} ${p.last_name}`)
  );

  const otherProviders = providers.filter((p) => {
    if (allSelectedIds.has(p.id)) return false;
    const name = `${p.first_name} ${p.last_name}`;
    const primaryPkg = p.packages?.[0];
    return (
      matchesSearch(name) &&
      (p.skills || []).some((s) => roleFilter.has(s.skill)) &&
      matchesBudget(primaryPkg?.price_with_commission)
    );
  });

  const handleToggleAdd = (providerId) => {
    setManuallyAdded((prev) => {
      const next = new Set(prev);
      next.has(providerId) ? next.delete(providerId) : next.add(providerId);
      return next;
    });
  };

  const handleReplaceInPackage = (provider) => {
    const newSkill = provider.packages?.[0]?.skill;
    setManuallyAdded((prev) => {
      const next = new Set(prev);
      for (const id of prev) {
        const other = providers.find((pp) => pp.id === id);
        if (other?.packages?.[0]?.skill === newSkill) next.delete(id);
      }
      next.add(provider.id);
      return next;
    });
  };
const handleViewProvider = (providerId) => {
  navigate(`/service-provider/${providerId}`, { state: { filters: activeFilters } });
};
  const handleBookSingle = async (provider) => {
    const key = `${provider.id}-single`;
    try {
      setLoadingKey(key);
      const payload = {
        event_category_id: activeFilters?.category_id ?? null,
        start_at: activeFilters?.start_datetime ?? null,
        end_at: activeFilters?.end_datetime ?? null,
        address: buildAddress(activeFilters),
        service_providers: [{ service_provider_id: provider.id, skill: provider.skills?.[0]?.skill ?? 'photographer' }],
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', { state: { order: response?.data?.data, payload, person: provider, filters: activeFilters } });
    } catch (err) {
      console.error('draftOrder failed:', err);
    } finally {
      setLoadingKey(null);
    }
  };



  /* ── Category mode ── */
  const allRows = providers.flatMap((p) =>
    (p.packages?.length ? p.packages : [null]).map((pkg) => ({
      key: `${p.id}-${pkg?.skill ?? 'unknown'}`,
      provider: p,
      skill: pkg?.skill ?? p.skills?.[0]?.skill ?? 'photographer',
      pkg,
    }))
  );

  const selectedKeys = new Set(selected.keys());

  const selectedRows = allRows.filter(
    (r) => selectedKeys.has(r.key) && matchesSearch(`${r.provider.first_name} ${r.provider.last_name}`)
  );

  const unselectedRows = allRows.filter((r) => {
    if (selectedKeys.has(r.key)) return false;
    const name = `${r.provider.first_name} ${r.provider.last_name}`;
    return matchesSearch(name) && roleFilter.has(r.skill) && matchesBudget(r.pkg?.price_with_commission);
  });

  const handleToggleSelect = (row) => {
    setSelected((prev) => {
      const next = new Map(prev);
      next.has(row.key) ? next.delete(row.key) : next.set(row.key, row);
      return next;
    });
  };

  const handleReplaceInCategory = (row) => {
    setSelected((prev) => {
      const next = new Map(prev);
      for (const [k, v] of prev) {
        if (v.skill === row.skill && k !== row.key) next.delete(k);
      }
      next.set(row.key, row);
      return next;
    });
  };

  const handleBookNow = async (row) => {
    const key = row.key;
    try {
      setLoadingKey(key);
      const payload = {
        event_category_id: activeFilters?.category_id ?? null,
        start_at: activeFilters?.start_datetime ?? null,
        end_at: activeFilters?.end_datetime ?? null,
        address: buildAddress(activeFilters),
        service_providers: [{ service_provider_id: row.provider.id, skill: row.skill }],
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', { state: { order: response?.data?.data, payload, person: row.provider, skill: row.skill, filters: activeFilters } });
    } catch (err) {
      console.error('draftOrder failed:', err);
    } finally {
      setLoadingKey(null);
    }
  };

  // Package mode: continue with (possibly customized) package team
  const handleContinueWithPackageTeam = () => {
    if (selectedProviders.length === 0) return;
    const serviceProviders = selectedProviders.map((p) => {
      const isFromPackage = packageProviderIds.has(p.id);
      const skill =
        (isFromPackage ? providerIdToBaseSkill.get(p.id) : p.packages?.[0]?.skill) ??
        p.skills?.[0]?.skill ??
        'photographer';
      return { service_provider_id: p.id, skill };
    });
    console.log('serviceProviders', serviceProviders);
    navigate('/select-package', {
      state: {
        package: statePackage,
        packageId,
        filters: activeFilters,
        serviceProviders,
        teamProviders: selectedProviders,
      },
    });
  };

  // Category mode: continue with custom-built team
  const handleContinueWithCustomTeam = () => {
    if (selected.size === 0) return;
    const rows = [...selected.values()];
    const serviceProviders = rows.map((r) => ({
      service_provider_id: r.provider.id,
      skill: r.skill,
    }));
    console.log('rows', rows, 'serviceProviders', serviceProviders);
    navigate('/select-package', {
      state: {
        package: null,
        packageId: null,
        filters: activeFilters,
        serviceProviders,
        teamProviders: rows.map((r) => ({ ...r.provider, _bookedSkill: r.skill })),
      },
    });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const days = activeFilters?.start_datetime && activeFilters?.end_datetime
    ? Math.max(1, Math.round((new Date(activeFilters.end_datetime) - new Date(activeFilters.start_datetime)) / (1000 * 60 * 60 * 24)))
    : 1;

  const basePackagePrice = (statePackage?.team || []).reduce(
    (sum, t) => sum + (t.providers || []).reduce((s, p) => s + (p.price_with_commission || 0), 0), 0
  );
  const selectedTeamCost = isPackageMode
    ? selectedProviders.reduce((s, p) => s + (p.packages?.[0]?.price_with_commission || 0), 0)
    : selectedRows.reduce((s, r) => s + (r.pkg?.price_with_commission || 0), 0);

  const totalRows = isPackageMode
    ? selectedProviders.length + otherProviders.length
    : selectedRows.length + unselectedRows.length;

  const eventTypeName =
    categories.find((c) => String(c.id) === String(activeFilters?.category_id))?.name ||
    activeFilters?.category_name ||
    activeFilters?.category?.name ||
    '—';

  return (
    <ViewsLayout>
      <style>{STYLES}</style>
      <div className="fb-page">
        {/* <Stepper /> */}

        <h1 className="fb-heading">Build Your Custom Team</h1>
        <p className="fb-subheading">Handpick the best professionals for your event. You can replace or add providers to suit your needs.</p>

        <div className="fb-layout">
          <Sidebar
            eventTypeName={eventTypeName}
            categories={categories}
            activeFilters={activeFilters}
            summaryForm={summaryForm} setSummaryForm={setSummaryForm}
            search={search} setSearch={setSearch}
            roleFilter={roleFilter} toggleRole={toggleRole}
            budgetRange={budgetRange} setBudgetRange={setBudgetRange}
            applying={applying}
            editingFilters={editingFilters}
            onEditFilters={handleEditFilters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            onCancelFilters={handleCancelFilters}
          />

          <main className="fb-main">
            {restoring ? (
              <div className="fb-empty">⏳ Restoring your search…</div>
            ) : (
              <>
                {/* Selected team panel */}
                {(isPackageMode ? selectedProviders.length : selectedRows.length) > 0 && (
                  <div className="fb-selected-panel">
                    <div className="fb-selected-header">
                      <div>
                        <span className="fb-selected-title">
                          Selected Team ({isPackageMode ? selectedProviders.length : selectedRows.length})
                        </span>

                      </div>
                      <div className="fb-selected-cost">
                        <div className="fb-selected-cost-label">Total Team Cost</div>
                        <div className="fb-selected-cost-value">₹{selectedTeamCost.toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        className="fb-continue-btn"
                        onClick={isPackageMode ? handleContinueWithPackageTeam : handleContinueWithCustomTeam}
                      >
                        Continue with Team <FiArrowRight size={14} />
                      </button>
                    </div>

                    <div className="fb-selected-rows">
                      {isPackageMode
                        ? selectedProviders.map((p) => {
                          const isFromPackage = packageProviderIds.has(p.id);
                          const skill = isFromPackage ? providerIdToBaseSkill.get(p.id) : p.packages?.[0]?.skill;
                          const isLead = p.skills?.find((s) => s.skill === skill)?.is_primary;
                          return (
                            <SelectedTeamRow
                              key={p.id}
                              name={`${p.first_name} ${p.last_name}`}
                              src={p.profile_picture}
                              skill={skill}
                              price={p.packages?.[0]?.price_with_commission}
                              days={days}
                              isLead={isLead}
                              location={`${p.city}, ${p.state}`}
                              removeDisabled={isFromPackage}
                              onRemove={() => handleToggleAdd(p.id)}
                            />
                          );
                        })
                        : selectedRows.map((r) => {
                          const isLead = r.provider.skills?.find((s) => s.skill === r.skill)?.is_primary;
                          return (
                            <SelectedTeamRow
                              key={r.key}
                              name={`${r.provider.first_name} ${r.provider.last_name}`}
                              src={r.provider.profile_picture}
                              skill={r.skill}
                              price={r.pkg?.price_with_commission}
                              days={days}
                              isLead={isLead}
                              location={`${r.provider.city}, ${r.provider.state}`}
                              onRemove={() => handleToggleSelect(r)}
                            />
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Available providers */}
                <div className="fb-available-header">
                  <div>
                    <span className="fb-available-title">Available Providers</span>
                    <div className="fb-available-sub">{totalRows} provider{totalRows !== 1 ? 's' : ''} found</div>
                  </div>
                </div>

                {totalRows === 0 ? (
                  <div className="fb-empty">No providers found.</div>
                ) : (
                  <div className="fb-grid">
                    {isPackageMode
                      ? otherProviders.map((p) => {
                        const name = `${p.first_name} ${p.last_name}`;
                        const pkg = p.packages?.[0];
                        const skill = pkg?.skill ?? p.skills?.[0]?.skill;
                        const showReplace = selectedProviders.some(
                          (sp) => (sp.packages?.[0]?.skill) === skill
                        );
                        const isLoading = loadingKey === `${p.id}-single`;
                        return (
                          <ProviderCard
                            key={p.id}
                            name={name}
                            src={p.profile_picture}
                            skill={skill}
                            city={p.city} state={p.state}
                            rating={p.reviews?.avg_rating}
                            reviewCount={p.reviews?.count || 0}
                            distanceKm={p.distance_meters != null ? (p.distance_meters / 1000).toFixed(1) : null}
                            price={pkg?.price_with_commission}
                            durationType={pkg?.duration_type}
                            isSelected={false}
                            isLoading={isLoading}
                            showReplace={showReplace}
                            isFavorite={favorites.has(p.id)}
                            onToggleFavorite={() => toggleFavorite(p.id)}
                            onAdd={() => handleToggleAdd(p.id)}
                            onReplace={() => handleReplaceInPackage(p)}
                            onBookNow={() => handleBookSingle(p)}
                              onViewDetails={() => handleViewProvider(p.id)}

                          />
                        );
                      })
                      : unselectedRows.map((r) => {
                        const name = `${r.provider.first_name} ${r.provider.last_name}`;
                        const showReplace = selectedRows.some((sr) => sr.skill === r.skill);
                        const isLoading = loadingKey === r.key;
                        return (
                          <ProviderCard
                            key={r.key}
                            name={name}
                            src={r.provider.profile_picture}
                            skill={r.skill}
                            city={r.provider.city} state={r.provider.state}
                            rating={r.provider.reviews?.avg_rating}
                            reviewCount={r.provider.reviews?.count || 0}
                            distanceKm={r.provider.distance_meters != null ? (r.provider.distance_meters / 1000).toFixed(1) : null}
                            price={r.pkg?.price_with_commission}
                            isSelected={false}
                            durationType={r.pkg?.duration_type}
                            isLoading={isLoading}
                            showReplace={showReplace}
                            isFavorite={favorites.has(r.key)}
                            onToggleFavorite={() => toggleFavorite(r.key)}
                            onAdd={() => handleToggleSelect(r)}
                            onReplace={() => handleReplaceInCategory(r)}
                            onBookNow={() => handleBookNow(r)}
                            onViewDetails={() => handleViewProvider(r.provider.id)}
                          />
                        );
                      })}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </ViewsLayout>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
.fb-page { width: 100%; max-width: 1500px; margin: 0 auto; padding: 24px; }

/* Stepper */
.fb-stepper { display: flex; align-items: center; gap: 14px; padding-bottom: 24px; border-bottom: 1px solid #f0f0f0; margin-bottom: 24px; }
.fb-step { display: flex; align-items: center; gap: 10px; }
.fb-step-dot { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.fb-step-dot--done { background: #ff9c2b; color: #fff; }
.fb-step-dot--active { background: #fff; border: 2.5px solid #ff9c2b; color: #ff9c2b; }
.fb-step-dot--upcoming { background: #f3f4f6; color: #bbb; border: 2px solid #f3f4f6; }
.fb-step-label { font-size: 13px; font-weight: 600; }
.fb-step-label--done { color: #1a1a1a; }
.fb-step-label--active { color: #1a1a1a; font-weight: 700; }
.fb-step-label--upcoming { color: #bbb; }
.fb-step-line { flex: 1; height: 1px; background: #f0d9b8; min-width: 30px; max-width: 90px; }

.fb-heading { font-size: 26px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px; letter-spacing: -0.01em; }
.fb-subheading { font-size: 13.5px; color: #888; margin: 0 0 20px; }

/* Event bar */
.fb-event-bar { display: flex; align-items: center; gap: 28px; background: #fafafa; border: 1px solid #f0f0f0; border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; flex-wrap: wrap; }
.fb-event-item { display: flex; align-items: center; gap: 10px; }
.fb-event-icon { color: #999; }
.fb-event-label { font-size: 11px; color: #999; }
.fb-event-value { font-size: 13px; font-weight: 700; color: #1a1a1a; }
.fb-edit-btn { margin-left: auto; display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: #1a1a1a; cursor: pointer; }

/* Layout */
.fb-layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
.fb-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 20px; }
.fb-sidebar-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; padding: 18px; max-height: calc(100vh - 40px); overflow-y: auto; }
.fb-sidebar-title { display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px; }
.fb-search-box { display: flex; align-items: center; gap: 8px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 9px 12px; }
.fb-search-box input { border: none; outline: none; font-size: 13px; flex: 1; background: transparent; }

.fb-role-list { display: flex; flex-direction: column; gap: 9px; }
.fb-role-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151; cursor: pointer; }
.fb-role-check input { accent-color: #ff9c2b; width: 15px; height: 15px; }

.fb-range-wrap { position: relative; height: 24px; margin-bottom: 6px; }
.fb-range { position: absolute; width: 100%; top: 8px; accent-color: #ff9c2b; pointer-events: none; -webkit-appearance: none; background: transparent; }
.fb-range::-webkit-slider-thumb { pointer-events: auto; -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #ff9c2b; cursor: pointer; }
.fb-range::-moz-range-thumb { pointer-events: auto; width: 16px; height: 16px; border-radius: 50%; background: #ff9c2b; cursor: pointer; border: none; }
.fb-range-labels { display: flex; justify-content: space-between; font-size: 11px; color: #999; }

.fb-pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
.fb-pill { border: 1px solid #e2e2e2; background: #fff; border-radius: 20px; padding: 6px 13px; font-size: 12px; font-weight: 500; color: #444; cursor: pointer; }
.fb-pill--active { background: #fff7ea; border-color: #ff9c2b; color: #ff9c2b; font-weight: 700; }

/* Edit-mode inputs */
.fb-edit-input {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  font-size: 12.5px;
  font-family: inherit;
  background: #fff;
  color: #1a1a1a;
}
.fb-edit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* Filter summary (view mode) */
.fb-filter-summary-item { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
.fb-filter-summary-item:last-of-type { border-bottom: none; }
.fb-filter-summary-label { font-size: 11px; color: #999; }
.fb-filter-summary-value { font-size: 13px; font-weight: 600; color: #1a1a1a; word-break: break-word; }
.fb-edit-filters-btn {
  width: 100%;
  margin-top: 10px;
  background: #fff;
  color: #ff9c2b;
  border: 1.5px solid #ff9c2b;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.fb-edit-filters-btn:hover { background: #fff7ea; }

.fb-summary-card { background: #fffaf2; border-color: #fde8c8; }
.fb-summary-header { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
.fb-summary-badge { font-size: 10px; font-weight: 700; background: #ede9fe; color: #6d28d9; padding: 2px 8px; border-radius: 20px; }
.fb-summary-row { display: flex; justify-content: space-between; font-size: 12.5px; color: #555; padding: 5px 0; }
.fb-summary-total { display: flex; justify-content: space-between; font-size: 15px; font-weight: 700; color: #1a1a1a; padding-top: 10px; margin-top: 6px; border-top: 1px solid #f0e0c0; }
.fb-summary-note { font-size: 10.5px; color: #aaa; margin-top: 2px; }

/* Main */
.fb-main { min-width: 0; }
.fb-empty { text-align: center; padding: 60px 0; color: #aaa; font-size: 14px; }

/* Selected team panel */
.fb-selected-panel { background: #fff; border: 1px solid #f0f0f0; border-radius: 18px; padding: 20px; margin-bottom: 28px; }
.fb-selected-header { display: flex; align-items: center; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
.fb-selected-title { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.fb-selected-sub { font-size: 12px; color: #999; margin-top: 2px; }
.fb-selected-cost { margin-left: auto; text-align: right; }
.fb-selected-cost-label { font-size: 11px; color: #999; }
.fb-selected-cost-value { font-size: 18px; font-weight: 700; color: #1a1a1a; }
.fb-continue-btn { display: flex; align-items: center; gap: 6px; background: #ff9c2b; color: #fff; border: none; border-radius: 10px; padding: 11px 20px; font-size: 13.5px; font-weight: 700; cursor: pointer; }
.fb-continue-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.fb-selected-rows { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.fb-team-row { display: flex; align-items: center; gap: 12px; border: 1px solid #f0f0f0; border-radius: 12px; padding: 12px; position: relative; }
.fb-drag-handle { color: #ccc; cursor: grab; }
.fb-team-row-info { min-width: 0; flex: 1; }
.fb-team-row-name { font-size: 13.5px; font-weight: 700; color: #1a1a1a; }
.fb-team-row-skill { font-size: 11.5px; color: #888; }
.fb-team-row-loc { font-size: 11px; color: #aaa; display: flex; align-items: center; gap: 3px; margin-top: 2px; }
.fb-lead-tag { display: inline-block; margin-top: 4px; font-size: 10.5px; font-weight: 700; color: #b45309; }
.fb-team-row-right { text-align: right; flex-shrink: 0; }
.fb-team-row-price { font-size: 13px; font-weight: 700; color: #1a1a1a; }
.fb-team-row-days { font-size: 11px; color: #999; margin-top: 4px; }
.fb-row-remove { position: absolute; top: -7px; right: -7px; width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 1px solid #eee; color: #999; display: flex; align-items: center; justify-content: center; cursor: pointer; }

.fb-avail-badge { display: inline-block; font-size: 10px; font-weight: 700; color: #15803d; background: #dcfce7; padding: 2px 8px; border-radius: 20px; margin: 4px 0; }

/* Available header */
.fb-available-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.fb-available-title { font-size: 16px; font-weight: 700; color: #1a1a1a; }
.fb-available-sub { font-size: 12px; color: #999; margin-top: 2px; }

/* Provider grid + card */
.fb-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
.fb-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; transition: transform .2s, box-shadow .2s; }
.fb-card:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,0,0,0.1); }
.fb-card--selected { outline: 2px solid #ff9c2b; }
.fb-card-media { position: relative; width: 100%; aspect-ratio: 4/3; background: #f3f4f6; }
.fb-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.fb-card-media-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; color: #aaa; background: #f3f4f6; }
.fb-card-chip { position: absolute; top: 10px; left: 10px; font-size: 10.5px; font-weight: 700; padding: 4px 9px; border-radius: 7px; }
.fb-card-heart { position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border-radius: 50%; background: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #999; }
.fb-card-heart--active { color: #ef4444; }

.fb-card-body { padding: 14px; flex: 1; }
.fb-card-name { font-size: 14.5px; font-weight: 700; color: #111; margin: 0 0 3px; }
.fb-card-loc { font-size: 11.5px; color: #999; display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.fb-card-rating { font-size: 12px; color: #555; display: flex; align-items: center; gap: 4px; margin-bottom: 10px; }
.fb-card-rating-count { color: #aaa; }
.fb-card-new { color: #aaa; }
.fb-card-distance { color: #aaa; }
.fb-card-price-row { display: flex; align-items: center; justify-content: space-between; }
.fb-card-price { font-size: 18px; font-weight: 800; color: #111; }
.fb-card-price-unit { font-size: 11px; font-weight: 500; color: #999; margin-left: 2px; }

.fb-card-actions { display: flex; gap: 8px; padding: 0 14px 14px; }
.fb-btn-primary { background: #ff9c2b; color: #fff; border: none; border-radius: 8px; padding: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.fb-btn-secondary { background: #f9fafb; color: #6b7280; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 9px; font-size: 12.5px; font-weight: 600; cursor: pointer; }

.fb-avatar-img { border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.fb-avatar-fallback { border-radius: 50%; background: #f3f4f6; color: #888; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

@media (max-width: 980px) {
  .fb-layout { grid-template-columns: 1fr; }
  .fb-sidebar { position: static; }
  .fb-sidebar-card { max-height: none; }
}
@media (max-width: 600px) {
  .fb-event-bar { flex-direction: column; align-items: flex-start; }
  .fb-edit-btn { margin-left: 0; }
  .fb-edit-grid { grid-template-columns: 1fr; }
}
`;

export default FindBest;