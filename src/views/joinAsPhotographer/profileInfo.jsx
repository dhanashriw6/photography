import React, { useRef, useState, useEffect } from 'react';
import '../index.css';
import { LuCamera } from 'react-icons/lu';
import { FiX, FiUpload } from 'react-icons/fi';
import { getProfile } from '../../services/profile';
import { getCasteList, getLanguagesList, getCategory } from '../../services/common';

/* ─── Tag Input — matches SignUp's TagInput style exactly ─────────────────── */
const TagInput = ({ label, tags, setTags, placeholder, suggestions = [] }) => {
    const [input, setInput] = useState('');
    const [showSug, setShowSug] = useState(false);

    const addTag = (val) => {
        const v = val.trim().replace(/,$/, '');
        if (v && !tags.includes(v)) setTags([...tags, v]);
        setInput('');
        setShowSug(false);
    };

    const removeTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

    const filtered = suggestions.filter(
        s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    );

    return (
        <div className="su-field" style={{ position: 'relative' }}>
            {label && <label>{label}</label>}
            <div
                style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                    gap: '6px', padding: '8px 13px', minHeight: '46px',
                    border: '1.5px solid #d1d5db', borderRadius: '8px',
                    background: '#fff', cursor: 'text', boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onClick={e => e.currentTarget.querySelector('input')?.focus()}
                onFocusCapture={e => {
                    e.currentTarget.style.borderColor = '#f5a623';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)';
                }}
                onBlurCapture={e => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                {tags.map((tag, i) => (
                    <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: '#FFF3D6', color: '#1a1a1a',
                        borderRadius: '6px', padding: '2px 8px',
                        fontSize: '13px', fontWeight: 600,
                    }}>
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(i)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#888', padding: 0, lineHeight: 1, fontSize: '14px',
                                display: 'flex', alignItems: 'center',
                            }}
                        >×</button>
                    </span>
                ))}
                <input
                    value={input}
                    onChange={e => { setInput(e.target.value); setShowSug(true); }}
                  
                    onFocus={() => setShowSug(true)}
                    onBlur={() => setTimeout(() => setShowSug(false), 150)}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    style={{
                        border: 'none', outline: 'none', background: 'transparent',
                        fontSize: '14px', color: '#111', minWidth: '80px', flex: 1,
                        padding: '2px 0', fontFamily: 'inherit',
                    }}
                />
            </div>

            {/* Suggestions dropdown */}
            {showSug && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1.5px solid #d1d5db',
                    borderTop: 'none', borderRadius: '0 0 8px 8px',
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

            <p className="su-field-hint">Type and press Enter to add</p>
        </div>
    );
};

