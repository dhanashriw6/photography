import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../index.css';
import { LuCamera } from 'react-icons/lu';
import { FiUpload, FiX } from 'react-icons/fi';
import { getProfile, updateProfile } from '../../services/profile';
import { getCasteList, getLanguagesList, getCategory, uploadAddress, getUploadLink } from '../../services/common';

const GOOGLE_API_KEY = 'AIzaSyAqSdUC-vQRcFGmucESKRQmDCvzhfUel4c';

/* ─── Upload helper (mirrors KYC pattern exactly) ────────────────────────── */
const uploadFileToAWS = async (file, documentFor = 'profile') => {
    const linkRes = await getUploadLink({
        document_for: documentFor,
        document_type: file.type === 'application/pdf' ? 'pdf' : 'image',
        mimetype: file.type,
        side: 'front',
    });
    const { presignedUrl, key } = linkRes.data.data;
    await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
    });
    return key;
};

/* ─── Tag Input ───────────────────────────────────────────────────────────── */
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
                        <button type="button" onClick={() => removeTag(i)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#888', padding: 0, lineHeight: 1, fontSize: '14px',
                            display: 'flex', alignItems: 'center',
                        }}>×</button>
                    </span>
                ))}
                <input
                    value={input}
                    onChange={e => { setInput(e.target.value); setShowSug(true); }}
                    onKeyDown={e => {
                        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
                            e.preventDefault();
                            addTag(input);
                        }
                        if (e.key === 'Backspace' && !input && tags.length) {
                            setTags(tags.slice(0, -1));
                        }
                    }}
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
            {showSug && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1.5px solid #d1d5db',
                    borderTop: 'none', borderRadius: '0 0 8px 8px',
                    zIndex: 10, maxHeight: '160px', overflowY: 'auto',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                }}>
                    {filtered.map(s => (
                        <div key={s} onMouseDown={() => addTag(s)} style={{
                            padding: '9px 14px', fontSize: '13px', cursor: 'pointer',
                            color: '#444', transition: 'background 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#FFF3D6'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >{s}</div>
                    ))}
                </div>
            )}
            <p className="su-field-hint">Type and press Enter to add</p>
        </div>
    );
};

/* ─── Pincode field with Places autocomplete ─────────────────────────────── */
const PincodeField = ({ value, onChange, onAddressFill }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const debounceRef = useRef(null);

    const fetchSuggestions = useCallback(async (input) => {
        if (!input || input.length < 3) { setSuggestions([]); return; }
        setLoading(true);
        try {
            const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': GOOGLE_API_KEY },
                body: JSON.stringify({ input }),
            });
            const data = await res.json();
            setSuggestions(data.suggestions || []);
        } catch (err) {
            console.error('Places autocomplete error:', err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
    };

    const handleSelect = async (suggestion) => {
        const placeId = suggestion.placePrediction?.placeId;
        const description = suggestion.placePrediction?.text?.text || '';
        onChange(description);
        setSuggestions([]);
        if (!placeId) return;
        setGeocoding(true);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
            );
            const data = await res.json();
            const result = data.results?.[0];
            if (!result) return;
            const get = (type) =>
                result.address_components?.find(c => c.types.includes(type))?.long_name || '';
            onAddressFill({
                pincode: get('postal_code') || description,
                flat: [get('premise'), get('street_number'), get('route')].filter(Boolean).join(', '),
                area: [get('sublocality_level_1') || get('sublocality'), get('neighborhood')].filter(Boolean).join(', '),
                city: get('locality') || get('administrative_area_level_2'),
                state: get('administrative_area_level_1'),
                country: get('country'),
                lat: result.geometry?.location?.lat,
                lng: result.geometry?.location?.lng,
                place_id: placeId,
            });
        } catch (err) {
            console.error('Geocode error:', err);
        } finally {
            setGeocoding(false);
        }
    };

    return (
        <div className="su-field" style={{ gridColumn: 'span 2', position: 'relative' }}>
            <label>Pincode / Zipcode</label>
            <div style={{ position: 'relative' }}>
                <input
                    type="text" value={value} onChange={handleChange}
                    placeholder="e.g. 360001" style={{ paddingRight: '36px' }}
                />
                {(loading || geocoding) && (
                    <span style={{
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)', color: '#f5a623', fontSize: '12px', pointerEvents: 'none',
                    }}>●●●</span>
                )}
            </div>
            {suggestions.length > 0 && (
                <div style={{
                    position: 'absolute', top: 'calc(100% - 6px)', left: 0, right: 0,
                    background: '#fff', border: '1.5px solid #d1d5db',
                    borderTop: 'none', borderRadius: '0 0 8px 8px',
                    zIndex: 20, maxHeight: '200px', overflowY: 'auto',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                }}>
                    {suggestions.map((s, i) => {
                        const p = s.placePrediction;
                        const main = p?.structuredFormat?.mainText?.text || p?.text?.text || '';
                        const secondary = p?.structuredFormat?.secondaryText?.text || '';
                        return (
                            <div key={i} onMouseDown={() => handleSelect(s)} style={{
                                padding: '10px 14px', cursor: 'pointer',
                                borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                                transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#FFFAF0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{main}</div>
                                {secondary && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{secondary}</div>}
                            </div>
                        );
                    })}
                </div>
            )}
            <p className="su-field-hint">
                {geocoding ? 'Fetching address details…' : 'Type your pincode or area to auto-fill address'}
            </p>
        </div>
    );
};

