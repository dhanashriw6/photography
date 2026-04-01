import React, { useState } from 'react';
 
const BANKS = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Bank of Baroda', 'Punjab National Bank', 'Kotak Mahindra Bank',
    'Canara Bank', 'Union Bank of India', 'IndusInd Bank',
];
 const AddBankDetails = ({ onSave, onCancel }) => {
    const [form, setForm] = useState({
        holderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
    });
 
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
 
    return (
        <div>
            <h2 style={{
                margin: '0 0 24px',
                fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em',
            }}>
                Add Bank Details
            </h2>
 
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
 
                {/* Account Holder Name */}
                <div className="su-field">
                    <label>Account Holder Name</label>
                    <input
                        type="text"
                        value={form.holderName}
                        onChange={set('holderName')}
                        placeholder="Your Name"
                    />
                </div>
 
                {/* Account Number */}
                <div className="su-field">
                    <label>Account Number</label>
                    <input
                        type="text"
                        value={form.accountNumber}
                        onChange={set('accountNumber')}
                        placeholder="Your Account Number"
                    />
                </div>
 
                {/* IFSC Code */}
                <div className="su-field">
                    <label>IFSC Code</label>
                    <input
                        type="text"
                        value={form.ifscCode}
                        onChange={set('ifscCode')}
                        placeholder="IFSC Code"
                    />
                </div>
 
                {/* Bank Name */}
                <div className="su-field">
                    <label>Bank Name</label>
                    <select value={form.bankName} onChange={set('bankName')}>
                        <option value="">Select Bank</option>
                        {BANKS.map(b => <option key={b}>{b}</option>)}
                    </select>
                </div>
 
            </div>
 
            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button
                    type="button"
                    onClick={() => onSave?.(form)}
                    className="su-btn-primary"
                    style={{ padding: '11px 28px' }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
 
export default AddBankDetails;