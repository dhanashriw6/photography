import React, { useRef, useState } from 'react';
import { LuCamera } from 'react-icons/lu';
import { FiX, FiUpload } from 'react-icons/fi';

/* ─── Tag Input ─────────────────────────────────────────────────────────── */
const TagInput = ({ tags, setTags, placeholder, suggestions = [] }) => {
    const [input, setInput] = useState('');
    const [showSug, setShowSug] = useState(false);

    const addTag = (val) => {
        const v = val.trim();
        if (v && !tags.includes(v)) setTags([...tags, v]);
        setInput('');
        setShowSug(false);
    };

    const removeTag = (t) => setTags(tags.filter(x => x !== t));

    const filtered = suggestions.filter(
        s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    );

    return (
        <div style={{ position: 'relative' }}>
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
                border: '1.5px solid #e8e8e8', borderRadius: '10px',
                padding: '8px 12px', background: '#fff', minHeight: '44px',
                cursor: 'text', transition: 'border-color 0.2s',
            }}
                onClick={e => e.currentTarget.querySelector('input')?.focus()}
            >
                {tags.map(t => (
                    <span key={t} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: '#FFF3D6', color: 'var(--color-orange)',
                        borderRadius: '6px', padding: '3px 10px',
                        fontSize: '12px', fontWeight: 600,
                    }}>
                        {t}
                        <FiX
                            size={11} style={{ cursor: 'pointer' }}
                            onClick={() => removeTag(t)}
                        />
                    </span>
                ))}
                <input
                    value={input}
                    onChange={e => { setInput(e.target.value); setShowSug(true); }}
                    onKeyDown={e => {
                        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
                            e.preventDefault(); addTag(input);
                        }
                        if (e.key === 'Backspace' && !input && tags.length)
                            setTags(tags.slice(0, -1));
                    }}
                    onFocus={() => setShowSug(true)}
                    onBlur={() => setTimeout(() => setShowSug(false), 150)}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    style={{
                        border: 'none', outline: 'none', fontSize: '13px',
                        color: '#333', background: 'transparent',
                        flexGrow: 1, minWidth: '80px', padding: '2px 0',
                        fontFamily: 'inherit',
                    }}
                />
            </div>
            {showSug && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1.5px solid #e8e8e8',
                    borderTop: 'none', borderRadius: '0 0 10px 10px',
                    zIndex: 10, maxHeight: '160px', overflowY: 'auto',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                }}>
                    {filtered.map(s => (
                        <div
                            key={s}
                            onMouseDown={() => addTag(s)}
                            style={{
                                padding: '9px 14px', fontSize: '13px', cursor: 'pointer',
                                color: '#444', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FFF3D6'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Main Component ────────────────────────────────────────────────────── */
const PhotographerProfileInfo = ({ onSave, onCancel }) => {
    const fileRef   = useRef();
    const idRef     = useRef();
    const [photo, setPhoto]     = useState(null);
    const [idFile, setIdFile]   = useState(null);

    const [form, setForm] = useState({
        firstName: 'John', lastName: 'Doe',
        email: 'johndoe@gmail.com', phone: '12345 67890',
        experience: '2 Years', gender: '',
        pincode: '360001', flat: '', area: '',
        landmark: '', city: '', state: '', country: 'India',
    });

    const [cantShootCasts,  setCantShootCasts]  = useState(['Patel', 'Aditi']);
    const [specializations, setSpecializations] = useState(['Photography', 'Wedding']);
    const [languages,       setLanguages]       = useState(['English', 'Hindi']);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) setPhoto(URL.createObjectURL(file));
    };

    const handleId = (e) => {
        const file = e.target.files[0];
        if (file) setIdFile(file.name);
    };

    const fieldStyle = {
        display: 'flex', flexDirection: 'column', gap: '6px',
    };
    const labelStyle = {
        fontSize: '12px', fontWeight: 600, color: '#666', letterSpacing: '0.01em',
    };
    const inputStyle = {
        border: '1.5px solid #e8e8e8', borderRadius: '10px',
        padding: '11px 14px', fontSize: '13px', color: '#333',
        fontFamily: 'inherit', outline: 'none', background: '#fff',
        transition: 'border-color 0.2s',
    };
    const hintStyle = {
        fontSize: '11px', color: '#aaa', margin: '2px 0 0',
    };

    const onFocus = e => e.target.style.borderColor = 'var(--color-orange)';
    const onBlur  = e => e.target.style.borderColor = '#e8e8e8';

    return (
        <div>
            {/* ── Personal Information ── */}
            <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Personal Information
            </h2>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#555' }}>
                Please upload a profile picture for your account.
            </p>
            <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#aaa', lineHeight: 1.6 }}>
                Helps other users recognize you. Choose a clear portrait-style photo. No sunsets. No pets. Just you.
            </p>

            {/* Photo upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
                <div
                    onClick={() => fileRef.current.click()}
                    style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        border: '2px dashed #ccc', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: '4px', overflow: 'hidden',
                        background: '#fafafa', transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-orange)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#ccc'}
                >
                    {photo
                        ? <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <>
                            <LuCamera size={22} color="#bbb" />
                            <span style={{ fontSize: '10px', color: '#bbb', fontWeight: 600 }}>Add Photo</span>
                        </>
                    }
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#bbb' }}>Supported formats: JPG, JPEG, PNG</p>
            </div>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>First Name</label>
                    <input style={inputStyle} type="text" value={form.firstName} onChange={set('firstName')} placeholder="John" onFocus={onFocus} onBlur={onBlur} />
                    <p style={hintStyle}>Must match identification documents.</p>
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Last Name</label>
                    <input style={inputStyle} type="text" value={form.lastName} onChange={set('lastName')} placeholder="Doe" onFocus={onFocus} onBlur={onBlur} />
                    <p style={hintStyle}>Must match identification documents.</p>
                </div>
            </div>

            {/* Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Email</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Phone Number</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <select style={{ ...inputStyle, width: '100px', flexShrink: 0 }} defaultValue="+91" onFocus={onFocus} onBlur={onBlur}>
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                        </select>
                        <input style={{ ...inputStyle, flex: 1 }} type="tel" value={form.phone} onChange={set('phone')} placeholder="00000 00000" onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <p style={hintStyle}>Enter a valid phone number to receive OTPs</p>
                </div>
            </div>

            {/* Experience + Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Years Of Experience</label>
                    <input style={inputStyle} type="text" value={form.experience} onChange={set('experience')} placeholder="e.g. 2 Years" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Gender</label>
                    <input style={inputStyle} type="text" value={form.gender} onChange={set('gender')} placeholder="Add Gender" onFocus={onFocus} onBlur={onBlur} />
                </div>
            </div>

            {/* Which cast you can't shoot */}
            <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                <label style={labelStyle}>Which cast you can't shoot</label>
                <TagInput
                    tags={cantShootCasts}
                    setTags={setCantShootCasts}
                    placeholder="Type and press Enter…"
                    suggestions={['Patel', 'Aditi', 'Shah', 'Mehta', 'Joshi', 'Rao', 'Sharma']}
                />
            </div>

            {/* Specialization */}
            <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                <label style={labelStyle}>Specialization</label>
                <TagInput
                    tags={specializations}
                    setTags={setSpecializations}
                    placeholder="e.g. Wedding, Portrait…"
                    suggestions={['Photography', 'Wedding', 'Portrait', 'Fashion', 'Wildlife', 'Sports', 'Travel', 'Product']}
                />
            </div>

            {/* Languages Spoken */}
            <div style={{ ...fieldStyle, marginBottom: '20px' }}>
                <label style={labelStyle}>Languages Spoken</label>
                <TagInput
                    tags={languages}
                    setTags={setLanguages}
                    placeholder="e.g. English, Hindi…"
                    suggestions={['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Punjabi']}
                />
            </div>

            {/* Upload Photo ID Proof */}
            <div style={{ ...fieldStyle, marginBottom: '40px' }}>
                <label style={labelStyle}>Upload Your Photo ID Proof</label>
                <div
                    onClick={() => idRef.current.click()}
                    style={{
                        border: '1.5px dashed #d0d0d0', borderRadius: '10px',
                        padding: '20px', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                        cursor: 'pointer', background: '#fafafa',
                        transition: 'border-color 0.2s, background 0.2s',
                        minHeight: '80px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-orange)'; e.currentTarget.style.background = '#FFFAF0'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0d0d0'; e.currentTarget.style.background = '#fafafa'; }}
                >
                    {idFile ? (
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-orange)', fontWeight: 600 }}>
                            ✓ {idFile}
                        </p>
                    ) : (
                        <>
                            <FiUpload size={20} color="#ccc" />
                            <p style={{ margin: 0, fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
                                Click to upload your document (JPG, JPEG, PNG or PDF)
                            </p>
                        </>
                    )}
                </div>
                <input ref={idRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleId} />
            </div>

            {/* ── Address ── */}
            <h2 style={{ margin: '0 0 20px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Address</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Pincode</label>
                    <input style={inputStyle} type="text" value={form.pincode} onChange={set('pincode')} placeholder="360001" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Flat, House no., Building, Company, Apartment</label>
                    <input style={inputStyle} type="text" value={form.flat} onChange={set('flat')} placeholder="Enter Flat, House no., Building, Company, Apartment" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Area, Street, Village</label>
                    <input style={inputStyle} type="text" value={form.area} onChange={set('area')} placeholder="Enter Area, Street, Village" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Landmark</label>
                    <input style={inputStyle} type="text" value={form.landmark} onChange={set('landmark')} placeholder="Landmark" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Town / City</label>
                        <select style={inputStyle} value={form.city} onChange={set('city')} onFocus={onFocus} onBlur={onBlur}>
                            <option value="">Select City</option>
                            <option>Rajkot</option>
                            <option>Ahmedabad</option>
                            <option>Surat</option>
                        </select>
                    </div>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>State</label>
                        <select style={inputStyle} value={form.state} onChange={set('state')} onFocus={onFocus} onBlur={onBlur}>
                            <option value="">Select State</option>
                            <option>Gujarat</option>
                            <option>Maharashtra</option>
                            <option>Rajasthan</option>
                        </select>
                    </div>
                </div>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Country / Region</label>
                    <select style={inputStyle} value={form.country} onChange={set('country')} onFocus={onFocus} onBlur={onBlur}>
                        <option>India</option>
                        <option>USA</option>
                        <option>UK</option>
                    </select>
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                    onClick={onCancel}
                    style={{
                        padding: '11px 28px', borderRadius: '10px', fontSize: '13px',
                        fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                        background: 'transparent', color: '#888',
                        border: '1.5px solid #e0e0e0', transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#bbb'; e.currentTarget.style.color = '#555'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#888'; }}
                >
                    Cancel
                </button>
                <button
                    onClick={onSave}
                    style={{
                        padding: '11px 28px', borderRadius: '10px', fontSize: '13px',
                        fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                        background: 'var(--color-orange)', color: '#fff',
                        border: 'none', transition: 'opacity 0.18s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default PhotographerProfileInfo;