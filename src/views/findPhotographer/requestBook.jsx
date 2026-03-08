import React, { useState } from 'react';
import ViewsLayout from '../Layout';
import '../index.css';
import { BsCameraFill, BsStarFill } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { FiPhone, FiEdit2 } from 'react-icons/fi';
import { LuCalendar, LuClock } from 'react-icons/lu';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Reusable field using shared .su-field CSS class ── */
const FieldBox = ({ label, children, style = {} }) => (
    <div className="su-field" style={style}>
        <label>{label}</label>
        {children}
    </div>
);

/* ── Map placeholder ── */
const MapPreview = () => (
    <div style={{
        borderRadius: '10px',
        overflow: 'hidden',
        height: '160px',
        position: 'relative',
        background: '#e8edf0',
    }}>
        <img
            src="https://tile.openstreetmap.org/13/4823/3084.png"
            alt="map"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 20, height: 20,
            borderRadius: '50%',
            background: '#e53935',
            border: '3px solid #fff',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }} />
    </div>
);

const RequestBook = () => {
    const [eventName, setEventName] = useState('wedding');
    const [startDate] = useState('29 May 2025');
    const [endDate] = useState('29 May 2025');
    const [startTime, setStartTime] = useState('01:00 PM');
    const [endTime, setEndTime] = useState('07:00 PM');
    const [pkg] = useState('Full day');
    const [addons, setAddons] = useState('');
    const [venue, setVenue] = useState('party plot');
    const [address, setAddress] = useState('');
    const navigate = useNavigate()

    return (
        <ViewsLayout>
           

            <div style={{
                background: '#f7f7f5',
                minHeight: '100vh',
                padding: '36px 0 ',
            }}>

                {/* ── Page Title ── */}
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: '#1a1a1a',
                    margin: '0 0 32px',
                    letterSpacing: '-0.02em',
                    fontFamily: 'inherit',
                }}>Request to booking</h1>

                {/* ── Two-column grid ── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '560px 560px',
                    gap: '20px',
                    // alignItems: 'start',
                    // maxWidth: '1100px',
                    margin: '0 auto',
                    padding: '0 40px',
                }}>

                    {/* ════ LEFT COLUMN ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* ── Booking Details Card ── */}
                        <div className="rb-card" style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '22px 24px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}>
                            <p style={{ margin: '0 0 20px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                                Your Booking Details
                            </p>

                            {/* Event Name */}
                            <FieldBox label="Event Name">
                                <div className="rb-event-input-wrap">
                                    <input
                                        value={eventName}
                                        onChange={e => setEventName(e.target.value)}
                                    />
                                    <ChevronDown size={16} color="#999" className="rb-chevron" />
                                </div>
                            </FieldBox>

                            {/* Dates */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                                <FieldBox label="Start Date">
                                    <div className="rb-field-display">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <LuCalendar size={15} color="#E8A317" />
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{startDate}</span>
                                        </div>
                                        <FiEdit2 size={13} color="#bbb" />
                                    </div>
                                </FieldBox>
                                <FieldBox label="End Date">
                                    <div className="rb-field-display">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <LuCalendar size={15} color="#E8A317" />
                                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{endDate}</span>
                                        </div>
                                        <FiEdit2 size={13} color="#bbb" />
                                    </div>
                                </FieldBox>
                            </div>

                            {/* Time */}
                            <div style={{ marginTop: '16px' }}>
                                <FieldBox label="Time">
                                    <div className="rb-field-display">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                            <LuClock size={15} color="#E8A317" />
                                            <input
                                                className="rb-inline-input"
                                                value={startTime}
                                                onChange={e => setStartTime(e.target.value)}
                                            />
                                            <span style={{ color: '#bbb', fontSize: '13px' }}>to</span>
                                            <input
                                                className="rb-inline-input"
                                                value={endTime}
                                                onChange={e => setEndTime(e.target.value)}
                                            />
                                        </div>
                                        <FiEdit2 size={13} color="#bbb" />
                                    </div>
                                </FieldBox>
                            </div>

                            {/* Package */}
                            <div style={{ marginTop: '16px' }}>
                                <FieldBox label="Your package">
                                    <div className="rb-field-display">
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>{pkg}</span>
                                        <FiEdit2 size={13} color="#bbb" />
                                    </div>
                                </FieldBox>
                            </div>

                            {/* Add-ons */}
                            <div style={{ marginTop: '16px' }}>
                                <FieldBox label="AddOns">
                                    <div className="rb-field-display" style={{ alignItems: 'flex-start' }}>
                                        <textarea
                                            className="rb-inline-textarea"
                                            value={addons}
                                            onChange={e => setAddons(e.target.value)}
                                            placeholder="write here you want to add in your package"
                                        />
                                        <FiEdit2 size={13} color="#bbb" style={{ marginLeft: '8px', flexShrink: 0, marginTop: '2px' }} />
                                    </div>
                                </FieldBox>
                            </div>
                        </div>

                        {/* ── Photographer Card ── */}
                        <div className="rb-card" style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        }}>
                            {/* Orange banner */}
                            <div style={{
                                background: 'linear-gradient(135deg, #E8A317 0%, #f5b93a 100%)',
                                height: '80px',
                            }} />

                            {/* White body */}
                            <div style={{
                                background: '#fff',
                                padding: '0 24px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                                {/* Avatar overlapping banner */}
                                <div style={{ marginTop: '-44px', position: 'relative', marginBottom: '12px' }}>
                                    <div style={{
                                        width: '80px', height: '80px',
                                        borderRadius: '50%',
                                        border: '4px solid #fff',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                    }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"
                                            alt="John Miller"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: '5px', right: '5px',
                                        width: '13px', height: '13px',
                                        borderRadius: '50%', background: '#22c55e',
                                        border: '2px solid #fff',
                                    }} />
                                </div>

                                <p style={{
                                    margin: '0 0 8px', fontWeight: 800,
                                    fontSize: '20px', color: '#1a1a1a',
                                    letterSpacing: '-0.01em',
                                }}>John Miller</p>

                                {/* Verified badge + since */}
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: '10px', marginBottom: '18px',
                                    flexWrap: 'wrap', justifyContent: 'center',
                                }}>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        background: '#FFF3D6',
                                        border: '1px solid #E8A317',
                                        borderRadius: '50px', padding: '4px 12px',
                                        fontSize: '12px', fontWeight: 700, color: '#c98f10',
                                    }}>
                                        <MdVerified size={13} color="#E8A317" />
                                        Verified photographer
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#999', fontWeight: 500 }}>
                                        Since March 2021
                                    </span>
                                </div>

                                {/* Stats */}
                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    border: '1.5px solid #f0f0f0',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    marginBottom: '18px',
                                }}>
                                    <div style={{
                                        flex: 1, textAlign: 'center',
                                        padding: '14px 12px',
                                        borderRight: '1.5px solid #f0f0f0',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '3px' }}>
                                            <BsCameraFill size={13} color="#E8A317" />
                                            <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>180+</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 500 }}>Event completed</p>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'center', padding: '14px 12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '3px' }}>
                                            <BsStarFill size={13} color="#E8A317" />
                                            <span style={{ fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>4.8</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 500 }}>Rating</p>
                                    </div>
                                </div>

                                {/* Contact — reuses .su-btn-primary from index.css */}
                                <button className="su-btn-primary rb-btn-contact" style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '8px',
                                }}>
                                    <FiPhone size={15} />
                                    Contact Photographer
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ════ RIGHT COLUMN ════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Event Location */}
                        <div className="rb-card" style={{
                            background: '#fff', borderRadius: '16px',
                            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}>
                            <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                                Event Location
                            </p>
                            <MapPreview />
                        </div>

                        {/* Add Event Location */}
                        <div className="rb-card" style={{
                            background: '#fff', borderRadius: '16px',
                            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}>
                            <p style={{ margin: '0 0 20px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                                Add Event Location
                            </p>

                            {/* Venue — uses .su-field + native input → gets focus ring from index.css */}
                            <div style={{ marginBottom: '16px' }}>
                                <FieldBox label="Venue Name">
                                    <input
                                        type="text"
                                        value={venue}
                                        onChange={e => setVenue(e.target.value)}
                                        placeholder="venue name"
                                    />
                                </FieldBox>
                            </div>

                            {/* Address */}
                            <div style={{ marginBottom: '20px' }}>
                                <FieldBox label="Add address details">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        placeholder="Area name , street name"
                                    />
                                </FieldBox>
                            </div>

                            {/* Save — reuses .su-btn-primary */}
                            <button className="su-btn-primary">Save</button>
                        </div>

                        {/* Price List */}
                        <div className="rb-card" style={{
                            background: '#fff', borderRadius: '16px',
                            padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}>
                            <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '15px', color: '#1a1a1a' }}>
                                Price list
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Summary</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Credits Used</span>
                            </div>

                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { label: 'Package Price', value: 20 },
                                    { label: 'Add On Price', value: 20 },
                                ].map(row => (
                                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>{row.label}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{row.value}</span>
                                    </div>
                                ))}
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: '2px',
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>40</span>
                                </div>
                            </div>

                            {/* Pay Now — reuses .su-btn-primary */}
                            <button className="su-btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/thank-you')}>
                                Pay Now
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </ViewsLayout>
    );
};

export default RequestBook;