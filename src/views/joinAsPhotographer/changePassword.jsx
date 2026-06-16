import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { changePassword } from '../../services/profile';

const ChangePassword = () => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleCurrent = () => setShowCurrent(s => !s);
    const toggleNew = () => setShowNew(s => !s);
    const toggleConfirm = () => setShowConfirm(s => !s);

    const handleSave = async () => {

        setError('');       // ← clear at START (before validation), not at end
        setSuccess(false);
        if (!currentPassword) return setError('Please enter your current password.');
        if (newPassword.length < 8) return setError('New password must be at least 8 characters.');
        if (newPassword !== confirmPassword) return setError('Passwords do not match.');

        const payload = {
            current_password: currentPassword,
            new_password: newPassword,

        };
        try {
            setLoading(true);
            const res = await changePassword(payload);

            // Clear fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            setSuccess(true);
        } catch (error) {
            const msg =
                error?.response?.data?.error?.message ||
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong";

            setError(msg);
        } finally {
            setLoading(false);
        }

    };


    return (
        <div>
            <h2 className="pe-title">Change Password</h2>
            <p style={{ margin: '0 0 32px', fontSize: '13px', color: '#888' }}>Keep your account secure by using a strong password.</p>

            {success && (
                <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
                    ✓ Password updated successfully!
                </div>
            )}
            {error && (
                <div style={{
                    marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
                    background: '#fee2e2', color: '#b91c1c', fontSize: '13px',
                }}>
                    {error}
                </div>
            )}


            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' }}>

                {/* Current Password */}
                <div className="su-field">
                    <label>Current Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLock size={14} color="#f5a623" style={{ flexShrink: 0 }} />
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={toggleCurrent} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                            {showCurrent ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="su-field">
                    <label>New Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLock size={14} color="#f5a623" style={{ flexShrink: 0 }} />
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={toggleNew} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                            {showNew ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                        </button>
                    </div>
                    <p className="su-field-hint">At least 8 characters</p>
                </div>



                {/* Confirm Password */}
                <div className="su-field">
                    <label>Confirm New Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiLock size={14} color="#f5a623" style={{ flexShrink: 0 }} />
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={toggleConfirm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0, display: 'flex', flexShrink: 0 }}>
                            {showConfirm ? <FiEye size={15} /> : <FiEyeOff size={15} />}
                        </button>
                    </div>
                </div>


                <div className="pe-form-actions" style={{ marginTop: '8px' }}>
                    <button
                        onClick={() => {
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setError('');
                            setSuccess(false);
                        }}
                        className="su-btn-primary-outline"
                    >
                        Cancel
                    </button>                    <button onClick={handleSave} className="su-btn-primary">Update Password</button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;