import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';
import ViewsLayout from '../Layout';
import { FiSearch, FiSliders, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { draftOrder } from '../../services/order';

/* ── helper: format ISO string to readable date/time ── */
const fmtDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const fmtTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

/* ── Filter Summary Banner ── */
const FilterSummary = ({ filters }) => {
  if (!filters) return null;

  const chips = [
    filters.start_datetime && {
      icon: <FiCalendar size={12} />,
      label: `Start: ${fmtDate(filters.start_datetime)} · ${fmtTime(filters.start_datetime)}`,
    },
    filters.end_datetime && {
      icon: <FiClock size={12} />,
      label: `End: ${fmtDate(filters.end_datetime)} · ${fmtTime(filters.end_datetime)}`,
    },
    (filters.lat && filters.lng) && {
      icon: <FiMapPin size={12} />,
      label: `${filters.lat?.toFixed(4)}, ${filters.lng?.toFixed(4)}`,
    },
  ].filter(Boolean);

  return (
    <div style={{
      background: '#f8f9ff',
      border: '1.5px solid #e0e4ff',
      borderRadius: '14px',
      padding: '14px 16px',
      marginBottom: '20px',
    }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
        Your Event Filters
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {filters.category_id && (
          <span style={chipStyle('#ede9fe', '#6d28d9')}>
            🎉 Category #{filters.category_id}
          </span>
        )}
        {chips.map((c, i) => (
          <span key={i} style={chipStyle('#f0f9ff', '#0369a1')}>
            {c.icon}&nbsp;{c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

const chipStyle = (bg, color) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: bg,
  color,
  fontSize: '12px',
  fontWeight: 500,
  padding: '4px 10px',
  borderRadius: '20px',
});

/* ── Main Component ── */
const FindBest = () => {
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState(null); // tracks which provider's Add is in-flight
  const location = useLocation();
  const navigate = useNavigate();

  const providers = location.state?.providers || [];
  const filters = location.state?.filters;
  const statePackage = location.state?.package;
  const isCustomizeMode = location.state?.mode === 'customize';

  const filtered = providers.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const packageProviderIds = new Set(
    statePackage?.team?.flatMap((tm) => tm.providers?.map((p) => p.id) || []) || []
  );

  const selectedProviders = isCustomizeMode
    ? filtered.filter((p) => packageProviderIds.has(p.id))
    : [];
  const otherProviders = isCustomizeMode
    ? filtered.filter((p) => !packageProviderIds.has(p.id))
    : filtered;

  /* Build the draftOrder payload from provider + filters */
  const buildBookingPayload = (provider) => ({
    event_category_id: filters?.category_id ?? null,
    start_at: filters?.start_datetime ?? null,
    end_at: filters?.end_datetime ?? null,
    address_place_id: filters?.place_id ?? null,
    address: {
      lat: filters?.lat ?? null,
      lng: filters?.lng ?? null,
    },
    photographers: [
      { photographer_id: provider.id },
    ],
  });

  /* Call draftOrder API then navigate to /requestBook */
  const handleAdd = async (e, provider) => {
    e.stopPropagation();
    try {
      setLoadingId(provider.id);
      const payload = buildBookingPayload(provider);
      const response = await draftOrder(payload);

      navigate('/requestBook', {
        state: {
          order: response?.data?.data,
          payload,
          person: provider,
          filters,
        },
      });
    } catch (err) {
      console.error('draftOrder failed:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const renderProviderCard = (p, isSelectedInPackage = false) => {
    const name = `${p.first_name} ${p.last_name}`;
    const rating = p.reviews?.avg_rating;
    const reviewCount = p.reviews?.count || 0;
    const skills = p.skills?.map((s) => s.skill.charAt(0).toUpperCase() + s.skill.slice(1)).join(' · ') || '—';
    const pkg = p.packages?.[0];
    const price = pkg?.price_with_commission;

    return (
      <div
        key={p.id}
        onClick={() =>
          navigate(`/photographer/${p.id}`, {
            state: { person: p, filters },
          })
        }
        style={{
          background: '#fff',
          borderRadius: '18px',
          padding: '18px',
          border: isSelectedInPackage ? '2px solid #6366f1' : '1px solid #ececec',
          boxShadow: isSelectedInPackage ? '0 6px 20px rgba(99, 102, 241, 0.15)' : '0 4px 12px rgba(0,0,0,0.06)',
          cursor: 'pointer',
          transition: 'all .25s ease',
          position: 'relative',
          marginTop: isSelectedInPackage ? '8px' : '0px',
        }}
      >
        {isSelectedInPackage && (
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '18px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            ✓ Pre-selected in Package
          </div>
        )}
        {/* Top Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <img
              src={p.profile_picture || `https://ui-avatars.com/api/?name=${p.first_name}+${p.last_name}`}
              alt={name}
              style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>{name}</h3>
              <p style={{ margin: '4px 0', color: '#666', fontSize: '13px' }}>{skills}</p>
              <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>📍 {p.city}, {p.state}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111' }}>₹{price?.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>Final Price</div>
          </div>
        </div>

        {/* Info Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          <div className="provider-chip">{pkg?.category?.name}</div>
          <div className="provider-chip">{pkg?.duration_value} {pkg?.duration_type}</div>
          <div className="provider-chip">{(p.distance_meters / 1000).toFixed(1)} km away</div>
        </div>

        {/* Pricing */}
        <div style={{
          marginTop: '14px', borderTop: '1px solid #eee', paddingTop: '12px',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#999' }}>Unit Price</div>
            <div style={{ fontWeight: 600 }}>₹{pkg?.unit_price}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#999' }}>Total Price</div>
            <div style={{ fontWeight: 600 }}>₹{pkg?.total_price}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#999' }}>Commission</div>
            <div style={{ fontWeight: 600 }}>₹{pkg?.commission_amount}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
          <div>
            {reviewCount > 0 ? (
              <>⭐ {rating} ({reviewCount} reviews)</>
            ) : (
              <span style={{ color: '#999', fontSize: '13px' }}>New Provider</span>
            )}
          </div>

          {/* ── Add button → calls draftOrder then navigates ── */}
          <button
            onClick={(e) => handleAdd(e, p)}
            className="su-btn-primary"
            disabled={loadingId === p.id}
            style={{ 
              opacity: loadingId === p.id ? 0.7 : 1, 
              minWidth: '64px',
              background: isSelectedInPackage ? '#10b981' : undefined,
              borderColor: isSelectedInPackage ? '#10b981' : undefined,
            }}
          >
            {loadingId === p.id ? '...' : (isSelectedInPackage ? 'Selected' : 'Add')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <ViewsLayout>
      <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>
          Available Providers
        </h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
          {filtered.length} provider{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* ── Filter Summary ── */}
        <FilterSummary filters={filters} />

        {/* Search + Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#fff', border: '1.5px solid #e5e7eb',
            borderRadius: '10px', padding: '10px 14px', flex: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
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
            cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            color: '#1a1a1a', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <FiSliders size={15} /> Filter
          </button>
        </div>

        {/* Provider List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa', fontSize: '15px' }}>
            No providers found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Selected package providers section */}
            {isCustomizeMode && selectedProviders.length > 0 && (
              <div>
                <h2 style={{ 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  color: '#4f46e5', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  marginBottom: '14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4f46e5' }}></span>
                  Selected Team Members ({selectedProviders.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedProviders.map((p) => renderProviderCard(p, true))}
                </div>
              </div>
            )}

            {/* Other providers section */}
            <div>
              {isCustomizeMode && (
                <h2 style={{ 
                  fontSize: '12px', 
                  fontWeight: 700, 
                  color: '#4b5563', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  marginBottom: '14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px' 
                }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#4b5563' }}></span>
                  {selectedProviders.length > 0 ? 'Rest of the Providers' : 'Available Providers'} ({otherProviders.length})
                </h2>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {otherProviders.map((p) => renderProviderCard(p, false))}
              </div>
            </div>

          </div>
        )}
      </div>
    </ViewsLayout>
  );
};

export default FindBest;