import React, { useState, useEffect } from 'react';
import { addBankDetails } from '../../services/bank';
import { getBankList } from '../../services/common';

const ACCOUNT_TYPES = [
    { value: 'savings', label: 'Savings' },
    { value: 'current', label: 'Current' },
];

const AddBankDetails = ({ onSave, onCancel }) => {
    const [form, setForm] = useState({
        holderName: '',
        accountNumber: '',
        ifscCode: '',
        accountType: 'savings',
        isPrimary: true,
    });

    const [banks, setBanks] = useState([]);
    const [banksLoading, setBanksLoading] = useState(false);

    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState('');
    const [saveOk, setSaveOk] = useState('');

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    // ── Fetch bank list ──
    useEffect(() => {
        const fetchBanks = async () => {
            setBanksLoading(true);
            try {
                const res = await getBankList();
                // Adjust path based on your API response shape
                const data = res?.data?.data?.banks || res?.data?.data || [];
                if (Array.isArray(data)) setBanks(data);
            } catch (err) {
                console.error('Bank list fetch error:', err);
            } finally {
                setBanksLoading(false);
            }
        };
        fetchBanks();
    }, []);

    // ── Save ──
    const handleSave = async () => {
        setSaveErr('');
        setSaveOk('');

        if (!form.holderName.trim()) { setSaveErr('Account holder name is required.'); return; }
        if (!form.accountNumber.trim()) { setSaveErr('Account number is required.'); return; }
        if (!form.ifscCode.trim()) { setSaveErr('IFSC code is required.'); return; }
        // if (!form.bankName) { setSaveErr('Please select a bank.'); return; }

        const payload = {
            account_holder_name: form.holderName.trim(),
            account_number: form.accountNumber.trim(),
            ifsc_code: form.ifscCode.trim().toUpperCase(),
            account_type: form.accountType,
            is_primary: form.isPrimary,
        };

        try {
            setSaving(true);
            await addBankDetails(payload);
            setSaveOk('Bank details saved successfully!');
            onSave?.(payload);
        } catch (err) {
            const msg =
                err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                'Failed to save bank details.';
            setSaveErr(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 className="pe-title">
                Add Bank Details
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: '12px', color: '#aaa', lineHeight: 1.6 }}>
                Your bank details are used for payouts. Please ensure all information is accurate.
            </p>

            {/* ── Banners ── */}
            {saveOk && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#dcfce7', color: '#15803d', fontSize: '13px' }}>
                    {saveOk}
                </div>
            )}
            {saveErr && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13px' }}>
                    {saveErr}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Account Holder Name */}
                <div className="su-field">
                    <label>Account Holder Name<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <input
                        type="text"
                        value={form.holderName}
                        onChange={set('holderName')}
                        placeholder="e.g. Rahul Sharma"
                    />
                    <p className="su-field-hint">Must match your bank records exactly.</p>
                </div>

                {/* Account Number */}
                <div className="su-field">
                    <label>Account Number<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <input
                        type="text"
                        value={form.accountNumber}
                        onChange={(e) => setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))}
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
                        onChange={(e) => setForm(f => ({ ...f, ifscCode: e.target.value.toUpperCase() }))}
                        placeholder="e.g. HDFC0001234"
                        maxLength={11}
                    />
                    <p className="su-field-hint">11-character code found on your chequebook or passbook.</p>
                </div>

                {/* Bank Name */}
                {/* <div className="su-field">
                    <label>Bank Name<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <select
                        value={form.bankName}
                        onChange={set('bankName')}
                        disabled={banksLoading}
                        style={{ color: form.bankName ? '#111' : '#9ca3af' }}
                    >
                        <option value="">
                            {banksLoading ? 'Loading banks…' : 'Select Bank'}
                        </option>
                        {banks.map(b => {
                            // Support both { id, name } objects and plain strings
                            const label = b?.name || b;
                            const value = b?.id || b?.name || b;
                            return <option key={value} value={value}>{label}</option>;
                        })}
                    </select>
                </div> */}

                {/* Account Type */}
                <div className="su-field">
                    <label>Account Type<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        {ACCOUNT_TYPES.map(({ value, label }) => {
                            const isChecked = form.accountType === value;
                            return (
                                <div
                                    key={value}
                                    onClick={() => setForm(f => ({ ...f, accountType: value }))}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                                        border: `1.5px solid ${isChecked ? '#f5a623' : '#d1d5db'}`,
                                        background: isChecked ? '#FFF9EE' : '#fff',
                                        boxShadow: isChecked ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                                        transition: 'all 0.2s', userSelect: 'none', flex: 1,
                                    }}
                                >
                                    <div style={{
                                        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                                        border: `2px solid ${isChecked ? '#f5a623' : '#d1d5db'}`,
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'border-color 0.2s',
                                    }}>
                                        {isChecked && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f5a623' }} />}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: isChecked ? 600 : 400, color: isChecked ? '#1a1a1a' : '#374151' }}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Is Primary */}
                <div className="su-field">
                    <div
                        onClick={() => setForm(f => ({ ...f, isPrimary: !f.isPrimary }))}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                            border: `1.5px solid ${form.isPrimary ? '#f5a623' : '#d1d5db'}`,
                            background: form.isPrimary ? '#FFF9EE' : '#fff',
                            boxShadow: form.isPrimary ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                            transition: 'all 0.2s', userSelect: 'none',
                        }}
                    >
                        {/* Checkbox */}
                        <div style={{
                            width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                            border: `2px solid ${form.isPrimary ? '#f5a623' : '#d1d5db'}`,
                            background: form.isPrimary ? '#f5a623' : '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
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

            </div>

            {/* Action buttons */}
            <div className="pe-form-actions" style={{ marginTop: '32px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
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
                    {saving ? 'Saving…' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default AddBankDetails;