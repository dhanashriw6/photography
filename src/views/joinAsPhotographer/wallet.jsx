import React, { useEffect, useState } from 'react';
import { getWalletBalance } from '../../services/wallet';

const BANKS = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Bank of Baroda', 'Punjab National Bank', 'Kotak Mahindra Bank',
    'Canara Bank', 'Union Bank of India', 'IndusInd Bank',
];

const TRANSACTION_TYPES = ['All Transaction Types', 'Payment Received', 'Withdrawal', 'Refund Adjustment', 'Commission Deduction'];

const MOCK_TRANSACTIONS = [
    { id: 'TXN-20240530-0012', date: 'May 30, 2024', time: '10:24 AM', type: 'Payment Received', description: 'Booking payment received', ref: 'Order #ORD-20240530-0891', amount: '+$350.00', status: 'Completed', statusColor: '#16a34a', icon: '↓', iconBg: '#dcfce7', iconColor: '#16a34a' },
    { id: 'TXN-20240528-0098', date: 'May 28, 2024', time: '03:15 PM', type: 'Withdrawal', description: 'Withdrawal to Bank Account', ref: '**** **** **** 1234', amount: '-$500.00', status: 'Completed', statusColor: '#16a34a', icon: '↑', iconBg: '#fef9c3', iconColor: '#ca8a04' },
    { id: 'TXN-20240526-0076', date: 'May 26, 2024', time: '11:42 AM', type: 'Refund Adjustment', description: 'Client refund for order', ref: 'Order #ORD-20240525-0550', amount: '-$120.00', status: 'Completed', statusColor: '#16a34a', icon: '↺', iconBg: '#dbeafe', iconColor: '#2563eb' },
    { id: 'TXN-20240525-0041', date: 'May 25, 2024', time: '09:30 AM', type: 'Commission Deduction', description: 'Platform commission (15%)', ref: 'Order #ORD-20240524-0328', amount: '-$52.50', status: 'Completed', statusColor: '#16a34a', icon: '%', iconBg: '#fce7f3', iconColor: '#db2777' },
    { id: 'TXN-20240524-0022', date: 'May 24, 2024', time: '02:10 PM', type: 'Payment Received', description: 'Booking payment received', ref: 'Order #ORD-20240524-0328', amount: '+$450.00', status: 'Pending', statusColor: '#d97706', icon: '↓', iconBg: '#dcfce7', iconColor: '#16a34a' },
    { id: 'TXN-20240522-0017', date: 'May 22, 2024', time: '04:50 PM', type: 'Withdrawal', description: 'Withdrawal to Bank Account', ref: '**** **** **** 1234', amount: '-$300.00', status: 'Failed', statusColor: '#dc2626', icon: '↑', iconBg: '#fee2e2', iconColor: '#dc2626' },
];

const StatusBadge = ({ status, color }) => {
    const bg = color === '#16a34a' ? '#f0fdf4' : color === '#d97706' ? '#fffbeb' : '#fef2f2';
    return (
        <span style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            color,
            background: bg,
            border: `1px solid ${color}33`,
        }}>{status}</span>
    );
};

const StatCard = ({ icon, label, value, sub, iconBg }) => (
    <div style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: '14px',
        padding: '20px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flex: 1,
        minWidth: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
        <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: iconBg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '22px', flexShrink: 0,
        }}>{icon}</div>
        <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</p>
            <p style={{ margin: '4px 0 2px', fontSize: '22px', fontWeight: 700, color: '#111' }}>{value}</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{sub}</p>
        </div>
    </div>
);