/* ─── Robust Extractor Helpers (Prevents objects from leaking as React children) ─── */
const extractCast = (c) => {
    if (!c) return { id: null, name: '' };
    if (typeof c === 'string') return { id: null, name: c };
    
    const id = c.cast?.id || c.cast_id || c.id || null;
    const name = c.cast?.name || c.name || (typeof c.cast === 'string' ? c.cast : '');
    
    return { id, name: typeof name === 'string' ? name : String(name || '') };
};

const extractCategory = (c) => {
    if (!c) return { id: null, name: '' };
    if (typeof c === 'string') return { id: null, name: c };
    
    const id = c.category?.id || c.event_category?.id || c.category_id || c.id || null;
    const name = c.category?.name || c.event_category?.name || c.name || (typeof c.category === 'string' ? c.category : '');
    
    return { id, name: typeof name === 'string' ? name : String(name || '') };
};

const extractLanguage = (l) => {
    if (!l) return { id: null, name: '', proficiency: 'fluent' };
    if (typeof l === 'string') return { id: null, name: l, proficiency: 'fluent' };
    
    const id = l.language?.id || l.language_id || l.id || null;
    const name = l.language?.name || l.name || (typeof l.language === 'string' ? l.language : '');
    const proficiency = l.proficiency || 'fluent';
    
    return { id, name: typeof name === 'string' ? name : String(name || ''), proficiency };
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const PhotographerProfileInfo = ({ onSave, onCancel }) => {
    const fileRef = useRef();
    const idRef = useRef();

    // Profile photo state
    const [photo, setPhoto] = useState(null);           // preview URL
    const [photoFile, setPhotoFile] = useState(null);   // raw File
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoKey, setPhotoKey] = useState('');       // S3 key after upload

    const [idFile, setIdFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState('');
    const [saveOk, setSaveOk] = useState('');

    const geoRef = useRef({ lat: null, lng: null, place_id: '' });

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        experience: '', gender: '',
        pincode: '', flat: '', area: '', landmark: '',
        city: '', state: '', country: 'India',
    });

    // Tag state — objects with id (from API) + name, so we can build insert/delete diffs
    const [cantShootCasts, setCantShootCasts]         = useState([]); // [{id, name}]
    const [originalCasts, setOriginalCasts]           = useState([]);
    const [specializations, setSpecializations]       = useState([]); // [{id, name}]
    const [originalSpecs, setOriginalSpecs]           = useState([]);
    const [languages, setLanguages]                   = useState([]); // [{id, name, proficiency}]
    const [originalLangs, setOriginalLangs]           = useState([]);

    // Suggestions from API: [{id, name}]
    const [casteSuggestions, setCasteSuggestions]     = useState([]);
    const [languageSuggestions, setLanguageSuggestions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    // ── Profile photo: preview immediately, upload in background ──
    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhoto(URL.createObjectURL(file));
        setPhotoFile(file);
        setPhotoUploading(true);
        setPhotoKey('');
        try {
            const key = await uploadFileToAWS(file, 'profile');
            setPhotoKey(key);
        } catch (err) {
            console.error('Profile photo upload failed:', err);
            setSaveErr('Profile photo upload failed. Please try again.');
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleId = (e) => {
        const file = e.target.files[0];
        if (file) setIdFile(file.name);
    };

    const handleAddressFill = ({ pincode, flat, area, city, state, country, lat, lng, place_id }) => {
        setForm(f => ({
            ...f,
            pincode: pincode || f.pincode,
            flat: flat || f.flat,
            area: area || f.area,
            city: city || f.city,
            state: state || f.state,
            country: country || f.country,
        }));
        geoRef.current = { lat, lng, place_id };
    };

    // ── Build insert/delete diff arrays ──
    const buildCastDiff = () => {
        const toInsert = cantShootCasts
            .filter(c => !originalCasts.find(o => o.id === c.id))
            .map(c => ({ type: 'insert', cast_id: c.id }));
        const toDelete = originalCasts
            .filter(o => !cantShootCasts.find(c => c.id === o.id))
            .map(o => ({ type: 'delete', cast_id: o.id }));
        return [...toInsert, ...toDelete];
    };

    const buildCategoryDiff = () => {
        const toInsert = specializations
            .filter(c => !originalSpecs.find(o => o.id === c.id))
            .map(c => ({ type: 'insert', category_id: c.id }));
        const toDelete = originalSpecs
            .filter(o => !specializations.find(c => c.id === o.id))
            .map(o => ({ type: 'delete', category_id: o.id }));
        return [...toInsert, ...toDelete];
    };

    const buildLanguageDiff = () => {
        const toInsert = languages
            .filter(l => !originalLangs.find(o => o.id === l.id))
            .map(l => ({ type: 'insert', language_id: l.id, proficiency: l.proficiency || 'fluent' }));
        const toDelete = originalLangs
            .filter(o => !languages.find(l => l.id === o.id))
            .map(o => ({ type: 'delete', language_id: o.id }));
        return [...toInsert, ...toDelete];
    };

    // ── Save: address first, then profile ──
    const handleSave = async () => {
        setSaveErr('');
        setSaveOk('');

        if (photoUploading) {
            setSaveErr('Profile photo is still uploading. Please wait.');
            return;
        }

        // 1. Upload address if filled
        if (form.pincode || form.city || form.state) {
            if (!form.pincode || !form.city || !form.state) {
                setSaveErr('Please fill in pincode, city, and state.');
                return;
            }
            try {
                await uploadAddress({
                    address_type: 'current',
                    address_line1: form.flat.trim(),
                    address_line2: form.area.trim(),
                    city: form.city.trim(),
                    state: form.state.trim(),
                    country: form.country.trim(),
                    postal_code: form.pincode.trim(),
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
                    lat: geoRef.current.lat,
                    lng: geoRef.current.lng,
                    place_id: geoRef.current.place_id,
                    service_area_radius_meters: 50000,
                });
            } catch (err) {
                const msg = err?.response?.data?.error?.message || err?.response?.data?.message || 'Failed to save address.';
                setSaveErr(msg);
                return;
            }
        }

        // 2. Build profile update payload
        const profilePayload = {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            ...(form.experience && { years_of_exp: parseInt(form.experience, 10) || form.experience }),
            ...(form.gender && { gender: form.gender.trim() }),
            ...(photoKey && { profile_image: photoKey }),
            
        };

        const castDiff = buildCastDiff();
        const catDiff  = buildCategoryDiff();
        const langDiff = buildLanguageDiff();

        if (castDiff.length)   profilePayload.casts            = castDiff;
        if (catDiff.length)    profilePayload.event_categories = catDiff;
        if (langDiff.length)   profilePayload.languages        = langDiff;

        try {
            setSaving(true);
            await updateProfile(profilePayload);
            setSaveOk('Profile saved successfully!');
            onSave?.();
        } catch (err) {
            const msg = err?.response?.data?.error?.message || err?.response?.data?.message || 'Failed to save profile.';
            setSaveErr(msg);
        } finally {
            setSaving(false);
        }
    };

    // ── Fetch initial data ──
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await getProfile();
                const user = res?.data?.data?.user;
                if (user) {
                    setForm(f => ({
                        ...f,
                        firstName: user.first_name || '',
                        lastName: user.last_name || '',
                        email: user.email || '',
                        phone: user.phone_no || '',
                        experience: user.years_of_exp ? `${user.years_of_exp}` : '',
                        country: 'India',
                    }));
                    if (user.profile_document?.url) {
    setPhoto(user.profile_document.url);
    // photoKey stays as the S3 key for uploads, don't set it from URL
}
                    if (user.casts?.length) {
                        const mapped = user.casts.map(c => extractCast(c));
                        setCantShootCasts(mapped);
                        setOriginalCasts(mapped);
                    }
                    if (user.event_categories?.length) {
                        const mapped = user.event_categories.map(c => extractCategory(c));
                        setSpecializations(mapped);
                        setOriginalSpecs(mapped);
                    }
                    if (user.user_languages?.length) {
                        const mapped = user.user_languages.map(l => extractLanguage(l));
                        setLanguages(mapped);
                        setOriginalLangs(mapped);
                    }
                }
            } catch (err) { console.error('Profile fetch error:', err); }

            try {
                const r = await getCasteList();
                const d = r?.data?.data?.casts;
                if (Array.isArray(d)) setCasteSuggestions(d.map(c => extractCast(c)));
            } catch (err) { console.error('Caste fetch error:', err); }

            try {
                const r = await getLanguagesList();
                const d = r?.data?.data?.languages;
                if (Array.isArray(d)) setLanguageSuggestions(d.map(l => extractLanguage(l)));
            } catch (err) { console.error('Language fetch error:', err); }

            try {
                const r = await getCategory();
                const d = r?.data?.data?.event_categories;
                if (Array.isArray(d)) setCategorySuggestions(d.map(c => extractCategory(c)));
            } catch (err) { console.error('Category fetch error:', err); }
        };

        fetchAll();
    }, []);

    // Adapters: TagInput works with string arrays; we wrap to keep id mapping
    const castNames = cantShootCasts.map(c => c.name);
    const setCastNames = (names) => {
        setCantShootCasts(names.map(name => {
            const existing = cantShootCasts.find(c => c.name === name);
            if (existing) return existing;
            const fromSug = casteSuggestions.find(s => s.name === name);
            return fromSug || { id: null, name };
        }));
    };

    const specNames = specializations.map(c => c.name);
    const setSpecNames = (names) => {
        setSpecializations(names.map(name => {
            const existing = specializations.find(c => c.name === name);
            if (existing) return existing;
            const fromSug = categorySuggestions.find(s => s.name === name);
            return fromSug || { id: null, name };
        }));
    };

    const langNames = languages.map(l => l.name);
    const setLangNames = (names) => {
        setLanguages(names.map(name => {
            const existing = languages.find(l => l.name === name);
            if (existing) return existing;
            const fromSug = languageSuggestions.find(s => s.name === name);
            return fromSug || { id: null, name, proficiency: 'fluent' };
        }));
    };

    return (
        <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Personal Information
            </h2>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#555' }}>
                Please upload a profile picture for your account.
            </p>
            <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#aaa', lineHeight: 1.6 }}>
                Helps other users recognize you. Choose a clear portrait-style photo.
            </p>

            {/* ── Profile Photo ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
                <div
                    onClick={() => !photoUploading && fileRef.current.click()}
                    style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        border: '2px dashed #ccc', cursor: photoUploading ? 'wait' : 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: '4px', overflow: 'hidden',
                        background: '#fafafa', transition: 'border-color 0.2s', position: 'relative',
                    }}
                    onMouseEnter={e => { if (!photoUploading) e.currentTarget.style.borderColor = '#f5a623'; }}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#ccc'}
                >
                    {photo
                        ? <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: photoUploading ? 0.5 : 1 }} />
                        : <><LuCamera size={22} color="#bbb" /><span style={{ fontSize: '10px', color: '#bbb', fontWeight: 600 }}>Add Photo</span></>
                    }
                    {photoUploading && (
                        <div style={{
                            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.6)',
                        }}>
                            <div style={{
                                width: '22px', height: '22px', border: '2px solid #f5a623',
                                borderTopColor: 'transparent', borderRadius: '50%',
                                animation: 'spin 0.7s linear infinite',
                            }} />
                        </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                <p style={{ margin: '8px 0 0', fontSize: '11px', color: photoUploading ? '#f5a623' : '#bbb' }}>
                    {photoUploading ? 'Uploading…' : 'Supported formats: JPG, JPEG, PNG'}
                </p>
            </div>

  {saveOk && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#dcfce7', color: '#15803d', fontSize: '13px' }}>
                    {saveOk}
                </div>
            )}
            {/* ── Personal fields ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>
                <div className="su-field">
                    <label>First Name</label>
                    <input type="text" value={form.firstName} onChange={set('firstName')} />
                    <p className="su-field-hint">Must match identification documents.</p>
                </div>
                <div className="su-field">
                    <label>Last Name</label>
                    <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
                    <p className="su-field-hint">Must match identification documents.</p>
                </div>
                <div className="su-field">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
                </div>
                <div className="su-field">
                    <label>Phone Number<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <div className="su-phone-row">
                        <select className="su-country" defaultValue="+91">
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                        </select>
                        <input className="su-number" type="tel" value={form.phone} onChange={set('phone')} placeholder="00000 00000" />
                    </div>
                    <p className="su-field-hint">Enter a valid phone number to receive OTPs</p>
                </div>
                <div className="su-field">
                    <label>Years Of Experience</label>
                    <input type="text" value={form.experience} onChange={set('experience')} placeholder="e.g. 2" />
                </div>
                <div className="su-field">
                    <label>Gender</label>
                    <input type="text" value={form.gender} onChange={set('gender')} placeholder="Add Gender" />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <TagInput label="Which cast you can't shoot" tags={castNames} setTags={setCastNames}
                        placeholder="e.g. Patel, Aditi..." suggestions={casteSuggestions.map(s => s.name)} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <TagInput label="Specialization" tags={specNames} setTags={setSpecNames}
                        placeholder="e.g. Wedding, Portrait…" suggestions={categorySuggestions.map(s => s.name)} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <TagInput label="Languages Spoken" tags={langNames} setTags={setLangNames}
                        placeholder="e.g. English, Hindi…" suggestions={languageSuggestions.map(s => s.name)} />
                </div>

            </div>

            {/* ── Personal Info Save button ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button type="button" onClick={handleSave} className="su-btn-primary"
                    style={{ padding: '11px 28px', opacity: (saving || photoUploading) ? 0.7 : 1, cursor: (saving || photoUploading) ? 'not-allowed' : 'pointer' }}
                    disabled={saving || photoUploading}>
                    {saving ? 'Saving…' : photoUploading ? 'Uploading photo…' : 'Save'}
                </button>
            </div>

            {/* ── Address ── */}
            <h2 style={{ margin: '40px 0 20px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Address
            </h2>

            {saveErr && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13px' }}>
                    {saveErr}
                </div>
            )}
          

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>
                <PincodeField
                    value={form.pincode}
                    onChange={(val) => setForm(f => ({ ...f, pincode: val }))}
                    onAddressFill={handleAddressFill}
                />
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Flat, House no., Building, Company, Apartment</label>
                    <input type="text" value={form.flat} onChange={set('flat')} placeholder="Enter Flat, House no." />
                </div>
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Area, Street, Village</label>
                    <input type="text" value={form.area} onChange={set('area')} placeholder="Enter Area, Street, Village" />
                </div>
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Landmark</label>
                    <input type="text" value={form.landmark} onChange={set('landmark')} placeholder="Landmark" />
                </div>
                <div className="su-field">
                    <label>Town / City</label>
                    <input type="text" value={form.city} onChange={set('city')} placeholder="City" />
                </div>
                <div className="su-field">
                    <label>State</label>
                    <input type="text" value={form.state} onChange={set('state')} placeholder="State" />
                </div>
                <div className="su-field" style={{ gridColumn: 'span 2' }}>
                    <label>Country / Region</label>
                    <input type="text" value={form.country} onChange={set('country')} placeholder="Country" />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button type="button" onClick={handleSave} className="su-btn-primary"
                    style={{ padding: '11px 28px', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                    disabled={saving}>
                    {saving ? 'Saving…' : 'Save Address'}
                </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default PhotographerProfileInfo;