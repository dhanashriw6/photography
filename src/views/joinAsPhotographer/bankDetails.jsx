import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { addBankDetails } from '../../services/bank';
// NOTE: The following 3 are ASSUMED service functions for the saved-accounts list.
// Add them to ../../services/bank.js (or rename the imports to match what you already have):
//   - getBankDetailsList()        -> GET list of saved accounts (the array of objects you shared)
//   - updateBankDetails(id, body) -> PUT/PATCH to edit an existing account
//   - deleteBankDetails(id)       -> DELETE an account
//   - setPrimaryBankDetails(id)   -> PATCH to mark an account as primary
import {
    getBankDetailsList,
    // updateBankDetails,
    // deleteBankDetails,
    // setPrimaryBankDetails,
} from '../../services/bank';

const ACCOUNT_TYPES = [
    { value: 'savings', label: 'Savings' },
    { value: 'current', label: 'Current' },
];

const ORANGE = '#f5a623';
const ORANGE_BG = '#FFF9EE';

const emptyForm = {
    id: null,
    holderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    accountType: 'savings',
    isPrimary: true,
};

// ── IFSC → Bank name lookup (free public API, no key required) ──
// https://ifsc.razorpay.com/{IFSC_CODE}
const fetchBankByIFSC = async (ifsc) => {
    if (!ifsc || ifsc.length !== 11) return null;
    try {
        const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data?.BANK || null;
    } catch (err) {
        return null;
    }
};

const maskAccountNumber = (num = '') => {
    const str = String(num);
    if (str.length <= 4) return str;
    const last4 = str.slice(-4);
    return `•••• •••• ${last4}`;
};

const STATUS_STYLES = {
    pending_verification: { bg: '#FEF3C7', color: '#92400e', label: 'Pending Verification' },
    rejected: { bg: '#fee2e2', color: '#b91c1c', label: 'Rejected' },
    verified: { bg: '#dcfce7', color: '#15803d', label: 'Verified' },
    active: { bg: '#dcfce7', color: '#15803d', label: 'Verified' },
};

