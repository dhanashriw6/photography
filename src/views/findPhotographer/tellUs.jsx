import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { BsCalendar2Event } from 'react-icons/bs';
import { FiChevronDown } from 'react-icons/fi';

const TellUs = () => {
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    eventType: 'wedding',
    startDate: '14/04/2025',
    endDate: '14/04/2025',
    startTime: '01:20',
    endTime: '01:20',
    location: 'Gujrat , India',
    pincode: '360003',
  });
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  /* ── Floating-label field wrapper ── */
  const Field = ({ label, span = 1, children }) => (
    <div
      style={{
        gridColumn: span === 2 ? 'span 2' : undefined,
        position: 'relative',
      }}
    >
      {/* Outlined floating label */}
      <fieldset
        style={{
          border: '1.5px solid #d1d5db',
          borderRadius: '10px',
          padding: '0 12px 10px',
          margin: 0,
          background: '#fff',
        }}
      >
        <legend
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#555',
            padding: '0 4px',
            marginLeft: '2px',
          }}
        >
          {label}
        </legend>
        {children}
      </fieldset>
    </div>
  );

  const inputStyle = {
    width: '100%',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#1a1a1a',
    background: 'transparent',
    padding: '2px 0',
    boxSizing: 'border-box',
  };

  const iconStyle = {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888',
    fontSize: '16px',
    pointerEvents: 'none',
  };



  return (
    <ViewsLayout>
      <div className="w-full" style={{ maxWidth: '640px' }}>
        <div className="views-card">
          <h1
            style={{
              textAlign: 'center',
              fontSize: '36px',
              fontWeight: 700,
              color: '#1a1a1a',
              marginBottom: '28px',
              letterSpacing: '-0.01em',
            }}
          >
            Tell Us About Your Event
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '20px 20px',
            }}
          >
            {/* Select Your Event — full width */}
            <Field label="Select Your Event" span={2}>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.eventType}
                  onChange={e => handleChange('eventType', e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    paddingRight: '28px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="corporate">Corporate</option>
                  <option value="engagement">Engagement</option>
                  <option value="other">Other</option>
                </select>
                {/* Chevron */}
                <span style={{ ...iconStyle, top: '50%', right: '0' }}>
                  <FiChevronDown size={16} color="#888" />
                </span>
              </div>
            </Field>

            {/* Event Start Date */}
            <Field label="Event Start Date">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={form.startDate}
                  onChange={e => handleChange('startDate', e.target.value)}
                  style={{ ...inputStyle, paddingRight: '28px' }}
                />
                <span style={{ position: 'absolute', right: 0 }}><BsCalendar2Event size={16} color="#888" /></span>
              </div>
            </Field>

            {/* Event End Date */}
            <Field label="Event End Date">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={form.endDate}
                  onChange={e => handleChange('endDate', e.target.value)}
                  style={{ ...inputStyle, paddingRight: '28px' }}
                />
                <span style={{ position: 'absolute', right: 0 }}><BsCalendar2Event size={16} color="#888" /></span>
              </div>
            </Field>

            {/* Event Start Time */}
            <Field label="Event Start Time">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={form.startTime}
                  onChange={e => handleChange('startTime', e.target.value)}
                  style={{ ...inputStyle, paddingRight: '28px' }}
                />
                <span style={{ position: 'absolute', right: 0 }}><BsCalendar2Event size={16} color="#888" /></span>
              </div>
            </Field>

            {/* Event End Time */}
            <Field label="Event End Time">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={form.endTime}
                  onChange={e => handleChange('endTime', e.target.value)}
                  style={{ ...inputStyle, paddingRight: '28px' }}
                />
                <span style={{ position: 'absolute', right: 0 }}><BsCalendar2Event size={16} color="#888" /></span>
              </div>
            </Field>

            {/* Event Location — full width */}
            <Field label="Event Location" span={2}>
              <input
                type="text"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                style={inputStyle}
              />
            </Field>

            {/* Pincode / Zipcode — full width */}
            <Field label="Pincode/Zipcode" span={2}>
              <input
                type="text"
                value={form.pincode}
                onChange={e => handleChange('pincode', e.target.value)}
                style={inputStyle}
              />
            </Field>

            {/* Terms checkbox */}
            <div style={{ gridColumn: 'span 2', marginTop: '4px', display: 'flex' }}>
              <label className="su-checkbox-row">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                />
                <span>
                  I agree to the{' '}
                  <a style={{ textDecoration: 'underline', color: '#1a1a1a', cursor: 'pointer' }}>
                    terms &amp; conditions
                  </a>
                </span>
              </label>
            </div>

            {/* Book Now CTA */}
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
              <button type="submit" className="su-btn-primary" onClick={() => navigate('/find-best')}>Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default TellUs;