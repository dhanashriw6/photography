import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewsLayout from '../Layout';
import {
  FiStar,
  FiArrowLeft,
  FiCheckCircle,
  FiLink,
  FiAward,
  FiGlobe,
  FiVideo,
  FiCalendar,
  FiCamera,
  FiUser,
  FiClock,
} from 'react-icons/fi';
import { getServiceProviderDetails } from '../../services/booking';

// ---------------------------------------------------------------------------
// Tokens — matches your calendar / light pages exactly
// ---------------------------------------------------------------------------
const c = {
  bg: '#f9fafb',
  card: '#ffffff',
  cardAlt: '#f9fafb',
  border: '#f3f4f6',
  borderMid: '#e5e7eb',
  text: '#1a1a1a',
  subtext: '#6b7280',
  faint: '#9ca3af',
  accent: '#f5a623',
  accentSoft: '#fdf0db',
  accentMid: '#fef3c7',
  success: '#15803d',
  successSoft: '#dcfce7',
  warn: '#d97706',
  warnSoft: '#fef3c7',
  danger: '#dc2626',
  dangerSoft: '#fee2e2',
};

const kycStyles = {
  approved: { color: c.success, bg: c.successSoft, label: 'KYC Approved' },
  pending:  { color: c.warn,    bg: c.warnSoft,    label: 'KYC Pending'  },
  rejected: { color: c.danger,  bg: c.dangerSoft,  label: 'KYC Rejected' },
};

const skillLabel = (s) =>
  s?.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const formatDate = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return null; }
};

const currency = (v) =>
  v === null || v === undefined || v === '' ? null : `₹${Number(v).toLocaleString('en-IN')}`;

// ---------------------------------------------------------------------------
// Small reusable pieces
// ---------------------------------------------------------------------------
const Pill = ({ children, color, bg, icon: Icon }) => (
  <span style={{
    fontSize: 12, fontWeight: 700,
    color: color || c.subtext,
    background: bg || '#f3f4f6',
    padding: '4px 10px', borderRadius: 999,
    display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
  }}>
    {Icon && <Icon size={12} />}
    {children}
  </span>
);