// ── Small inline icons (no external icon lib dependency) ──
const BankIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 10L12 4L21 10" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10V19M9.5 10V19M14.5 10V19M19 10V19" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 19H21" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3 21H21" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const EditIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M12 20h9" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const StarIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M12 2.5l3 6.2 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.9 3.1 1.1-6.5L2.5 9.6l6.5-.9Z" stroke={ORANGE} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AddBankDetails = ({ onSave, onCancel }) => {
    const [form, setForm] = useState(emptyForm);

    const [accounts, setAccounts] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState('');
    const [saveOk, setSaveOk] = useState('');

    const [bankName, setBankName] = useState('');
    const [bankLookupLoading, setBankLookupLoading] = useState(false);
    const [bankNameCache, setBankNameCache] = useState({});

    const formTopRef = useRef(null);
    const debounceRef = useRef(null);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    // ── Load saved accounts ──
    const loadAccounts = async () => {
        setListLoading(true);
        try {
            const res = await getBankDetailsList();
            const data = res?.data?.data || res?.data || [];
            if (Array.isArray(data)) setAccounts(data);
        } catch (err) {
            console.error('Bank accounts fetch error:', err);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    // ── Auto-detect bank name from IFSC as the user types ──
    useEffect(() => {
        clearTimeout(debounceRef.current);
        if (form.ifscCode.length !== 11) {
            setBankName('');
            return;
        }
        debounceRef.current = setTimeout(async () => {
            setBankLookupLoading(true);
            const name = await fetchBankByIFSC(form.ifscCode);
            setBankName(name || '');
            setBankLookupLoading(false);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [form.ifscCode]);

    // ── Resolve bank names for the saved accounts list ──
    useEffect(() => {
        accounts.forEach(async (acc) => {
            if (acc.ifsc_code && bankNameCache[acc.ifsc_code] === undefined) {
                const name = await fetchBankByIFSC(acc.ifsc_code);
                setBankNameCache((prev) => ({ ...prev, [acc.ifsc_code]: name || 'Unknown Bank' }));
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts]);

    const resetForm = () => {
        setForm(emptyForm);
        setBankName('');
        setSaveErr('');
        setSaveOk('');
    };

    const startEdit = (acc) => {
        setForm({
            id: acc.id,
            holderName: acc.account_holder_name || '',
            accountNumber: acc.account_number || '',
            ifscCode: acc.ifsc_code || '',
            upiId: acc.upi_id || '',
            accountType: acc.account_type || 'savings',
            isPrimary: !!acc.is_primary,
        });
        setSaveErr('');
        setSaveOk('');
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ── Save (add or edit) ──
    const handleSave = async () => {
        setSaveErr('');
        setSaveOk('');

        if (!form.holderName.trim()) {
            setSaveErr('Account holder name is required.');
            toast.error('Account holder name is required.');
            return;
        }
        if (!form.accountNumber.trim()) {
            setSaveErr('Account number is required.');
            toast.error('Account number is required.');
            return;
        }
        if (!form.ifscCode.trim() || form.ifscCode.trim().length !== 11) {
            setSaveErr('A valid 11-character IFSC code is required.');
            toast.error('A valid 11-character IFSC code is required.');
            return;
        }

        const payload = {
            account_holder_name: form.holderName.trim(),
            account_number: form.accountNumber.trim(),
            ifsc_code: form.ifscCode.trim().toUpperCase(),
            upi_id: form.upiId.trim() || null,
            account_type: form.accountType,
            is_primary: form.isPrimary,
        };

        try {
            setSaving(true);
            if (form.id) {
                // await updateBankDetails(form.id, payload);
                setSaveOk('Bank details updated successfully!');
                toast.success('Bank details updated successfully!');
            } else {
                await addBankDetails(payload);
                setSaveOk('Bank details saved successfully!');
                toast.success('Bank details saved successfully!');
            }
            onSave?.(payload);
            resetForm();
            loadAccounts();
        } catch (err) {
            const msg =
                err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                'Failed to save bank details.';
            setSaveErr(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    // const handleDelete = async (acc) => {
    //     if (!window.confirm('Remove this bank account?')) return;
    //     try {
    //         await deleteBankDetails(acc.id);
    //         loadAccounts();
    //     } catch (err) {
    //         console.error('Delete bank account error:', err);
    //     }
    // };

    // const handleMakePrimary = async (acc) => {
    //     try {
    //         await setPrimaryBankDetails(acc.id);
    //         loadAccounts();
    //     } catch (err) {
    //         console.error('Set primary bank account error:', err);
    //     }
    // };

    return (
        <div ref={formTopRef}>
            <h2 className="pe-title">Add / Edit Bank Account</h2>
            <p style={{ margin: '0 0 24px', fontSize: '12px', color: '#aaa', lineHeight: 1.6 }}>
                🔒 This information can be changed later.
            </p>

            {/* {saveOk && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#dcfce7', color: '#15803d', fontSize: '13px' }}>
                    {saveOk}
                </div>
            )}
            {saveErr && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13px' }}>
                    {saveErr}
                </div>
            )} */}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Account Holder Name */}
                <div className="su-field">
                    <label>Account Holder Name<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <input
                        type="text"
                        value={form.holderName}
                        onChange={set('holderName')}
                        placeholder="e.g. Rahul Sharma"
                    />
                </div>

                {/* Account Type */}
                <div className="su-field">
                    <label>Account Type<sup style={{ color: '#ef4444' }}>*</sup> <span title="Choose how this account is held" style={{ cursor: 'help', color: '#9ca3af' }}>ⓘ</span></label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        {ACCOUNT_TYPES.map(({ value, label }) => {
                            const isChecked = form.accountType === value;
                            return (
                                <div
                                    key={value}
                                    onClick={() => setForm((f) => ({ ...f, accountType: value }))}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 18px', borderRadius: '8px', cursor: 'pointer',
                                        border: `1.5px solid ${isChecked ? ORANGE : '#d1d5db'}`,
                                        background: isChecked ? ORANGE_BG : '#fff',
                                        boxShadow: isChecked ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                                        transition: 'all 0.2s', userSelect: 'none', flex: 1,
                                    }}
                                >
                                    <div style={{
                                        width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                                        border: `2px solid ${isChecked ? ORANGE : '#d1d5db'}`,
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {isChecked && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ORANGE }} />}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: isChecked ? 600 : 400, color: isChecked ? '#1a1a1a' : '#374151' }}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Account Number */}
                <div className="su-field">
                    <label>Account Number<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <input
                        type="text"
                        value={form.accountNumber}
                        onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))}
                        placeholder="e.g. 1234567890"
                        maxLength={18}
                    />
                </div>

                {/* IFSC Code */}
                <div className="su-field">
                    <label>IFSC Code<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <input
                        type="text"
                        value={form.ifscCode}
                        onChange={(e) => setForm((f) => ({ ...f, ifscCode: e.target.value.toUpperCase() }))}
                        placeholder="e.g. HDFC0001234"
                        maxLength={11}
                    />
                    <p className="su-field-hint">Enter 11-character IFSC code</p>
                </div>

                {/* Bank Name — auto-detected from IFSC, read-only */}
                <div className="su-field">
                    <label>Bank Name</label>
                    <input
                        type="text"
                        value={bankLookupLoading ? 'Detecting bank…' : bankName}
                        disabled
                        placeholder="Auto-detected from IFSC code"
                        style={{ background: '#f3f4f6', color: bankName ? '#111' : '#9ca3af', cursor: 'not-allowed' }}
                    />
                </div>

                {/* UPI ID (optional) */}
                <div className="su-field">
                    <label>UPI ID <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                    <input
                        type="text"
                        value={form.upiId}
                        onChange={set('upiId')}
                        placeholder="e.g. rahul@upi"
                    />
                </div>
            </div>

            {/* Is Primary */}
            <div className="su-field" style={{ marginTop: '20px' }}>
                <div
                    onClick={() => setForm((f) => ({ ...f, isPrimary: !f.isPrimary }))}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                        border: `1.5px solid ${form.isPrimary ? ORANGE : '#d1d5db'}`,
                        background: form.isPrimary ? ORANGE_BG : '#fff',
                        boxShadow: form.isPrimary ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                        transition: 'all 0.2s', userSelect: 'none',
                    }}
                >
                    <div style={{
                        width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                        border: `2px solid ${form.isPrimary ? ORANGE : '#d1d5db'}`,
                        background: form.isPrimary ? ORANGE : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {form.isPrimary && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: form.isPrimary ? 600 : 400, color: '#1a1a1a' }}>
                            Set as Primary Account
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>
                            Payouts will be sent to this account by default.
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="pe-form-actions" style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <button
                    type="button"
                    onClick={handleSave}
                    className="su-btn-primary"
                    style={{
                        padding: '11px 28px',
                        opacity: saving ? 0.7 : 1,
                        cursor: saving ? 'not-allowed' : 'pointer',
                    }}
                    disabled={saving}
                >
                    {saving ? 'Saving…' : form.id ? 'Update Changes' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={resetForm}
                    style={{ background: 'none', border: 'none', color: ORANGE, fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                >
                    Reset
                </button>
                {onCancel && (
                    <button onClick={onCancel} className="su-btn-primary-outline" style={{ marginLeft: 'auto' }}>
                        Cancel
                    </button>
                )}
            </div>

            {/* ── Saved Bank Accounts ── */}
            <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #eee' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>Saved Bank Accounts</h3>

                {listLoading && (
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>Loading saved accounts…</p>
                )}

                {!listLoading && accounts.length === 0 && (
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>No bank accounts saved yet.</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {accounts.map((acc) => {
                        const resolvedBank = bankNameCache[acc.ifsc_code];
                        const statusInfo = acc.status && STATUS_STYLES[acc.status];
                        return (
                            <div
                                key={acc.id}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '16px 18px', borderRadius: '10px',
                                    border: `1.5px solid ${acc.is_primary ? ORANGE : '#eee'}`,
                                    background: acc.is_primary ? ORANGE_BG : '#fff',
                                }}
                            >
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '8px', background: ORANGE_BG,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <BankIcon />
                                </div>

                                <div style={{ minWidth: '160px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>
                                            {resolvedBank === undefined ? 'Detecting…' : resolvedBank}
                                        </span>
                                        {acc.is_primary && (
                                            <span style={{ fontSize: '11px', fontWeight: 600, color: ORANGE, background: '#FFF1DC', padding: '2px 8px', borderRadius: '999px' }}>
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                        {acc.account_holder_name}
                                    </div>
                                </div>

                                <div style={{ minWidth: '140px' }}>
                                    <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'capitalize' }}>
                                        {acc.account_type} Account
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#374151', fontWeight: 500, marginTop: '2px' }}>
                                        {maskAccountNumber(acc.account_number)}
                                    </div>
                                </div>

                                <div style={{ minWidth: '120px' }}>
                                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>IFSC Code</div>
                                    <div style={{ fontSize: '13px', color: '#374151', fontWeight: 500, marginTop: '2px' }}>
                                        {acc.ifsc_code}
                                    </div>
                                </div>

                                {statusInfo && (
                                    <span style={{
                                        fontSize: '11px', fontWeight: 600, color: statusInfo.color,
                                        background: statusInfo.bg, padding: '4px 10px', borderRadius: '999px',
                                        whiteSpace: 'nowrap',
                                    }} title={acc.rejection_reason || ''}>
                                        {statusInfo.label}
                                    </span>
                                )}

                                <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto', flexShrink: 0 }}>
                                    {/* <button onClick={() => startEdit(acc)} style={btnGhostStyle}>
                                        <EditIcon /> Edit
                                    </button> */}
                                    {!acc.is_primary && (
                                        <button onClick={() => handleMakePrimary(acc)} style={btnGhostStyle}>
                                            <StarIcon /> Make Primary
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(acc)} style={{ ...btnGhostStyle, color: '#dc2626' }}>
                                        <TrashIcon /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={resetForm}
                    style={{
                        marginTop: '20px', width: '100%', padding: '12px',
                        border: `1.5px dashed ${ORANGE}`, borderRadius: '8px',
                        background: 'transparent', color: ORANGE, fontWeight: 600, fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    + Add New Bank Account
                </button>
            </div>
        </div>
    );
};

const btnGhostStyle = {
    display: 'flex', alignItems: 'center', gap: '5px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '12.5px', fontWeight: 600, color: '#374151', padding: 0,
};

export default AddBankDetails;