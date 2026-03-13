import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';
import ViewsLayout from '../Layout';
import { FiSearch, FiSliders } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { PiFilmSlate } from 'react-icons/pi';
import { BsStarFill } from 'react-icons/bs';
import { TbCameraPlus } from 'react-icons/tb';

const photographers = [
    { id: 1, name: 'John Smith', rating: 4, highlight: false, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
    { id: 2, name: 'Olivia Davis', rating: 5, highlight: true, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
    { id: 3, name: 'Emma Johnson', rating: 4, highlight: false, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
    { id: 4, name: 'Michael Brown', rating: 5, highlight: false, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { id: 5, name: 'Daniel Wilson', rating: 4, highlight: true, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
    { id: 6, name: 'Sophia Taylor', rating: 4, highlight: false, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80' },
];

/* Fixed tilt per card so it looks hand-placed */
const TILTS = [-2.8, 1.6, -1.4, 2.4, -1.8, 1.2];

const Stars = ({ count }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map(i => (
            <BsStarFill key={i} size={11} color={i <= count ? '#F5A623' : '#555'} />
        ))}
    </div>
);

const PolaroidCard = ({ person, index, onClick }) => {
    const { name, rating, highlight, img } = person;
    const tilt = TILTS[index % TILTS.length];
    const borderColor = highlight ? 'var(--color-orange)' : '#000';
    const shadowColor = highlight ? '#b87800' : '#000';

    return (
        <div style={{ position: 'relative', paddingTop: '36px', paddingBottom: '10px' }}>
            <div
                style={{
                    position: 'relative',
                    border: `12px solid ${borderColor}`,
                    borderBottom: `52px solid ${borderColor}`,
                    background: highlight ? 'var(--color-orange)' : '#000',
                    transform: `rotate(${tilt}deg)`,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    cursor: 'pointer',
                    overflow: 'visible',
                }}
                onClick={onClick}
            >
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '3/4',
                        overflow: 'hidden',
                        // background: '#2a2a2a',

                    }}
                >
                    <img
                        src={img}
                        alt={name}
                        style={{
                            width: '100%',
                            height: '90%',
                            objectFit: 'cover',
                            objectPosition: 'top center',

                        }}
                    />

                    {/* Name + stars overlay */}
                    <div style={{ position: 'absolute', bottom: '-10px', left: '10px' }}>
                        <Stars count={rating} highlight={highlight} />
                        <p style={{
                            margin: '3px 0 0',
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: 700,
                            letterSpacing: '0.01em',
                            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                        }}>
                            {name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const FindBest = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const filtered = photographers.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ViewsLayout>
            <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>

                {/* Hero */}
                <div style={{ width: '100%', height: '304px', overflow: 'hidden', position: 'relative', marginBottom: '28px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
                        alt="camera"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h1 style={{ color: '#fff', fontSize: '36px', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.01em', margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
                            Find A Best One For You
                        </h1>
                    </div>
                </div>

                {/* Search + Filter */}
                <div style={{ display: 'flex',padding: '0 100px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '50px', padding: '10px 18px', flex: 1, maxWidth: '260px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#1a1a1a', background: 'transparent', flex: 1 }}
                        />
                        <FiSearch size={15} color="#888" />
                    </div>
                    <PiFilmSlate size={28} color="#F5A623" style={{ opacity: 0.8 }} />
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', padding: '8px 12px' }}>
                        Filter <FiSliders size={16} color="#1a1a1a" />
                    </button>
                </div>

                {/* Grid */}
                <div style={{ position: 'relative',padding: '0 100px' }}>
                    <FaStar size={22} color="#ccc" style={{ position: 'absolute', left: '-32px', top: '8px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px 30px', padding: '0 12px' }}>
                        {filtered.map((person, index) => (
                            <PolaroidCard
                                key={person.id}
                                person={person}
                                index={index}
                                onClick={() => navigate(`/photographer/${person.id}`, { state: { person } })}
                            />
                        ))}
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '24px' }}>
                        <TbCameraPlus size={26} color="#F5A623" style={{ opacity: 0.7 }} />
                    </div>
                </div>

            </div>
        </ViewsLayout>
    );
};

export default FindBest;