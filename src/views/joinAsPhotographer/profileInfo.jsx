import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../index.css';
import { LuCamera } from 'react-icons/lu';
import { getProfile, updateProfile } from '../../services/profile';
import { getCasteList, getLanguagesList, getCategory, getUploadLink } from '../../services/common';
import Select from "react-select";
const GOOGLE_API_KEY = 'AIzaSyAqSdUC-vQRcFGmucESKRQmDCvzhfUel4c';

/* ─── Upload helper ───────────────────────────────────────────────────────── */
const uploadFileToAWS = async (file, documentFor = 'profile') => {
    const linkRes = await getUploadLink({
        document_for: documentFor,
        document_type: file.type === 'application/pdf' ? 'pdf' : 'image',
        mimetype: file.type,
        side: 'front',
    });
    const { presignedUrl, key } = linkRes.data.data;
    await fetch(presignedUrl, { method: 'PUT', body: file });
    return key;
};

/* ─── Skills Multi-Select ─────────────────────────────────────────────────── */
const SKILL_OPTIONS = [
    { value: 'photographer', label: 'Photographer' },
    { value: 'videographer', label: 'Videographer' },
    { value: 'cinematographer', label: 'Cinematographer' },
    { value: 'drone_operator', label: 'Drone Operator' },
];

