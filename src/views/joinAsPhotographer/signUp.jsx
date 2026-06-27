import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiChevronDown, FiX, FiCheck, FiMapPin, FiLoader } from 'react-icons/fi';
import PhotographerLayout from './PhotographerLayout';
import { signUpAsPhotographer } from '../../services/auth';

const GOOGLE_API_KEY = 'AIzaSyAqSdUC-vQRcFGmucESKRQmDCvzhfUel4c';

/* ─────────────────────────────────────────────────────────────
   Multi-Select Skills Dropdown
───────────────────────────────────────────────────────────── */
const SKILL_OPTIONS = [
  { value: 'photographer', label: 'photographer' },
  { value: 'videographer', label: 'videographer' },
  { value: 'cinematographer', label: 'cinematographer' },
  { value: 'drone_operator', label: 'drone operator' },
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
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    );
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
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxSizing: 'border-box',
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
              {opt?.label}
              <button type="button" onClick={(e) => removeTag(e, val)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#888', padding: 0, lineHeight: 1, fontSize: '14px',
                display: 'flex', alignItems: 'center',
              }}><FiX size={12} /></button>
            </span>
          );
        })}
        <FiChevronDown
          size={16}
          style={{
            marginLeft: 'auto', color: '#9ca3af', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
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
              <div
                key={opt.value}
                onClick={() => toggle(opt.value)}
                style={{
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
                {isSelected && <FiCheck size={15} style={{ color: '#f5a623' }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Address Autocomplete Field
   - Calls Places Autocomplete API on input
   - Shows suggestion dropdown with text.text
   - On select: shows structuredFormat.mainText in input
   - Fetches geocode to populate full address object
   - Exposes populated address + postal_code to parent
───────────────────────────────────────────────────────────── */

/**
 * Parse a geocode result into the payload-ready address object.
 * Returns { address_line1, city, state, country, postal_code, lat, lng, place_id, timezone }
 */
// const parseGeocodeResult = (result, placeId) => {
//   const components = result.address_components || [];

//   const get = (types) => {
//     const comp = components.find(c => types.every(t => c.types.includes(t)));
//     return comp?.long_name || '';
//   };

//   // Build address_line1 from sublocality + premise/street_number/route if present
//   const sublocality = get(['sublocality_level_1']) || get(['sublocality']) || '';
//   const premise = get(['premise']) || '';
//   const streetNumber = get(['street_number']) || '';
//   const route = get(['route']) || '';
//   const address_line1 = [premise, streetNumber, route, sublocality].filter(Boolean).join(', ') || result.formatted_address?.split(',')[0] || '';

//   const city =
//     get(['locality', 'political']) ||
//     get(['administrative_area_level_3', 'political']) ||
//     get(['administrative_area_level_2', 'political']) ||
//     '';

//   const state = get(['administrative_area_level_1', 'political']) || '';
//   const country = get(['country', 'political']) || '';
//   const postal_code = get(['postal_code']) || '';
//   const lat = result.geometry?.location?.lat || 0;
//   const lng = result.geometry?.location?.lng || 0;

//   // Derive timezone from country (simplified — for production use a timezone API)
//   const timezoneMap = { India: 'Asia/Kolkata', 'United States': 'America/New_York', 'United Kingdom': 'Europe/London' };
//   const timezone = timezoneMap[country] || 'UTC';

//   return { address_line1, city, state, country, postal_code, lat, lng, place_id: placeId, timezone };
// };


const parseGeocodeResult = (result, placeId) => {
  const components = result.address_components || [];

  const get = (types, nameType = 'long_name') => {
    const comp = components.find(c => types.every(t => c.types.includes(t)));
    return comp?.[nameType] || '';
  };

  const sublocality = get(['sublocality_level_1']) || get(['sublocality']) || '';
  const premise      = get(['premise']) || '';
  const streetNumber = get(['street_number']) || '';
  const route        = get(['route']) || '';
  const address_line1 =
    [premise, streetNumber, route, sublocality].filter(Boolean).join(', ') ||
    result.formatted_address?.split(',')[0] || '';

  const city =
    get(['locality', 'political']) ||
    get(['administrative_area_level_3', 'political']) ||
    get(['administrative_area_level_2', 'political']) || '';

  const state        = get(['administrative_area_level_1', 'political']) || '';
  const state_code   = get(['administrative_area_level_1', 'political'], 'short_name') || '';
  const country      = get(['country', 'political']) || '';
  const country_code = get(['country', 'political'], 'short_name') || '';
  const postal_code  = get(['postal_code']) || '';
  const lat          = result.geometry?.location?.lat || 0;
  const lng          = result.geometry?.location?.lng || 0;

  const timezoneMap  = {
    India: 'Asia/Kolkata',
    'United States': 'America/New_York',
    'United Kingdom': 'Europe/London',
  };
  const timezone = timezoneMap[country] || 'UTC';

  return {
    address_line1,
    address_line2: '',   // not available from geocode
    address_line3: '',
    city,
    state,
    state_code,
    country,
    country_code,
    postal_code,
    lat,
    lng,
    place_id: placeId,
    timezone,
  };
};
export const AddressAutocomplete = ({ label, hint, value, onAddressSelect, error, isCurrentAddress }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingGeocode, setLoadingGeocode] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const lastSelectedAddress = useRef(value);
  const isTyping = useRef(false);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync postal_code and address display when address is set externally
  useEffect(() => {
    if (isTyping.current) {
      if (value === null) {
        isTyping.current = false;
        lastSelectedAddress.current = null;
        return;
      }
    }
    lastSelectedAddress.current = value;
    if (value) {
      setInputValue(value.address_line1 || value.city || '');
      if (value.postal_code !== undefined) {
        setPostalCode(value.postal_code);
      }
    } else {
      setInputValue('');
      setPostalCode('');
    }
  }, [value]);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoadingSuggestions(true);
    try {
      const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
        },
        body: JSON.stringify({ input: query }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    isTyping.current = true;
    setInputValue(val);
    // Clear selected address when user types again
    onAddressSelect(null);
    setPostalCode('');

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelectSuggestion = async (suggestion) => {
    const pred = suggestion.placePrediction;
    const mainText = pred.structuredFormat?.mainText?.text || pred.text?.text || '';
    const placeId = pred.placeId;

    // Show only mainText in input
    setInputValue(mainText);
    setOpen(false);
    setSuggestions([]);

    // Fetch geocode
    setLoadingGeocode(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results?.[0]) {
        const parsed = parseGeocodeResult(data.results[0], placeId);
        setPostalCode(parsed.postal_code);
        onAddressSelect(parsed);
      }
    } catch {
      // fail silently — user can still proceed
    } finally {
      setLoadingGeocode(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setOpen(false);
    setPostalCode('');
    onAddressSelect(null);
  };

  const isLoading = loadingSuggestions || loadingGeocode;

  return (
    <div className="su-field" style={{ gridColumn: 'span 2' }}>
      {/* Address search input */}
      <label>{label}<sup style={{ color: '#ef4444' }}>*</sup></label>
      <div ref={containerRef} style={{ position: 'relative' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FiMapPin size={15} style={{
            position: 'absolute', left: '12px', color: '#9ca3af', flexShrink: 0, pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Search address…"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            style={{ paddingLeft: '34px', paddingRight: inputValue ? '56px' : '34px' }}
            autoComplete="off"
          />
          {/* Right-side icons */}
          <div style={{ position: 'absolute', right: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isLoading && (
              <span style={{ color: '#f5a623', display: 'flex', animation: 'spin 0.8s linear infinite' }}>
                <FiLoader size={15} />
              </span>
            )}
            {inputValue && !isLoading && (
              <button type="button" onClick={handleClear} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#9ca3af', display: 'flex', padding: 0,
              }}>
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        {open && suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: '#fff', border: '1.5px solid #e5e7eb',
            borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 100, overflow: 'hidden', maxHeight: '240px', overflowY: 'auto',
          }}>
            {suggestions.map((s, i) => {
              const pred = s.placePrediction;
              const fullText = pred.text?.text || '';
              const mainText = pred.structuredFormat?.mainText?.text || fullText;
              const secondaryText = pred.structuredFormat?.secondaryText?.text || '';
              return (
                <div
                  key={pred.placeId || i}
                  onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(s); }}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', fontSize: '13px',
                    borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFFBF0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <FiMapPin size={13} style={{ color: '#f5a623', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{mainText}</div>
                      {secondaryText && (
                        <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '1px' }}>{secondaryText}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hint && <p className="su-field-hint">{hint}</p>}
      {error && <p className="su-error">{error}</p>}

      {/* Pincode — shown after address is selected, prefilled from geocode */}
      {(value || postalCode !== '') && (
        <div style={{ marginTop: '12px' }}>
          <label style={{ fontSize: '13px' }}>
            Pincode / Zipcode
            {isCurrentAddress && <sup style={{ color: '#ef4444' }}>*</sup>}
          </label>
          <input
            type="text"
            placeholder="360001"
            value={postalCode}
            maxLength={10}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              setPostalCode(v);
              if (value) {
                onAddressSelect({ ...value, postal_code: v });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────── */
const SignUpPhotographer = () => {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNo, setPhoneNo] = useState('');
  const [skills, setSkills] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Address state — full parsed objects
  const [currentAddress, setCurrentAddress] = useState(null);
  const [permanentAddress, setPermanentAddress] = useState(null);

  // ── UI state ────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [success, setSuccess] = useState('');

  // ── Submit ──────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e?.preventDefault();

    setError('');
    setErrorType('');
    setSuccess('');
    setFieldErrors({});

    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (!/^[A-Za-z\s]+$/.test(firstName.trim())) {
      errors.firstName = 'Only alphabets are allowed';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z\s]+$/.test(lastName.trim())) {
      errors.lastName = 'Only alphabets are allowed';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (password.length > 16) {
      errors.password = 'Password cannot exceed 16 characters';
    }

    if (!phoneNo.trim()) {
      errors.phoneNo = 'Phone number is required';
    } else if (!/^\d+$/.test(phoneNo)) {
      errors.phoneNo = 'Only numbers are allowed';
    } else if (phoneNo.length !== 10) {
      errors.phoneNo = 'Phone number must be exactly 10 digits';
    }

    if (skills.length === 0) {
      errors.skills = 'Please select at least one skill';
    }

    if (!currentAddress) {
      errors.currentAddress = 'Please select a current address';
    }

    if (!permanentAddress) {
      errors.permanentAddress = 'Please select a permanent address';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password,
      phone_code: phoneCode,
      phone_no: phoneNo.trim(),
      user_type: 'service_provider',
      skills,
      current_address: {
        address_line1: currentAddress.address_line1,
        address_line2: currentAddress.address_line1, // mirror if no separate line2
        city: currentAddress.city,
        state: currentAddress.state,
        country: currentAddress.country,
        postal_code: currentAddress.postal_code,
        lat: currentAddress.lat,
        lng: currentAddress.lng,
        place_id: currentAddress.place_id,
        timezone: currentAddress.timezone,
        service_area_radius_meters: 50000,
      },
      permanent_address: {
        address_line1: permanentAddress.address_line1,
        city: permanentAddress.city,
        state: permanentAddress.state,
        country: permanentAddress.country,
        postal_code: permanentAddress.postal_code,
        lat: permanentAddress.lat,
        lng: permanentAddress.lng,
        place_id: permanentAddress.place_id,
        timezone: permanentAddress.timezone,
      },
    };

    try {
      setLoading(true);
      const res = await signUpAsPhotographer(payload);
      const { access_token, refresh_token } = res?.data?.data || {};
      if (access_token) localStorage.setItem('authToken', access_token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/join-as-photographer/login'), 1500);
    } catch (err) {
      const status = err?.response?.status;
      const code = err?.response?.data?.error?.code;
      const msg = err?.response?.data?.error?.message || err?.response?.data?.message;
      if (status === 409 || code === 'CONFLICT') {
        setErrorType('conflict');
        setError(msg || 'An account with this email or phone number already exists.');
      } else {
        setErrorType('general');
        setError(msg || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhotographerLayout>
      {/* Spinner keyframe — injected once */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">
          <h1 style={{
            textAlign: 'center', fontSize: '36px', fontWeight: 700,
            color: '#1a1a1a', marginBottom: '28px', letterSpacing: '-0.01em',
          }}>
            Sign Up
          </h1>

          {/* ── Error Banner ── */}
          {error && (
            <div style={{
              marginBottom: '16px', padding: '12px 14px', borderRadius: '8px',
              background: errorType === 'conflict' ? '#FFF7ED' : '#fee2e2',
              border: `1px solid ${errorType === 'conflict' ? '#FDBA74' : '#fca5a5'}`,
              color: errorType === 'conflict' ? '#9a3412' : '#b91c1c',
              fontSize: '13px', lineHeight: '1.6',
            }}>
              {error}
              {errorType === 'conflict' && (
                <span>
                  {' '}Please{' '}
                  <a href="/join-as-photographer/login" style={{ color: '#c2410c', fontWeight: 700, textDecoration: 'underline' }}>
                    log in
                  </a>
                  {' '}instead, or use a different email and phone number.
                </span>
              )}
            </div>
          )}

          {/* ── Success Banner ── */}
          {success && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px', borderRadius: '8px',
              background: '#dcfce7', color: '#15803d', fontSize: '13px',
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 20px' }}>

              {/* First Name */}
              <div className="su-field">
                <label>First Name</label>
                <input type="text" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <p className="su-field-hint">Must match identification documents.</p>
                {fieldErrors.firstName && <p className="su-error">{fieldErrors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="su-field">
                <label>Last Name</label>
                <input type="text" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
                <p className="su-field-hint">Must match identification documents.</p>
                {fieldErrors.lastName && <p className="su-error">{fieldErrors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="su-field">
                <label>Email</label>
                <input type="email" placeholder="johndoe@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                {fieldErrors.email && <p className="su-error">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="su-field">
                <label>Password</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    style={{ flex: 1 }}
                    maxLength={16} minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#aaa', padding: 0, display: 'flex', flexShrink: 0,
                  }}>
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
                {fieldErrors.password && <p className="su-error">{fieldErrors.password}</p>}
              </div>

              {/* Phone */}
              <div className="su-field" style={{ gridColumn: 'span 2' }}>
                <label>Phone Number<sup style={{ color: '#ef4444' }}>*</sup></label>
                <div className="su-phone-row">
                  <select className="su-country" value={phoneCode} onChange={e => setPhoneCode(e.target.value)}>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <input
                    className="su-number"
                    type="tel"
                    placeholder="12345 67890"
                    value={phoneNo}
                    maxLength={10}
                    onChange={(e) => setPhoneNo(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <p className="su-field-hint">Enter valid number for OTP verification</p>
                {fieldErrors.phoneNo && <p className="su-error">{fieldErrors.phoneNo}</p>}
              </div>

              {/* Skills */}
              <div className="su-field" style={{ gridColumn: 'span 2' }}>
                <label>Skills<sup style={{ color: '#ef4444' }}>*</sup></label>
                <MultiSkillSelect selected={skills} onChange={setSkills} />
                <p className="su-field-hint">Select one or more skills that apply to you.</p>
                {fieldErrors.skills && <p className="su-error">{fieldErrors.skills}</p>}
              </div>

              {/* ── Current Address ── */}
              <AddressAutocomplete
                label="Current Address"
                hint="Start typing your current city or area."
                value={currentAddress}
                onAddressSelect={setCurrentAddress}
                error={fieldErrors.currentAddress}
                isCurrentAddress
              />

              {/* ── Permanent Address ── */}
              <AddressAutocomplete
                label="Permanent Address"
                hint="Start typing your permanent city or area."
                value={permanentAddress}
                onAddressSelect={setPermanentAddress}
                error={fieldErrors.permanentAddress}
                isCurrentAddress={false}
              />

              {/* Submit */}
                              <button className='su-btn-primary' onClick={() => navigate('/')}>Back</button>

              {/* <div style={{ gridColumn: 'span 2', marginTop: '4px' }}> */}
                <button
                  type="submit"
                  className="su-btn-primary"
                  style={{ width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  disabled={loading}
                >
                  {loading ? 'Creating account…' : 'Sign Up'}
                </button>
              {/* </div> */}
            </div>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '20px' }}>
            Already have an account?{' '}
            <a href="/join-as-photographer/login" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
              Login
            </a>
          </p>
        </div>
      </div>
    </PhotographerLayout>
  );
};

export default SignUpPhotographer;