/* ─── Main Component ────────────────────────────────────────────────────── */
const PhotographerProfileInfo = ({ onSave, onCancel }) => {
    const fileRef = useRef();
    const idRef = useRef();
    const [photo, setPhoto] = useState(null);
    const [idFile, setIdFile] = useState(null);

    const [form, setForm] = useState({
        firstName: '', lastName: '',
        email: '', phone: '',
        experience: '', gender: '',
        pincode: '', flat: '', area: '',
        landmark: '', city: '', state: '', country: '',
    });

    const [cantShootCasts, setCantShootCasts] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [casteSuggestions, setCasteSuggestions] = useState([]);
    const [languageSuggestions, setLanguageSuggestions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) setPhoto(URL.createObjectURL(file));
    };

    const handleId = (e) => {
        const file = e.target.files[0];
        if (file) setIdFile(file.name);
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Profile
                const res = await getProfile();
                const user = res?.data?.data?.user;
                if (user) {
                    setForm(f => ({
                        ...f,
                        firstName: user.first_name || '',
                        lastName: user.last_name || '',
                        email: user.email || '',
                        phone: user.phone_no || '',
                        experience: user.years_of_exp ? `${user.years_of_exp} Years` : '',
                        country: 'India',
                    }));

                    // Pre-fill tags from profile if API returns them
                    if (user.casts?.length) setCantShootCasts(user.casts.map(c => c.name || c));
                    if (user.event_categories?.length) setSpecializations(user.event_categories.map(c => c.name || c));
                    if (user.user_languages?.length) setLanguages(user.user_languages.map(l => l.name || l));
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }

            try {
                // Caste list
                const casteRes = await getCasteList();
                const casteData = casteRes?.data?.data?.casts;
                
                if (Array.isArray(casteData)) {
                    setCasteSuggestions(casteData.map(c => c.name || c));
                }
            } catch (err) {
                console.error('Failed to fetch caste list:', err);
            }

            try {
                // Languages list
                const langRes = await getLanguagesList();
                const langData = langRes?.data?.data?.languages;
                if (Array.isArray(langData)) {
                    setLanguageSuggestions(langData.map(l => l.name || l));
                }
            } catch (err) {
                console.error('Failed to fetch languages:', err);
            }

            try {
                // Category / Specialization list
                const catRes = await getCategory();
                const catData = catRes?.data?.data?.event_categories;
                if (Array.isArray(catData)) {
                    setCategorySuggestions(catData.map(c => c.name || c));
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchAll();
    }, []);

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
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#f5a623'}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>

                {/* First Name */}
                <div className="su-field">
                    <label>First Name</label>
                    <input type="text" value={form.firstName} onChange={set('firstName')} />
                    <p className="su-field-hint">Must match identification documents.</p>
                </div>

                {/* Last Name */}
                <div className="su-field">
                    <label>Last Name</label>
                    <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
                    <p className="su-field-hint">Must match identification documents.</p>
                </div>

                {/* Email */}
                <div className="su-field">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
                </div>

                {/* Phone */}
                <div className="su-field">
                    <label>Phone Number<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <div className="su-phone-row">
                        <select className="su-country" defaultValue="+91">
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                        </select>
                        <input
                            className="su-number"
                            type="tel"
                            value={form.phone}
                            onChange={set('phone')}
                            placeholder="00000 00000"
                        />
                    </div>
                    <p className="su-field-hint">Enter a valid phone number to receive OTPs</p>
                </div>

                {/* Experience */}
                <div className="su-field">
                    <label>Years Of Experience</label>
                    <input type="text" value={form.experience} onChange={set('experience')} placeholder="e.g. 2 Years" />
                </div>

                {/* Gender */}
                <div className="su-field">
                    <label>Gender</label>
                    <input type="text" value={form.gender} onChange={set('gender')} placeholder="Add Gender" />
                </div>

                {/* Which cast you can't shoot — full width, matches SignUp exactly */}
                <div style={{ gridColumn: 'span 2' }}>
                    <TagInput
                        label="Which cast you can't shoot"
                        tags={cantShootCasts}
                        setTags={setCantShootCasts}
                        placeholder="e.g. Patel, Aditi..."
                        suggestions={casteSuggestions}
                    />
                </div>

                {/* Specialization — full width */}
                <div style={{ gridColumn: 'span 2' }}>
                    <TagInput
                        label="Specialization"
                        tags={specializations}
                        setTags={setSpecializations}
                        placeholder="e.g. Wedding, Portrait…"
                        suggestions={categorySuggestions} />
                </div>

                {/* Languages — full width */}
                <div style={{ gridColumn: 'span 2' }}>
                    <TagInput
                        label="Languages Spoken"
                        tags={languages}
                        setTags={setLanguages}
                        placeholder="e.g. English, Hindi…"
                        suggestions={languageSuggestions}
                    />
                </div>

                {/* Upload Photo ID Proof — full width */}
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Upload Your Photo ID Proof</label>
                    <div
                        onClick={() => idRef.current.click()}
                        style={{
                            border: '1.5px dashed #d1d5db', borderRadius: '8px',
                            padding: '20px', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: '8px',
                            cursor: 'pointer', background: '#fafafa',
                            transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                            minHeight: '80px',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#f5a623';
                            e.currentTarget.style.background = '#FFFAF0';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.background = '#fafafa';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {idFile ? (
                            <p style={{ margin: 0, fontSize: '13px', color: '#f5a623', fontWeight: 600 }}>
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

            </div>

            {/* ── Address ── */}
            <h2 style={{ margin: '40px 0 20px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Address
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>

                {/* Pincode — full width */}
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Pincode / Zipcode</label>
                    <input type="text" value={form.pincode} onChange={set('pincode')} placeholder="360001" />
                </div>

                {/* Flat — full width */}
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Flat, House no., Building, Company, Apartment</label>
                    <input type="text" value={form.flat} onChange={set('flat')} placeholder="Enter Flat, House no., Building, Company, Apartment" />
                </div>

                {/* Area — full width */}
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Area, Street, Village</label>
                    <input type="text" value={form.area} onChange={set('area')} placeholder="Enter Area, Street, Village" />
                </div>

                {/* Landmark — full width */}
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Landmark</label>
                    <input type="text" value={form.landmark} onChange={set('landmark')} placeholder="Landmark" />
                </div>

                {/* City */}
                <div className="su-field">
                    <label>Town / City</label>
                    <select value={form.city} onChange={set('city')}>
                        <option value="">Select City</option>
                        <option>Rajkot</option>
                        <option>Ahmedabad</option>
                        <option>Surat</option>
                    </select>
                </div>

                {/* State */}
                <div className="su-field">
                    <label>State</label>
                    <select value={form.state} onChange={set('state')}>
                        <option value="">Select State</option>
                        <option>Gujarat</option>
                        <option>Maharashtra</option>
                        <option>Rajasthan</option>
                    </select>
                </div>

                {/* Country — full width */}
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Country / Region</label>
                    <select value={form.country} onChange={set('country')}>
                        <option>India</option>
                        <option>USA</option>
                        <option>UK</option>
                    </select>
                </div>

            </div>

            {/* Action buttons — match SignUp's su-btn-primary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button
                    type="button"
                    onClick={onSave}
                    className="su-btn-primary"
                    style={{ padding: '11px 28px' }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default PhotographerProfileInfo;