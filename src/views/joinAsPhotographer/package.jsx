import React, { useState } from 'react';
import '../index.css';
import { FiPlus, FiX } from 'react-icons/fi';

const AddYourPackage = ({ onSave, onCancel }) => {
    const [fullDayPrice, setFullDayPrice] = useState('100000 Rs');
    const [fullDayIncludes, setFullDayIncludes] = useState('5 day , 50 edited photos , All Row photos');

    const [halfDayPrice, setHalfDayPrice] = useState('50 Rs');
    const [halfDayIncludes, setHalfDayIncludes] = useState('5 day , 50 edited photos , All Row photos');

    // Extra custom packages
    const [extraPackages, setExtraPackages] = useState([]);

    const addPackage = () => {
        setExtraPackages(p => [...p, { label: '', price: '', includes: '' }]);
    };

    const removePackage = (i) =>
        setExtraPackages(p => p.filter((_, idx) => idx !== i));

    const updatePackage = (i, key, val) =>
        setExtraPackages(p => p.map((pkg, idx) => idx === i ? { ...pkg, [key]: val } : pkg));

    return (
        <div>
            <h2 style={{
                margin: '0 0 24px', fontSize: '28px', fontWeight: 700,
                color: '#1a1a1a', letterSpacing: '-0.02em',
            }}>
                Add Your Package
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Full Day Price */}
                <div className="su-field">
                    <label>Add Full day package price</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={fullDayPrice}
                            onChange={e => setFullDayPrice(e.target.value)}
                            placeholder="100000 Rs"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: '#f5a623', border: 'none', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.18s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <FiPlus size={18} />
                        </button>
                    </div>
                </div>

                {/* What include in full day */}
                <div className="su-field">
                    <label>What include in full day package</label>
                    <textarea
                        value={fullDayIncludes}
                        onChange={e => setFullDayIncludes(e.target.value)}
                        placeholder="5 day , 50 edited photos , All Row photos"
                        rows={3}
                        style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                </div>

                {/* Half Day Price */}
                <div className="su-field">
                    <label>Add half day package price</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={halfDayPrice}
                            onChange={e => setHalfDayPrice(e.target.value)}
                            placeholder="50 Rs"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: '#f5a623', border: 'none', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.18s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <FiPlus size={18} />
                        </button>
                    </div>
                </div>

                {/* What include in half day */}
                <div className="su-field">
                    <label>What include in half day package</label>
                    <textarea
                        value={halfDayIncludes}
                        onChange={e => setHalfDayIncludes(e.target.value)}
                        placeholder="5 day , 50 edited photos , All Row photos"
                        rows={3}
                        style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                </div>

                {/* Extra custom packages */}
                {extraPackages.map((pkg, i) => (
                    <div key={i} style={{
                        border: '1.5px solid #d1d5db', borderRadius: '10px',
                        padding: '16px', display: 'flex', flexDirection: 'column',
                        gap: '12px', position: 'relative', background: '#fafafa',
                    }}>
                        <button
                            type="button"
                            onClick={() => removePackage(i)}
                            style={{
                                position: 'absolute', top: '12px', right: '12px',
                                background: '#fee2e2', border: 'none', borderRadius: '6px',
                                color: '#ef4444', cursor: 'pointer', padding: '4px',
                                display: 'flex', alignItems: 'center',
                            }}
                        ><FiX size={14} /></button>

                        <div className="su-field" style={{ marginBottom: 0 }}>
                            <label>Package Name</label>
                            <input
                                type="text"
                                value={pkg.label}
                                onChange={e => updatePackage(i, 'label', e.target.value)}
                                placeholder="e.g. Premium Day"
                            />
                        </div>
                        <div className="su-field" style={{ marginBottom: 0 }}>
                            <label>Package Price</label>
                            <input
                                type="text"
                                value={pkg.price}
                                onChange={e => updatePackage(i, 'price', e.target.value)}
                                placeholder="e.g. 75000 Rs"
                            />
                        </div>
                        <div className="su-field" style={{ marginBottom: 0 }}>
                            <label>What's Included</label>
                            <textarea
                                value={pkg.includes}
                                onChange={e => updatePackage(i, 'includes', e.target.value)}
                                placeholder="Describe what's included..."
                                rows={2}
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                    </div>
                ))}

                {/* Add more package button */}
                <button
                    type="button"
                    onClick={addPackage}
                    style={{
                        width: '100%', padding: '11px', borderRadius: '8px',
                        border: '1.5px dashed #d1d5db', background: 'transparent',
                        color: '#888', fontSize: '13px', fontWeight: 600,
                        fontFamily: 'inherit', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '6px', transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.color = '#f5a623'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#888'; }}
                >
                    <FiPlus size={15} /> Add Another Package
                </button>

            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                 <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button
                    type="button"
                    onClick={onSave}
                    className="su-btn-primary"
                    style={{ padding: '11px 32px', borderRadius: '50px' }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default AddYourPackage;