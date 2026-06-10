import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../index.css';
import ViewsLayout from '../Layout';
import { FiSearch, FiSliders, FiMapPin, FiStar } from 'react-icons/fi';

const FindBest = () => {
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const providers = location.state?.providers || [];
  const filters = location.state?.filters;

  const filtered = providers.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <ViewsLayout>
      <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>
          Available Providers
        </h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
          {filtered.length} provider{filtered.length !== 1 ? 's' : ''} found
        </p>

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((p) => {
              const name = `${p.first_name} ${p.last_name}`;
              const avatar = p.profile_picture ;
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
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #ececec",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    cursor: "pointer",
    transition: "all .25s ease",
  }}
>
  {/* Top Section */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "16px",
    }}
  >
    <div
      style={{
        display: "flex",
        gap: "14px",
      }}
    >
      <img
        src={
          p.profile_picture ||
          `https://ui-avatars.com/api/?name=${p.first_name}+${p.last_name}`
        }
        alt={name}
        style={{
          width: "68px",
          height: "68px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 700,
          }}
        >
          {name}
        </h3>

        <p
          style={{
            margin: "4px 0",
            color: "#666",
            fontSize: "13px",
          }}
        >
          {skills}
        </p>

        <p
          style={{
            margin: 0,
            color: "#888",
            fontSize: "12px",
          }}
        >
          📍 {p.city}, {p.state}
        </p>
      </div>
    </div>

    <div style={{ textAlign: "right" }}>
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#111",
        }}
      >
        ₹{price?.toLocaleString()}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#888",
        }}
      >
        Final Price
      </div>
    </div>
  </div>

  {/* Info Chips */}
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "14px",
    }}
  >
    <div className="provider-chip">
      {pkg?.category?.name}
    </div>

    <div className="provider-chip">
      {pkg?.duration_value} {pkg?.duration_type}
    </div>

    <div className="provider-chip">
      {(p.distance_meters / 1000).toFixed(1)} km away
    </div>
  </div>

  {/* Pricing */}
  <div
    style={{
      marginTop: "14px",
      borderTop: "1px solid #eee",
      paddingTop: "12px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "12px",
    }}
  >
    <div>
      <div style={{ fontSize: "11px", color: "#999" }}>
        Unit Price
      </div>
      <div style={{ fontWeight: 600 }}>
        ₹{pkg?.unit_price}
      </div>
    </div>

    <div>
      <div style={{ fontSize: "11px", color: "#999" }}>
        Total Price
      </div>
      <div style={{ fontWeight: 600 }}>
        ₹{pkg?.total_price}
      </div>
    </div>

    <div>
      <div style={{ fontSize: "11px", color: "#999" }}>
        Commission
      </div>
      <div style={{ fontWeight: 600 }}>
        ₹{pkg?.commission_amount}
      </div>
    </div>
  </div>

  {/* Footer */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "16px",
    }}
  >
    <div>
      {reviewCount > 0 ? (
        <>
          ⭐ {rating} ({reviewCount} reviews)
        </>
      ) : (
        <span
          style={{
            color: "#999",
            fontSize: "13px",
          }}
        >
          New Provider
        </span>
      )}
    </div>

    <button
      className="su-btn-primary"
    >
      View Profile
    </button>
  </div>
</div>
              );
            })}
          </div>
        )}
      </div>
    </ViewsLayout>
  );
};

export default FindBest;