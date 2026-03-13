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
            <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto', padding: '0 20px 60px' }}>

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
                                            ? <BsStarFill size={28} color="#f5a623" />
                                            : <BsStar size={28} color="#ddd" />
                                        }
                                    </button>
                                ))}
                            </div>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888', fontWeight: 500 }}>Your Rating: {rating}/5</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                            {/* Write A Review */}
                            <div className="su-field">
                                <label>Write A Review</label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Share your experience..."
                                    rows={4}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            {/* Upload Photos */}
                            <div className="su-field">
                                <label>Upload Your Photos</label>
                                <div
                                    onClick={() => fileRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    style={{
                                        border: '1.5px solid #d1d5db', borderRadius: '8px',
                                        padding: '28px 14px', cursor: 'pointer',
                                        background: '#fafafa', minHeight: '100px',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'border-color 0.2s, background 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.background = '#FFF9EE'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
                                >
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
                                                <img key={i} src={p.url} alt={p.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #f5a623' }} />
                                            ))}
                                            <div style={{ width: '64px', height: '64px', border: '2px dashed #f5a623', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5a623', fontSize: '22px' }}>+</div>
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" multiple style={{ display: 'none' }} onChange={handleFiles} />
                            </div>

                            {/* Recommend */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Recommend?</span>
                                {['Yes', 'No'].map(opt => (
                                    <label key={opt} className="su-checkbox-row">
                                        <input
                                            type="checkbox"
                                            checked={recommend === opt}
                                            onChange={() => setRecommend(opt)}
                                        />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Submit */}
                            <button onClick={handleSubmit} className="su-btn-primary" style={{ width: '100%', marginTop: '4px' }}>
                                Post Review
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ViewsLayout>
    );
};

export default LeaveReview;