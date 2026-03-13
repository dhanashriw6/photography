import React, { useRef, useState } from 'react';
import { LuCamera } from 'react-icons/lu';

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
            <h2 style={{ margin: '0 0 6px', fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px', marginBottom: '24px' }}>
                <div className="su-field">
                    <label>First Name</label>
                    <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="John" />
                    <p className="su-field-hint">Must match identification documents.</p>
                </div>
                <div className="su-field">
                    <label>Last Name</label>
                    <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
                    <p className="su-field-hint">Must match identification documents.</p>
                </div>
            </div>

            {/* Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px', marginBottom: '24px' }}>
                <div className="su-field">
                    <label>Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
                </div>
                <div className="su-field">
                    <label>Phone Number</label>
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
            </div>

            {/* Cast + Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px', marginBottom: '40px' }}>
                <div className="su-field">
                    <label>Cast</label>
                    <input type="text" value={form.cast} onChange={set('cast')} placeholder="Cast" />
                </div>
                <div className="su-field">
                    <label>Gender</label>
                    <select value={form.gender} onChange={set('gender')}>
                        <option value="">Choose Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* ── Address ── */}
            <h2 style={{ margin: '0 0 24px', fontSize: '36px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>Address</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                <div className="su-field">
                    <label>Pincode</label>
                    <input type="text" value={form.pincode} onChange={set('pincode')} placeholder="360001" />
                </div>
                <div className="su-field">
                    <label>Flat, House no., Building, Company, Apartment</label>
                    <input type="text" value={form.flat} onChange={set('flat')} placeholder="Enter Flat, House no., Building, Company, Apartment" />
                </div>
                <div className="su-field">
                    <label>Area, Street, Village</label>
                    <input type="text" value={form.area} onChange={set('area')} placeholder="Enter Area, Street, Village" />
                </div>
                <div className="su-field">
                    <label>Landmark</label>
                    <input type="text" value={form.landmark} onChange={set('landmark')} placeholder="Landmark" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 20px' }}>
                    <div className="su-field">
                        <label>Town / City</label>
                        <select value={form.city} onChange={set('city')}>
                            <option value="">Select City</option>
                            <option>Rajkot</option>
                            <option>Ahmedabad</option>
                            <option>Surat</option>
                        </select>
                    </div>
                    <div className="su-field">
                        <label>State</label>
                        <select value={form.state} onChange={set('state')}>
                            <option value="">Select State</option>
                            <option>Gujarat</option>
                            <option>Maharashtra</option>
                            <option>Rajasthan</option>
                        </select>
                    </div>
                </div>
                <div className="su-field">
                    <label>Country / Region</label>
                    <select value={form.country} onChange={set('country')}>
                        <option>India</option>
                        <option>USA</option>
                        <option>UK</option>
                    </select>
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button onClick={onCancel} className="su-btn-primary-outline">Cancel</button>
                <button className="su-btn-primary" onClick={onSave}>Save</button>
            </div>
        </div>
    );
};

export default ProfileInformation;