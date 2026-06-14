import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import '../index.css';
import ViewsLayout from '../Layout';
import { FiSearch, FiSliders, FiCalendar, FiClock, FiMapPin, FiTag, FiUserCheck, FiUsers, FiX } from 'react-icons/fi';
import { draftOrder } from '../../services/order';

/* ── helpers ── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const fmtTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};
const decodeFilters = (encoded) => {
  try {
    return encoded ? JSON.parse(decodeURIComponent(escape(atob(encoded)))) : null;
  } catch { return null; }
};

const SKILL_LABELS = {
  photographer:    'Photographer',
  videographer:    'Videographer',
  drone_operator:  'Drone Operator',
  cinematographer: 'Cinematographer',
};
const SKILL_EMOJI = {
  photographer:    '📷',
  videographer:    '🎥',
  drone_operator:  '🚁',
  cinematographer: '🎬',
};

/* ── Filter Summary ── */
const FilterSummary = ({ filters }) => {
  if (!filters) return null;
  const items = [
    filters.category_id && {
      icon: <FiTag size={13} />,
      label: 'Category',
      value: `#${filters.category_id}`,
      color: { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9', icon: '#8b5cf6' },
    },
    filters.start_datetime && {
      icon: <FiCalendar size={13} />,
      label: 'Start',
      value: `${fmtDate(filters.start_datetime)}, ${fmtTime(filters.start_datetime)}`,
      color: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', icon: '#3b82f6' },
    },
    filters.end_datetime && {
      icon: <FiClock size={13} />,
      label: 'End',
      value: `${fmtDate(filters.end_datetime)}, ${fmtTime(filters.end_datetime)}`,
      color: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', icon: '#22c55e' },
    },
    (filters.lat && filters.lng) && {
      icon: <FiMapPin size={13} />,
      label: 'Location',
      value: filters.city
        ? `${filters.city}, ${filters.state || ''}`
        : `${filters.lat?.toFixed(4)}, ${filters.lng?.toFixed(4)}`,
      color: { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', icon: '#f97316' },
    },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
        Your event filters
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: item.color.bg, border: `1px solid ${item.color.border}`,
            borderRadius: '10px', padding: '10px 12px',
          }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: item.color.icon, flexShrink: 0, boxShadow: `0 0 0 1px ${item.color.border}`,
            }}>
              {item.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: item.color.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '13px', color: '#111', fontWeight: 500, marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main ── */
const FindBest = () => {
  const [search, setSearch]           = useState('');
  const [loadingKey, setLoadingKey]   = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [providers, setProviders]     = useState([]);
  const [restoring, setRestoring]     = useState(false);

  // ── Package mode: track manually added provider IDs ──
  const [manuallyAdded, setManuallyAdded] = useState(new Set());

  // ── Category mode: track selected "providerId-skill" keys ──
  const [selected, setSelected] = useState(new Map());

  const location       = useLocation();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  const filtersFromState = location.state?.filters ?? null;
  const filtersFromUrl   = decodeFilters(searchParams.get('f'));
  const filters          = filtersFromState ?? filtersFromUrl;

  const statePackage = location.state?.package ?? null;
  const pkgIdFromUrl = searchParams.get('pkgId');
  const packageId    = statePackage?.id ?? location.state?.packageId ?? (pkgIdFromUrl ? Number(pkgIdFromUrl) : null);

  // ── Which mode are we in? ──
  const isPackageMode = !!packageId;

  /* ── Restore providers on refresh ── */
  useEffect(() => {
    if (location.state?.providers?.length) {
      setProviders(location.state.providers);
      return;
    }
    if (!filters) return;
    setRestoring(true);
    const { getServiceProviders } = require('../../services/booking');
    getServiceProviders({
      category_id:    filters.category_id,
      lat:            filters.lat,
      lng:            filters.lng,
      start_datetime: filters.start_datetime,
      end_datetime:   filters.end_datetime,
    })
      .then((res) => setProviders(res?.data?.data || []))
      .catch(console.error)
      .finally(() => setRestoring(false));
  }, []);

  /* ── Build address ── */
  const buildAddress = (filters) => ({
    lat:           filters?.lat           ?? null,
    lng:           filters?.lng           ?? null,
    place_id:      filters?.place_id      || undefined,
    address_line1: filters?.address_line1 || undefined,
    address_line2: filters?.address_line2 || undefined,
    address_line3: filters?.address_line3 || undefined,
    city:          filters?.city          || undefined,
    state:         filters?.state         || undefined,
    state_code:    filters?.state_code    || undefined,
    country:       filters?.country       || undefined,
    country_code:  filters?.country_code  || undefined,
    postal_code:   filters?.postal_code   || undefined,
    timezone:      filters?.timezone      || undefined,
  });

  /* ════════════════════════════════════════════
     PACKAGE MODE
  ════════════════════════════════════════════ */

  const packageProviderIds = new Set(
    statePackage?.team?.flatMap((tm) => tm.providers?.map((p) => p.id) || []) || []
  );
  const allSelectedIds    = new Set([...packageProviderIds, ...manuallyAdded]);

  const filteredProviders = providers.filter((p) =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectedProviders = filteredProviders.filter((p) => allSelectedIds.has(p.id));
  const otherProviders    = filteredProviders.filter((p) => !allSelectedIds.has(p.id));

  const handleToggleAdd = (e, providerId) => {
    e.stopPropagation();
    setManuallyAdded((prev) => {
      const next = new Set(prev);
      next.has(providerId) ? next.delete(providerId) : next.add(providerId);
      return next;
    });
  };

  // Single book in package mode
  const handleBookSingle = async (e, provider) => {
    e.stopPropagation();
    const key = `${provider.id}-single`;
    try {
      setLoadingKey(key);
      const payload = {
        event_category_id: filters?.category_id ?? null,
        start_at:          filters?.start_datetime ?? null,
        end_at:            filters?.end_datetime   ?? null,
        address:           buildAddress(filters),
        service_providers: [{
          service_provider_id: provider.id,
          skill: provider.skills?.[0]?.skill ?? 'photographer',
        }],
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', {
        state: { order: response?.data?.data, payload, person: provider, filters },
      });
    } catch (err) {
      console.error('draftOrder failed:', err);
    } finally {
      setLoadingKey(null);
    }
  };

  // Book all selected (package mode)
  const handleBookPackage = async () => {
    if (selectedProviders.length === 0) return;
    try {
      setBulkLoading(true);
      const payload = {
        event_package_id:  packageId,
        start_at:          filters?.start_datetime ?? null,
        end_at:            filters?.end_datetime   ?? null,
        address:           buildAddress(filters),
        service_providers: selectedProviders.map((p) => ({
          service_provider_id: p.id,
          skill: p.skills?.[0]?.skill ?? 'photographer',
        })),
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', {
        state: {
          order:     response?.data?.data,
          payload,
          providers: selectedProviders,
          packageId,
          filters,
        },
      });
    } catch (err) {
      console.error('draftOrder (package) failed:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const renderPackageCard = (p, isSelected = false) => {
    const name          = `${p.first_name} ${p.last_name}`;
    const rating        = p.reviews?.avg_rating;
    const reviewCount   = p.reviews?.count || 0;
    const skills        = p.skills?.map((s) => s.skill.charAt(0).toUpperCase() + s.skill.slice(1)).join(' · ') || '—';
    const pkg           = p.packages?.[0];
    const price         = pkg?.price_with_commission;
    const isFromPackage = packageProviderIds.has(p.id);
    const isLoading     = loadingKey === `${p.id}-single`;

    return (
      <div key={p.id} style={{
        background: '#fff', borderRadius: '18px', padding: '18px',
        border: isSelected ? '2px solid #6366f1' : '1px solid #ececec',
        boxShadow: isSelected ? '0 6px 20px rgba(99,102,241,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all .2s ease', position: 'relative',
      }}>
        {isSelected && (
          <div style={{
            position: 'absolute', top: '-11px', left: '18px',
            background: isFromPackage
              ? 'linear-gradient(135deg,#6366f1,#4f46e5)'
              : 'linear-gradient(135deg,#10b981,#059669)',
            color: '#fff', fontSize: '10px', fontWeight: 700,
            padding: '3px 10px', borderRadius: '20px',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            {isFromPackage ? '✓ Pre-selected' : '✓ Added'}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <img
              src={p.profile_picture || `https://ui-avatars.com/api/?name=${p.first_name}+${p.last_name}`}
              alt={name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{name}</h3>
              <p style={{ margin: '3px 0', color: '#666', fontSize: '13px' }}>{skills}</p>
              <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>📍 {p.city}, {p.state}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111' }}>
              {price != null ? `₹${price.toLocaleString()}` : '—'}
            </div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>Final Price</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          <div className="provider-chip">{pkg?.category?.name}</div>
          <div className="provider-chip">{pkg?.duration_value} {pkg?.duration_type}</div>
          <div className="provider-chip">{(p.distance_meters / 1000).toFixed(1)} km away</div>
        </div>

        <div style={{ marginTop: '14px', borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Unit Price',  value: `₹${pkg?.unit_price}` },
            { label: 'Total Price', value: `₹${pkg?.total_price}` },
            { label: 'Commission',  value: `₹${pkg?.commission_amount}` },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: '11px', color: '#aaa' }}>{item.label}</div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div style={{ fontSize: '13px' }}>
            {reviewCount > 0
              ? <>⭐ {rating} <span style={{ color: '#aaa' }}>({reviewCount} reviews)</span></>
              : <span style={{ color: '#aaa' }}>New Provider</span>}
          </div>
          {isSelected ? (
            <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => handleToggleAdd(e, p.id)}
                disabled={isFromPackage}
                style={{
                  padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  border: '1.5px solid #e5e7eb', color: '#6b7280', background: '#f9fafb',
                  cursor: isFromPackage ? 'not-allowed' : 'pointer',
                  opacity: isFromPackage ? 0.4 : 1,
                }}
              >
                Remove
              </button>
              <button
                onClick={(e) => handleBookSingle(e, p)}
                disabled={isLoading}
                className="su-btn-primary"
                style={{ opacity: isLoading ? 0.7 : 1, minWidth: '64px' }}
              >
                {isLoading ? '...' : 'Book'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => handleBookSingle(e, p)}
                disabled={isLoading}
                className="su-btn-primary"
                style={{ opacity: isLoading ? 0.7 : 1, minWidth: '56px' }}
              >
                {isLoading ? '...' : 'Add'}
              </button>
              <button
                onClick={(e) => handleToggleAdd(e, p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  border: '1.5px solid #6366f1', color: '#6366f1', background: '#f5f3ff',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                <FiUserCheck size={14} /> Add to Package
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════
     CATEGORY MODE (multi-skill expanded rows)
  ════════════════════════════════════════════ */

  const expandedRows = filteredProviders.flatMap((p) =>
    (p.packages?.length ? p.packages : [null]).map((pkg) => ({
      key:      `${p.id}-${pkg?.skill ?? 'unknown'}`,
      provider: p,
      skill:    pkg?.skill ?? p.skills?.[0]?.skill ?? 'photographer',
      pkg,
    }))
  );

  const selectedKeys   = new Set(selected.keys());
  const selectedRows   = expandedRows.filter((r) => selectedKeys.has(r.key));
  const unselectedRows = expandedRows.filter((r) => !selectedKeys.has(r.key));

  const handleToggleSelect = (e, row) => {
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Map(prev);
      next.has(row.key) ? next.delete(row.key) : next.set(row.key, row);
      return next;
    });
  };

  // Single book in category mode
  const handleBookNow = async (e, row) => {
    e.stopPropagation();
    const key = row.key;
    try {
      setLoadingKey(key);
      const payload = {
        event_category_id: filters?.category_id ?? null,
        start_at:          filters?.start_datetime ?? null,
        end_at:            filters?.end_datetime   ?? null,
        address:           buildAddress(filters),
        service_providers: [{
          service_provider_id: row.provider.id,
          skill:               row.skill,
        }],
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', {
        state: {
          order:   response?.data?.data,
          payload,
          person:  row.provider,
          skill:   row.skill,
          filters,
        },
      });
    } catch (err) {
      console.error('draftOrder failed:', err);
    } finally {
      setLoadingKey(null);
    }
  };

  // Book all selected (category mode)
  const handleBookSelected = async () => {
    if (selected.size === 0) return;
    try {
      setBulkLoading(true);
      const rows = [...selected.values()];
      const payload = {
        event_category_id: filters?.category_id ?? null,
        start_at:          filters?.start_datetime ?? null,
        end_at:            filters?.end_datetime   ?? null,
        address:           buildAddress(filters),
        service_providers: rows.map((r) => ({
          service_provider_id: r.provider.id,
          skill:               r.skill,
        })),
      };
      const response = await draftOrder(payload);
      navigate('/requestBook', {
        state: {
          order:     response?.data?.data,
          payload,
          providers: rows.map((r) => ({ ...r.provider, _bookedSkill: r.skill })),
          filters,
        },
      });
    } catch (err) {
      console.error('draftOrder (bulk) failed:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const renderSkillCard = (row, isSelected = false) => {
    const { provider: p, skill, pkg, key } = row;
    const name        = `${p.first_name} ${p.last_name}`;
    const reviewCount = p.reviews?.count || 0;
    const rating      = p.reviews?.avg_rating;
    const price       = pkg?.price_with_commission;
    const skillLabel  = SKILL_LABELS[skill] || skill;
    const skillEmoji  = SKILL_EMOJI[skill] || '🎯';
    const isLoading   = loadingKey === key;

    return (
      <div key={key} style={{
        background:   '#fff', borderRadius: '18px', padding: '18px',
        border:       isSelected ? '2px solid #6366f1' : '1px solid #ececec',
        boxShadow:    isSelected
          ? '0 6px 20px rgba(99,102,241,0.12)'
          : '0 2px 8px rgba(0,0,0,0.05)',
        transition:   'all .2s ease', position: 'relative',
      }}>
        {isSelected && (
          <div style={{
            position: 'absolute', top: '-11px', left: '18px',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color: '#fff', fontSize: '10px', fontWeight: 700,
            padding: '3px 10px', borderRadius: '20px',
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            ✓ Selected
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <img
              src={p.profile_picture || `https://ui-avatars.com/api/?name=${p.first_name}+${p.last_name}`}
              alt={name}
              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{name}</h3>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                marginTop: '4px', marginBottom: '2px',
                background: '#f0f0ff', border: '1px solid #c7d2fe',
                borderRadius: '6px', padding: '2px 8px',
                fontSize: '11px', fontWeight: 700, color: '#4338ca',
              }}>
                {skillEmoji} {skillLabel}
              </div>
              <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>📍 {p.city}, {p.state}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111' }}>
              {price != null ? `₹${price.toLocaleString()}` : '—'}
            </div>
            <div style={{ fontSize: '11px', color: '#aaa' }}>Final Price</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          {pkg?.category?.name && <div className="provider-chip">{pkg.category.name}</div>}
          {pkg && <div className="provider-chip">{pkg.duration_value} {pkg.duration_type}</div>}
          <div className="provider-chip">{(p.distance_meters / 1000).toFixed(1)} km away</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '13px' }}>
            {reviewCount > 0
              ? <>⭐ {rating} <span style={{ color: '#aaa' }}>({reviewCount} reviews)</span></>
              : <span style={{ color: '#aaa' }}>New Provider</span>}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
            {isSelected ? (
              <>
                <button
                  onClick={(e) => handleToggleSelect(e, row)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '8px 14px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: 600,
                    border: '1.5px solid #e5e7eb', color: '#6b7280',
                    background: '#f9fafb', cursor: 'pointer',
                  }}
                >
                  <FiX size={13} /> Remove
                </button>
                <button
                  onClick={(e) => handleBookNow(e, row)}
                  disabled={isLoading}
                  className="su-btn-primary"
                  style={{ opacity: isLoading ? 0.7 : 1, minWidth: '80px' }}
                >
                  {isLoading ? '...' : `Book as ${skillLabel}`}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => handleToggleSelect(e, row)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '8px 14px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: 600,
                    border: '1.5px solid #6366f1', color: '#6366f1',
                    background: '#f5f3ff', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  <FiUserCheck size={14} /> Add as {skillLabel}
                </button>
                <button
                  onClick={(e) => handleBookNow(e, row)}
                  disabled={isLoading}
                  className="su-btn-primary"
                  style={{ opacity: isLoading ? 0.7 : 1, minWidth: '80px' }}
                >
                  {isLoading ? '...' : `Book as ${skillLabel}`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ── Render ── */
  const totalSelected = isPackageMode ? selectedProviders.length : selected.size;
  const totalRows     = isPackageMode ? filteredProviders.length : expandedRows.length;

  return (
    <ViewsLayout>
      <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
          Available Providers
        </h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
          {restoring
            ? 'Restoring...'
            : `${totalRows} ${isPackageMode ? 'provider' : 'option'}${totalRows !== 1 ? 's' : ''} found`}
          {isPackageMode && packageId && (
            <span style={{ marginLeft: '10px', fontSize: '11px', fontWeight: 600, background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '20px' }}>
              Package #{packageId}
            </span>
          )}
          {!isPackageMode && totalSelected > 0 && (
            <span style={{ marginLeft: '10px', fontSize: '11px', fontWeight: 600, background: '#ede9fe', color: '#6d28d9', padding: '2px 8px', borderRadius: '20px' }}>
              {totalSelected} selected
            </span>
          )}
        </p>

        <FilterSummary filters={filters} />

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#fff', border: '1.5px solid #e5e7eb',
            borderRadius: '10px', padding: '10px 14px', flex: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <FiSearch size={15} color="#aaa" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', background: 'transparent', flex: 1 }}
            />
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#fff', border: '1.5px solid #e5e7eb',
            borderRadius: '10px', padding: '10px 16px',
            cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#1a1a1a',
          }}>
            <FiSliders size={15} /> Filter
          </button>
        </div>

        {restoring ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: '15px' }}>
            ⏳ Restoring your search…
          </div>
        ) : totalRows === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: '15px' }}>
            No providers found.
          </div>
        ) : isPackageMode ? (
          /* ══ PACKAGE MODE LAYOUT ══ */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {selectedProviders.length > 0 && (
              <div style={{ background: '#f8f7ff', border: '1.5px solid #e0e0ff', borderRadius: '20px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUsers size={15} color="#4f46e5" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Selected Team · {selectedProviders.length}
                    </span>
                  </div>
                  <button
                    onClick={handleBookPackage}
                    disabled={bulkLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: bulkLoading ? '#a5b4fc' : '#6366f1',
                      color: '#fff', border: 'none', borderRadius: '10px',
                      padding: '9px 18px', fontSize: '13px', fontWeight: 700,
                      cursor: bulkLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(99,102,241,0.3)', transition: 'all .2s',
                    }}
                  >
                    {bulkLoading ? '⏳ Booking...' : `📦 Book Package (${selectedProviders.length})`}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedProviders.map((p) => renderPackageCard(p, true))}
                </div>
              </div>
            )}
            <div>
              {selectedProviders.length > 0 && otherProviders.length > 0 && (
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  Rest of the providers · {otherProviders.length}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {otherProviders.map((p) => renderPackageCard(p, false))}
              </div>
            </div>
          </div>
        ) : (
          /* ══ CATEGORY MODE LAYOUT (multi-skill) ══ */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {selectedRows.length > 0 && (
              <div style={{ background: '#f8f7ff', border: '1.5px solid #e0e0ff', borderRadius: '20px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUsers size={15} color="#4f46e5" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Your Selection · {selectedRows.length}
                    </span>
                  </div>
                  <button
                    onClick={handleBookSelected}
                    disabled={bulkLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: bulkLoading ? '#a5b4fc' : '#6366f1',
                      color: '#fff', border: 'none', borderRadius: '10px',
                      padding: '9px 18px', fontSize: '13px', fontWeight: 700,
                      cursor: bulkLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(99,102,241,0.3)', transition: 'all .2s',
                    }}
                  >
                    {bulkLoading ? '⏳ Booking...' : `📦 Book All (${selectedRows.length})`}
                  </button>
                </div>

                {/* Selection summary chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {selectedRows.map((r) => (
                    <div key={r.key} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: '#fff', border: '1px solid #c7d2fe',
                      borderRadius: '20px', padding: '4px 10px',
                      fontSize: '12px', fontWeight: 600, color: '#4338ca',
                    }}>
                      {SKILL_EMOJI[r.skill]} {r.provider.first_name} · {SKILL_LABELS[r.skill] || r.skill}
                      <button
                        onClick={(e) => handleToggleSelect(e, r)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a5b4fc', padding: '0 0 0 2px', lineHeight: 1 }}
                      >
                        <FiX size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedRows.map((r) => renderSkillCard(r, true))}
                </div>
              </div>
            )}

            <div>
              {selectedRows.length > 0 && unselectedRows.length > 0 && (
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  More Providers · {unselectedRows.length}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {unselectedRows.map((r) => renderSkillCard(r, false))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ViewsLayout>
  );
};

export default FindBest;