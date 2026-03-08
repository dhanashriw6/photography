import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const PasswordField = ({ label, value, onChange, show, onToggle, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
            border: '1.5px solid #e0e0e0', borderRadius: '8px',
            padding: '10px 14px 8px', position: 'relative', background: '#fff',
            transition: 'border-color 0.2s',
        }}
            onFocusCapture={e => e.currentTarget.style.borderColor = '#E8A317'}
            onBlurCapture={e => e.currentTarget.style.borderColor = '#e0e0e0'}
        >
            <label style={{
                position: 'absolute', top: '-9px', left: '12px',
                background: '#fff', padding: '0 4px',
                fontSize: '11px', fontWeight: 600, color: '#999', letterSpacing: '0.03em',
            }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiLock size={14} color="#E8A317" />
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    style={{
                        border: 'none', outline: 'none', background: 'transparent',
                        fontSize: '14px', fontWeight: 500, color: '#1a1a1a',
                        flex: 1, fontFamily: 'inherit', padding: '2px 0',
                    }}
                    placeholder="••••••••"
                />
                <button type="button" onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex' }}>
                    {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
            </div>
        </div>
        {hint && <p style={{ margin: 0, fontSize: '11px', color: '#aaa', paddingLeft: '4px' }}>{hint}</p>}
    </div>
);

const ChangePassword = () => {
    const [fields, setFields] = useState({ current: '', newPwd: '', confirm: '' });
    const [show, setShow] = useState({ current: false, newPwd: false, confirm: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const toggle = (k) => setShow(s => ({ ...s, [k]: !s[k] }));
    const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

    const handleSave = () => {
        setError('');
        if (!fields.current) return setError('Please enter your current password.');
        if (fields.newPwd.length < 8) return setError('New password must be at least 8 characters.');
        if (fields.newPwd !== fields.confirm) return setError('Passwords do not match.');
        setSuccess(true);
        setFields({ current: '', newPwd: '', confirm: '' });
    };

    /* Strength indicator */
    const strength = (() => {
        const p = fields.newPwd;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^a-zA-Z0-9]/.test(p)) s++;
        return s;
    })();
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
    const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][strength];

    return (
        <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Change Password</h2>
            <p style={{ margin: '0 0 32px', fontSize: '13px', color: '#888' }}>Keep your account secure by using a strong password.</p>

            {success && (
                <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
                    ✓ Password updated successfully!
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' }}>
                <PasswordField
                    label="Current Password"
                    value={fields.current}
                    onChange={set('current')}
                    show={show.current}
                    onToggle={() => toggle('current')}
                />

                <PasswordField
                    label="New Password"
                    value={fields.newPwd}
                    onChange={set('newPwd')}
                    show={show.newPwd}
                    onToggle={() => toggle('newPwd')}
                    hint="At least 8 characters with uppercase, number and symbol."
                />

                {/* Strength bar */}
                {fields.newPwd && (
                    <div>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{
                                    flex: 1, height: '4px', borderRadius: '2px',
                                    background: i <= strength ? strengthColor : '#e5e7eb',
                                    transition: 'background 0.3s',
                                }} />
                            ))}
                        </div>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: strengthColor }}>{strengthLabel}</p>
                    </div>
                )}

                <PasswordField
                    label="Confirm New Password"
                    value={fields.confirm}
                    onChange={set('confirm')}
                    show={show.confirm}
                    onToggle={() => toggle('confirm')}
                />

                {error && <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</p>}

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => { setFields({ current: '', newPwd: '', confirm: '' }); setError(''); setSuccess(false); }} style={{
                        background: '#fff', color: '#E8A317', border: '2px solid #E8A317',
                        borderRadius: '50px', padding: '11px 28px', fontSize: '14px',
                        fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FFF3D6'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >Cancel</button>
                    <button onClick={handleSave} style={{
                        background: '#E8A317', color: '#fff', border: '2px solid #E8A317',
                        borderRadius: '50px', padding: '11px 28px', fontSize: '14px',
                        fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = '#c98f10'}
                        onMouseLeave={e => e.currentTarget.style.background = '#E8A317'}
                    >Update Password</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;