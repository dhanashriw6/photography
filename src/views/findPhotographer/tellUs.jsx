import React, { useEffect, useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { getCategory } from '../../services/common';
import { AddressAutocomplete } from '../joinAsPhotographer/signUp';
import { getPackage } from '../../services/booking';
import Select from "react-select";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiHeadphones,
} from 'react-icons/fi';

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

  const FEATURES = [
    {
      icon: <FiCalendar size={17} />,
      title: 'Easy & Fast Booking',
      desc: "Share a few details and we'll handle the planning.",
    },
    {
      icon: <FiShield size={17} />,
      title: 'Secure & Reliable',
      desc: "Your data is safe with us. We're here to deliver peace of mind.",
    },
    {
      icon: <FiUsers size={17} />,
      title: 'Professional Photographers',
      desc: 'Top-quality photography tailored to your event.',
    },
  ];

  return (
    <ViewsLayout>
      <div className="w-full" style={{ maxWidth: '1100px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            borderRadius: '26px',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            background: '#fff',
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {/* ── Left panel ── */}
          <div
            style={{
              flex: '1 1 360px',
              minWidth: '320px',
              position: 'relative',
              minHeight: '620px',
              backgroundImage: 'url(/BG.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#fff',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.8) 100%)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '22px',
                }}
              >
                <FiShield size={13} style={{ color: '#FFAE00' }} />
                Trusted by hundreds of happy clients
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 14px', lineHeight: 1.25 }}>
                Let's Capture<br />Your Special Moments
              </h2>

              <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: '0 0 30px', maxWidth: '300px' }}>
                Tell us about your event and we'll take care of the rest. Professional. Reliable. Unforgettable.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.12)',
                        color: '#FFAE00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700 }}>{f.title}</p>
                      <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need help card */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '28px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#FFAE00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FiHeadphones size={17} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>Need help?</p>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'rgba(255,255,255,0.7)' }}>Our team is ready to assist you</p>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: 'rgba(255,255,255,0.7)' }}>Mon - Sat, 9:00 AM - 7:00 PM</p>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#FFAE00', fontWeight: 700 }}>+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* ── Right panel: form ── */}
          <div style={{ flex: '1 1 420px', minWidth: '320px', padding: '40px 44px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#FFF3D6',
                  color: '#E8A317',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FiCalendar size={20} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '21px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.01em' }}>
                  Tell Us About Your Event
                </h1>
                <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#999' }}>
                  Fill in the details below to check availability and get started.
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', margin: '0 0 24px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Select Your Event */}
              <div className="su-field">
                <label>Select Your Event</label>

                <Select
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  value={
                    categories
                      .map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))
                      .find((option) => option.value === form.categoryId) || null
                  }
                  onChange={(selected) =>
                    handleChange("categoryId", selected?.value || "")
                  }
                  placeholder="Search or select an event"
                  isSearchable
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "48px",
                      borderColor: errors.categoryId ? "#ef4444" : "#ddd",
                    }),
                 
                  
                  }}
                />

                {errors.categoryId && (
                  <span style={errorTextStyle}>{errors.categoryId}</span>
                )}
              </div>
              {/* Start / End Date */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
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
              </div>

              {/* Start / End Time */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
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
              </div>

              {/* Event Location */}
              <div className="su-field">
                <label>
                  Event Location<span style={{ color: '#e53935' }}>*</span>
                </label>
                <AddressAutocomplete
                  showPin={false}
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

              {/* Terms checkbox */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                    <a style={{ textDecoration: 'underline', color: '#1a1a1a', cursor: 'pointer', fontWeight: 700 }}>
                      terms &amp; conditions
                    </a>
                  </span>
                </label>
                {errors.agreed && <span style={errorTextStyle}>{errors.agreed}</span>}
              </div>

              {/* Book Now CTA */}
              <button
                type="button"
                onClick={handleBookNow}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  border: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f5a623 0%, #E8A317 100%)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontFamily: 'inherit',
                  boxShadow: '0 6px 18px rgba(232,163,23,0.35)',
                }}
              >
                <FiCalendar size={16} />
                Book Now
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#999' }}>
                <FiShield size={13} style={{ color: '#bbb' }} />
                No hidden charges. Transparent pricing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default TellUs;