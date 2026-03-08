import React, { useState, useRef } from 'react';
import ViewsLayout from '../Layout';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { FiUploadCloud } from 'react-icons/fi';

const LeaveReview = () => {
    const [rating, setRating] = useState(5);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);
    const [recommend, setRecommend] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef();

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
        setPhotos(prev => [...prev, ...previews]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const previews = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
        setPhotos(prev => [...prev, ...previews]);
    };

    const handleSubmit = () => {
        if (!comment.trim()) return;
        setSubmitted(true);
    };

    const displayRating = hovered || rating;

    return (
        <ViewsLayout>
            <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', padding: '0 20px 60px', fontFamily: 'inherit' }}>

                <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 900, color: '#1a1a1a', margin: '0 0 32px', letterSpacing: '-0.02em' }}>
                    Leave A Review
                </h1>

                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                        <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800, color: '#1a1a1a' }}>Review Posted!</h3>
                        <p style={{ color: '#888', fontSize: '14px' }}>Thank you for sharing your experience.</p>
                    </div>
                ) : (
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>

                        {/* Star Rating */}
                        <div style={{ marginBottom: '24px' }}>
                            <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Add A Rating</p>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <button
                                        key={i}
                                        type="button"
                                        onMouseEnter={() => setHovered(i)}
                                        onMouseLeave={() => setHovered(0)}
                                        onClick={() => setRating(i)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.15s' }}
                                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        {i <= displayRating
                                            ? <BsStarFill size={28} color="#E8A317" />
                                            : <BsStar size={28} color="#ddd" />
                                        }
                                    </button>
                                ))}
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: 500 }}>Your Rating: {rating}/5</p>
                        </div>

                        {/* Write A Review */}
                        <div style={{ marginBottom: '20px', position: 'relative' }}>
                            <div style={{
                                border: '1.5px solid #e0e0e0', borderRadius: '10px',
                                padding: '12px 14px 10px', position: 'relative',
                                transition: 'border-color 0.2s',
                            }}
                                onFocusCapture={e => e.currentTarget.style.borderColor = '#E8A317'}
                                onBlurCapture={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                            >
                                <label style={{
                                    position: 'absolute', top: '-9px', left: '12px',
                                    background: '#fff', padding: '0 4px',
                                    fontSize: '11px', fontWeight: 600, color: '#999', letterSpacing: '0.03em',
                                }}>Write A Review</label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="comment"
                                    rows={4}
                                    style={{
                                        width: '100%', border: 'none', outline: 'none',
                                        background: 'transparent', fontSize: '14px',
                                        color: '#1a1a1a', fontFamily: 'inherit',
                                        resize: 'vertical', lineHeight: 1.6,
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Upload Photos */}
                        <div style={{ marginBottom: '24px' }}>
                            <div
                                onClick={() => fileRef.current.click()}
                                onDrop={handleDrop}
                                onDragOver={e => e.preventDefault()}
                                style={{
                                    border: '1.5px solid #e0e0e0', borderRadius: '10px',
                                    padding: '28px 14px', position: 'relative',
                                    cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
                                    background: '#fafafa', minHeight: '100px',
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', gap: '8px',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8A317'; e.currentTarget.style.background = '#FFF9EE'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.background = '#fafafa'; }}
                            >
                                <label style={{
                                    position: 'absolute', top: '-9px', left: '12px',
                                    background: '#fafafa', padding: '0 4px',
                                    fontSize: '11px', fontWeight: 600, color: '#999', letterSpacing: '0.03em',
                                }}>Upload Your Photos</label>

                                {photos.length === 0 ? (
                                    <>
                                        <FiUploadCloud size={22} color="#bbb" />
                                        <p style={{ margin: 0, fontSize: '13px', color: '#bbb', textAlign: 'center' }}>
                                            Click to upload your document (JPG, JPEG, PNG or PDF)
                                        </p>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {photos.map((p, i) => (
                                            <img key={i} src={p.url} alt={p.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #E8A317' }} />
                                        ))}
                                        <div style={{ width: '64px', height: '64px', border: '2px dashed #E8A317', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8A317', fontSize: '22px' }}>+</div>
                                    </div>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" multiple style={{ display: 'none' }} onChange={handleFiles} />
                        </div>

                        {/* Recommend */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Recommend?</span>
                            {['Yes', 'No'].map(opt => (
                                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '14px', color: '#555', fontWeight: 500 }}>
                                    <div
                                        onClick={() => setRecommend(opt)}
                                        style={{
                                            width: '18px', height: '18px',
                                            border: `2px solid ${recommend === opt ? '#E8A317' : '#ccc'}`,
                                            borderRadius: '4px', background: recommend === opt ? '#E8A317' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s', cursor: 'pointer', flexShrink: 0,
                                        }}
                                    >
                                        {recommend === opt && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>}
                                    </div>
                                    {opt}
                                </label>
                            ))}
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            style={{
                                width: '100%', background: '#E8A317', color: '#fff',
                                border: 'none', borderRadius: '50px', padding: '16px',
                                fontSize: '15px', fontWeight: 800, cursor: 'pointer',
                                fontFamily: 'inherit', letterSpacing: '0.02em',
                                boxShadow: '0 6px 20px rgba(232,163,23,0.35)',
                                transition: 'background 0.2s, transform 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#c98f10'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#E8A317'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            Post Review
                        </button>
                    </div>
                )}
            </div>
        </ViewsLayout>
    );
};

export default LeaveReview;