const MultiSkillSelect = ({ selected, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = (value) => {
        onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
    };

    const removeTag = (e, value) => {
        e.stopPropagation();
        onChange(selected.filter(v => v !== value));
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px',
                    padding: '8px 13px', minHeight: '46px',
                    border: `1.5px solid ${open ? '#f5a623' : '#d1d5db'}`,
                    borderRadius: '8px', background: '#fff', cursor: 'pointer',
                    boxShadow: open ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
                }}
            >
                {selected.length === 0 && (
                    <span style={{ color: '#9ca3af', fontSize: '14px', flex: 1 }}>Select skills…</span>
                )}
                {selected.map(val => {
                    const opt = SKILL_OPTIONS.find(o => o.value === val);
                    return (
                        <span key={val} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: '#FFF3D6', color: '#1a1a1a',
                            borderRadius: '6px', padding: '2px 8px', fontSize: '13px', fontWeight: 600,
                        }}>
                            {opt?.label || val}
                            <button type="button" onClick={(e) => removeTag(e, val)} style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#888', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center',
                            }}>×</button>
                        </span>
                    );
                })}
                <span style={{
                    marginLeft: 'auto', color: '#9ca3af', flexShrink: 0,
                    display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s', fontSize: '12px',
                }}>▾</span>
            </div>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                    background: '#fff', border: '1.5px solid #e5e7eb',
                    borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    zIndex: 50, overflow: 'hidden',
                }}>
                    {SKILL_OPTIONS.map(opt => {
                        const isSelected = selected.includes(opt.value);
                        return (
                            <div key={opt.value} onClick={() => toggle(opt.value)} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 14px', cursor: 'pointer', fontSize: '14px',
                                background: isSelected ? '#FFFBF0' : 'transparent',
                                color: isSelected ? '#1a1a1a' : '#374151',
                                fontWeight: isSelected ? 600 : 400,
                                transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f9fafb'; }}
                                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <span>{opt.label}</span>
                                {isSelected && <span style={{ color: '#f5a623', fontSize: '14px' }}>✓</span>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
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
    const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s));

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
                onFocusCapture={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)'; }}
                onBlurCapture={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                {tags.map((tag, i) => (
                    <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: '#FFF3D6', color: '#1a1a1a',
                        borderRadius: '6px', padding: '2px 8px', fontSize: '13px', fontWeight: 600,
                    }}>
                        {tag}
                        <button type="button" onClick={() => removeTag(i)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#888', padding: 0, lineHeight: 1, fontSize: '14px', display: 'flex', alignItems: 'center',
                        }}>×</button>
                    </span>
                ))}
                <input
                    value={input}
                    onChange={e => { setInput(e.target.value); setShowSug(true); }}
                    onKeyDown={e => {
                        if ((e.key === 'Enter' || e.key === ',') && input.trim()) { e.preventDefault(); addTag(input); }
                        if (e.key === 'Backspace' && !input && tags.length) setTags(tags.slice(0, -1));
                    }}
                    onFocus={() => setShowSug(true)}
                    onBlur={() => setTimeout(() => setShowSug(false), 150)}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#111', minWidth: '80px', flex: 1, padding: '2px 0', fontFamily: 'inherit' }}
                />
            </div>
            {showSug && filtered.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', border: '1.5px solid #d1d5db', borderTop: 'none',
                    borderRadius: '0 0 8px 8px', zIndex: 10, maxHeight: '160px', overflowY: 'auto',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                }}>
                    {filtered.map(s => (
                        <div key={s} onMouseDown={() => addTag(s)} style={{ padding: '9px 14px', fontSize: '13px', cursor: 'pointer', color: '#444', transition: 'background 0.15s' }}
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

/* ─── Address Autocomplete Field ──────────────────────────────────────────── */
/**
 * Renders a search-as-you-type address input + a pincode field below it.
 * Calls onAddressFill({ address_line1, city, state, country, postal_code, lat, lng, place_id, timezone })
 * when a suggestion is selected from geocode.
 * addressData  — current full address object (so we can show the prefilled pincode on load)
 * onPincodeChange — lets parent update only postal_code when user edits pincode manually
 */
const AddressAutocompleteField = ({ label, addressData, onAddressFill, onPincodeChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [loadingSug, setLoadingSug] = useState(false);
    const [loadingGeo, setLoadingGeo] = useState(false);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    // Pre-fill input display from loaded address
    useEffect(() => {
        if (addressData?.address_line1 && !inputValue) {
            setInputValue(addressData.address_line1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressData?.address_line1]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchSuggestions = useCallback(async (query) => {
        if (!query || query.length < 2) { setSuggestions([]); setOpen(false); return; }
        setLoadingSug(true);
        try {
            const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': GOOGLE_API_KEY },
                body: JSON.stringify({ input: query }),
            });
            const data = await res.json();
            setSuggestions(data.suggestions || []);
            setOpen(true);
        } catch { setSuggestions([]); } finally { setLoadingSug(false); }
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
    };

    const handleSelect = async (suggestion) => {
        const pred = suggestion.placePrediction;
        const mainText = pred?.structuredFormat?.mainText?.text || pred?.text?.text || '';
        const placeId = pred?.placeId;

        setInputValue(mainText);
        setOpen(false);
        setSuggestions([]);

        if (!placeId) return;
        setLoadingGeo(true);
        try {
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`);
            const data = await res.json();
            const result = data.results?.[0];
            if (!result) return;

            const get = (types) => result.address_components?.find(c => types.every(t => c.types.includes(t)))?.long_name || '';

            const sublocality = get(['sublocality_level_1']) || get(['sublocality']) || '';
            const premise = get(['premise']) || '';
            const streetNo = get(['street_number']) || '';
            const route = get(['route']) || '';
            const address_line1 = [premise, streetNo, route, sublocality].filter(Boolean).join(', ') || mainText;

            const city = get(['locality', 'political']) || get(['administrative_area_level_3', 'political']) || get(['administrative_area_level_2', 'political']) || '';
            const state = get(['administrative_area_level_1', 'political']) || '';
            const country = get(['country', 'political']) || '';
            const postal_code = get(['postal_code']) || '';
            const lat = result.geometry?.location?.lat || 0;
            const lng = result.geometry?.location?.lng || 0;
            const tzMap = { India: 'Asia/Kolkata', 'United States': 'America/New_York', 'United Kingdom': 'Europe/London' };
            const timezone = tzMap[country] || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

            onAddressFill({ address_line1, city, state, country, postal_code, lat, lng, place_id: placeId, timezone });
        } catch (err) { console.error('Geocode error:', err); } finally { setLoadingGeo(false); }
    };

    const isLoading = loadingSug || loadingGeo;

    return (
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search input */}
            <div className="su-field" ref={containerRef} style={{ position: 'relative' }}>
                <label>{label}<sup style={{ color: '#ef4444' }}>*</sup></label>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search address…"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => suggestions.length > 0 && setOpen(true)}
                        autoComplete="off"
                        style={{ paddingRight: isLoading ? '36px' : undefined }}
                    />
                    {isLoading && (
                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <div style={{ width: '16px', height: '16px', border: '2px solid #f5a623', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        </span>
                    )}
                </div>
                <p className="su-field-hint">Type your area or locality to search</p>

                {/* Dropdown */}
                {open && suggestions.length > 0 && (
                    <div style={{
                        position: 'absolute', top: 'calc(100% - 6px)', left: 0, right: 0,
                        background: '#fff', border: '1.5px solid #e5e7eb', borderTop: 'none',
                        borderRadius: '0 0 8px 8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        zIndex: 100, maxHeight: '220px', overflowY: 'auto',
                    }}>
                        {suggestions.map((s, i) => {
                            const pred = s.placePrediction;
                            const main = pred?.structuredFormat?.mainText?.text || pred?.text?.text || '';
                            const secondary = pred?.structuredFormat?.secondaryText?.text || '';
                            return (
                                <div key={pred?.placeId || i}
                                    onMouseDown={(e) => { e.preventDefault(); handleSelect(s); }}
                                    style={{
                                        padding: '10px 14px', cursor: 'pointer', fontSize: '13px',
                                        borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        transition: 'background 0.12s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FFFBF0'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                >
                                    <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{main}</div>
                                    {secondary && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '1px' }}>{secondary}</div>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pincode — always visible; pre-filled from geocode or loaded profile */}
            <div className="su-field">
                <label>Pincode / Zipcode</label>
                <input
                    type="text"
                    placeholder="e.g. 360001"
                    value={addressData?.postal_code || ''}
                    maxLength={10}
                    onChange={(e) => onPincodeChange(e.target.value.replace(/\D/g, ''))}
                />
            </div>
        </div>
    );
};

/* ─── Robust Extractor Helpers ────────────────────────────────────────────── */
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

/* ─── Address state shape helper ─────────────────────────────────────────── */
const emptyAddress = () => ({
    address_line1: '', city: '', state: '', country: 'India',
    postal_code: '', lat: null, lng: null, place_id: '', timezone: 'Asia/Kolkata',
});

const addressFromApi = (apiAddr) => {
    if (!apiAddr) return emptyAddress();
    return {
        address_line1: apiAddr.address_line1 || '',
        city: apiAddr.city || '',
        state: apiAddr.state || '',
        country: apiAddr.country || 'India',
        postal_code: apiAddr.postal_code || '',
        lat: apiAddr.lat ?? null,
        lng: apiAddr.lng ?? null,
        place_id: apiAddr.place_id || '',
        timezone: apiAddr.timezone || 'Asia/Kolkata',
    };
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const PhotographerProfileInfo = ({ onSave, onCancel }) => {
    const fileRef = useRef();

    // Profile photo
    const [photo, setPhoto] = useState(null);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [photoKey, setPhotoKey] = useState('');

    const [saving, setSaving] = useState(false);
    const [saveErr, setSaveErr] = useState('');
    const [saveOk, setSaveOk] = useState('');

    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        experience: '', gender: '',
    });

    // Tag state
    const [cantShootCasts, setCantShootCasts] = useState([]);
    const [originalCasts, setOriginalCasts] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [originalSpecs, setOriginalSpecs] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [originalLangs, setOriginalLangs] = useState([]);

    // Skills — array of skill value strings e.g. ['photographer', 'videographer']
    const [skills, setSkills] = useState(() => {
        try {
            const stored = localStorage.getItem('photographer_skills');
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [originalSkills, setOriginalSkills] = useState([]);

    // Suggestions
    const [casteSuggestions, setCasteSuggestions] = useState([]);
    const [languageSuggestions, setLanguageSuggestions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);

    // Address state — full objects ready to send in payload
    const [currentAddress, setCurrentAddress] = useState(emptyAddress());
    const [permanentAddress, setPermanentAddress] = useState(emptyAddress());

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    // ── Profile photo ──
    const handlePhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhoto(URL.createObjectURL(file));
        setPhotoUploading(true);
        setPhotoKey('');
        try {
            const key = await uploadFileToAWS(file, 'profile');
            setPhotoKey(key);
        } catch { setSaveErr('Profile photo upload failed. Please try again.'); }
        finally { setPhotoUploading(false); }
    };

    // ── Tag diff builders ──
    const buildCastDiff = () => {
        const toInsert = cantShootCasts.filter(c => !originalCasts.find(o => o.id === c.id)).map(c => ({ type: 'insert', cast_id: c.id }));
        const toDelete = originalCasts.filter(o => !cantShootCasts.find(c => c.id === o.id)).map(o => ({ type: 'delete', cast_id: o.id }));
        return [...toInsert, ...toDelete];
    };
    const buildCategoryDiff = () => {
        const toInsert = specializations.filter(c => !originalSpecs.find(o => o.id === c.id)).map(c => ({ type: 'insert', category_id: c.id }));
        const toDelete = originalSpecs.filter(o => !specializations.find(c => c.id === o.id)).map(o => ({ type: 'delete', category_id: o.id }));
        return [...toInsert, ...toDelete];
    };
    const buildLanguageDiff = () => {
        const toInsert = languages.filter(l => !originalLangs.find(o => o.id === l.id)).map(l => ({ type: 'insert', language_id: l.id, proficiency: l.proficiency || 'fluent' }));
        const toDelete = originalLangs.filter(o => !languages.find(l => l.id === o.id)).map(o => ({ type: 'delete', language_id: o.id }));
        return [...toInsert, ...toDelete];
    };

    // Skills diff: { type: 'insert'|'delete', skill: string }
    // const buildSkillsDiff = () => {
    //     const toInsert = skills.filter(s => !originalSkills.includes(s)).map(s => ({ type: 'insert', skill: s }));
    //     const toDelete = originalSkills.filter(s => !skills.includes(s)).map(s => ({ type: 'delete', skill: s }));
    //     return [...toInsert, ...toDelete];
    // };

    // ── Single Save — profile + both addresses in one call ──
    const handleSave = async () => {
        setSaveErr('');
        setSaveOk('');

        if (photoUploading) { setSaveErr('Profile photo is still uploading. Please wait.'); return; }

        const profilePayload = {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            ...(form.experience && { years_of_exp: parseInt(form.experience, 10) || form.experience }),
            ...(form.gender && { gender: form.gender.trim() }),
            ...(photoKey && { profile_image: photoKey }),
        };

        // Include addresses only if they have at least address_line1 + city
        if (currentAddress.address_line1 && currentAddress.city) {
            profilePayload.current_address = {
                address_line1: currentAddress.address_line1,
                city: currentAddress.city,
                state: currentAddress.state,
                country: currentAddress.country,
                postal_code: currentAddress.postal_code,
                lat: currentAddress.lat,
                lng: currentAddress.lng,
                timezone: currentAddress.timezone || 'Asia/Kolkata',
                service_area_radius_meters: 50000,
                ...(currentAddress.place_id && { place_id: currentAddress.place_id }),
            };
        }

        if (permanentAddress.address_line1 && permanentAddress.city) {
            profilePayload.permanent_address = {
                address_line1: permanentAddress.address_line1,
                city: permanentAddress.city,
                state: permanentAddress.state,
                country: permanentAddress.country,
                postal_code: permanentAddress.postal_code,
                lat: permanentAddress.lat,
                lng: permanentAddress.lng,
                timezone: permanentAddress.timezone || 'Asia/Kolkata',
                ...(permanentAddress.place_id && { place_id: permanentAddress.place_id }),
            };
        }

        const castDiff = buildCastDiff();
        const catDiff = buildCategoryDiff();
        const langDiff = buildLanguageDiff();
        profilePayload.skills = skills;
        if (castDiff.length) profilePayload.casts = castDiff;
        if (catDiff.length) profilePayload.event_categories = catDiff;
        if (langDiff.length) profilePayload.languages = langDiff;

        try {
            setSaving(true);
            await updateProfile(profilePayload);
            localStorage.setItem('photographer_skills', JSON.stringify(skills));
            setSaveOk('Profile saved successfully!');
            onSave?.();
        } catch (err) {
            const msg = err?.response?.data?.error?.message || err?.response?.data?.message || 'Failed to save profile.';
            setSaveErr(msg);
        } finally {
            setSaving(false);
        }
    };

    // ── Initial data fetch ──
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
                        gender: user.gender || '',
                    }));
                    if (user.profile_document?.url) setPhoto(user.profile_document.url);

                    // Pre-fill addresses
                    if (user.current_address) setCurrentAddress(addressFromApi(user.current_address));
                    if (user.permanent_address) setPermanentAddress(addressFromApi(user.permanent_address));

                    if (user.casts?.length) {
                        const mapped = user.casts.map(extractCast);
                        setCantShootCasts(mapped); setOriginalCasts(mapped);
                    }
                    if (user.event_categories?.length) {
                        const mapped = user.event_categories.map(extractCategory);
                        setSpecializations(mapped); setOriginalSpecs(mapped);
                    }
                    if (user.user_languages?.length) {
                        const mapped = user.user_languages.map(extractLanguage);
                        setLanguages(mapped); setOriginalLangs(mapped);
                    }
                    // Skills: extract skill string values from [{skill, is_primary}]
                    if (user.skills?.length) {
                        const mapped = user.skills.map(s => s.skill).filter(Boolean);
                        setSkills(mapped);
                        setOriginalSkills(mapped);
                        localStorage.setItem('photographer_skills', JSON.stringify(mapped));
                    }
                }
            } catch (err) { console.error('Profile fetch error:', err); }

            try {
                const r = await getCasteList();
                const d = r?.data?.data?.casts;
                if (Array.isArray(d)) setCasteSuggestions(d.map(extractCast));
            } catch (err) { console.error('Caste fetch error:', err); }

            try {
                const r = await getLanguagesList();
                const d = r?.data?.data?.languages;
                if (Array.isArray(d)) setLanguageSuggestions(d.map(extractLanguage));
            } catch (err) { console.error('Language fetch error:', err); }

            try {
                const r = await getCategory();
                const d = r?.data?.data?.event_categories;
                if (Array.isArray(d)) setCategorySuggestions(d.map(extractCategory));
            } catch (err) { console.error('Category fetch error:', err); }
        };
        fetchAll();
    }, []);

    // Tag name adapters
    const castNames = cantShootCasts.map(c => c.name);
    const setCastNames = (names) => setCantShootCasts(names.map(name => cantShootCasts.find(c => c.name === name) || casteSuggestions.find(s => s.name === name) || { id: null, name }));

    const specNames = specializations.map(c => c.name);
    const setSpecNames = (names) => setSpecializations(names.map(name => specializations.find(c => c.name === name) || categorySuggestions.find(s => s.name === name) || { id: null, name }));

    const langNames = languages.map(l => l.name);
    const setLangNames = (names) => setLanguages(names.map(name => languages.find(l => l.name === name) || languageSuggestions.find(s => s.name === name) || { id: null, name, proficiency: 'fluent' }));

    return (
        <div className="profile-form-container">
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

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
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }}>
                            <div style={{ width: '22px', height: '22px', border: '2px solid #f5a623', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
                <p style={{ margin: '8px 0 0', fontSize: '11px', color: photoUploading ? '#f5a623' : '#bbb' }}>
                    {photoUploading ? 'Uploading…' : 'Supported formats: JPG, JPEG, PNG'}
                </p>
            </div>

            {/* ── Banners ── */}
            {saveOk && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#dcfce7', color: '#15803d', fontSize: '13px' }}>
                    {saveOk}
                </div>
            )}
            {saveErr && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13px' }}>
                    {saveErr}
                </div>
            )}

            {/* ── Personal fields ── */}
            <div className="profile-grid">
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
                <div className="su-field full-width-field">
                    <label>Gender</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        {['male', 'female'].map(g => {
                            const isChecked = form.gender === g;
                            return (
                                <div
                                    key={g}
                                    onClick={() => setForm(f => ({ ...f, gender: g }))}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
                                        border: `1.5px solid ${isChecked ? '#f5a623' : '#d1d5db'}`,
                                        background: isChecked ? '#FFF9EE' : '#fff',
                                        boxShadow: isChecked ? '0 0 0 3px rgba(245,166,35,0.15)' : 'none',
                                        transition: 'all 0.2s', userSelect: 'none', flex: 1,
                                    }}
                                >
                                    <div style={{
                                        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                                        border: `2px solid ${isChecked ? '#f5a623' : '#d1d5db'}`,
                                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'border-color 0.2s',
                                    }}>
                                        {isChecked && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f5a623' }} />}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: isChecked ? 600 : 400, color: isChecked ? '#1a1a1a' : '#374151' }}>
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Skills multi-select */}
                <div className="su-field full-width-field">
                    <label>Skills<sup style={{ color: '#ef4444' }}>*</sup></label>
                    <Select
                        isMulti
                        options={SKILL_OPTIONS}
                        value={SKILL_OPTIONS.filter((option) =>
                            skills.includes(option.value)
                        )}
                        onChange={(selected) =>
                            setSkills(selected ? selected.map((item) => item.value) : [])
                        }
                        placeholder="Search or select skills..."
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                minHeight: 46,
                                borderRadius: 8,
                                borderColor: state.isFocused ? "#f5a623" : "#d1d5db",
                                boxShadow: state.isFocused
                                    ? "0 0 0 3px rgba(245,166,35,0.15)"
                                    : "none",
                                "&:hover": {
                                    borderColor: "#f5a623",
                                },
                            }),

                            multiValue: (base) => ({
                                ...base,
                                background: "#FFF3D6",
                                borderRadius: 6,
                            }),

                            multiValueLabel: (base) => ({
                                ...base,
                                color: "#1a1a1a",
                                fontWeight: 600,
                            }),

                            multiValueRemove: (base) => ({
                                ...base,
                                cursor: "pointer",
                                ":hover": {
                                    background: "#FFE5A3",
                                    color: "#000",
                                },
                            }),

                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),

                            menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                    />
                </div>

                <div className="full-width-field">
                    <TagInput label="Which cast you can't shoot" tags={castNames} setTags={setCastNames}
                        placeholder="e.g. Patel, Aditi..." suggestions={casteSuggestions.map(s => s.name)} />
                </div>
                <div className="full-width-field">
                    <TagInput label="Specialization" tags={specNames} setTags={setSpecNames}
                        placeholder="e.g. Wedding, Portrait…" suggestions={categorySuggestions.map(s => s.name)} />
                </div>
                <div className="full-width-field">
                    <TagInput label="Languages Spoken" tags={langNames} setTags={setLangNames}
                        placeholder="e.g. English, Hindi…" suggestions={languageSuggestions.map(s => s.name)} />
                </div>
            </div>

            {/* ── Current Address ── */}
            <h2 style={{ margin: '40px 0 8px', fontSize: '22px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.01em' }}>
                Current Address
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#aaa' }}>Search and select to auto-fill, or update the pincode manually.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>
                <AddressAutocompleteField
                    label="Current Address"
                    addressData={currentAddress}
                    onAddressFill={(filled) => setCurrentAddress(prev => ({ ...prev, ...filled }))}
                    onPincodeChange={(val) => setCurrentAddress(prev => ({ ...prev, postal_code: val }))}
                />
                <div className="su-field">
                    <label>Town / City</label>
                    <input type="text" value={currentAddress.city} onChange={e => setCurrentAddress(p => ({ ...p, city: e.target.value }))} placeholder="City" />
                </div>
                <div className="su-field">
                    <label>State</label>
                    <input type="text" value={currentAddress.state} onChange={e => setCurrentAddress(p => ({ ...p, state: e.target.value }))} placeholder="State" />
                </div>
                <div className="su-field full-width-field">
                    <label>Country / Region</label>
                    <input type="text" value={currentAddress.country} onChange={e => setCurrentAddress(p => ({ ...p, country: e.target.value }))} placeholder="Country" />
                </div>
            </div>

            {/* ── Permanent Address ── */}
            <h2 style={{ margin: '40px 0 8px', fontSize: '22px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.01em' }}>
                Permanent Address
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#aaa' }}>Search and select to auto-fill, or update the pincode manually.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>
                <AddressAutocompleteField
                    label="Permanent Address"
                    addressData={permanentAddress}
                    onAddressFill={(filled) => setPermanentAddress(prev => ({ ...prev, ...filled }))}
                    onPincodeChange={(val) => setPermanentAddress(prev => ({ ...prev, postal_code: val }))}
                />
                <div className="su-field">
                    <label>Town / City</label>
                    <input type="text" value={permanentAddress.city} onChange={e => setPermanentAddress(p => ({ ...p, city: e.target.value }))} placeholder="City" />
                </div>
                <div className="su-field">
                    <label>State</label>
                    <input type="text" value={permanentAddress.state} onChange={e => setPermanentAddress(p => ({ ...p, state: e.target.value }))} placeholder="State" />
                </div>
                <div className="su-field full-width-field">
                    <label>Country / Region</label>
                    <input type="text" value={permanentAddress.country} onChange={e => setPermanentAddress(p => ({ ...p, country: e.target.value }))} placeholder="Country" />
                </div>
            </div>

            {/* ── Single Save button ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '40px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="su-btn-primary"
                    style={{ padding: '11px 28px', opacity: (saving || photoUploading) ? 0.7 : 1, cursor: (saving || photoUploading) ? 'not-allowed' : 'pointer' }}
                    disabled={saving || photoUploading}
                >
                    {saving ? 'Saving…' : photoUploading ? 'Uploading photo…' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default PhotographerProfileInfo;