import React, { useState, useRef } from 'react';
import ViewsLayout from '../Layout';
import { FiUploadCloud, FiX } from 'react-icons/fi';

const DISPUTE_TYPES = [
    'Poor Image Quality',
    'Photographer No Show',
    'Wrong Package Delivered',
    'Late Delivery of Photos',
    'Unprofessional Behaviour',
    'Missing Photos',
    'Other',
];

const RaiseDispute = () => {
    const [form, setForm] = useState({
        bookingId: '#bk-1234567890',
        photographer: 'john',
        disputeType: 'poor image quality',
        description: '',
        agreed: false,
    });
    const [files, setFiles] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleFiles = (e) => {
        const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files).map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

    const handleSubmit = () => {
        setError('');
        if (!form.bookingId.trim()) return setError('Booking ID is required.');
        if (!form.photographer.trim()) return setError('Photographer name is required.');
        if (!form.description.trim()) return setError('Please describe the dispute.');
        if (!form.agreed) return setError('Please agree to the terms & conditions.');
        setSubmitted(true);
    };

    return (
        <ViewsLayout>
            <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', padding: '0 20px 60px' }}>

                <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 900, color: '#1a1a1a', margin: '0 0 32px', letterSpacing: '-0.02em' }}>
                    Disputes Your Order
                </h1>

                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800, color: '#1a1a1a' }}>Dispute Submitted</h3>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>
                            We've received your dispute request.<br />Our team will review it and get back to you within 48 hours.
                        </p>
                    </div>
                ) : (
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                            {/* Booking ID */}
                            <div className="su-field">
                                <label>Booking Id</label>
                                <input type="text" value={form.bookingId} onChange={set('bookingId')} placeholder="#bk-0000000000" />
                            </div>

                            {/* Photographer Name */}
                            <div className="su-field">
                                <label>Photographer Name</label>
                                <input type="text" value={form.photographer} onChange={set('photographer')} placeholder="Photographer name" />
                            </div>

                            {/* Dispute Type */}
                            <div className="su-field">
                                <label>Disputes Type</label>
                                <select value={form.disputeType} onChange={set('disputeType')}>
                                    {DISPUTE_TYPES.map(t => (
                                        <option key={t} value={t.toLowerCase()}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div className="su-field">
                                <label>Description Of Disputes</label>
                                <textarea
                                    value={form.description}
                                    onChange={set('description')}
                                    placeholder="Describe your dispute..."
                                    rows={5}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Attach Evidence */}
                            <div className="su-field">
                                <label>Attach Evidence</label>
                                <div
                                    onClick={() => fileRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    style={{
                                        border: '1.5px solid #d1d5db', borderRadius: '8px',
                                        padding: '28px 14px', cursor: 'pointer',
                                        background: '#fafafa', minHeight: '100px',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'border-color 0.2s, background 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.background = '#FFF9EE'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
                                >
                                    {files.length === 0 ? (
                                        <>
                                            <FiUploadCloud size={22} color="#bbb" />
                                            <p style={{ margin: 0, fontSize: '13px', color: '#bbb', textAlign: 'center' }}>
                                                Click to upload your document (JPG, JPEG, PNG or PDF)
                                            </p>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                            {files.map((f, i) => (
                                                <div key={i} style={{ position: 'relative' }}>
                                                    <img src={f.url} alt={f.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #f5a623' }} />
                                                    <button
                                                        type="button"
                                                        onClick={ev => { ev.stopPropagation(); removeFile(i); }}
                                                        style={{
                                                            position: 'absolute', top: '-6px', right: '-6px',
                                                            width: '18px', height: '18px', borderRadius: '50%',
                                                            background: '#ef4444', border: 'none', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            padding: 0, color: '#fff',
                                                        }}
                                                    >
                                                        <FiX size={11} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div style={{ width: '64px', height: '64px', border: '2px dashed #f5a623', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5a623', fontSize: '22px' }}>+</div>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" multiple style={{ display: 'none' }} onChange={handleFiles} />
                            </div>

                            {/* Terms checkbox */}
                            <label className="su-checkbox-row">
                                <input
                                    type="checkbox"
                                    checked={form.agreed}
                                    onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
                                />
                                <span>
                                    I agree to the{' '}
                                    <a href="#" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>terms &amp; conditions</a>
                                </span>
                            </label>

                            {error && (
                                <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</p>
                            )}

                            {/* Submit */}
                            <button onClick={handleSubmit} className="su-btn-primary" style={{ width: '100%', marginTop: '4px' }}>
                                Submit Disputes And Request A Resolution
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ViewsLayout>
    );
};

export default RaiseDispute;