const SectionCard = ({ title, children, style }) => (
  <div style={{
    background: c.card, borderRadius: 16, padding: '20px 22px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: `1px solid ${c.border}`,
    boxSizing: 'border-box', ...style,
  }}>
    {title && (
      <p style={{ margin: '0 0 14px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: 0.7, color: c.faint }}>
        {title}
      </p>
    )}
    {children}
  </div>
);

const StatRow = ({ icon: Icon, label, value, last }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: last ? 'none' : `1px solid ${c.border}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.subtext }}>
      <Icon size={14} color={c.accent} /> {label}
    </div>
    <div style={{ fontSize: 13.5, fontWeight: 700, color: c.text }}>{value ?? '—'}</div>
  </div>
);

const PackageCard = ({ pkg }) => {
  const tiers = [
    { label: 'Per Hour',     value: currency(pkg.price_per_hour)     },
    { label: 'Half Day',     value: currency(pkg.price_per_half_day) },
    { label: 'Full Day',     value: currency(pkg.price_per_day)      },
  ].filter((t) => t.value);

  return (
    <div style={{
      border: `1px solid ${c.border}`, borderRadius: 12, padding: 16,
      background: c.cardAlt, marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: c.text }}>{skillLabel(pkg.skill)}</div>
          {pkg.category?.name && (
            <div style={{ fontSize: 12, color: c.faint, marginTop: 3 }}>{pkg.category.name}</div>
          )}
        </div>
      </div>
      {tiers.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {tiers.map((t) => (
            <div key={t.label} style={{
              flex: '1 1 90px', background: c.accentSoft,
              borderRadius: 10, padding: '9px 10px', textAlign: 'center',
              border: `1px solid ${c.accentMid}`,
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: c.accent }}>{t.value}</div>
              <div style={{ fontSize: 10.5, color: c.faint, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const ServiceProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    getServiceProviderDetails(id)
      .then((res) => {
        const sp = res?.data?.data?.service_provider || null;
        if (!cancelled) setProvider(sp);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError('Could not load this provider.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const kyc       = provider?.kyc_status ? kycStyles[provider.kyc_status] : null;
  const fullName  = provider ? [provider.first_name, provider.middle_name, provider.last_name].filter(Boolean).join(' ') : '';
  const initials  = provider ? `${provider.first_name?.[0] || ''}${provider.last_name?.[0] || ''}`.toUpperCase() : '';
  const avatarUrl = provider?.profile_document?.url || provider?.profile_picture || null;

  // Avatar colour from initials (matches your booking row colours)
  const AVATAR_COLORS = ['#f5a623', '#2563eb', '#9333ea', '#15803d', '#dc2626', '#0891b2'];
  const avatarBg = AVATAR_COLORS[(provider?.id || 0) % AVATAR_COLORS.length];

  return (
    <ViewsLayout>
      <div style={{  minHeight: '100vh' }}>

        {/* ── Loading / Error ── */}
        {loading && (
          <div style={{ padding: 100, textAlign: 'center', fontSize: 14, color: c.faint }}>
            Loading provider…
          </div>
        )}
        {error && (
          <div style={{ padding: 100, textAlign: 'center', fontSize: 14, color: c.danger }}>
            {error}
          </div>
        )}

        {!loading && !error && !provider && (
          <div style={{ padding: 100, textAlign: 'center', fontSize: 14, color: c.faint }}>
            Provider not found.
          </div>
        )}

        {!loading && !error && provider && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px', boxSizing: 'border-box' }}>

            {/* ── Back button ── */}
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: '#fff', border: `1.5px solid ${c.border}`,
                borderRadius: 10, padding: '9px 16px', fontSize: 13,
                fontWeight: 700, color: c.text, cursor: 'pointer',
                marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <FiArrowLeft size={14} /> Back
            </button>

            {/* ── Profile header card ── */}
            <SectionCard style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                {/* Avatar */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl} alt={fullName}
                    style={{
                      width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                      border: `3px solid ${c.accentSoft}`, flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
                    background: avatarBg, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, fontWeight: 800,
                    border: `3px solid ${c.accentSoft}`,
                  }}>
                    {initials || <FiCamera size={24} />}
                  </div>
                )}

                {/* Name + badges */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: c.text }}>
                    {fullName || 'Unnamed Provider'}
                  </h1>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {provider.is_verified_user && (
                      <Pill color={c.success} bg={c.successSoft} icon={FiCheckCircle}>Verified</Pill>
                    )}
                    {kyc && <Pill color={kyc.color} bg={kyc.bg}>{kyc.label}</Pill>}
                    {provider.years_of_exp && (
                      <Pill color={c.accent} bg={c.accentSoft} icon={FiClock}>
                        {provider.years_of_exp} yrs exp
                      </Pill>
                    )}
                  </div>
                </div>

                {/* Quick stats strip */}
                <div style={{ display: 'flex', gap: 24, flexShrink: 0, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: c.text }}>
                      {provider.avg_rating ?? '—'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: c.faint, fontWeight: 600 }}>Rating</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: c.text }}>
                      {provider.completed_bookings ?? 0}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: c.faint, fontWeight: 600 }}>Bookings</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ── Two-column body ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20, alignItems: 'start',
            }}>

              {/* ─ Left / sidebar ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Overview */}
                <SectionCard title="Overview">
                  <StatRow icon={FiStar}     label="Rating"           value={provider.avg_rating ?? 'No ratings yet'} />
                  <StatRow icon={FiCalendar} label="Bookings done"    value={provider.completed_bookings ?? 0} />
                  <StatRow icon={FiClock}    label="Years experience" value={provider.years_of_exp} />
                  <StatRow icon={FiUser}     label="Gender"           value={provider.gender ? skillLabel(provider.gender) : null} />
                  <StatRow icon={FiCalendar} label="Joined"           value={formatDate(provider.created_at)} last />
                </SectionCard>

                {/* Skills */}
                {provider.skills?.length > 0 && (
                  <SectionCard title="Skills">
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {provider.skills.map((s) => (
                        <Pill
                          key={s.skill}
                          color={s.is_primary ? c.accent : c.subtext}
                          bg={s.is_primary ? c.accentSoft : '#f3f4f6'}
                        >
                          {skillLabel(s.skill)}{s.is_primary ? ' · Primary' : ''}
                        </Pill>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Languages */}
                {provider.user_languages?.length > 0 && (
                  <SectionCard title="Languages">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {provider.user_languages.map((l, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: 13.5, color: c.text, fontWeight: 600 }}>
                              {l.language?.name}
                            </div>
                            {l.language?.native_name && (
                              <div style={{ fontSize: 11.5, color: c.faint }}>{l.language.native_name}</div>
                            )}
                          </div>
                          <Pill>{skillLabel(l.proficiency)}</Pill>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Links */}
                {(provider.portfolio_link || provider.social_links?.length > 0) && (
                  <SectionCard title="Links">
                   {provider.portfolio_link && (
  <a
    href={provider.portfolio_link}
    target="_blank"
    rel="noreferrer"
    style={linkRowStyle}
  >
    <FiLink size={14} color={c.accent} />
    <span>Portfolio site</span>
  </a>
)}
                  {provider.social_links?.map((link, i) => (
  <a
    key={i}
    href={typeof link === 'string' ? link : link.url}
    target="_blank"
    rel="noreferrer"
    style={linkRowStyle}
  >
    <FiGlobe size={14} color={c.accent} />
    <span>{typeof link === 'string' ? 'Link' : link.platform || 'Link'}</span>
  </a>
))}
                  </SectionCard>
                )}
              </div>

              {/* ─ Right / main ─ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Bio */}
                <SectionCard title="About">
                  <p style={{
                    fontSize: 14, lineHeight: 1.75, margin: 0,
                    color: provider.bio ? c.subtext : c.faint,
                  }}>
                    {provider.bio || 'This provider hasn\'t added a bio yet.'}
                  </p>
                </SectionCard>

                {/* Packages */}
                {provider.packages?.length > 0 && (
                  <SectionCard title="Packages">
                    {provider.packages.map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </SectionCard>
                )}

                {/* Portfolio */}
                {provider.portfolio_documents?.length > 0 && (
                  <SectionCard title="Portfolio">
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                      gap: 10,
                    }}>
                      {provider.portfolio_documents.map((doc) => (
                        <div key={doc.id} style={{
                          position: 'relative', aspectRatio: '4 / 5',
                          borderRadius: 10, overflow: 'hidden',
                          border: `1px solid ${c.border}`, background: c.cardAlt,
                        }}>
                          {doc.document_type === 'video' ? (
                            <video
                              src={doc.url} muted loop
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          ) : (
                            <img
                              src={doc.url} alt="Portfolio work" loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* Video links */}
                {provider.video_links?.length > 0 && (
                  <SectionCard title="Videos">
                   {provider.video_links.map((v, i) => (
  <a
    key={i}
    href={typeof v === 'string' ? v : v.url}
    target="_blank"
    rel="noreferrer"
    style={linkRowStyle}
  >
    <FiVideo size={14} color={c.accent} />
    <span>{typeof v === 'string' ? v : v.title || v.url}</span>
  </a>
))}
                  </SectionCard>
                )}

                {/* Awards */}
                {provider.awards?.length > 0 && (
                  <SectionCard title="Awards">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {provider.awards.map((award, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 9,
                          fontSize: 13.5, color: c.subtext,
                          padding: '8px 0',
                          borderBottom: i < provider.awards.length - 1 ? `1px solid ${c.border}` : 'none',
                        }}>
                          <FiAward size={14} color={c.accent} />
                          {typeof award === 'string' ? award : award.title}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ViewsLayout>
  );
};

/* ── shared inline styles ── */
const linkRowStyle = {
  display: 'flex', alignItems: 'center', gap: 9,
  fontSize: 13, color: '#374151', textDecoration: 'none',
  padding: '9px 0', borderBottom: '1px solid #f3f4f6',
  fontWeight: 600,
};

export default ServiceProviderDetails;