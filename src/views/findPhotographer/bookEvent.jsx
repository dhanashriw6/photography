import React, { useEffect, useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { getCategory } from '../../services/common';
import { AddressAutocomplete } from '../joinAsPhotographer/signUp';
import { getPackage } from '../../services/booking';
import {
    FiShield,
    FiCalendar,
    FiUsers,
    FiHeadphones,
} from 'react-icons/fi';

const BookEvent = () => {
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

        <div className="w-full" style={{ maxWidth: '1100px' }}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    borderRadius: '26px',
                    overflow: 'hidden',

                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                {/* ── Left panel ── */}


                {/* ── Right panel: form ── */}
                <div style={{ flex: '1 1 420px', padding: '5px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                        
                        <div>
                            <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                                Tell Us About Your Event
                            </h2>
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

    );
};

export default BookEvent;