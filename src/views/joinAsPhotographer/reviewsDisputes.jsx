import React, { useEffect, useState } from 'react';
import { getSPDispute } from '../../services/dispute';

// ---- helpers -------------------------------------------------------------

const STATUS_MAP = {
    pending: { label: 'Open', bg: '#fdecea', color: '#e5484d' },
    open: { label: 'Open', bg: '#fdecea', color: '#e5484d' },
    in_review: { label: 'In Review', bg: '#eaf2ff', color: '#3b82f6' },
    resolved: { label: 'Resolved', bg: '#e7f7ef', color: '#16a34a' },
};

const formatStatus = (status) =>
    STATUS_MAP[status] || { label: status ? status.replace(/_/g, ' ') : 'Unknown', bg: '#f3f4f6', color: '#6b7280' };

// "late_delivery" -> "Late Delivery"
const formatDisputeType = (type) =>
    (type || '')
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

// "3" -> "DISP-2026-00003" style, falls back gracefully if id is missing
const formatDisputeCode = (dispute) => {
    const year = dispute.created_at ? new Date(dispute.created_at).getFullYear() : new Date().getFullYear();
    const paddedId = String(dispute.id).padStart(5, '0');
    return `DISP-${year}-${paddedId}`;
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
};

const initials = (first = '', last = '') =>
    `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

// ---- UI pieces -------------------------------------------------------------

const StatusBadge = ({ status }) => {
    const { label, bg, color } = formatStatus(status);
    return (
        <span style={{
            background: bg,
            color,
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
        }}>
            {label}
        </span>
    );
};

const Avatar = ({ first, last, url }) => (
    <div style={{
        width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden',
        background: '#e5e7eb', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 700, color: '#6b7280',
    }}>
        {url
            ? <img src={url} alt={`${first} ${last}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials(first, last)
        }
    </div>
);

const DisputeCard = ({ dispute, onViewDetails, onReply, onShare }) => {
    const customerName = dispute.customer
        ? `${dispute.customer.first_name} ${dispute.customer.last_name}`.trim()
        : 'Unknown';

    const isResolved = dispute.status === 'resolved';

    return (
        <div style={{
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        }}>
            {/* Header: code + status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
                    {formatDisputeCode(dispute)}
                </p>
                <StatusBadge status={dispute.status} />
            </div>

            {/* Order ID */}
            <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                Order ID: <span style={{ color: '#4b5563' }}>{dispute.booking?.booking_number || '—'}</span>
            </p>

            {/* Raised by / Issue type row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#9ca3af' }}>Raised by</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Avatar first={dispute.customer?.first_name} last={dispute.customer?.last_name} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>{customerName}</span>
                    </div>
                </div>
                <div>
                    <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#9ca3af' }}>Issue Type</p>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
                        {formatDisputeType(dispute.dispute_type)}
                    </p>
                </div>
            </div>

            {/* Raised on / Resolved on */}
            <div>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#9ca3af' }}>
                    {isResolved ? 'Resolved On' : 'Raised On'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
                    {isResolved ? formatDate(dispute.resolved_at) : formatDate(dispute.created_at)}
                </p>
            </div>
            {dispute.images?.length > 0 && (
                <div>
                    <p
                        style={{
                            margin: "0 0 8px",
                            fontSize: "11px",
                            color: "#9ca3af",
                        }}
                    >
                        Evidence
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                        }}
                    >
                        {dispute.images.map((img) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt="Evidence"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open(img.url, "_blank")}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                    onClick={() => onViewDetails?.(dispute)}
                    style={{
                        flex: 1, padding: '8px 12px', borderRadius: '8px',
                        border: '1px solid #e5e7eb', background: '#fff',
                        fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer',
                    }}
                >
                    View Details
                </button>
                {!isResolved && (
                    <button
                        onClick={() => onReply?.(dispute)}
                        style={{
                            flex: 1, padding: '8px 12px', borderRadius: '8px',
                            border: '1px solid #f5a623', background: '#fff7e6',
                            fontSize: '13px', fontWeight: 600, color: '#b45309', cursor: 'pointer',
                        }}
                    >
                        Reply
                    </button>
                )}
                <button
                    onClick={() => onShare?.(dispute)}
                    title="Share"
                    style={{
                        width: '36px', padding: '8px', borderRadius: '8px',
                        border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    ⤴
                </button>
            </div>
        </div>
    );
};

// ---- main component --------------------------------------------------------

const Disputes = ({ limit }) => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDisputes = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getSPDispute();
            setDisputes(res?.data?.data || []);
        } catch (err) {
            console.error(err);
            setError('Could not load disputes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    const handleViewDetails = (dispute) => {
        // TODO: wire up to a details modal / route
        console.log('view details', dispute);
    };

    const handleReply = (dispute) => {
        // TODO: wire up to a reply modal
        console.log('reply', dispute);
    };

    const handleShare = (dispute) => {
        // TODO: wire up to share/export
        console.log('share', dispute);
    };

    const visibleDisputes = limit ? disputes.slice(0, limit) : disputes;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 className="pe-title" style={{ margin: 0 }}>Recent Disputes</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                        Latest issues raised by clients
                    </p>
                </div>
                <button style={{
                    padding: '8px 16px', borderRadius: '8px',
                    border: '1px solid #f5a623', background: '#fff7e6',
                    fontSize: '13px', fontWeight: 600, color: '#b45309', cursor: 'pointer',
                }}>
                    View All Disputes
                </button>
            </div>

            {loading && (
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>Loading disputes…</p>
            )}

            {!loading && error && (
                <p style={{ fontSize: '13px', color: '#e5484d' }}>{error}</p>
            )}

            {!loading && !error && visibleDisputes.length === 0 && (
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>No disputes to show.</p>
            )}

            {!loading && !error && visibleDisputes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {visibleDisputes.map(d => (
                        <DisputeCard
                            key={d.id}
                            dispute={d}
                            onViewDetails={handleViewDetails}
                            onReply={handleReply}
                            onShare={handleShare}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Disputes;
export { DisputeCard };