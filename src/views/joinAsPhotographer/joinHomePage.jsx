import React, { useState, useEffect, useCallback } from 'react';
import PhotographerLayout from './PhotographerLayout';
import { getBlocks,addBlocks } from '../../services/calender';
/* ─── constants ────────────────────────────────────────────────────────────── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const REASONS = [
    { value: 'vacation', label: 'Vacation', color: '#f5a623', bg: '#fdf0db' },
    { value: 'personal', label: 'Personal', color: '#d97706', bg: '#fef3c7' },
    { value: 'busy_external', label: 'Busy (External)', color: '#2563eb', bg: '#dbeafe' },
    { value: 'holiday', label: 'Holiday', color: '#9333ea', bg: '#f3e8ff' },
    { value: 'other', label: 'Other', color: '#6b7280', bg: '#f3f4f6' },
];
const reasonMeta = (value) => REASONS.find((r) => r.value === value) || REASONS[4];

/* ─── date helpers ─────────────────────────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, '0');
const toLocalDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Month range for the getBlocks query — UTC month boundaries, matching the API convention
// e.g. from=2026-07-01T00:00:00.000Z&to=2026-08-01T00:00:00.000Z
const monthRangeUTC = (y, m) => ({
    from: new Date(Date.UTC(y, m, 1, 0, 0, 0)).toISOString(),
    to: new Date(Date.UTC(y, m + 1, 1, 0, 0, 0)).toISOString(),
});

// does a given local calendar day fall inside a block's [start_at, end_at) range
const dayInBlock = (dateObj, block) => {
    const dayStart = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const start = new Date(block.start_at);
    const end = new Date(block.end_at);
    return start < dayEnd && end > dayStart;
};

/* ─── Add Block modal ──────────────────────────────────────────────────────── */
const AddBlockModal = ({ open, onClose, onSave, defaultDate }) => {
    const [fromDate, setFromDate] = useState(defaultDate);
    const [toDate, setToDate] = useState(defaultDate);
    const [reason, setReason] = useState('vacation');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setFromDate(defaultDate);
            setToDate(defaultDate);
            setReason('vacation');
            setNote('');
            setError('');
        }
    }, [open, defaultDate]);

    if (!open) return null;

    const handleSave = async () => {
        if (!fromDate || !toDate) {
            setError('Please select both dates.');
            return;
        }
        if (new Date(toDate) < new Date(fromDate)) {
            setError('To date cannot be before From date.');
            return;
        }

        // start_at = local midnight of fromDate
        // end_at   = local midnight of the day AFTER toDate (so the block covers the full last day)
        const [fy, fm, fd] = fromDate.split('-').map(Number);
        const [ty, tm, td] = toDate.split('-').map(Number);
        const start_at = new Date(fy, fm - 1, fd, 0, 0, 0, 0).toISOString();
        const endDateObj = new Date(ty, tm - 1, td, 0, 0, 0, 0);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const end_at = endDateObj.toISOString();

        const payload = { start_at, end_at, reason, note: note.trim() || undefined };

        try {
            setSaving(true);
            setError('');
            await onSave(payload);
        } catch (e) {
            setError('Failed to save block. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: '#1a1a1a' }}>Add Block Range</h2>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                            Block dates to hide them from client availability.
                        </p>
                    </div>
                    <button onClick={onClose} style={closeBtnStyle}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '20px' }}>
                    <div>
                        <label style={labelStyle}>From Date</label>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>To Date</label>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
                    </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                    <label style={labelStyle}>Reason</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {REASONS.map((r) => (
                            <button
                                key={r.value}
                                onClick={() => setReason(r.value)}
                                style={{
                                    padding: '7px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '12.5px',
                                    fontWeight: 700,
                                    border: reason === r.value ? `1.5px solid ${r.color}` : '1.5px solid #e5e7eb',
                                    background: reason === r.value ? r.bg : '#fff',
                                    color: reason === r.value ? r.color : '#6b7280',
                                }}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                    <label style={labelStyle}>Note (Optional)</label>
                    <textarea
                        value={note}
                        maxLength={200}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note…"
                        style={{ ...inputStyle, height: '80px', resize: 'none', fontFamily: 'inherit' }}
                    />
                    <div style={{ textAlign: 'right', fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        {note.length}/200
                    </div>
                </div>

                {error && <p style={{ color: '#dc2626', fontSize: '12.5px', margin: '10px 0 0' }}>{error}</p>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                    <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={saveBtnStyle}>
                        {saving ? 'Saving…' : 'Save Block'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Main calendar ────────────────────────────────────────────────────────── */
const AvailabilityCalendar = () => {
    const today = new Date();
    const [cur, setCur] = useState({ y: today.getFullYear(), m: today.getMonth() }); // defaults to current month
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState(toLocalDateStr(today));

    const { y, m } = cur;

    const fetchBlocks = useCallback(async () => {
        try {
            setLoading(true);
            const { from, to } = monthRangeUTC(y, m);
            const res = await getBlocks({ from, to });
           setBlocks(res?.data?.data?.blocks || []);
        } catch (e) {
            console.error('Failed to load blocks', e);
        } finally {
            setLoading(false);
        }
    }, [y, m]);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInPrev = new Date(y, m, 0).getDate();

    const prev = () => setCur((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
    const next = () => setCur((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));
    const goToday = () => setCur({ y: today.getFullYear(), m: today.getMonth() });

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: daysInPrev - firstDay + i + 1, cur: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
    const totalCells = cells.length <= 35 ? 35 : 42;
    for (let i = 1; i <= totalCells - cells.length; i++) cells.push({ day: i, cur: false });

    const isToday = (d, isCur) => isCur && d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

 const blocksForDay = (d, isCur) => {
    if (!isCur) return [];

    const dateObj = new Date(y, m, d);

    return Array.isArray(blocks)
        ? blocks.filter((b) => dayInBlock(dateObj, b))
        : [];
};
    const openModalForDay = (d, isCur) => {
        if (!isCur) return;
        setModalDate(toLocalDateStr(new Date(y, m, d)));
        setModalOpen(true);
    };

    const handleSaveBlock = async (payload) => {
        await addBlocks(payload);
        setModalOpen(false);
        fetchBlocks();
    };

    return (
        <PhotographerLayout>
            <div style={{ background: '#f9fafb', minHeight: '100vh', width: '100%', padding: '28px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#1a1a1a' }}>My Availability Calendar</h1>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                            Manage blocked dates. Blocked dates are hidden from client search.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setModalDate(toLocalDateStr(today));
                            setModalOpen(true);
                        }}
                        style={addBtnStyle}
                    >
                        + Add Block
                    </button>
                </div>

                {/* Calendar card */}
                <div style={card}>
                    {/* Month nav */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button onClick={prev} style={navBtn}>‹</button>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1a1a1a', minWidth: '160px', textAlign: 'center' }}>
                                {MONTH_NAMES[m]} {y}
                            </h3>
                            <button onClick={next} style={navBtn}>›</button>
                        </div>
                        <button onClick={goToday} style={{ ...navBtn, padding: '6px 14px', fontSize: '12.5px' }}>Today</button>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: '4px' }}>
                        {DAYS.map((d) => (
                            <div key={d} style={{ fontSize: '11.5px', fontWeight: 700, color: '#9ca3af', padding: '6px 0' }}>{d}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '6px' }}>
                        {cells.map((cell, i) => {
                            const dayBlocks = blocksForDay(cell.day, cell.cur);
                            const todayCell = isToday(cell.day, cell.cur);
                            return (
                                <div
                                    key={i}
                                    onClick={() => openModalForDay(cell.day, cell.cur)}
                                    style={{
                                        minHeight: '74px',
                                        borderRadius: '10px',
                                        border: todayCell ? '1.5px solid #f5a623' : '1px solid #f3f4f6',
                                        background: !cell.cur ? '#fafafa' : '#fff',
                                        padding: '6px',
                                        cursor: cell.cur ? 'pointer' : 'default',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                    }}
                                >
                                    <span style={{
                                        fontSize: '12.5px',
                                        fontWeight: todayCell ? 800 : 600,
                                        color: !cell.cur ? '#d1d5db' : todayCell ? '#f5a623' : '#374151',
                                    }}>
                                        {cell.day}
                                    </span>
                                    {dayBlocks.slice(0, 2).map((b, idx) => {
                                        const meta = reasonMeta(b.reason);
                                        return (
                                            <span
                                                key={idx}
                                                style={{
                                                    fontSize: '9.5px',
                                                    fontWeight: 700,
                                                    color: meta.color,
                                                    background: meta.bg,
                                                    borderRadius: '5px',
                                                    padding: '2px 5px',
                                                    textTransform: 'capitalize',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {meta.label}
                                            </span>
                                        );
                                    })}
                                    {dayBlocks.length > 2 && (
                                        <span style={{ fontSize: '9.5px', color: '#9ca3af', fontWeight: 600 }}>
                                            +{dayBlocks.length - 2} more
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {loading && (
                        <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#9ca3af', marginTop: '14px' }}>Loading…</p>
                    )}

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                        {REASONS.map((r) => (
                            <div key={r.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
                                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: r.color, display: 'inline-block' }} />
                                {r.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddBlockModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveBlock}
                defaultDate={modalDate}
            />
        </PhotographerLayout>
    );
};

/* ─── styles ───────────────────────────────────────────────────────────────── */
const card = {
    background: '#fff',
    borderRadius: '16px',
    padding: '22px',
    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    border: '1px solid #f3f4f6',
};

const navBtn = {
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '6px 12px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#374151',
    lineHeight: 1,
};

const addBtnStyle = {
    background: '#f5a623',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '11px 18px',
    fontSize: '13.5px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
};

const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(17,24,39,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
};

const modalStyle = {
    background: '#fff',
    borderRadius: '16px',
    padding: '26px',
    width: '460px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
};

const closeBtnStyle = {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    lineHeight: 1,
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0 0 0 12px',
};

const labelStyle = {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '6px',
};

const inputStyle = {
    width: '100%',
    padding: '9px 11px',
    borderRadius: '8px',
    border: '1.5px solid #e5e7eb',
    fontSize: '13px',
    color: '#1a1a1a',
    boxSizing: 'border-box',
};

const cancelBtnStyle = {
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '9px',
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#374151',
    cursor: 'pointer',
};

const saveBtnStyle = {
    background: '#f5a623',
    border: 'none',
    borderRadius: '9px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
};

export default AvailabilityCalendar;