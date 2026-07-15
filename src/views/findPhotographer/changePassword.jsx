import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { changePassword } from '../../services/profile';

const ChangePassword = () => {
    const [fields, setFields] = useState({ current: '', newPwd: '', confirm: '' });
    const [show, setShow] = useState({ current: false, newPwd: false, confirm: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggle = (k) => setShow(s => ({ ...s, [k]: !s[k] }));
    const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

    const handleSave = async () => {
        setError('');
        setSuccess(false);
        if (!fields.current) {
            setError('Please enter your current password.');
            toast.error('Please enter your current password.');
            return;
        }
        if (fields.newPwd.length < 8) {
            setError('New password must be at least 8 characters.');
            toast.error('New password must be at least 8 characters.');
            return;
        }
        if (fields.newPwd !== fields.confirm) {
            setError('Passwords do not match.');
            toast.error('Passwords do not match.');
            return;
        }

        const payload = {
            current_password: fields.current,
            new_password: fields.newPwd,
        };

        try {
            setLoading(true);
            await changePassword(payload);
            setSuccess(true);
            toast.success('Password updated successfully!');
            setFields({ current: '', newPwd: '', confirm: '' });
        } catch (err) {
            const msg =
                err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
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
            <h2 style={{ margin: '0 0 6px', fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Change Password</h2>
            <p style={{ margin: '0 0 32px', fontSize: '13px', color: '#888' }}>Keep your account secure by using a strong password.</p>

            {/* {success && (
                <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
                    ✓ Password updated successfully!
                </div>
            )} */}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' }}>

                {/* Current Password */}
                <div className="su-field">
                    <label>Current Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLock size={14} color="#f5a623" style={{ flexShrink: 0 }} />
                        <input
                            type={show.current ? 'text' : 'password'}
                            value={fields.current}
                            onChange={set('current')}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={() => toggle('current')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                            {show.current ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="su-field">
                    <label>New Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLock size={14} color="#f5a623" style={{ flexShrink: 0 }} />
                        <input
                            type={show.newPwd ? 'text' : 'password'}
                            value={fields.newPwd}
                            onChange={set('newPwd')}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={() => toggle('newPwd')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                            {show.newPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                    </div>
                    <p className="su-field-hint">At least 8 characters with uppercase, number and symbol.</p>
                </div>

                {/* Strength bar */}
                {fields.newPwd && (
                    <div style={{ marginTop: '-8px' }}>
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

                {/* Confirm Password */}
                <div className="su-field">
                    <label>Confirm New Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLock size={14} color="#f5a623" style={{ flexShrink: 0 }} />
                        <input
                            type={show.confirm ? 'text' : 'password'}
                            value={fields.confirm}
                            onChange={set('confirm')}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={() => toggle('confirm')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                            {show.confirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                        </button>
                    </div>
                </div>

                {error && <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</p>}

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => { setFields({ current: '', newPwd: '', confirm: '' }); setError(''); setSuccess(false); }} className="su-btn-primary-outline" disabled={loading}>Cancel</button>
                    <button onClick={handleSave} className="su-btn-primary" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;