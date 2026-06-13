import React, { useEffect, useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { getCategory } from '../../services/common';
import { AddressAutocomplete } from '../joinAsPhotographer/signUp';
import { getPackage } from '../../services/booking';

const TellUs = () => {
  const [agreed, setAgreed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [address, setAddress] = useState(null);
 const [form, setForm] = useState({
  categoryId: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  pincode: "",
});
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategory();
      setCategories(res?.data?.data?.event_categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();
  }, []);

  const buildDateTime = (date, time) => {
  if (!date || !time) {
    return null;
  }

  const dateTime = new Date(`${date}T${time}:00`);

  if (isNaN(dateTime.getTime())) {
    console.error("Invalid date/time:", date, time);
    return null;
  }

  return dateTime.toISOString();
};

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

const handleBookNow = async () => {
  try {
    const params = {
      category_id:      form.categoryId,
      lat:              address?.lat,
      lng:              address?.lng,
      place_id:         address?.place_id,
      // ── all optional address fields from geocode ──
      address_line1:    address?.address_line1  || undefined,
      address_line2:    address?.address_line2  || undefined,
      address_line3:    address?.address_line3  || undefined,
      city:             address?.city           || undefined,
      state:            address?.state          || undefined,
      state_code:       address?.state_code     || undefined,
      country:          address?.country        || undefined,
      country_code:     address?.country_code   || undefined,
      postal_code:      address?.postal_code    || undefined,
      timezone:         address?.timezone       || undefined,
      date:             form.startDate,
      start_datetime:   buildDateTime(form.startDate, form.startTime),
      end_datetime:     buildDateTime(form.endDate, form.endTime),
    };

    const response = await getPackage(params);
    navigate('/package-suggestion', {
      state: { packages: response?.data?.data, filters: params },
    });
  } catch (err) {
    console.error(err);
  }
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
                value={form.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
              >
                <option value="">Select Event</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}

              </select>
            </div>

            {/* Event Start Date */}
            <div className="su-field">
              <label>Event Start Date</label>
             <input
  type="date"
  value={form.startDate}
  min={new Date().toISOString().split("T")[0]}
  onChange={(e) => handleChange("startDate", e.target.value)}
/>
            </div>

            {/* Event End Date */}
            <div className="su-field">
              <label>Event End Date</label>
             <input
  type="date"
  value={form.endDate}
  min={form.startDate || new Date().toISOString().split("T")[0]}
  onChange={(e) => handleChange("endDate", e.target.value)}
/>
            </div>

            {/* Event Start Time */}
            <div className="su-field">
              <label>Event Start Time</label>
             <input
  type="time"
  value={form.startTime}
  onChange={(e) => handleChange("startTime", e.target.value)}
/>
            </div>

            {/* Event End Time */}
            <div className="su-field">
              <label>Event End Time</label>
          <input
  type="time"
  value={form.endTime}
  onChange={(e) => handleChange("endTime", e.target.value)}
/>
            </div>

            {/* Event Location */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Event Location</label>
              <AddressAutocomplete
                label="Event Location"
                value={address}
                onAddressSelect={setAddress}
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
                type="button"
                className="su-btn-primary"
                style={{ width: "100%" }}
                onClick={handleBookNow}
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