const CashWithdrawal = ({ balance = 1234.50, onWithdraw }) => {
    const [showBankForm, setShowBankForm] = useState(false);
    const [search, setSearch] = useState('');
    const [txType, setTxType] = useState('All Transaction Types');
    const [page, setPage] = useState(1);
    const [form, setForm] = useState({ holderName: '', accountNumber: '', ifscCode: '', bankName: '' });

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const filtered = MOCK_TRANSACTIONS.filter(t => {
        const matchType = txType === 'All Transaction Types' || t.type === txType;
        const matchSearch = !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / 6) || 1;

    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            try {
                const res = await getWalletBalance();
                setWalletBalance(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWalletBalance();
    }, []);

    return (
        <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: '0', maxWidth: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#111' }}>Wallet</h1>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Track your earnings, transactions and manage your withdrawals.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* <button
                        onClick={() => setShowBankForm(v => !v)}
                        className='su-btn-primary'
                    >
                        🏦 Bank Details
                    </button> */}
                    <button
                        onClick={onWithdraw}
                       className='su-btn-primary'
                    >
                        ↑ Withdraw Funds
                    </button>
                    <button
                       className='su-btn-primary'
                    >
                        ⬇ Download Statement
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <StatCard icon="👛" label="Total Balance" value={`${walletBalance.currency} ${walletBalance.total_balance}`} sub="All time balance" iconBg="#FFF3E0" />
                <StatCard icon="💵" label="Available to Withdraw" value={`${walletBalance.currency} ${walletBalance.withdrawable_balance}`} sub="Ready for withdrawal" iconBg="#E8F5E9" />
                <StatCard icon="🕐" label="Locked Balance" value={`${walletBalance.currency} ${walletBalance.locked_balance}`} sub="Clearing (hold period)" iconBg="#EDE7F6" />
                {/* <StatCard icon="📊" label="Total Earnings" value="$4,812.75" sub="Lifetime earnings" iconBg="#E3F2FD" /> */}
            </div>

            {/* Bank Details Form (toggleable) */}
            {showBankForm && (
                <div style={{
                    background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: '14px',
                    padding: '24px', marginBottom: '24px',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                }}>
                    <h2 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#111' }}>Change Bank Details</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {[
                            { label: 'Account Holder Name', key: 'holderName', placeholder: 'Your Name', type: 'text' },
                            { label: 'Account Number', key: 'accountNumber', placeholder: 'Your Account Number', type: 'text' },
                            { label: 'IFSC Code', key: 'ifscCode', placeholder: 'IFSC Code', type: 'text' },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>{f.label}</label>
                                <input
                                    type={f.type}
                                    value={form[f.key]}
                                    onChange={set(f.key)}
                                    placeholder={f.placeholder}
                                    style={{
                                        width: '100%', padding: '9px 12px', borderRadius: '8px',
                                        border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none',
                                        boxSizing: 'border-box', color: '#111',
                                    }}
                                />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Bank Name</label>
                            <select
                                value={form.bankName}
                                onChange={set('bankName')}
                                style={{
                                    width: '100%', padding: '9px 12px', borderRadius: '8px',
                                    border: '1.5px solid #e5e7eb', fontSize: '13px', outline: 'none',
                                    boxSizing: 'border-box', color: form.bankName ? '#111' : '#aaa', background: '#fff',
                                }}
                            >
                                <option value="">Select Bank</option>
                                {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setShowBankForm(false)}
                            style={{ padding: '9px 20px', borderRadius: '8px', border: '1.5px solid #e0e0e0', background: '#fff', fontSize: '13px', fontWeight: 600, color: '#555', cursor: 'pointer' }}
                        >Cancel</button>
                        <button
                            onClick={() => setShowBankForm(false)}
                            style={{ padding: '9px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #f97316)', fontSize: '13px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                        >Save Details</button>
                    </div>
                </div>
            )}

            {/* Transactions Panel */}
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                {/* Filters */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '160px' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '14px' }}>🔍</span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search transactions..."
                            style={{
                                width: '100%', paddingLeft: '36px', padding: '9px 12px 9px 36px',
                                border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px',
                                outline: 'none', boxSizing: 'border-box', color: '#333',
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#555', whiteSpace: 'nowrap', background: '#fff' }}>
                        📅 <span>May 01, 2024</span> <span style={{ color: '#bbb' }}>–</span> <span>May 31, 2024</span> <span style={{ marginLeft: '4px', color: '#aaa' }}>▾</span>
                    </div>
                    <select
                        value={txType}
                        onChange={e => setTxType(e.target.value)}
                        style={{
                            padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px',
                            fontSize: '13px', color: '#555', outline: 'none', background: '#fff', cursor: 'pointer',
                        }}
                    >
                        {TRANSACTION_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <button
                        onClick={() => { setSearch(''); setTxType('All Transaction Types'); }}
                        style={{ padding: '9px 16px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: '#fff', fontSize: '13px', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                    >
                        ↺ Reset Filters
                    </button>
                </div>

                {/* Table */}
                <div style={{ padding: '20px 20px 0' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#111' }}>Recent Transactions</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    {['Date ↕', 'Transaction ID', 'Type', 'Description', 'Amount ↕', 'Status', ''].map(h => (
                                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#888', fontSize: '12px', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.slice((page - 1) * 6, page * 6).map((t, i) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid #fafafa', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                                            <div style={{ fontWeight: 600, color: '#222' }}>{t.date}</div>
                                            <div style={{ color: '#aaa', fontSize: '11px' }}>{t.time}</div>
                                        </td>
                                        <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ color: '#333', fontFamily: 'monospace', fontSize: '12px' }}>{t.id}</span>
                                                <span style={{ color: '#ccc', cursor: 'pointer', fontSize: '14px' }}>⧉</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{
                                                    width: '28px', height: '28px', borderRadius: '50%',
                                                    background: t.iconBg, display: 'inline-flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    color: t.iconColor, fontSize: '13px', fontWeight: 700, flexShrink: 0,
                                                }}>{t.icon}</span>
                                                <span style={{ color: '#333', whiteSpace: 'nowrap' }}>{t.type}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 14px' }}>
                                            <div style={{ color: '#222', fontWeight: 500 }}>{t.description}</div>
                                            <div style={{ color: '#aaa', fontSize: '11px' }}>{t.ref}</div>
                                        </td>
                                        <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                                            <span style={{ fontWeight: 700, color: t.amount.startsWith('+') ? '#16a34a' : '#dc2626', fontSize: '14px' }}>
                                                {t.amount}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 14px' }}>
                                            <StatusBadge status={t.status} color={t.statusColor} />
                                        </td>
                                        <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                                            <span style={{ color: '#ccc', cursor: 'pointer', fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>⋮</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer / Pagination */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                        Showing {Math.min((page - 1) * 6 + 1, filtered.length)} to {Math.min(page * 6, filtered.length)} of {filtered.length} transactions
                    </span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : '#555', fontSize: '14px' }}
                        >‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid',
                                    borderColor: page === p ? '#f97316' : '#e5e7eb',
                                    background: page === p ? 'linear-gradient(135deg, #f59e0b, #f97316)' : '#fff',
                                    color: page === p ? '#fff' : '#555',
                                    fontSize: '13px', fontWeight: page === p ? 700 : 400,
                                    cursor: 'pointer',
                                }}
                            >{p}</button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : '#555', fontSize: '14px' }}
                        >›</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashWithdrawal;