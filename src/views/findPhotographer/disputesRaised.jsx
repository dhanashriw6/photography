import React, { useEffect, useState } from 'react';
import { getDisputes } from '../../services/dispute';
import { FiAlertCircle, FiClock, FiCheckCircle, FiXCircle, FiImage } from 'react-icons/fi';

/* ── Helpers ── */
const formatDisputeType = (type) =>
  type?.replaceAll('_', ' ')?.replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#b45309', bg: '#FFF3D6', icon: FiClock },
  resolved: { label: 'Resolved', color: '#15803d', bg: '#dcfce7', icon: FiCheckCircle },
  rejected: { label: 'Rejected', color: '#b91c1c', bg: '#fee2e2', icon: FiXCircle },
};

const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.pending;

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const cfg = getStatusConfig(status);
  const Icon = cfg.icon;
  return (
    <span
      className="dr-status-badge"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
};

/* ── Single dispute card ── */
const DisputeCard = ({ dispute }) => {
  const [showImage, setShowImage] = useState(null);

  return (
    <div className="dr-card">
      <div className="dr-card-head">
        <div className="dr-card-head-left">
          <span className="dr-type-icon">
            <FiAlertCircle size={16} />
          </span>
          <div>
            <div className="dr-dispute-type">{formatDisputeType(dispute.dispute_type)}</div>
            <div className="dr-meta-row">
              <span>Booking #{dispute.booking_id}</span>
              <span className="dr-dot">•</span>
              <span>Raised {formatDate(dispute.created_at)}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={dispute.status} />
      </div>

      {dispute.description && (
        <p className="dr-description">{dispute.description}</p>
      )}

      {dispute.images?.length > 0 && (
        <div className="dr-images-row">
          {dispute.images.map((img) => (
            <div
              key={img.id}
              className="dr-image-thumb"
              onClick={() => setShowImage(img.url)}
            >
              <img src={img.url} alt="Dispute evidence" />
            </div>
          ))}
        </div>
      )}

      {dispute.status === 'resolved' && dispute.resolution_note && (
        <div className="dr-resolution-box">
          <div className="dr-resolution-label">
            <FiCheckCircle size={13} /> Resolution Note
          </div>
          <p>{dispute.resolution_note}</p>
          {dispute.resolved_at && (
            <div className="dr-resolved-date">Resolved on {formatDate(dispute.resolved_at)}</div>
          )}
        </div>
      )}

      {showImage && (
        <div className="dr-image-modal" onClick={() => setShowImage(null)}>
          <img src={showImage} alt="Dispute evidence full" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
const DisputesRaised = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDisputes();
      setDisputes(response?.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch disputes:', err);
      setError('Failed to load disputes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dr-page">
      <style>{STYLES}</style>

      <div className="dr-header">
        <h1 className="dr-title">Disputes Raised</h1>
        <p className="dr-subtitle">Track the status of disputes you've raised for your bookings.</p>
      </div>

      {loading ? (
        <div className="dr-state-box">⏳ Loading disputes…</div>
      ) : error ? (
        <div className="dr-state-box dr-state-box--error">
          {error}
          <button className="dr-retry-btn" onClick={fetchDisputes}>Retry</button>
        </div>
      ) : disputes.length === 0 ? (
        <div className="dr-state-box">
          <FiAlertCircle size={22} />
          <p>You haven't raised any disputes yet.</p>
        </div>
      ) : (
        <div className="dr-list">
          {disputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
.dr-page { padding: 14px; margin: 0 auto; }
.dr-header { margin-bottom: 24px; }
.dr-title { font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px; }
.dr-subtitle { font-size: 13.5px; color: #888; margin: 0; }

.dr-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  justify-content: center;
  min-height: 180px;
  color: #aaa;
  font-size: 14px;
  background: #fff;
  border-radius: 14px;
  border: 1px dashed #eee;
}
.dr-state-box--error { color: #b91c1c; }
.dr-retry-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.dr-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 14px; }

.dr-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  
}

.dr-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.dr-card-head-left { display: flex; gap: 10px; align-items: flex-start; }
.dr-type-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dr-dispute-type { font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
.dr-meta-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #999; flex-wrap: wrap; }
.dr-dot { color: #ddd; }

.dr-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.dr-description {
  font-size: 13.5px;
  color: #444;
  line-height: 1.5;
  margin: 0 0 14px;
  background: #fafafa;
  border-radius: 10px;
  padding: 10px 12px;
}

.dr-images-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.dr-image-thumb {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #eee;
  flex-shrink: 0;
}
.dr-image-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

.dr-resolution-box {
  margin-top: 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 12px 14px;
}
.dr-resolution-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: #15803d;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}
.dr-resolution-box p { margin: 0; font-size: 13px; color: #1a1a1a; line-height: 1.5; }
.dr-resolved-date { font-size: 11px; color: #4ade80; margin-top: 6px; }

.dr-image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.dr-image-modal img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .dr-page { padding: 16px; }
  .dr-card-head { flex-direction: column; }
}
`;

export default DisputesRaised;