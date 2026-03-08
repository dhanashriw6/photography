import React, { useState, useRef } from 'react';
import ViewsLayout from '../Layout';
import { FiUploadCloud, FiX } from 'react-icons/fi';
import { ChevronDown } from 'lucide-react';

const FieldBox = ({ label, children }) => (
    <div style={{
        border: '1.5px solid #e0e0e0', borderRadius: '10px',
        padding: '10px 14px 8px', position: 'relative',
        background: '#fff', transition: 'border-color 0.2s',
    }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#E8A317'}
        onBlurCapture={e => e.currentTarget.style.borderColor = '#e0e0e0'}
    >
        <label style={{
            position: 'absolute', top: '-9px', left: '12px',
            background: '#fff', padding: '0 4px',
            fontSize: '11px', fontWeight: 600, color: '#999', letterSpacing: '0.03em',
        }}>{label}</label>
        {children}
    </div>
);

const inputStyle = {
    border: 'none', outline: 'none', background: 'transparent',
    fontSize: '14px', fontWeight: 500, color: '#1a1a1a',
    width: '100%', fontFamily: 'inherit', padding: '4px 0',
};

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
            <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', padding: '0 20px 60px', fontFamily: 'inherit' }}>

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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                            {/* Booking ID */}
                            <FieldBox label="Booking Id">
                                <input style={inputStyle} value={form.bookingId} onChange={set('bookingId')} placeholder="#bk-0000000000" />
                            </FieldBox>

                            {/* Photographer Name */}
                            <FieldBox label="Photographer Name">
                                <input style={inputStyle} value={form.photographer} onChange={set('photographer')} placeholder="Photographer name" />
                            </FieldBox>

                            {/* Dispute Type */}
                            <FieldBox label="Disputes Type">
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <select
                                        value={form.disputeType}
                                        onChange={set('disputeType')}
                                        style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '24px' }}
                                    >
                                        {DISPUTE_TYPES.map(t => (
                                            <option key={t} value={t.toLowerCase()}>{t}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} color="#999" style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
                                </div>
                            </FieldBox>

                            {/* Description */}
                            <FieldBox label="Description Of Disputes">
                                <textarea
                                    value={form.description}
                                    onChange={set('description')}
                                    placeholder="comment"
                                    rows={5}
                                    style={{
                                        ...inputStyle,
                                        resize: 'vertical', lineHeight: 1.6,
                                        boxSizing: 'border-box', paddingTop: '4px',
                                    }}
                                />
                            </FieldBox>

                            {/* Attach Evidence */}
                            <div>
                                <div
                                    onClick={() => fileRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    style={{
                                        border: '1.5px solid #e0e0e0', borderRadius: '10px',
                                        padding: '28px 14px', position: 'relative',
                                        cursor: 'pointer', background: '#fafafa',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'border-color 0.2s, background 0.2s',
                                        minHeight: '100px',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8A317'; e.currentTarget.style.background = '#FFF9EE'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                                >
                                    <label style={{
                                        position: 'absolute', top: '-9px', left: '12px',
                                        background: '#fafafa', padding: '0 4px',
                                        fontSize: '11px', fontWeight: 600, color: '#999', letterSpacing: '0.03em',
                                        pointerEvents: 'none',
                                    }}>Attach Evidence</label>

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
                                                    <img src={f.url} alt={f.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #E8A317' }} />
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
                                            <div style={{ width: '64px', height: '64px', border: '2px dashed #E8A317', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8A317', fontSize: '22px' }}>+</div>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" multiple style={{ display: 'none' }} onChange={handleFiles} />
                            </div>

                            {/* Terms checkbox */}
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                                <div
                                    onClick={() => setForm(f => ({ ...f, agreed: !f.agreed }))}
                                    style={{
                                        width: '18px', height: '18px', flexShrink: 0, marginTop: '1px',
                                        border: `2px solid ${form.agreed ? '#E8A317' : '#ccc'}`,
                                        borderRadius: '4px',
                                        background: form.agreed ? '#E8A317' : '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s', cursor: 'pointer',
                                    }}
                                >
                                    {form.agreed && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>}
                                </div>
                                <span style={{ fontSize: '13px', color: '#555', lineHeight: 1.6 }}>
                                    I agree to the{' '}
                                    <a href="#" style={{ color: '#E8A317', fontWeight: 700, textDecoration: 'underline' }}>terms &amp; conditions</a>
                                </span>
                            </label>

                            {error && (
                                <p style={{ margin: 0, fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>{error}</p>
                            )}

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                style={{
                                    width: '100%', background: '#E8A317', color: '#fff',
                                    border: 'none', borderRadius: '50px', padding: '16px',
                                    fontSize: '15px', fontWeight: 800, cursor: 'pointer',
                                    fontFamily: 'inherit', letterSpacing: '0.02em',
                                    boxShadow: '0 6px 20px rgba(232,163,23,0.35)',
                                    transition: 'background 0.2s, transform 0.2s',
                                    marginTop: '4px',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#c98f10'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#E8A317'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
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