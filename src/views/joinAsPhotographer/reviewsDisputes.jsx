import React, { useEffect, useState } from 'react';

import {  getDisputeDetails } from '../../services/dispute';


const StarRating = ({ rating = 5 }) => (
    <span style={{ color: '#f5a623', fontSize: '14px', letterSpacing: '1px' }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
);
 
const ReviewCard = ({ name, avatar, text, time, rating, liked, onLike }) => (
    <div style={{
        background: '#fff',
        border: '1.5px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    }}>
        <div className="pe-review-row">
            <div className="pe-review-user-info">
                {/* Avatar */}
                <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden',
                    background: '#e5e7eb', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                }}>
                    {avatar
                        ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>📷</span>
                    }
                </div>
     
                {/* Name & Stars (mobile) */}
                <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>{name}</p>
                    <div className="pe-review-rating-mobile">
                        <StarRating rating={rating} />
                        <span style={{ fontSize: '11px', color: '#aaa' }}>{time}</span>
                    </div>
                </div>
            </div>
 
            {/* Rating + time (desktop) */}
            <div className="pe-review-rating-desktop">
                <StarRating rating={rating} />
                <span style={{ fontSize: '11px', color: '#aaa' }}>{time}</span>
            </div>
        </div>

        {/* Text */}
        <p className="pe-review-text" style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.4, paddingLeft: '56px' }}>
            {text}
        </p>
 
        {/* Like */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
                onClick={onLike}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 600,
                    color: liked ? '#f5a623' : '#3b82f6',
                    padding: 0,
                }}
            >
                {liked ? '♥ Liked' : 'Like'}
            </button>
        </div>
    </div>
);
 
const Reviews = ({ reviews: initialReviews }) => {


   
    const defaultReviews = [
        { id: 1, name: 'John', text: 'Lorem Ipsum...', time: '2 hours ago', rating: 5, liked: false },
        { id: 2, name: 'John', text: 'Lorem Ipsum...', time: '2 hours ago', rating: 5, liked: false },
        { id: 3, name: 'John', text: 'Lorem Ipsum...', time: '2 hours ago', rating: 5, liked: false },
    ];
 
    const [reviews, setReviews] = useState(initialReviews || defaultReviews);

     const getDisputes = async () => {
        const res = await getDisputeDetails();
        console.log(res.data)
    };
    useEffect(() => {
        getDisputes();
    }, []);
 
    const toggleLike = (id) =>
        setReviews(rs => rs.map(r => r.id === id ? { ...r, liked: !r.liked } : r));
 
    return (
        <div>
            <h2 className="pe-title" style={{ marginBottom: '20px' }}>
                Reviews
            </h2>
 
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map(r => (
                    <ReviewCard
                        key={r.id}
                        name={r.name}
                        avatar={r.avatar}
                        text={r.text}
                        time={r.time}
                        rating={r.rating}
                        liked={r.liked}
                        onLike={() => toggleLike(r.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Reviews;
