import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../index.css';
import ViewsLayout from '../Layout';
import {
  FiSearch, FiCalendar, FiClock, FiMapPin, FiUsers, FiX,
  FiEdit2, FiHeart, FiStar, FiArrowRight, FiMove,
} from 'react-icons/fi';
import { draftOrder } from '../../services/order';

/* ── helpers ── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const decodeFilters = (encoded) => {
  try {
    return encoded ? JSON.parse(decodeURIComponent(escape(atob(encoded)))) : null;
  } catch { return null; }
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

/* ── Event details bar ── */
const EventDetailsBar = ({ filters, navigate }) => {
  const days = filters?.start_datetime && filters?.end_datetime
    ? Math.max(1, Math.round((new Date(filters.end_datetime) - new Date(filters.start_datetime)) / (1000 * 60 * 60 * 24)))
    : null;

  const items = [
    { icon: <FiUsers size={15} />, label: 'Event Type', value: filters?.category_name || filters?.category?.name || '—' },
    { icon: <FiCalendar size={15} />, label: 'Date', value: filters?.start_datetime ? `${fmtDate(filters.start_datetime)}${filters?.end_datetime ? ` – ${fmtDate(filters.end_datetime)}` : ''}` : '—' },
    { icon: <FiMapPin size={15} />, label: 'Location', value: filters?.city ? `${filters.city}, ${filters.state || ''}` : (filters?.state || '—') },
    { icon: <FiClock size={15} />, label: 'Duration', value: days ? `${days} Day${days > 1 ? 's' : ''}` : '—' },
    { icon: <FiUsers size={15} />, label: 'Guests (Est.)', value: filters?.guests_min && filters?.guests_max ? `${filters.guests_min} – ${filters.guests_max}` : '—' },
  ];

  return (
    <div className="fb-event-bar">
      {items.map((it) => (
        <div className="fb-event-item" key={it.label}>
          <span className="fb-event-icon">{it.icon}</span>
          <div>
            <div className="fb-event-label">{it.label}</div>
            <div className="fb-event-value">{it.value}</div>
          </div>
        </div>
      ))}
      <button className="fb-edit-btn" onClick={() => navigate(-1)}>
        <FiEdit2 size={13} /> Edit Event Details
      </button>
    </div>
  );
};

