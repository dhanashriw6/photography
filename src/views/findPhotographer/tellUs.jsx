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
  const [errors, setErrors] = useState({});
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.categoryId) {
      newErrors.categoryId = "Please select an event type";
    }
    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      newErrors.endDate = "End date cannot be before start date";
    }
    if (!form.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!form.endTime) {
      newErrors.endTime = "End time is required";
    }
    if (!address) {
      newErrors.address = "Event location is required";
    }
    if (!agreed) {
      newErrors.agreed = "You must accept the terms & conditions";
    }

    return newErrors;
  };

  const handleBookNow = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const params = {
        category_id: form.categoryId,
        lat: address?.lat,
        lng: address?.lng,
        place_id: address?.place_id,
        // ── all optional address fields from geocode ──
        address_line1: address?.address_line1 || undefined,
        address_line2: address?.address_line2 || undefined,
        address_line3: address?.address_line3 || undefined,
        city: address?.city || undefined,
        state: address?.state || undefined,
        state_code: address?.state_code || undefined,
        country: address?.country || undefined,
        country_code: address?.country_code || undefined,
        postal_code: address?.postal_code || undefined,
        timezone: address?.timezone || undefined,
        date: form.startDate,
        start_datetime: buildDateTime(form.startDate, form.startTime),
        end_datetime: buildDateTime(form.endDate, form.endTime),
      };

      const response = await getPackage(params);
      navigate('/package-suggestion', {
        state: { packages: response?.data?.data, filters: params },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const errorTextStyle = {
    color: '#e53935',
    fontSize: '12px',
    fontWeight: 500,
    marginTop: '5px',
    display: 'block',
  };

  const errorBorderStyle = (field) =>
    errors[field] ? { border: '1px solid #e53935' } : {};

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
                style={errorBorderStyle('categoryId')}
              >
                <option value="">Select Event</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}

              </select>
              {errors.categoryId && <span style={errorTextStyle}>{errors.categoryId}</span>}
            </div>

            {/* Event Start Date */}
            <div className="su-field">
              <label>Event Start Date</label>
              <input
                type="date"
                value={form.startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => handleChange("startDate", e.target.value)}
                style={errorBorderStyle('startDate')}
              />
              {errors.startDate && <span style={errorTextStyle}>{errors.startDate}</span>}
            </div>

            {/* Event End Date */}
            <div className="su-field">
              <label>Event End Date</label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => handleChange("endDate", e.target.value)}
                style={errorBorderStyle('endDate')}
              />
              {errors.endDate && <span style={errorTextStyle}>{errors.endDate}</span>}
            </div>

            {/* Event Start Time */}
            <div className="su-field">
              <label>Event Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                style={errorBorderStyle('startTime')}
              />
              {errors.startTime && <span style={errorTextStyle}>{errors.startTime}</span>}
            </div>

            {/* Event End Time */}
            <div className="su-field">
              <label>Event End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                style={errorBorderStyle('endTime')}
              />
              {errors.endTime && <span style={errorTextStyle}>{errors.endTime}</span>}
            </div>

            {/* Event Location */}
            <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Event Location</label>
              <AddressAutocomplete
                label="Event Location"
                value={address}
                onAddressSelect={(val) => {
                  setAddress(val);
                  if (errors.address) {
                    setErrors(prev => ({ ...prev, address: undefined }));
                  }
                }}
              />
              {errors.address && <span style={errorTextStyle}>{errors.address}</span>}
            </div>

            {/* Pincode / Zipcode */}
            {/* <div className="su-field" style={{ gridColumn: 'span 2' }}>
              <label>Pincode / Zipcode</label>
              <input
                type="text"
                value={form.pincode}
                onChange={e => handleChange('pincode', e.target.value)}
              />
            </div> */}

            {/* Terms checkbox */}
            <div style={{ gridColumn: 'span 2', marginTop: '4px', display: 'flex', flexDirection: 'column' }}>
              <label className="su-checkbox-row">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => {
                    setAgreed(e.target.checked);
                    if (errors.agreed) {
                      setErrors(prev => ({ ...prev, agreed: undefined }));
                    }
                  }}
                />
                <span>
                  I agree to the{' '}
                  <a style={{ textDecoration: 'underline', color: '#1a1a1a', cursor: 'pointer' }}>
                    terms &amp; conditions
                  </a>
                </span>
              </label>
              {errors.agreed && <span style={errorTextStyle}>{errors.agreed}</span>}
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