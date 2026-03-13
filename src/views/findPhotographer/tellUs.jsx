import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';

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
              gap: '24px 20px',
            }}
          >
            {/* Select Your Event */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Select Your Event</label>
              <select
                value={form.eventType}
                onChange={e => handleChange('eventType', e.target.value)}
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday</option>
                <option value="corporate">Corporate</option>
                <option value="engagement">Engagement</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Event Start Date */}
            <div className="su-field">
              <label>Event Start Date</label>
              <input
                type="text"
                value={form.startDate}
                onChange={e => handleChange('startDate', e.target.value)}
              />
            </div>

            {/* Event End Date */}
            <div className="su-field">
              <label>Event End Date</label>
              <input
                type="text"
                value={form.endDate}
                onChange={e => handleChange('endDate', e.target.value)}
              />
            </div>

            {/* Event Start Time */}
            <div className="su-field">
              <label>Event Start Time</label>
              <input
                type="text"
                value={form.startTime}
                onChange={e => handleChange('startTime', e.target.value)}
              />
            </div>

            {/* Event End Time */}
            <div className="su-field">
              <label>Event End Time</label>
              <input
                type="text"
                value={form.endTime}
                onChange={e => handleChange('endTime', e.target.value)}
              />
            </div>

            {/* Event Location */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Event Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
              />
            </div>

            {/* Pincode / Zipcode */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Pincode / Zipcode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={e => handleChange('pincode', e.target.value)}
              />
            </div>

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
              <button
                type="submit"
                className="su-btn-primary"
                style={{ width: '100%' }}
                onClick={() => navigate('/find-best')}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default TellUs;