/* ── Sidebar ── */
const Sidebar = ({
  search, setSearch,
  roleFilter, toggleRole,
  budgetRange, setBudgetRange,
  availability, setAvailability,
  isPackageMode, basePackagePrice, selectedTeamCost,
}) => (
  <aside className="fb-sidebar">
    <div className="fb-sidebar-card">
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

      <span className="fb-sidebar-title" style={{ marginTop: 18 }}>Filter by Role</span>
      <div className="fb-role-list">
        {ROLE_OPTIONS.map((r) => (
          <label className="fb-role-check" key={r}>
            <input type="checkbox" checked={roleFilter.has(r)} onChange={() => toggleRole(r)} />
            {SKILL_LABELS[r]}
          </label>
        ))}
      </div>

      <span className="fb-sidebar-title" style={{ marginTop: 18 }}>Budget Range (per day)</span>
      <div className="fb-range-wrap">
        <input
          type="range" min={0} max={25000} step={500}
          value={budgetRange[0]}
          onChange={(e) => setBudgetRange([Math.min(Number(e.target.value), budgetRange[1]), budgetRange[1]])}
          className="fb-range fb-range--min"
        />
        <input
          type="range" min={0} max={25000} step={500}
          value={budgetRange[1]}
          onChange={(e) => setBudgetRange([budgetRange[0], Math.max(Number(e.target.value), budgetRange[0])])}
          className="fb-range fb-range--max"
        />
      </div>
      <div className="fb-range-labels">
        <span>₹{budgetRange[0].toLocaleString('en-IN')}</span>
        <span>₹{budgetRange[1].toLocaleString('en-IN')}{budgetRange[1] >= 25000 ? '+' : ''}</span>
      </div>

      <span className="fb-sidebar-title" style={{ marginTop: 18 }}>Availability</span>
      <div className="fb-pill-row">
        {['any', 'available', 'limited', 'unavailable'].map((a) => (
          <button
            key={a}
            className={`fb-pill ${availability === a ? 'fb-pill--active' : ''}`}
            onClick={() => setAvailability(a)}
            title={a !== 'any' ? "Not yet wired to live availability data" : undefined}
          >
            {a === 'any' ? 'Any' : a.charAt(0).toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>
    </div>

    {/* {isPackageMode && (
      <div className="fb-sidebar-card fb-summary-card">
        <div className="fb-summary-header">
          Package Summary
          <span className="fb-summary-badge">Package #1</span>
        </div>
        <div className="fb-summary-row">
          <span>Base Package Price</span>
          <span>₹{basePackagePrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="fb-summary-row">
          <span>Selected Team</span>
          <span>₹{selectedTeamCost.toLocaleString('en-IN')}</span>
        </div>
        <div className="fb-summary-total">
          <span>Total Team Cost</span>
          <span>₹{(basePackagePrice + selectedTeamCost).toLocaleString('en-IN')}</span>
        </div>
        <div className="fb-summary-note">(Inclusive of all days)</div>
      </div>
    )} */}
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
  onAdd, onRemove, onReplace, onBookNow,
}) => {
  const colors = SKILL_COLORS[skill] || { bg: '#f3f4f6', text: '#374151' };
  return (
    <div className={`fb-card ${isSelected ? 'fb-card--selected' : ''}`}>
      <div className="fb-card-media">
        {src ? <img src={src} alt={name} /> : <div className="fb-card-media-fallback">{name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</div>}
        <span className="fb-card-chip" style={{ background: colors.bg, color: colors.text }}>
          {SKILL_LABELS[skill] || skill}
        </span>
        <button
          className={`fb-card-heart ${isFavorite ? 'fb-card-heart--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        >
          <FiHeart size={14} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="fb-card-body">
        <h3 className="fb-card-name">{name}</h3>
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
          <span className="fb-card-price">₹{price != null ? price.toLocaleString('en-IN') : '—'}<span className="fb-card-price-unit">/day</span></span>
          <span className="fb-avail-badge">Available</span>
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

  const [manuallyAdded, setManuallyAdded] = useState(new Set());
  const [selected, setSelected] = useState(new Map());
  const [favorites, setFavorites] = useState(new Set());

  const [roleFilter, setRoleFilter] = useState(new Set(ROLE_OPTIONS));
  const [budgetRange, setBudgetRange] = useState([0, 25000]);
  const [availability, setAvailability] = useState('any'); // UI-only: no live data field yet

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const filtersFromState = location.state?.filters ?? null;
  const filtersFromUrl = decodeFilters(searchParams.get('f'));
  const filters = filtersFromState ?? filtersFromUrl;

  const statePackage = location.state?.package ?? null;
  const pkgIdFromUrl = searchParams.get('pkgId');
  const packageId = statePackage?.id ?? location.state?.packageId ?? (pkgIdFromUrl ? Number(pkgIdFromUrl) : null);

  const isPackageMode = !!packageId;

  useEffect(() => {
    if (location.state?.providers?.length) {
      setProviders(location.state.providers);
      return;
    }
    if (!filters) return;
    setRestoring(true);
    const { getServiceProviders } = require('../../services/booking');
    getServiceProviders({
      category_id: filters.category_id,
      lat: filters.lat,
      lng: filters.lng,
      start_datetime: filters.start_datetime,
      end_datetime: filters.end_datetime,
    })
      .then((res) => setProviders(res?.data?.data || []))
      .catch(console.error)
      .finally(() => setRestoring(false));
  }, []);

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
  const matchesBudget = (unitPrice) => unitPrice == null ? true : (unitPrice >= budgetRange[0] && unitPrice <= budgetRange[1]);

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
      matchesBudget(primaryPkg?.unit_price)
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

  const handleBookSingle = async (provider) => {
    const key = `${provider.id}-single`;
    try {
      setLoadingKey(key);
      const payload = {
        event_category_id: filters?.category_id ?? null,
        start_at: filters?.start_datetime ?? null,
        end_at: filters?.end_datetime ?? null,
        address: buildAddress(filters),
        service_providers: [{ service_provider_id: provider.id, skill: provider.skills?.[0]?.skill ?? 'photographer' }],
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', { state: { order: response?.data?.data, payload, person: provider, filters } });
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
    return matchesSearch(name) && roleFilter.has(r.skill) && matchesBudget(r.pkg?.unit_price);
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
        event_category_id: filters?.category_id ?? null,
        start_at: filters?.start_datetime ?? null,
        end_at: filters?.end_datetime ?? null,
        address: buildAddress(filters),
        service_providers: [{ service_provider_id: row.provider.id, skill: row.skill }],
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', { state: { order: response?.data?.data, payload, person: row.provider, skill: row.skill, filters } });
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
        filters,
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
        filters,
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

  const days = filters?.start_datetime && filters?.end_datetime
    ? Math.max(1, Math.round((new Date(filters.end_datetime) - new Date(filters.start_datetime)) / (1000 * 60 * 60 * 24)))
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

  return (
    <ViewsLayout>
      <style>{STYLES}</style>
      <div className="fb-page">
        {/* <Stepper /> */}

        <h1 className="fb-heading">Build Your Custom Team</h1>
        <p className="fb-subheading">Handpick the best professionals for your event. You can replace or add providers to suit your needs.</p>

        <EventDetailsBar filters={filters} navigate={navigate} />

        <div className="fb-layout">
          <Sidebar
            search={search} setSearch={setSearch}
            roleFilter={roleFilter} toggleRole={toggleRole}
            budgetRange={budgetRange} setBudgetRange={setBudgetRange}
            availability={availability} setAvailability={setAvailability}
            isPackageMode={isPackageMode}
            basePackagePrice={basePackagePrice}
            selectedTeamCost={selectedTeamCost}
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
                            isSelected={false}
                            isLoading={isLoading}
                            showReplace={showReplace}
                            isFavorite={favorites.has(p.id)}
                            onToggleFavorite={() => toggleFavorite(p.id)}
                            onAdd={() => handleToggleAdd(p.id)}
                            onReplace={() => handleReplaceInPackage(p)}
                            onBookNow={() => handleBookSingle(p)}
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
                            isLoading={isLoading}
                            showReplace={showReplace}
                            isFavorite={favorites.has(r.key)}
                            onToggleFavorite={() => toggleFavorite(r.key)}
                            onAdd={() => handleToggleSelect(r)}
                            onReplace={() => handleReplaceInCategory(r)}
                            onBookNow={() => handleBookNow(r)}
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
.fb-layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start; }
.fb-sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 20px; }
.fb-sidebar-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; padding: 18px; }
.fb-sidebar-title { display: block; font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
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
}
@media (max-width: 600px) {
  .fb-event-bar { flex-direction: column; align-items: flex-start; }
  .fb-edit-btn { margin-left: 0; }
}
`;

export default FindBest;