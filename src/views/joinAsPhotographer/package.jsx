import React, { useState, useEffect } from 'react';
import '../index.css';
import { FiPlus, FiX, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import {
    createPackage,
    updatePackage,
    deletePackage,
    getAllPackages,
} from '../../services/package';
import { getCategory } from '../../services/common';

/* ─── Add / Edit Package Modal ─────────────────────────────────────────── */

const PackageModal = ({ open, onClose, onSaved, editData, categories, userSkills = [] }) => {
    const [form, setForm] = useState({
        category_id: '',
        price_per_hour: '',
        price_per_half_day: '',
        price_per_day: '',
        skill: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editData) {
            setForm({
                category_id: editData.category?.id ?? editData.category_id ?? '',
                skill: editData.skill ?? '',
                price_per_hour: editData.price_per_hour ?? '',
                price_per_half_day: editData.price_per_half_day ?? '',
                price_per_day: editData.price_per_day ?? '',
            });
        } else {
            setForm({ category_id: '', skill: '', price_per_hour: '', price_per_half_day: '', price_per_day: '' });
        }
        setError('');
    }, [editData, open]);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async () => {
        setError('');
        if (!form.category_id) return setError('Please select a category.');
        if (!form.price_per_hour) return setError('Please enter price per hour.');
        if (!form.price_per_half_day) return setError('Please enter price per half day.');
        if (!form.price_per_day) return setError('Please enter price per day.');
        if (!form.skill) return setError('Please select a skill.');

        const payload = {
            category_id: Number(form.category_id),
            skill: form.skill,
            price_per_hour: parseFloat(form.price_per_hour),
            price_per_half_day: parseFloat(form.price_per_half_day),
            price_per_day: parseFloat(form.price_per_day),
        };

        try {
            setLoading(true);
            if (editData?.id) {
                await updatePackage(editData.id, payload);
            } else {
                await createPackage(payload);
            }
            onSaved(
                editData?.id
                    ? 'Package updated successfully!'
                    : 'Package added successfully!'
            );

            onClose();
        } catch (err) {
            const msg =
                err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                'Failed to save package. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
                    zIndex: 1000, backdropFilter: 'blur(2px)',
                    animation: 'modalFadeIn 0.18s ease',
                }}
            />

            {/* Modal panel */}
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1001, width: '100%', maxWidth: '480px',
                background: '#fff', borderRadius: '16px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                padding: '32px 28px 28px',
                animation: 'modalSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
            }}>

                {/* Modal header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 700, color: '#f5a623', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            {editData ? 'Edit Package' : 'New Package'}
                        </p>
                        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                            {editData ? 'Update Package' : 'Add Package'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: '1.5px solid #e5e7eb', background: '#fafafa',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#888', flexShrink: 0,
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#888'; }}
                    >
                        <FiX size={15} />
                    </button>
                </div>

                {error && (
                    <div style={{
                        marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
                        background: '#fee2e2', color: '#b91c1c', fontSize: '13px',
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Category dropdown */}
                    <div className="su-field">
                        <label>Category</label>
                        <select value={form.category_id} onChange={set('category_id')}>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id ?? cat.name} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="su-field">
                        <label>Skill</label>
                        <select value={form.skill} onChange={set('skill')}>
                            <option value="">Select Skill</option>
                            {userSkills.map(skill => (
                                <option key={skill} value={skill}>
                                    {skill.charAt(0).toUpperCase() + skill.slice(1).replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price per Hour */}
                    <div className="su-field">
                        <label>Price Per Hour (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price_per_hour}
                            onChange={set('price_per_hour')}
                            placeholder="e.g. 500"
                        />
                    </div>

                    {/* Price per Half Day */}
                    <div className="su-field">
                        <label>Price Per Half Day (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price_per_half_day}
                            onChange={set('price_per_half_day')}
                            placeholder="e.g. 1500"
                        />
                    </div>

                    {/* Price per Day */}
                    <div className="su-field">
                        <label>Price Per Day (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price_per_day}
                            onChange={set('price_per_day')}
                            placeholder="e.g. 2500"
                        />
                    </div>

                </div>

                {/* Modal actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                    <button onClick={onClose} className="su-btn-primary-outline" disabled={loading}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="su-btn-primary"
                        style={{ padding: '11px 32px', borderRadius: '50px' }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : editData ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes modalFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.97); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
        </>
    );
};

/* ─── Main Component ────────────────────────────────────────────────────── */
const AddYourPackage = ({ onSave, onCancel }) => {
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        id: null,
    });
    const [userSkills] = useState(() => {
        try {
            const stored = localStorage.getItem('photographer_skills');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchPackages = async () => {
        try {
            setError('');

            const res = await getAllPackages();

            const data =
                res?.data?.data?.packages ??
                res?.data?.data ??
                [];

            setPackages(Array.isArray(data) ? data : []);

        } catch {
            setError('Failed to load packages.');
        }
    };

    useEffect(() => {
        const init = async () => {
            setPageLoading(true);
            try {
                const catRes = await getCategory();
                const catData = catRes?.data?.data?.event_categories;
                if (Array.isArray(catData)) setCategories(catData);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
            await fetchPackages();
            setPageLoading(false);
        };
        init();
    }, []);

    const handleEdit = (pkg) => {
        setEditData(pkg);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        setDeleteModal({
            open: true,
            id,
        });
    };

    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);
            setError('');

            await deletePackage(deleteModal.id);

            setPackages(prev =>
                prev.filter(p => p.id !== deleteModal.id)
            );

            setSuccess('Package deleted successfully!');

            setTimeout(() => {
                setSuccess('');
            }, 2500);

            setDeleteModal({
                open: false,
                id: null,
            });

        } catch {
            setError('Failed to delete package.');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openAdd = () => {
        setEditData(null);
        setModalOpen(true);
    };

    return (
        <div>
            {/* Header */}
            <div className='flex w-full justify-between items-start' style={{ marginBottom: '20px' }}>
                <h2 style={{
                    margin: 0, fontSize: '28px', fontWeight: 700,
                    color: '#1a1a1a', letterSpacing: '-0.02em',
                }}>
                    Add Your Package
                </h2>
                <button
                    type="button"
                    onClick={openAdd}
                    className="su-btn-primary"
                    style={{ padding: '11px 32px', borderRadius: '50px' }}
                >
                    Add Package
                </button>
            </div>

            {success && (
                <div style={{
                    background: '#F0FDF4',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    color: '#16A34A',
                    fontWeight: 600,
                }}>
                    ✓ {success}
                </div>
            )}

            {error && (
                <div style={{
                    marginBottom: '16px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    fontSize: '13px',
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Loading */}
                {pageLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                        <div style={{
                            width: '28px', height: '28px', border: '3px solid #f5a623',
                            borderTopColor: 'transparent', borderRadius: '50%',
                            animation: 'pkgSpin 0.7s linear infinite',
                        }} />
                    </div>
                ) : packages.length === 0 ? (
                    /* Empty state */
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', padding: '40px 20px', gap: '10px',
                        border: '1.5px dashed #d1d5db', borderRadius: '10px', background: '#fafafa',
                    }}>
                        <FiPackage size={36} color="#d1d5db" />
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#aaa' }}>No packages added yet</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#bbb', textAlign: 'center' }}>
                            Add your first package to let clients know your pricing.
                        </p>
                    </div>
                ) : (
                    /* ── Compact horizontal package cards ── */
                    packages.map(pkg => (
                        <div
                            key={pkg.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: '10px',
                                padding: '10px 14px',
                                background: '#fafafa',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#f5a623';
                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(245,166,35,0.10)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Left accent bar */}
                            <div style={{
                                position: 'absolute', left: 0, top: 0, bottom: 0,
                                width: '3px',
                                background: 'linear-gradient(180deg, #f5a623, #f7c26b)',
                                borderRadius: '10px 0 0 10px',
                            }} />

                            {/* Category badge */}
                            <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: '#FFF3D6',
                                color: '#c27a00',
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '0.03em',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                minWidth: '130px',
                                textAlign: 'center',
                            }}>
                                {pkg.category.name}
                            </span>

                            {/* Divider */}
                            <div style={{ width: '1px', alignSelf: 'stretch', background: '#e5e7eb', flexShrink: 0 }} />
                            <span style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                minWidth: '130px',
                                textAlign: 'center',
                                textTransform: 'capitalize',
                                letterSpacing: '0.03em',
                            }}>
                                {pkg.skill
                                    ? pkg.skill
                                        .split('_')
                                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                        .join(' ')
                                    : 'N/A'}
                            </span>

                            {/* Price columns */}
                            <div style={{ display: 'flex', flex: 1, gap: 0 }}>
                                {[
                                    { label: 'Per Hour', value: pkg.price_per_hour },
                                    { label: 'Half Day', value: pkg.price_per_half_day },
                                    { label: 'Per Day', value: pkg.price_per_day },
                                ].map(({ label, value }, i, arr) => (
                                    <div
                                        key={label}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '2px',
                                            padding: '2px 8px',
                                            borderRight: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '10px',
                                            color: '#999',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            fontWeight: 600,
                                        }}>
                                            {label}
                                        </span>
                                        <span style={{
                                            fontSize: '15px',
                                            fontWeight: 700,
                                            color: '#1a1a1a',
                                        }}>
                                            ₹{Number(value).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div style={{ width: '1px', alignSelf: 'stretch', background: '#e5e7eb', flexShrink: 0 }} />

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                <button
                                    type="button"
                                    onClick={() => handleEdit(pkg)}
                                    style={{
                                        width: '30px', height: '30px', borderRadius: '8px',
                                        border: '1.5px solid #e5e7eb', background: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#666', transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.color = '#f5a623'; e.currentTarget.style.background = '#FFF9EE'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#666'; e.currentTarget.style.background = '#fff'; }}
                                >
                                    <FiEdit2 size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(pkg.id)}
                                    style={{
                                        width: '30px', height: '30px', borderRadius: '8px',
                                        border: '1.5px solid #e5e7eb', background: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#666', transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fee2e2'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#666'; e.currentTarget.style.background = '#fff'; }}
                                >
                                    <FiTrash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))
                )}

            </div>

            {/* Modal */}
            <PackageModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={async (message) => {
                    await fetchPackages();

                    setSuccess(message);

                    setTimeout(() => {
                        setSuccess('');
                    }, 2500);
                }}
                editData={editData}
                categories={categories}
                userSkills={userSkills}
            />

            <style>{`@keyframes pkgSpin { to { transform: rotate(360deg); } }`}</style>
            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <>
                    <div
                        onClick={() =>
                            setDeleteModal({
                                open: false,
                                id: null,
                            })
                        }
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.35)',
                            zIndex: 1100,
                            backdropFilter: 'blur(2px)',
                        }}
                    />

                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1101,
                        width: '100%',
                        maxWidth: '420px',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
                        padding: '28px',
                    }}>



                        <h3 style={{
                            margin: '0 0 8px',
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#111827',
                        }}>
                            Delete Package
                        </h3>

                        <p style={{
                            margin: '0 0 24px',
                            fontSize: '14px',
                            color: '#6B7280',
                            lineHeight: 1.6,
                        }}>
                            Are you sure you want to delete this package?
                            This action cannot be undone.
                        </p>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                        }}>
                            <button
                                type="button"
                                className="su-btn-primary-outline"
                                onClick={() =>
                                    setDeleteModal({
                                        open: false,
                                        id: null,
                                    })
                                }
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                                style={{
                                    background: '#DC2626',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50px',
                                    padding: '11px 24px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    opacity: deleteLoading ? 0.7 : 1,
                                }}
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AddYourPackage;