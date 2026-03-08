import React, { useState, useEffect } from 'react';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';
import { MdOutlineEmojiEvents } from 'react-icons/md';
import { BsCameraFill, BsFilm, BsStarFill } from 'react-icons/bs';
import { TbAward } from 'react-icons/tb';
import { LuCamera } from 'react-icons/lu';

const photographers = [
    { id: 1, name: 'John Smith',    rating: 4, highlight: false, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
    { id: 2, name: 'Olivia Davis',  rating: 5, highlight: true,  img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
    { id: 3, name: 'Emma Johnson',  rating: 4, highlight: false, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
    { id: 4, name: 'Michael Brown', rating: 5, highlight: false, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { id: 5, name: 'Daniel Wilson', rating: 4, highlight: true,  img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
    { id: 6, name: 'Sophia Taylor', rating: 4, highlight: false, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80' },
];

const TILTS = [-2.8, 1.6, -1.4, 2.4, -1.8, 1.2];

/* ── Circular rotating text badge ── */
const CircularText = () => {
    const text = '~ Find A Best One For Your Event ~';
    const radius = 46;
    const chars = text.split('');
    const angleStep = 360 / chars.length;

    return (
        <div style={{ position: 'relative', width: '110px', height: '110px' }}>
            <svg width="110" height="110" viewBox="0 0 110 110" style={{
                animation: 'spin-slow 12s linear infinite',
            }}>
                {chars.map((char, i) => {
                    const angle = (angleStep * i - 90) * (Math.PI / 180);
                    const x = 55 + radius * Math.cos(angle);
                    const y = 55 + radius * Math.sin(angle);
                    const rotate = angleStep * i;
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            transform={`rotate(${rotate}, ${x}, ${y})`}
                            style={{
                                fontSize: '7.5px',
                                fontFamily: 'inherit',
                                fontWeight: 600,
                                fill: '#1a1a1a',
                                letterSpacing: '0.02em',
                            }}
                        >
                            {char}
                        </text>
                    );
                })}
            </svg>
            {/* Center camera icon */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#E8A317',
            }}>
                <LuCamera size={22} />
            </div>
        </div>
    );
};

const EXPERTISE_ITEMS = [
    { label: "Portrait Photography", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=520&fit=crop" },
    { label: "Landscape & Nature",   img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=520&fit=crop" },
    { label: "Street Photography",   img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=520&fit=crop" },
    { label: "Fashion & Editorial",  img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=520&fit=crop" },
    { label: "Architecture",         img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=520&fit=crop" },
];

const INTERVAL = 3000;
const total = EXPERTISE_ITEMS.length;

const ExpertiseCarousel = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setActive(a => (a + 1) % total), INTERVAL);
        return () => clearInterval(t);
    }, []);

    const getOffset = (i) => {
        let o = i - active;
        if (o > Math.floor(total / 2)) o -= total;
        if (o < -Math.floor(total / 2)) o += total;
        return o;
    };

    return (
        <section style={{ padding: "60px 40px 70px", background: "#f5f4f0" }}>
            <h2 style={{
                textAlign: "center", fontSize: "40px", fontWeight: 900,
                color: "#1a1a1a", margin: "0 0 16px",
            }}>My Expertise</h2>

            {/* Fan */}
            <div style={{ position: "relative", height: "360px", width: "100%", maxWidth: "860px", margin: "0 auto" }}>
                {EXPERTISE_ITEMS.map((item, i) => {
                    const o = getOffset(i);
                    const abs = Math.abs(o);
                    if (abs > 2) return null;

                    const isCenter = o === 0;
                    const w = isCenter ? 290 : 220;
                    const h = isCenter ? 295 : 205;
                    const spreadX = o * 145;
                    const rotate  = o * 18;
                    const dropY   = abs * abs * 16;

                    return (
                        <div
                            key={i}
                            onClick={() => !isCenter && setActive(i)}
                            style={{
                                position: "absolute",
                                left: "50%", top: "50%",
                                width: `${w}px`,
                                height: `${h + 38}px`,
                                transform: `translate(-50%,-50%) translateX(${spreadX}px) translateY(${dropY}px) rotate(${rotate}deg)`,
                                zIndex: 10 - abs,
                                opacity: abs === 2 ? 0.72 : 1,
                                cursor: isCenter ? "default" : "pointer",
                                transition: "all 0.52s cubic-bezier(0.34,1.2,0.64,1)",
                            }}
                        >
                            {/* Polaroid shell */}
                            <div style={{
                                width: "100%", height: "100%",
                                background: "#FFAE00",
                                borderRadius: "10px",
                                padding: "7px 7px 0",
                                boxShadow: isCenter
                                    ? "0 22px 52px rgba(0,0,0,0.28)"
                                    : "0 8px 22px rgba(0,0,0,0.18)",
                                display: "flex", flexDirection: "column",
                            }}>
                                {/* Photo */}
                                <div style={{ flex: 1, borderRadius: "6px", overflow: "hidden" }}>
                                    <img src={item.img} alt={item.label}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                </div>

                                {/* Bottom caption strip */}
                                <div style={{
                                    height: "38px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {isCenter && (
                                        <span style={{
                                            fontSize: "12px", fontWeight: 800,
                                            color: "#1a1a1a",
                                            letterSpacing: "0.02em",
                                        }}>
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "14px" }}>
                {EXPERTISE_ITEMS.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)} style={{
                        width: i === active ? "24px" : "8px", height: "8px",
                        borderRadius: "4px",
                        background: i === active ? "#E8A317" : "#ccc",
                        border: "none", cursor: "pointer", padding: 0,
                        transition: "all 0.3s ease",
                    }} />
                ))}
            </div>
        </section>
    );
};

const Home = () => {
    const navigate = useNavigate();

    return (
        <ViewsLayout>
            <div style={{ maxWidth: '100%' }}>
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-14px) rotate(8deg); }
                }
                @keyframes pulse-ring {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                .hero-book-btn:hover {
                    background: #c98f10 !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 32px rgba(232,163,23,0.45) !important;
                }
            `}</style>

            <div style={{
                width: '100%',
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '20px 40px 60px',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* ── Decorative: Film strip top-left ── */}
                <div style={{
                    position: 'absolute',
                    top: '20px', left: '60px',
                    color: '#E8A317', opacity: 0.7,
                    animation: 'float-slow 4s ease-in-out infinite',
                }}>
                    <BsFilm size={40} />
                </div>

                {/* ── Decorative: plus/cross top-right ── */}
                <div style={{
                    position: 'absolute',
                    top: '60px', right: '120px',
                    color: '#1a1a1a', fontSize: '22px',
                    fontWeight: 300, opacity: 0.4,
                    lineHeight: 1,
                }}>✦</div>

                {/* ── Decorative: concentric circles left ── */}
                <div style={{
                    position: 'absolute',
                    top: '130px', left: '20px',
                    animation: 'pulse-ring 3s ease-in-out infinite',
                }}>
                    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                        {[32, 24, 16, 8].map((r, i) => (
                            <circle key={i} cx="36" cy="36" r={r}
                                stroke="#E8A317"
                                strokeWidth={i === 3 ? 0 : 1.2}
                                fill={i === 3 ? '#E8A317' : 'none'}
                                opacity={0.6 + i * 0.1}
                            />
                        ))}
                    </svg>
                </div>

                {/* ── Decorative: circular text badge bottom-right ── */}
                <div style={{
                    position: 'absolute',
                    bottom: '40px', right: '20px',
                    animation: 'float 5s ease-in-out infinite',
                }}>
                    <CircularText />
                </div>

                {/* ══════════════════
                    HERO CONTENT
                ══════════════════ */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    paddingTop: '20px',
                    paddingBottom: '40px',
                }}>

                    {/* Top rated badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        border: '1.5px solid #ddd',
                        borderRadius: '50px',
                        padding: '10px 20px',
                        marginBottom: '36px',
                        background: '#fff',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    }}>
                        <TbAward size={22} color="#E8A317" />
                        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>Top Rated Pro</p>
                            <p style={{ margin: 0, fontSize: '11px', fontWeight: 500, color: '#888' }}>Community</p>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        margin: '0 0 22px',
                        fontSize: 'clamp(36px, 5vw, 56px)',
                        fontWeight: 900,
                        lineHeight: 1.15,
                        color: '#1a1a1a',
                        letterSpacing: '-0.02em',
                        maxWidth: '700px',
                    }}>
                        The Best Place To{' '}
                        <span style={{ color: 'var(--color-orange)' }}>Find A</span>
                        <br />
                        <span style={{ color: 'var(--color-orange)' }}>Photographer</span>{' '}
                        For Your Event
                    </h1>

                    {/* Subtext */}
                    <p style={{
                        margin: '0 0 36px',
                        fontSize: '15px',
                        color: '#888',
                        lineHeight: 1.8,
                        maxWidth: '520px',
                        fontWeight: 400,
                    }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi .
                    </p>

                    {/* CTA Button */}
                    <button
                        className="hero-book-btn"
                        onClick={() => navigate('/find-best')}
                        style={{
                            background: '#E8A317',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '16px 52px',
                            fontSize: '16px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            letterSpacing: '0.02em',
                            boxShadow: '0 8px 24px rgba(232,163,23,0.35)',
                            transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                            fontFamily: 'inherit',
                        }}
                    >
                        Book Now
                    </button>
                </div>
            </div>

            {/* ══════════════════
                MARQUEE STRIP
            ══════════════════ */}
            <div style={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                background: '#FFF3D6',
                borderTop: '1px solid #f0e0b0',
                borderBottom: '1px solid #f0e0b0',
                padding: '18px 0',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <style>{`
                    @keyframes marquee {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .marquee-track {
                        display: flex;
                        width: max-content;
                        animation: marquee 22s linear infinite;
                    }
                    .marquee-track:hover { animation-play-state: paused; }
                `}</style>

                <div className="marquee-track">
                    {[...Array(2)].map((_, copy) => (
                        <div key={copy} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                            {[
                                { name: 'SnapPro',    icon: <LuCamera size={18} /> },
                                { name: 'LensArt',    icon: <BsCameraFill size={16} /> },
                                { name: 'FrameIt',    icon: <BsFilm size={16} /> },
                                { name: 'ClickMaster', icon: <LuCamera size={18} /> },
                                { name: 'PicturePro', icon: <BsCameraFill size={16} /> },
                                { name: 'ShutterCo',  icon: <MdOutlineEmojiEvents size={18} /> },
                                { name: 'GoldenEye',  icon: <BsFilm size={16} /> },
                                { name: 'AuraShot',   icon: <LuCamera size={18} /> },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '0 36px',
                                    borderRight: '1px solid #e8d9a0',
                                    whiteSpace: 'nowrap',
                                }}>
                                    <span style={{ color: '#E8A317' }}>{item.icon}</span>
                                    <span style={{
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        color: '#1a1a1a',
                                        letterSpacing: '0.03em',
                                        fontFamily: 'inherit',
                                    }}>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {/* ══════════════════
                OUR TEAM SECTION
            ══════════════════ */}
            <div style={{
                width: '100%',
                padding: '70px 0 80px',
                position: 'relative',
                overflow: 'hidden',
                background: '#fff',
            }}>
                <style>{`
                    @keyframes marquee-team {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .team-track {
                        display: flex;
                        width: max-content;
                        animation: marquee-team 28s linear infinite;
                        align-items: center;
                    }
                    .team-track:hover { animation-play-state: paused; }
                    .team-card-wrap:hover .team-polaroid {
                        transform: rotate(0deg) scale(1.04) !important;
                        box-shadow: 0 20px 48px rgba(0,0,0,0.25) !important;
                    }
                `}</style>

                {/* Decorative star top-left */}
                <div style={{ position: 'absolute', top: '40px', left: '48px' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 2 L17.5 14 L29 16 L17.5 18 L16 30 L14.5 18 L3 16 L14.5 14 Z" fill="#bbb" />
                    </svg>
                </div>

                {/* Decorative camera top-right */}
                <div style={{ position: 'absolute', top: '36px', right: '52px', color: '#E8A317' }}>
                    <LuCamera size={32} />
                </div>

                {/* Title */}
                <h2 style={{
                    textAlign: 'center',
                    fontSize: '48px',
                    fontWeight: 900,
                    color: '#1a1a1a',
                    margin: '0 0 52px',
                    letterSpacing: '-0.02em',
                    fontFamily: 'inherit',
                }}>Our Team</h2>

                {/* Scrolling polaroid row */}
                <div style={{ overflow: 'hidden', width: '100%' }}>
                    <div className="team-track">
                        {[...Array(2)].map((_, copy) => (
                            <div key={copy} style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                {photographers.map((person, index) => {
                                    const tilt = TILTS[index % TILTS.length];
                                    const borderColor = person.highlight ? '#F5A623' : '#1a1a1a';
                                    return (
                                        <div
                                            key={`${copy}-${person.id}`}
                                            className="team-card-wrap"
                                            style={{
                                                padding: '20px 18px 10px',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <div
                                                className="team-polaroid"
                                                style={{
                                                    position: 'relative',
                                                    width: '220px',
                                                    border: `12px solid ${borderColor}`,
                                                    borderBottom: `52px solid ${borderColor}`,
                                                    background: borderColor,
                                                    transform: `rotate(${tilt}deg)`,
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                    boxShadow: '0 10px 32px rgba(0,0,0,0.18)',
                                                    overflow: 'visible',
                                                }}
                                            >
                                                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
                                                    <img
                                                        src={person.img}
                                                        alt={person.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            objectPosition: 'top center',
                                                            display: 'block',
                                                        }}
                                                    />
                                                </div>
                                                {/* Name + stars on bottom tab */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '-46px',
                                                    left: '10px',
                                                    right: '10px',
                                                }}>
                                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '3px' }}>
                                                        {[1,2,3,4,5].map(i => (
                                                            <BsStarFill key={i} size={11} color={i <= person.rating ? '#F5A623' : (person.highlight ? '#c98f10' : '#555')} />
                                                        ))}
                                                    </div>
                                                    <p style={{
                                                        margin: 0,
                                                        color: person.highlight ? '#1a1a1a' : '#fff',
                                                        fontSize: '14px',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.01em',
                                                        whiteSpace: 'nowrap',
                                                    }}>{person.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Explore button */}
                <div style={{ textAlign: 'center', marginTop: '56px' }}>
                    <button
                        onClick={() => navigate('/find-best')}
                        style={{
                            background: '#E8A317',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50px',
                            padding: '16px 48px',
                            fontSize: '15px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            boxShadow: '0 8px 24px rgba(232,163,23,0.35)',
                            transition: 'background 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#c98f10'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#E8A317'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        Explor our Team
                    </button>
                </div>
            </div>
            <ExpertiseCarousel />
            </div>
        </ViewsLayout>
    );
};

export default Home;