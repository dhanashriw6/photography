import React, { useState, useRef } from 'react';
import ViewsLayout from '../Layout';
import {
    FiUploadCloud,
    FiX,
    FiShield,
    FiClipboard,
    FiUser,
    FiList,
    FiEdit3,
    FiArrowRight,
} from 'react-icons/fi';

const DISPUTE_TYPES = [
    'Poor Image Quality',
    'Photographer No Show',
    'Wrong Package Delivered',
    'Late Delivery of Photos',
    'Unprofessional Behaviour',
    'Missing Photos',
    'Other',
];

/* ── Reusable row: icon + label/description on the left, field on the right ── */
const FieldRow = ({ icon, label, description, children }) => (
    <div
        style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: '20px',
            padding: '20px 0',
            borderBottom: '1px solid #f0f0f0',
        }}
    >
        <div style={{ display: 'flex', gap: '14px', flex: '1 1 240px', minWidth: '220px' }}>
            <div
                style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#FFF3D6',
                    color: '#E8A317',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>
            <div>
                <p style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#1a1a1a' }}>{label}</p>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#999', lineHeight: 1.5 }}>{description}</p>
            </div>
        </div>

        <div style={{ flex: '1 1 320px', minWidth: '260px' }}>{children}</div>
    </div>
);

const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '14px',
    color: '#1a1a1a',
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};

const RaiseDispute = () => {
    const [form, setForm] = useState({
        bookingId: '',
        photographer: '',
        disputeType: '',
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
        if (!form.disputeType.trim()) return setError('Please select a dispute type.');
        if (!form.description.trim()) return setError('Please describe the dispute.');
        if (!form.agreed) return setError('Please agree to the terms & conditions.');
        setSubmitted(true);
    };

    const onFocus = (e) => { e.target.style.borderColor = '#f5a623'; };
    const onBlur = (e) => { e.target.style.borderColor = '#e5e7eb'; };

    return (
        <ViewsLayout>
            <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto', padding: '0 20px 60px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px', marginTop:"10px" }}>
                    <div
                        style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '14px',
                            background: '#FFF3D6',
                            color: '#E8A317',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 14px',
                        }}
                    >
                        <FiShield size={24} />
                    </div>
                    <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                        Dispute Your Order
                    </h1>
                    <p style={{ margin: 0, fontSize: '14.5px', color: '#888' }}>
                        Tell us what went wrong and we will review your request.
                    </p>
                </div>

                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800, color: '#1a1a1a' }}>Dispute Submitted</h3>
                        <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.7 }}>
                            We've received your dispute request.<br />Our team will review it and get back to you within 48 hours.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '20px',
                            padding: '8px 32px 32px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                            border: '1px solid #f0f0f0',
                        }}
                    >
                        {/* Booking ID */}
                        <FieldRow icon={<FiClipboard size={19} />} label="Booking ID" description="Enter your booking reference ID.">
                            <input
                                type="text"
                                value={form.bookingId}
                                onChange={set('bookingId')}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder="e.g. #bk-1234567890"
                                style={inputStyle}
                            />
                        </FieldRow>

                        {/* Photographer Name */}
                        <FieldRow icon={<FiUser size={19} />} label="Photographer Name" description="Name of the photographer.">
                            <input
                                type="text"
                                value={form.photographer}
                                onChange={set('photographer')}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder="e.g. John Doe"
                                style={inputStyle}
                            />
                        </FieldRow>

                        {/* Dispute Type */}
                        <FieldRow icon={<FiList size={19} />} label="Dispute Type" description="Select the reason for your dispute.">
                            <select
                                value={form.disputeType}
                                onChange={set('disputeType')}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                style={{ ...inputStyle, cursor: 'pointer', color: form.disputeType ? '#1a1a1a' : '#9ca3af' }}
                            >
                                <option value="" disabled>Select dispute type</option>
                                {DISPUTE_TYPES.map(t => (
                                    <option key={t} value={t.toLowerCase()} style={{ color: '#1a1a1a' }}>{t}</option>
                                ))}
                            </select>
                        </FieldRow>

                        {/* Description */}
                        <FieldRow icon={<FiEdit3 size={19} />} label="Description of Dispute" description="Provide details about the issue.">
                            <textarea
                                value={form.description}
                                onChange={set('description')}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder="Please describe the issue in detail..."
                                rows={4}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </FieldRow>

                        {/* Attach Evidence */}
                        <FieldRow icon={<FiUploadCloud size={19} />} label="Attach Evidence" description="Upload images or documents that support your dispute.">
                            <div
                                onClick={() => fileRef.current.click()}
                                onDrop={handleDrop}
                                onDragOver={e => e.preventDefault()}
                                style={{
                                    border: '1.5px dashed #d1d5db',
                                    borderRadius: '12px',
                                    padding: '28px 16px',
                                    cursor: 'pointer',
                                    background: '#fafafa',
                                    minHeight: '110px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    textAlign: 'center',
                                    transition: 'border-color 0.2s, background 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.background = '#FFF9EE'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
                            >
                                {files.length === 0 ? (
                                    <>
                                        <FiUploadCloud size={26} color="#E8A317" />
                                        <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#444', fontWeight: 600 }}>
                                            Drag &amp; drop files here or click to browse
                                        </p>
                                        <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
                                            Accepted files: JPG, JPEG, PNG, PDF (Max 10MB each)
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
                                        <div
                                            style={{
                                                width: '64px', height: '64px', border: '2px dashed #f5a623',
                                                borderRadius: '8px', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', color: '#f5a623', fontSize: '22px',
                                            }}
                                        >
                                            +
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" multiple style={{ display: 'none' }} onChange={handleFiles} />
                        </FieldRow>

                        {/* Terms checkbox */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 0 4px' }}>
                            <input
                                type="checkbox"
                                checked={form.agreed}
                                onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
                                style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#E8A317' }}
                            />
                            <span style={{ fontSize: '13.5px', color: '#555' }}>
                                I agree to the{' '}
                                <a href="#" style={{ color: '#E8A317', fontWeight: 700, textDecoration: 'none' }}>terms &amp; conditions</a>
                            </span>
                        </div>

                        {error && (
                            <p style={{ margin: '12px 0 0', fontSize: '12.5px', color: '#ef4444', fontWeight: 600 }}>{error}</p>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            style={{
                                width: '100%',
                                marginTop: '20px',
                                padding: '15px 0',
                                border: 'none',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #f5a623 0%, #E8A317 100%)',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                fontFamily: 'inherit',
                                boxShadow: '0 6px 18px rgba(232,163,23,0.35)',
                            }}
                        >
                            Submit Dispute &amp; Request Resolution
                            <FiArrowRight size={17} />
                        </button>
                    </div>
                )}
            </div>
        </ViewsLayout>
    );
};

export default RaiseDispute;