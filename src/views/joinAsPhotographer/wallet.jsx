
import React, { useState } from 'react';
 
const BANKS = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Bank of Baroda', 'Punjab National Bank', 'Kotak Mahindra Bank',
    'Canara Bank', 'Union Bank of India', 'IndusInd Bank',
];
const CashWithdrawal = ({ balance = 123.0, onWithdraw }) => {
    const [showChange, setShowChange] = useState(false);
    const [form, setForm] = useState({
        holderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
    });
 
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
 
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
 
            {/* Cash balance card */}
            <div style={{
                background: '#fff',
                border: '1.5px solid #e5e7eb',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}>
                <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>
                    Cash
                </h2>
 
                <div style={{
                    background: '#FFFAF0', borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '20px',
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a' }}>
                            ${balance.toFixed(2)}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>Total Cash</p>
                    </div>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: '#FFF3D6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: '20px' }}>💰</span>
                    </div>
                </div>
 
                <div className="pe-form-actions" style={{ marginTop: 0 }}>
                    <button
                        className="su-btn-primary-outline"
                        // onClick={() => setShowChange(v => !v)}
                    >
                        Change Bank Details
                    </button>
                    <button
                        className="su-btn-primary"
                        style={{ padding: '11px 24px' }}
                        onClick={onWithdraw}
                    >
                        Withdrawal
                    </button>
                </div>
            </div>
 
            {/* Inline Change Bank Details form */}
           
                <div>
                    <h2 className="pe-title" style={{ marginBottom: '24px' }}>
                        Change Bank Details
                    </h2>
 
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
 
                        <div className="su-field">
                            <label>Account Holder Name</label>
                            <input type="text" value={form.holderName} onChange={set('holderName')} placeholder="Your Name" />
                        </div>
 
                        <div className="su-field">
                            <label>Account Number</label>
                            <input type="text" value={form.accountNumber} onChange={set('accountNumber')} placeholder="Your Account Number" />
                        </div>
 
                        <div className="su-field">
                            <label>IFSC Code</label>
                            <input type="text" value={form.ifscCode} onChange={set('ifscCode')} placeholder="IFSC Code" />
                        </div>
 
                        <div className="su-field">
                            <label>Bank Name</label>
                            <select value={form.bankName} onChange={set('bankName')}>
                                <option value="">Select Bank</option>
                                {BANKS.map(b => <option key={b}>{b}</option>)}
                            </select>
                        </div>
 
                    </div>
 
                    <div className="pe-form-actions" style={{ marginTop: '28px' }}>
                        <button className="su-btn-primary-outline" onClick={() => setShowChange(false)}>Cancel</button>
                        <button
                            className="su-btn-primary"
                            style={{ padding: '11px 28px' }}
                            onClick={() => setShowChange(false)}
                        >
                            Save
                        </button>
                    </div>
                </div>
          
        </div>
    );
};

export default CashWithdrawal;