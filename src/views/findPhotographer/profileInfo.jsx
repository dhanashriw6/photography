import React, { useRef, useState } from 'react';
import { LuCamera } from 'react-icons/lu';

const FieldBox = ({ label, children, hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
            border: '1.5px solid #e0e0e0',
            borderRadius: '8px',
            padding: '10px 14px 8px',
            position: 'relative',
            background: '#fff',
            transition: 'border-color 0.2s',
        }}
            onFocusCapture={e => e.currentTarget.style.borderColor = '#E8A317'}
            onBlurCapture={e => e.currentTarget.style.borderColor = '#e0e0e0'}
        >
            <label style={{
                position: 'absolute', top: '-9px', left: '12px',
                background: '#fff', padding: '0 4px',
                fontSize: '11px', fontWeight: 600, color: '#999',
                letterSpacing: '0.03em',
            }}>{label}</label>
            {children}
        </div>
        {hint && <p style={{ margin: 0, fontSize: '11px', color: '#aaa', paddingLeft: '4px' }}>{hint}</p>}
    </div>
);

const inputStyle = {
    border: 'none', outline: 'none', background: 'transparent',
    fontSize: '14px', fontWeight: 500, color: '#1a1a1a',
    width: '100%', fontFamily: 'inherit', padding: '2px 0',
};

const selectStyle = {
    ...{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', fontWeight: 500, color: '#1a1a1a', width: '100%', fontFamily: 'inherit', padding: '2px 0' },
    appearance: 'none', cursor: 'pointer',
};

const ProfileInformation = ({ onSave, onCancel }) => {
    const fileRef = useRef();
    const [photo, setPhoto] = useState(null);
    const [form, setForm] = useState({
        firstName: 'John', lastName: 'Doe',
        email: 'johndoe@gmail.com', phone: '12345 67890',
        cast: 'Patel', gender: '',
        pincode: '360001', flat: '', area: '',
        landmark: '', city: '', state: '', country: 'India',
    });

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) setPhoto(URL.createObjectURL(file));
    };

    return (
        <div>
            {/* ── Personal Information ── */}
            <h2 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Personal Information
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: '13px', fontWeight: 600, color: '#555' }}>
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
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#E8A317'}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>
                <FieldBox label="First Name" hint="Must match identification documents.">
                    <input style={inputStyle} value={form.firstName} onChange={set('firstName')} placeholder="John" />
                </FieldBox>
                <FieldBox label="Last Name" hint="Must match identification documents.">
                    <input style={inputStyle} value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
                </FieldBox>
            </div>

            {/* Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <FieldBox label="Email">
                    <input style={inputStyle} value={form.email} onChange={set('email')} type="email" placeholder="email@example.com" />
                </FieldBox>
                <FieldBox label="Phone Number" hint="Enter a valid phone number to receive OTPs">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>🇮🇳</span>
                        <span style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>+91</span>
                        <input style={{ ...inputStyle, flex: 1 }} value={form.phone} onChange={set('phone')} placeholder="00000 00000" />
                    </div>
                </FieldBox>
            </div>

            {/* Cast + Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                <FieldBox label="Cast">
                    <input style={inputStyle} value={form.cast} onChange={set('cast')} placeholder="Cast" />
                </FieldBox>
                <FieldBox label="Gender">
                    <div style={{ position: 'relative' }}>
                        <select style={selectStyle} value={form.gender} onChange={set('gender')}>
                            <option value="">Choose Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }}>▾</span>
                    </div>
                </FieldBox>
            </div>

            {/* ── Address ── */}
            <h2 style={{ margin: '0 0 20px', fontSize: '26px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Address</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <FieldBox label="Pincode">
                    <input style={inputStyle} value={form.pincode} onChange={set('pincode')} placeholder="360001" />
                </FieldBox>
                <FieldBox label="Flat, House no., Building, Company, Apartment">
                    <input style={inputStyle} value={form.flat} onChange={set('flat')} placeholder="Enter Flat, House no., Building, Company, Apartment" />
                </FieldBox>
                <FieldBox label="Area, Street, Village">
                    <input style={inputStyle} value={form.area} onChange={set('area')} placeholder="Enter Area, Street, Village" />
                </FieldBox>
                <FieldBox label="Landmark">
                    <input style={inputStyle} value={form.landmark} onChange={set('landmark')} placeholder="Landmark" />
                </FieldBox>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <FieldBox label="Town / City">
                        <div style={{ position: 'relative' }}>
                            <select style={selectStyle} value={form.city} onChange={set('city')}>
                                <option value="">Select City</option>
                                <option>Rajkot</option>
                                <option>Ahmedabad</option>
                                <option>Surat</option>
                            </select>
                            <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }}>▾</span>
                        </div>
                    </FieldBox>
                    <FieldBox label="State">
                        <div style={{ position: 'relative' }}>
                            <select style={selectStyle} value={form.state} onChange={set('state')}>
                                <option value="">Select State</option>
                                <option>Gujarat</option>
                                <option>Maharashtra</option>
                                <option>Rajasthan</option>
                            </select>
                            <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }}>▾</span>
                        </div>
                    </FieldBox>
                </div>
                <FieldBox label="Country / Region">
                    <div style={{ position: 'relative' }}>
                        <select style={selectStyle} value={form.country} onChange={set('country')}>
                            <option>India</option>
                            <option>USA</option>
                            <option>UK</option>
                        </select>
                        <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }}>▾</span>
                    </div>
                </FieldBox>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={onCancel} style={{
                    background: '#fff', color: '#E8A317',
                    border: '2px solid #E8A317', borderRadius: '50px',
                    padding: '11px 28px', fontSize: '14px', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF3D6'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >Cancel</button>
                <button onClick={onSave} style={{
                    background: '#E8A317', color: '#fff',
                    border: '2px solid #E8A317', borderRadius: '50px',
                    padding: '11px 28px', fontSize: '14px', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#c98f10'}
                    onMouseLeave={e => e.currentTarget.style.background = '#E8A317'}
                >Save</button>
            </div>
        </div>
    );
};

export default ProfileInformation;