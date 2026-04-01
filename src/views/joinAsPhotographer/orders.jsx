import React, { useState } from 'react';
import '../index.css';
import { FiFilter, FiChevronDown, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ORDERS = [
    { id: 1, eventName: 'wedding',     package: 'Full day', date: '16/06/2025', status: 'Pending' },
    { id: 2, eventName: 'Engagement',  package: 'Full day', date: '16/06/2025', status: 'completed' },
    { id: 3, eventName: 'baby shoot',   package: 'Full day', date: '16/06/2025', status: 'pending' },
    { id: 4, eventName: 'bride to be', package: 'Full day', date: '16/06/2025', status: 'completed' },
];

const STATUS_STYLES = {
    pending:   { background: '#f5a623', color: '#fff' },
    completed: { background: '#0d9488', color: '#fff' },
};

const FILTER_OPTIONS = ['Past Booking', 'Upcoming', 'All'];

const OrderCard = ({ order }) => {
    const statusKey = order.status.toLowerCase();
    const badge = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
    const navigate = useNavigate();

    return (
        <div style={{
            background: '#fff', borderRadius: '12px',
            border: '1.5px solid #e8e8e8', padding: '16px 18px',
            position: 'relative', display: 'flex', flexDirection: 'column',
            gap: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s',
            overflow: 'hidden',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
        >
            {/* Status badge — top right */}
            <span style={{
                position: 'absolute', top: '0px', right: '-5px',
                ...badge,
                fontSize: '11px', fontWeight: 700,
                padding: '3px 12px', borderRadius: '0 0 8px 8px',
                letterSpacing: '0.02em', textTransform: 'capitalize',
            }}>
                {order.status}
            </span>

            {/* Event Name */}
            <div>
                <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Event Name
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '14px', color: '#1a1a1a', fontWeight: 600 }}>
                    {order.eventName}
                </p>
            </div>

            {/* Package + Event Date */}
            <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        pacakage
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#444', fontWeight: 500 }}>
                        {order.package}
                    </p>
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Event Date
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#444', fontWeight: 500 }}>
                        {order.date}
                    </p>
                </div>
            </div>

            {/* View Details + Share */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <button
                    type="button"
                    onClick={() => navigate('/order-summary')}
                    style={{
                        background: 'none', border: 'none', padding: 0,
                        fontSize: '13px', fontWeight: 700, color: '#f5a623',
                        cursor: 'pointer', fontFamily: 'inherit',
                        textDecoration: 'underline', textUnderlineOffset: '2px',
                    }}
                >
                    View Details
                </button>
                <button
                    type="button"
                    style={{
                        background: 'none', border: 'none', padding: '4px',
                        color: '#999', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', borderRadius: '6px',
                        transition: 'color 0.18s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f5a623'}
                    onMouseLeave={e => e.currentTarget.style.color = '#999'}
                >
                    <FiShare2 size={16} />
                </button>
            </div>
        </div>
    );
};

const YourOrderList = () => {
    const [filter, setFilter] = useState('Past Booking');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const filtered = ORDERS.filter(o => {
        if (filter === 'Upcoming') return o.status.toLowerCase() === 'pending';
        if (filter === 'All') return true;
        return true; // Past Booking shows all for demo
    });

    return (
        <div>
            {/* Header */}
            <h2 style={{
                margin: '0 0 20px', fontSize: '28px', fontWeight: 700,
                color: '#1a1a1a', letterSpacing: '-0.02em',
            }}>
                Your Order list
            </h2>

            {/* Filters row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', fontSize: '14px', fontWeight: 600 }}>
                    <FiFilter size={16} color="#888" />
                    <span>Filters:</span>
                </div>

                {/* Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        type="button"
                        onClick={() => setDropdownOpen(v => !v)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 16px', borderRadius: '8px',
                            border: '1.5px solid #d1d5db', background: '#fff',
                            fontSize: '13px', fontWeight: 600, color: '#444',
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'border-color 0.2s',
                            minWidth: '140px', justifyContent: 'space-between',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#f5a623'}
                        onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = '#d1d5db'; }}
                    >
                        {filter}
                        <FiChevronDown
                            size={15}
                            style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                    </button>

                    {dropdownOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                            background: '#fff', border: '1.5px solid #d1d5db',
                            borderRadius: '8px', zIndex: 20, minWidth: '140px',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.10)', overflow: 'hidden',
                        }}>
                            {FILTER_OPTIONS.map(opt => (
                                <div
                                    key={opt}
                                    onClick={() => { setFilter(opt); setDropdownOpen(false); }}
                                    style={{
                                        padding: '10px 16px', fontSize: '13px', cursor: 'pointer',
                                        color: filter === opt ? '#f5a623' : '#444',
                                        fontWeight: filter === opt ? 700 : 500,
                                        background: 'transparent', transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FFF3D6'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '16px',
            }}>
                {filtered.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: '48px 0',
                    color: '#bbb', fontSize: '14px', fontWeight: 500,
                }}>
                    No orders found.
                </div>
            )}
        </div>
    );
};

export default YourOrderList;