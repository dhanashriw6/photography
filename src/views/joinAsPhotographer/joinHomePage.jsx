import React, { useState, useEffect, useCallback } from 'react';
import PhotographerLayout from './PhotographerLayout';
import { getBlocks, addBlocks, deleteBlocks } from '../../services/calender';
/* ─── constants ────────────────────────────────────────────────────────────── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
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

/* ─── responsive helper ────────────────────────────────────────────────────── */
// Tracks viewport width against a breakpoint so layout can react with real
// JS-driven changes (not just CSS) where inline styles need different values
// (grid columns, font sizes, abbreviated labels, dot-vs-badge rendering, etc).
const useIsNarrow = (breakpoint) => {
    const getMatch = () => (typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false);
    const [isNarrow, setIsNarrow] = useState(getMatch);

    useEffect(() => {
        const onResize = () => setIsNarrow(getMatch());
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakpoint]);

    return isNarrow;
};

/* ─── date helpers ─────────────────────────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, '0');
const toLocalDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toLocalTimeStr = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

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

// format a block's start/end for display in the modal, e.g. "Jul 9, 12:00 AM → Jul 10, 12:00 AM"
const formatBlockRange = (block) => {
    const fmt = (iso) =>
        new Date(iso).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    return `${fmt(block.start_at)} → ${fmt(block.end_at)}`;
};

/* ─── Add Block modal ──────────────────────────────────────────────────────── */
const AddBlockModal = ({ open, onClose, onSave, onDelete, defaultDate, existingBlocks }) => {
    const isNarrow = useIsNarrow(560);

    const [fromDate, setFromDate] = useState(defaultDate);
    const [fromTime, setFromTime] = useState('00:00');
    const [toDate, setToDate] = useState(defaultDate);
    const [toTime, setToTime] = useState('23:59');
    const [reason, setReason] = useState('vacation');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (open) {
            setFromDate(defaultDate);
            setFromTime('00:00');
            setToDate(defaultDate);
            setToTime('23:59');
            setReason('vacation');
            setNote('');
            setError('');
            setDeletingId(null);
        }
    }, [open, defaultDate]);

    if (!open) return null;

    const handleSave = async () => {
        if (!fromDate || !toDate || !fromTime || !toTime) {
            setError('Please select date and time for both From and To.');
            return;
        }

        // start_at = local fromDate @ fromTime
        // end_at   = local toDate @ toTime
        const [fy, fm, fd] = fromDate.split('-').map(Number);
        const [fh, fmin] = fromTime.split(':').map(Number);
        const start_at = new Date(fy, fm - 1, fd, fh, fmin, 0, 0).toISOString();

        const [ty, tm, td] = toDate.split('-').map(Number);
        const [th, tmin] = toTime.split(':').map(Number);
        const end_at = new Date(ty, tm - 1, td, th, tmin, 0, 0).toISOString();

        if (new Date(end_at) <= new Date(start_at)) {
            setError('To date/time must be after From date/time.');
            return;
        }

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

    const handleDelete = async (id) => {
        try {
            setDeletingId(id);
            setError('');
            await onDelete(id);
        } catch (e) {
            setError('Failed to delete block. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div style={overlayStyle(isNarrow)} onClick={onClose}>
            <div style={modalStyle(isNarrow)} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: isNarrow ? '17px' : '19px', fontWeight: 800, color: '#1a1a1a' }}>Manage Blocks</h2>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>
                            Block dates to hide them from client availability.
                        </p>
                    </div>
                    <button onClick={onClose} style={closeBtnStyle}>×</button>
                </div>

                {existingBlocks && existingBlocks.length > 0 && (
                    <div style={{ marginTop: '18px' }}>
                        <label style={labelStyle}>Existing Blocks on This Day</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                            {existingBlocks.map((b) => {
                                const meta = reasonMeta(b.reason);
                                return (
                                    <div
                                        key={b.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: isNarrow ? 'flex-start' : 'center',
                                            justifyContent: 'space-between',
                                            flexWrap: isNarrow ? 'wrap' : 'nowrap',
                                            gap: '10px',
                                            border: '1px solid #f3f4f6',
                                            borderRadius: '9px',
                                            padding: '8px 10px',
                                            background: '#fafafa',
                                        }}
                                    >
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <span
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        color: meta.color,
                                                        background: meta.bg,
                                                        borderRadius: '5px',
                                                        padding: '2px 6px',
                                                        textTransform: 'capitalize',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {meta.label}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600, wordBreak: 'break-word' }}>
                                                    {formatBlockRange(b)}
                                                </span>
                                            </div>
                                            {b.note && (
                                                <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#9ca3af', overflow: 'hidden', whiteSpace: isNarrow ? 'normal' : 'nowrap', textOverflow: 'ellipsis' }}>
                                                    {b.note}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            disabled={deletingId === b.id}
                                            style={{ ...deleteBtnStyle, marginLeft: isNarrow ? 'auto' : 0 }}
                                        >
                                            {deletingId === b.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '20px', paddingTop: existingBlocks && existingBlocks.length > 0 ? '16px' : 0, borderTop: existingBlocks && existingBlocks.length > 0 ? '1px solid #f3f4f6' : 'none' }}>
                    <label style={labelStyle}>Add New Block</label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr 1fr' : '1fr 1fr', gap: isNarrow ? '10px' : '14px', marginTop: '10px' }}>
                    <div>
                        <label style={labelStyle}>From Date</label>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>From Time</label>
                        <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>To Date</label>
                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>To Time</label>
                        <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} style={inputStyle} />
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
                                    padding: isNarrow ? '7px 10px' : '7px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: isNarrow ? '12px' : '12.5px',
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

                <div style={{ display: 'flex', flexDirection: isNarrow ? 'column-reverse' : 'row', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                    <button onClick={onClose} style={{ ...cancelBtnStyle, width: isNarrow ? '100%' : 'auto' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={{ ...saveBtnStyle, width: isNarrow ? '100%' : 'auto' }}>
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

    const isNarrow = useIsNarrow(640);
    const isTiny = useIsNarrow(420);

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
        return Array.isArray(blocks) ? blocks.filter((b) => dayInBlock(dateObj, b)) : [];
    };

    // blocks overlapping the date currently selected in the modal (works even at month edges)
    const blocksForModalDate = () => {
        if (!modalDate) return [];
        const [yy, mm, dd] = modalDate.split('-').map(Number);
        const dateObj = new Date(yy, mm - 1, dd);
        return Array.isArray(blocks) ? blocks.filter((b) => dayInBlock(dateObj, b)) : [];
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

    const handleDeleteBlock = async (id) => {
        await deleteBlocks(id);
        await fetchBlocks();
    };

    const maxBadges = isTiny ? 1 : isNarrow ? 2 : 2;
    const dayLabels = isTiny ? DAYS_SHORT : DAYS;

    return (
        <PhotographerLayout>
            <div style={{ background: '#f9fafb', minHeight: '100vh', width: '100%', padding: isNarrow ? '14px' : '28px', boxSizing: 'border-box' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: isNarrow ? 'stretch' : 'flex-start', flexDirection: isNarrow ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: isNarrow ? '21px' : '26px', fontWeight: 800, color: '#1a1a1a' }}>My Availability Calendar</h1>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                            Manage blocked dates. Blocked dates are hidden from client search.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setModalDate(toLocalDateStr(today));
                            setModalOpen(true);
                        }}
                        style={{ ...addBtnStyle, width: isNarrow ? '100%' : 'auto' }}
                    >
                        + Add Block
                    </button>
                </div>

                {/* Calendar card */}
                <div style={{ ...card, padding: isNarrow ? '14px' : '22px', borderRadius: isNarrow ? '14px' : '16px' }}>
                    {/* Month nav */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: isNarrow ? '6px' : '10px' }}>
                            <button onClick={prev} style={navBtn}>‹</button>
                            <h3 style={{ margin: 0, fontSize: isNarrow ? '15px' : '18px', fontWeight: 700, color: '#1a1a1a', minWidth: isNarrow ? '120px' : '160px', textAlign: 'center' }}>
                                {isTiny ? MONTH_NAMES[m].slice(0, 3) : MONTH_NAMES[m]} {y}
                            </h3>
                            <button onClick={next} style={navBtn}>›</button>
                        </div>
                        <button onClick={goToday} style={{ ...navBtn, padding: '6px 14px', fontSize: '12.5px' }}>Today</button>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: '4px' }}>
                        {dayLabels.map((d, idx) => (
                            <div key={`${d}-${idx}`} style={{ fontSize: isNarrow ? '10px' : '11.5px', fontWeight: 700, color: '#9ca3af', padding: isNarrow ? '4px 0' : '6px 0' }}>{d}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: isNarrow ? '3px' : '6px' }}>
                        {cells.map((cell, i) => {
                            const dayBlocks = blocksForDay(cell.day, cell.cur);
                            const todayCell = isToday(cell.day, cell.cur);
                            return (
                                <div
                                    key={i}
                                    onClick={() => openModalForDay(cell.day, cell.cur)}
                                    style={{
                                        minHeight: isTiny ? '46px' : isNarrow ? '56px' : '74px',
                                        borderRadius: isNarrow ? '7px' : '10px',
                                        border: todayCell ? '1.5px solid #f5a623' : '1px solid #f3f4f6',
                                        background: !cell.cur ? '#fafafa' : '#fff',
                                        padding: isNarrow ? '4px 3px' : '6px',
                                        cursor: cell.cur ? 'pointer' : 'default',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '3px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <span style={{
                                        fontSize: isTiny ? '11px' : '12.5px',
                                        fontWeight: todayCell ? 800 : 600,
                                        color: !cell.cur ? '#d1d5db' : todayCell ? '#f5a623' : '#374151',
                                    }}>
                                        {cell.day}
                                    </span>

                                    {/* On tiny screens, swap text badges for compact color dots so they never overflow the cell */}
                                    {isTiny ? (
                                        dayBlocks.length > 0 && (
                                            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                                                {dayBlocks.slice(0, 4).map((b, idx) => {
                                                    const meta = reasonMeta(b.reason);
                                                    return (
                                                        <span
                                                            key={idx}
                                                            title={meta.label}
                                                            style={{
                                                                width: '6px',
                                                                height: '6px',
                                                                borderRadius: '50%',
                                                                background: meta.color,
                                                                display: 'inline-block',
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            {dayBlocks.slice(0, maxBadges).map((b, idx) => {
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
                                            {dayBlocks.length > maxBadges && (
                                                <span style={{ fontSize: '9.5px', color: '#9ca3af', fontWeight: 600 }}>
                                                    +{dayBlocks.length - maxBadges} more
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {loading && (
                        <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#9ca3af', marginTop: '14px' }}>Loading…</p>
                    )}

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: isNarrow ? '10px' : '16px', flexWrap: 'wrap', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                        {REASONS.map((r) => (
                            <div key={r.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isNarrow ? '11px' : '12px', color: '#6b7280' }}>
                                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: r.color, display: 'inline-block', flexShrink: 0 }} />
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
                onDelete={handleDeleteBlock}
                defaultDate={modalDate}
                existingBlocks={blocksForModalDate()}
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
    boxSizing: 'border-box',
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

// overlay/modal are functions of isNarrow so the modal behaves like a
// bottom sheet on small screens (full width, anchored to the bottom,
// rounded only at the top) instead of a centered fixed-width dialog.
const overlayStyle = (isNarrow) => ({
    position: 'fixed',
    inset: 0,
    background: 'rgba(17,24,39,0.45)',
    display: 'flex',
    alignItems: isNarrow ? 'flex-end' : 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: isNarrow ? 0 : '16px',
});

const modalStyle = (isNarrow) => ({
    background: '#fff',
    borderRadius: isNarrow ? '18px 18px 0 0' : '16px',
    padding: isNarrow ? '18px' : '26px',
    width: isNarrow ? '100%' : '480px',
    maxWidth: '100%',
    maxHeight: isNarrow ? '88vh' : '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    boxSizing: 'border-box',
});

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

const deleteBtnStyle = {
    background: '#fef2f2',
    border: '1.5px solid #fecaca',
    borderRadius: '7px',
    padding: '6px 10px',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#dc2626',
    cursor: 'pointer',
    flexShrink: 0,
};

export default AvailabilityCalendar;