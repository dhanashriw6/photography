import React, { useState,useRef,useCallback,useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { BsStarFill, BsInstagram, BsFacebook, BsPinterest, BsTelegram } from 'react-icons/bs';
import { FiArrowLeft, FiCamera, FiMapPin, FiCalendar, FiAward, FiPhone, FiMail } from 'react-icons/fi';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import ViewsLayout from '../Layout';

/* ─── full catalogue keyed by id ─── */
const PHOTOGRAPHER_DATA = {
    1: {
        id: 1, name: 'John Smith', rating: 4, highlight: false,
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
        aboutImg1: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80',
        aboutImg2: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80',
        tagline: 'Capturing timeless moments with a cinematic lens.',
        location: 'Rajkot',
        experience: '4 Years',
        shoots: '340+',
        specialty: 'Candid photography, Classic photography',
        cast: 'Patel',
        phone: '+91 1234567890',
        email: 'test123@gmail.com',
        awards: 'Lorem ipsum',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        portfolio: [
            'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&q=80',
            'https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=400&q=80',
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
            'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=400&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        ],
        price: '$250 / hour',
    },
    2: {
        id: 2, name: 'Olivia Davis', rating: 5, highlight: true,
        img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
        aboutImg1: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80',
        aboutImg2: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
        tagline: 'Bold, vibrant fashion stories through the lens.',
        location: 'Los Angeles, USA',
        experience: '10 Years',
        shoots: '500+',
        specialty: 'Fashion & Editorial',
        cast: 'N/A',
        phone: '+1 9876543210',
        email: 'olivia@davis.com',
        awards: 'Vogue Cover 2022',
        bio: 'Olivia Davis is an award-winning fashion photographer whose editorial work has graced the covers of Vogue, Elle, and Harper\'s Bazaar. She transforms every set into a world of its own — ethereal, dramatic, and utterly captivating. Her studio in LA is a creative hub for top brands.\n\nWith a decade of experience in the industry, Olivia has mastered the art of blending light, texture, and movement to create images that are both commercially powerful and artistically resonant.',
        portfolio: [
            'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
            'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
            'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80',
        ],
        price: '$400 / hour',
    },
    3: {
        id: 3, name: 'Emma Johnson', rating: 4, highlight: false,
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
        aboutImg1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80',
        aboutImg2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
        tagline: 'Wedding memories that last a lifetime.',
        location: 'Chicago, USA',
        experience: '6 Years',
        shoots: '220+',
        specialty: 'Wedding & Events',
        cast: 'N/A',
        phone: '+1 5554443333',
        email: 'emma@johnson.com',
        awards: 'Best Wedding Photographer 2023',
        bio: 'Emma Johnson captures the tender, joyful, and unscripted moments that make every wedding unique. Her documentary-style approach ensures every glance, laugh, and tear is preserved forever.\n\nShe works across the US and internationally, adapting to every venue and theme with ease. With over 220 weddings photographed, Emma brings a calm and professional energy to even the most hectic of days.',
        portfolio: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80',
            'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80',
            'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&q=80',
            'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80',
        ],
        price: '$300 / hour',
    },
    4: {
        id: 4, name: 'Michael Brown', rating: 5, highlight: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        aboutImg1: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80',
        aboutImg2: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80',
        tagline: 'Commercial photography that drives results.',
        location: 'San Francisco, USA',
        experience: '12 Years',
        shoots: '600+',
        specialty: 'Commercial & Brand',
        cast: 'N/A',
        phone: '+1 4158889999',
        email: 'michael@brown.com',
        awards: 'Ad Week Photo of Year',
        bio: 'Michael Brown partners with Fortune 500 companies and fast-growing startups to create imagery that converts. His background in advertising design gives him a sharp eye for composition and storytelling.\n\nEvery image he delivers is crafted to resonate with a brand\'s audience and drive measurable results. He has worked with clients including Apple, Nike, and Google.',
        portfolio: [
            'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
            'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
            'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
        ],
        price: '$350 / hour',
    },
    5: {
        id: 5, name: 'Daniel Wilson', rating: 4, highlight: true,
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
        aboutImg1: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80',
        aboutImg2: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
        tagline: 'Soulful landscapes and adventure captured in light.',
        location: 'Denver, USA',
        experience: '7 Years',
        shoots: '410+',
        specialty: 'Landscape & Adventure',
        cast: 'N/A',
        phone: '+1 7203334444',
        email: 'daniel@wilson.com',
        awards: 'National Geographic Feature',
        bio: 'Daniel Wilson chases golden hours across continents. From Patagonia\'s ice fields to the deserts of Namibia, his landscape and adventure photography pulls viewers into breathtaking environments.\n\nHe runs annual photography workshops and has been featured in National Geographic. His work is a testament to patience, preparation, and an unrelenting passion for the natural world.',
        portfolio: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
            'https://images.unsplash.com/photo-1439853949212-36589f9f53a4?w=400&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80',
        ],
        price: '$280 / hour',
    },
    6: {
        id: 6, name: 'Sophia Taylor', rating: 4, highlight: false,
        img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
        aboutImg1: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80',
        aboutImg2: 'https://images.unsplash.com/photo-1560066984-138daaa700cf?w=400&q=80',
        tagline: 'Lifestyle & family stories told authentically.',
        location: 'Austin, USA',
        experience: '5 Years',
        shoots: '180+',
        specialty: 'Lifestyle & Family',
        cast: 'N/A',
        phone: '+1 5126667777',
        email: 'sophia@taylor.com',
        awards: 'Austin Photo Awards',
        bio: 'Sophia Taylor brings warmth, energy, and creativity to every lifestyle and family session. She believes the best photographs are unstaged — real laughter, genuine connection, and pure joy.\n\nHer relaxed, fun approach puts even the shyest subjects at ease, resulting in truly authentic imagery. Families come back year after year to document their growing stories.',
        portfolio: [
            'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
            'https://images.unsplash.com/photo-1560066984-138daaa700cf?w=400&q=80',
            'https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&q=80',
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
            'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&q=80',
        ],
        price: '$200 / hour',
    },
};

const Stars = ({ count }) => (
    <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map(i => (
            <BsStarFill key={i} size={13} color={i <= count ? '#E8A317' : '#ddd'} />
        ))}
    </div>
);

const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
        <span style={{
            fontWeight: 700,
            color: '#1a1a1a',
            fontSize: '14px',
            minWidth: '90px',
        }}>{label}:</span>
        <span style={{
            color: '#555',
            fontSize: '14px',
        }}>{value}</span>
    </div>
);
const EXPERTISE_ITEMS = [
    {
        label: "Portrait Photography",
        sub: "Capturing the soul behind the eyes",
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&h=700&fit=crop",
        tag: "01",
        color: "#c9845a",
    },
    {
        label: "Landscape & Nature",
        sub: "Where light meets the wild earth",
        img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=700&fit=crop",
        tag: "02",
        color: "#5a8fc9",
    },
    {
        label: "Street Photography",
        sub: "Frozen moments in the urban rush",
        img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=700&fit=crop",
        tag: "03",
        color: "#b0b0b0",
    },
    {
        label: "Fashion & Editorial",
        sub: "Where vision becomes statement",
        img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=700&fit=crop",
        tag: "04",
        color: "#c9a85a",
    },
    {
        label: "Architecture",
        sub: "Lines, shadows, and geometry",
        img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&h=700&fit=crop",
        tag: "05",
        color: "#7a9c8a",
    },
];

const INTERVAL = 4000;

const ExpertiseCarousel = ({ data }) => {
   const [active, setActive] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const items = EXPERTISE_ITEMS;

  const goTo = useCallback((idx) => {
    setPrevIdx((cur) => cur === idx ? cur : active);
    setActive(idx);
    setProgress(0);
    setAnimKey((k) => k + 1);
    startTimeRef.current = null;
  }, [active]);

  const goNext = useCallback(() => {
    goTo((active + 1) % items.length);
  }, [active, goTo, items.length]);

  useEffect(() => {
    if (paused) {
      cancelAnimationFrame(progressRef.current);
      return;
    }
    const tick = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const p = Math.min(elapsed / INTERVAL, 1);
      setProgress(p);
      if (p >= 1) {
        goNext();
      } else {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [paused, animKey, goNext]);

  const circumference = 2 * Math.PI * 20;

  return (
    <>
    <h2 style={{
                textAlign: 'center',
                fontSize: '40px',
                fontWeight: 900,
                color: '#1a1a1a',
                margin: '0 0 48px',
            }}>My Expertise</h2>
    <section
      style={{
        position: "relative",
        width: "90%",
        height: "100vh",
        minHeight: "560px",
        overflow: "hidden",
        background: "#111",
        margin:"auto"
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
        
      {/* Slides */}
      {items.map((item, i) => {
        const isActive = i === active;
        const isPrev = i === prevIdx;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, zIndex: isActive ? 2 : isPrev ? 1 : 0, pointerEvents: "none" }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${item.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: isActive ? 1 : isPrev ? 0 : 0,
              transform: isActive ? "scale(1.05)" : "scale(1.0)",
              transition: "opacity 0.8s ease, transform 5s ease-out",
              filter: "brightness(0.52)",
            }} />
            {/* Wipe curtain */}
            {isActive && (
              <div key={`wipe-${animKey}`} style={{
                position: "absolute", inset: 0,
                background: "#111",
                animation: "wipeRight 0.8s cubic-bezier(0.77,0,0.18,1) forwards",
              }} />
            )}
          </div>
        );
      })}

    

 

      {/* Main text content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 5,
        display: "flex", alignItems: "flex-end",
        padding: "0 60px 80px",
        pointerEvents: "none",
      }}>
        <div>
          <div key={`tag-${active}`} style={{
            color: items[active].color, fontSize: "11px", letterSpacing: "0.3em",
            textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "14px",
            animation: "riseIn 0.55s 0.3s both ease",
          }}>
            {items[active].tag} &nbsp;/&nbsp; {String(items.length).padStart(2, "0")}
          </div>

          <h2 key={`h2-${active}`} style={{
            color: "#fff",
            fontSize: "clamp(38px, 6vw, 80px)",
            fontWeight: 400,
            margin: "0 0 16px",
            lineHeight: 1,
            letterSpacing: "-0.025em",
            animation: "riseIn 0.55s 0.1s both ease",
          }}>
            {items[active].label}
          </h2>

          <p key={`p-${active}`} style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "15px", margin: 0,
            fontStyle: "italic", letterSpacing: "0.03em",
            animation: "riseIn 0.55s 0.4s both ease",
          }}>
            {items[active].sub}
          </p>
        </div>
      </div>

      {/* Right side dot + ring nav */}
      <div style={{
        position: "absolute", right: "44px", top: "50%", transform: "translateY(-50%)",
        zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
      }}>
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button key={i} onClick={() => goTo(i)} style={{
              position: "relative", width: "48px", height: "48px",
              background: "transparent", border: "none", cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isActive && (
                <svg width="48" height="48" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                  <circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke={item.color} strokeWidth="1.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <div style={{
                width: isActive ? "9px" : "4px",
                height: isActive ? "9px" : "4px",
                borderRadius: "50%",
                background: isActive ? item.color : "rgba(255,255,255,0.25)",
                transition: "all 0.3s ease",
                boxShadow: isActive ? `0 0 10px ${item.color}88` : "none",
              }} />
            </button>
          );
        })}
      </div>

      {/* Thumbnail strip bottom-right */}
      <div style={{
        position: "absolute", bottom: "28px", right: "100px",
        zIndex: 10, display: "flex", gap: "10px", alignItems: "center",
      }}>
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: isActive ? "64px" : "44px",
                height: isActive ? "44px" : "30px",
                borderRadius: "4px",
                overflow: "hidden",
                cursor: "pointer",
                opacity: isActive ? 1 : 0.45,
                transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
                border: isActive ? `1.5px solid ${item.color}` : "1.5px solid transparent",
                flexShrink: 0,
              }}
            >
              <img src={item.img} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          );
        })}
      </div>

      {/* Bottom color bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, display: "flex", height: "3px" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            flex: 1,
            background: i === active ? item.color : "rgba(255,255,255,0.08)",
            transition: "background 0.5s ease",
          }} />
        ))}
      </div>

      <style>{`
        @keyframes wipeRight {
          0%   { transform: translateX(0); }
          100% { transform: translateX(101%); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
    </>
  );
};
/* ─── Portfolio Masonry Grid Component ─── */
const PortfolioGrid = ({ data }) => {
    const [showAll, setShowAll] = useState(false);
    const allImgs = data.portfolio || [];
    const displayed = showAll ? allImgs : allImgs.slice(0, 6);

    // Layout sizes matching reference: varied spans
    const spans = [
        { col: 'span 1', row: 'span 2' },  // tall
        { col: 'span 2', row: 'span 2' },  // wide-tall
        { col: 'span 1', row: 'span 1' },
        { col: 'span 1', row: 'span 1' },
        { col: 'span 1', row: 'span 2' },  // tall
        { col: 'span 2', row: 'span 1' },
        { col: 'span 1', row: 'span 1' },
        { col: 'span 1', row: 'span 2' },
        { col: 'span 2', row: 'span 1' },
    ];

    return (
        <section style={{ padding: '80px 40px 100px', background: '#fff' }}>
            <h2 style={{
                textAlign: 'center',
                fontSize: '40px',
                fontWeight: 900,
                color: '#1a1a1a',
                margin: '0 0 48px',
            }}>Portfolio</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridAutoRows: '160px',
                gap: '10px',
                maxWidth: '100%',
                margin: '0 auto',
            }}>
                {displayed.map((src, i) => {
                    const span = spans[i % spans.length];
                    return (
                        <div
                            key={i}
                            style={{
                                gridColumn: span.col,
                                gridRow: span.row,
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                            }}
                        >
                            <img
                                src={src}
                                alt={`Portfolio ${i + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    transition: 'transform 0.4s ease',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        </div>
                    );
                })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                    onClick={() => setShowAll(v => !v)}
                    style={{
                        background: '#E8A317',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '14px 36px',
                        fontSize: '15px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#c98f10'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#E8A317'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    {showAll ? 'Show Less' : 'See More'}
                </button>
            </div>
        </section>
    );
};

const packages = [
  {
    title: "Package Halfday",
    badge: "ALL INCLUSIVE",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=320&fit=crop",
    features: [
      "10 HOURS",
      "40 – 50 EDITED PHOTOS",
      "ALL RAW PHOTOS",
      "2 REEL",
      "1 HIGHLIGHT",
    ],
    price: "$5000",
  },
  {
    title: "Package Fullday",
    badge: "ALL INCLUSIVE",
    img: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=320&fit=crop",
    features: [
      "10 HOURS",
      "50 – 60 EDITED PHOTOS",
      "ALL RAW PHOTOS",
      "3 REEL",
      "2 HIGHLIGHT",
    ],
    price: "$6000",
    popular: true,
  },
];

const PackagePricing = ({data})=>{
     const [hovered, setHovered] = useState(null);

  return (
    <section style={{
      background: "#FFF3D6",
      padding: "72px 40px 80px",
      
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
     

      {/* Heading */}
      <h2 style={{
        fontSize: "clamp(32px, 5vw, 52px)",
        fontWeight: 900,
        color: "#1a1a1a",
        margin: "0 0 56px",
        textAlign: "center",
        letterSpacing: "-0.01em",
      }}>
        Package And Pricing
      </h2>

      {/* Cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "28px",
        width: "100%",
        maxWidth: "860px",
      }}>
        {packages.map((pkg, i) => (
          <div
            key={i}
            className="pkg-card"
            style={{
              background: "#fefce8",
              borderRadius: "16px",
              border: pkg.popular ? "2px solid #E8A317" : "2px solid #e8e0a0",
              overflow: "hidden",
              boxShadow: "0 8px 28px rgba(0,0,0,0.07)",
              position: "relative",
            }}
          >
            {/* Popular badge */}
            {pkg.popular && (
              <div style={{
                position: "absolute", top: "16px", right: "16px",
                background: "#E8A317", color: "#fff",
                fontSize: "10px", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "4px 12px", borderRadius: "20px",
                zIndex: 2,
              }}>
                Most Popular
              </div>
            )}

            {/* Image */}
            <div style={{ overflow: "hidden", height: "220px" }}>
              <img
                className="pkg-img"
                src={pkg.img}
                alt={pkg.title}
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                }}
              />
            </div>

            {/* Content */}
            <div style={{ padding: "28px 28px 32px" }}>
              {/* Title */}
              <h3 style={{
                fontSize: "24px", fontWeight: 700,
                color: "#1a1a1a", margin: "0 0 6px",
                textAlign: "center",
              }}>
                {pkg.title}
              </h3>

              {/* Badge */}
              <div style={{
                textAlign: "center",
                fontSize: "10px", fontWeight: 500,
                letterSpacing: "0.2em",
                color: "#888",
                marginBottom: "22px",
              }}>
                {pkg.badge}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#e8e0a0", marginBottom: "20px" }} />

              {/* Features */}
              <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0 }}>
                {pkg.features.map((f, j) => (
                  <li key={j} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px", letterSpacing: "0.15em",
                    color: "#555", textAlign: "center",
                    padding: "6px 0",
                    borderBottom: j < pkg.features.length - 1 ? "1px dashed #e8e0a0" : "none",
                  }}>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div style={{
                fontSize: "40px", fontWeight: 900,
                color: "#1a1a1a", textAlign: "center",
                margin: "0 0 24px",
                letterSpacing: "-0.02em",
              }}>
                {pkg.price}
              </div>

              {/* CTA */}
              <div style={{ textAlign: "center" }}>
                <button className="book-btn" style={{
                  background: "#E8A317",
                  color: "#fff",
                  border: "none",
                  borderRadius: "40px",
                  padding: "14px 44px",
                  fontSize: "15px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                }}>
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

     
    </section>
  );
}
const TESTIMONIALS = [
  {
    name: "Jordi",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=380&fit=crop&crop=face",
    stars: 5,
    text: "Working with this photographer was an absolutely incredible experience. Every shot was perfectly framed and the lighting was just magical. I couldn't believe how naturally they captured our moments — the photos tell a story I'll treasure forever. Truly a gifted artist who made us feel completely at ease throughout the entire session.",
  },
  {
    name: "Sophia",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=380&fit=crop&crop=face",
    stars: 5,
    text: "I was blown away by the quality and creativity in every single photo. The attention to detail, the composition, the editing — everything was done with such care and professionalism. Our wedding album is a masterpiece. Everyone who sees it asks who the photographer was. I cannot recommend them highly enough!",
  },
];

const Testimonials  = ({data})=>{
    const [active, setActive] = useState(0);
  const [dir, setDir] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const goTo = (idx, direction) => {
    setDir(direction);
    setAnimKey(k => k + 1);
    setActive(idx);
  };

  const prev = () => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, "left");
  const next = () => goTo((active + 1) % TESTIMONIALS.length, "right");

  const t = TESTIMONIALS[active];

  return (
    <section style={{
      background: "#f4f4f0",
      padding: "80px 40px 72px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
 

      {/* Heading */}
      <h2 style={{
        fontSize: "clamp(28px, 4vw, 48px)",
        fontWeight: 900,
        color: "#1a1a1a",
        margin: "0 0 52px",
        textAlign: "center",
        letterSpacing: "-0.01em",
      }}>
        What Customers Say
      </h2>

      {/* Card */}
      <div
        key={animKey}
        style={{
          display: "flex",
          alignItems: "stretch",
          maxWidth: "820px",
          width: "100%",
          border: "2px solid #FFAE00",
          borderRadius: "20px",
          background: "#fff",
          overflow: "visible",
          position: "relative",
          boxShadow: "0 12px 40px rgba(0,0,0,0.07)",
          animation: `${dir === "left" ? "slideInLeft" : "slideInRight"} 0.45s cubic-bezier(0.23,1,0.32,1) both`,
          minHeight: "320px",
        }}
      >
        {/* Photo — overlaps card left edge */}
        <div style={{
          flexShrink: 0,
          width: "220px",
          position: "relative",
          margin: "-2px -20px -2px -2px",
          zIndex: 2,
        }}>
          <div style={{}}>
            <img
              src={t.img}
              alt={t.name}
              style={{position:"absolute",left:"-30px", top:"15px", width: "100%",borderRadius: "18px",  border: "3px solid #f0e8c8", height: "90%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        {/* Text content */}
        <div style={{
          flex: 1,
          padding: "36px 36px 32px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          {/* Stars */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              {Array.from({ length: t.stars }).map((_, i) => (
                <span key={i} style={{ color: "#E8A317", fontSize: "20px", marginRight: "2px" }}>★</span>
              ))}
            </div>

            {/* Review text */}
            <p style={{
              fontSize: "14.5px",
              lineHeight: 1.75,
              color: "#444",
              margin: 0,
            }}>
              {t.text}
            </p>
          </div>

          {/* Name */}
          <div style={{
            textAlign: "right",
            fontSize: "20px",
            fontWeight: 700,
            color: "#1a1a1a",
            marginTop: "24px",
          }}>
            — {t.name}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div style={{ display: "flex", gap: "8px", marginTop: "28px", alignItems: "center" }}>
        <button className="arrow-btn" onClick={prev}>←</button>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {TESTIMONIALS.map((_, i) => (
            <div key={i} style={{
              width: i === active ? "20px" : "7px",
              height: "7px",
              borderRadius: "4px",
              background: i === active ? "#E8A317" : "#ccc",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
        <button className="arrow-btn" onClick={next}>→</button>
      </div>
    </section>
  );
}
const PhotographerDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [portfolioHover, setPortfolioHover] = useState(null);

    const person = location.state?.person || PHOTOGRAPHER_DATA[Number(id)];

    if (!person) {
        return (
            <ViewsLayout>
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
                    <MdOutlinePhotoCamera size={56} color="#E8A317" />
                    <p style={{ marginTop: '16px', fontSize: '18px' }}>Photographer not found.</p>
                    <button onClick={() => navigate('/find-best')} style={{
                        marginTop: '20px', background: '#E8A317', color: '#fff',
                        border: 'none', borderRadius: '50px', padding: '12px 28px',
                        cursor: 'pointer', fontWeight: 700,
                    }}>← Back</button>
                </div>
            </ViewsLayout>
        );
    }

    const data = PHOTOGRAPHER_DATA[person.id] || person;

    return (
        <ViewsLayout>


            <div style={{ maxWidth: '100%' }}>

                {/* ══════════════════════════════
                    HERO SECTION — Split layout
                ══════════════════════════════ */}
                <section style={{

                    maxWidth: '100%',
                    display: 'grid',
                    gridTemplateColumns: '680px 1fr',
                    minHeight: '560px',
                    overflow: 'hidden',
                }}>
                    {/* Left panel — white info */}
                    <div className="pd-animate pd-animate-1" style={{
                        background: '#f0ede6',
                        padding: '60px 48px 60px 48px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '6px',
                    }}>
                        <h1 style={{
                            fontSize: '48px',
                            fontWeight: 900,
                            color: '#1a1a1a',
                            margin: '0 0 28px',
                            lineHeight: 1.1,
                        }}>{data.name}</h1>

                        <InfoRow label="Experience" value={data.experience} />
                        <InfoRow label="Location" value={data.location} />
                        <InfoRow label="Expertise" value={data.specialty} />
                        <InfoRow label="Cast" value={data.cast || 'N/A'} />
                        <InfoRow label="Number" value={data.phone || '+91 0000000000'} />
                        <InfoRow label="Email" value={data.email || 'example@email.com'} />
                        <InfoRow label="Awards" value={data.awards || 'N/A'} />

                        <div style={{ marginTop: '20px' }}>
                            <Stars count={data.rating} />
                        </div>
                    </div>

                    {/* Right panel — large photo + social icons */}
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                            src={data.img}
                            alt={data.name}
                            style={{
                                width: '100%',
                                height: '928px',
                                objectFit: 'cover',
                                objectPosition: 'top center',
                                display: 'block',
                            }}
                        />

                        {/* Subtle gradient overlay at bottom */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0, left: 0, right: 0,
                            height: '120px',
                            background: 'linear-gradient(to top, rgba(240,237,230,0.5), transparent)',
                        }} />

                        {/* Social icons — right edge */}
                        <div style={{
                            position: 'absolute',
                            right: '-1px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0',
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '12px 0 0 12px',
                            padding: '16px 12px',
                        }}>
                            {[
                                { Icon: BsInstagram, href: '#' },
                                { Icon: BsFacebook, href: '#' },
                                { Icon: BsPinterest, href: '#' },
                                { Icon: BsTelegram, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    className="pd-social-icon"
                                    style={{
                                        color: '#333',
                                        display: 'flex',
                                        padding: '10px',
                                        transition: 'color 0.2s',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                            {/* Thin vertical line below icons */}
                            <div style={{
                                width: '1px',
                                height: '50px',
                                background: '#ccc',
                                margin: '8px auto 0',
                            }} />
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════
                    ABOUT ME SECTION
                ══════════════════════════════ */}
                <section style={{
                    maxWidth: '100%',
                    margin: '80px auto 0',
                    padding: '0 40px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '80px',
                    alignItems: 'center',
                }}>
                    {/* Left — overlapping images */}
                    <div className="pd-animate pd-animate-2" style={{
                        position: 'relative',
                        height: '480px',
                    }}>
                        {/* Decorative circle */}
                        <div style={{
                            position: 'absolute',
                            top: '60px',
                            left: '-20px',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            border: '3px solid #E8A317',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f0ede6',
                            zIndex: 10,
                        }}>
                            <div style={{
                                width: '14px', height: '14px',
                                borderRadius: '50%', background: '#E8A317',
                            }} />
                        </div>

                        {/* Decorative camera icon */}
                        <div style={{
                            position: 'absolute',
                            top: '0px',
                            right: '20px',
                            color: '#E8A317',
                            opacity: 0.6,
                            zIndex: 10,
                        }}>
                            <MdOutlinePhotoCamera size={36} />
                        </div>

                        {/* Background large image */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '60px',
                            right: '0',
                            height: '300px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                        }}>
                            <img
                                src={data.aboutImg1 || data.portfolio[0]}
                                alt="About landscape"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Foreground portrait image */}
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '0',
                            width: '220px',
                            height: '260px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            border: '4px solid #f0ede6',
                        }}>
                            <img
                                src={data.aboutImg2 || data.portfolio[1]}
                                alt="About portrait"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>

                    {/* Right — About text */}
                    <div className="pd-animate pd-animate-3">


                        <h2 style={{
                            fontSize: '40px',
                            fontWeight: 900,
                            color: '#1a1a1a',
                            margin: '0 0 24px',
                            lineHeight: 1.15,
                        }}>About Me</h2>

                        {data.bio.split('\n\n').map((para, i) => (
                            <p key={i} style={{
                                color: '#555',
                                fontSize: '15px',
                                lineHeight: 1.85,
                                margin: '0 0 18px',
                                fontWeight: 400,
                            }}>{para}</p>
                        ))}

                        <button
                            className="pd-contact-btn"
                            style={{
                                marginTop: '12px',
                                background: '#E8A317',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '14px 34px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                letterSpacing: '0.02em',
                                transition: 'background 0.2s, color 0.2s',
                            }}
                        >
                            Contact us
                        </button>
                    </div>
                </section>

                {/* ══════════════════════════════
                    MY EXPERTISE CAROUSEL
                ══════════════════════════════ */}
                <ExpertiseCarousel data={data} />

                {/* ══════════════════════════════
                    PORTFOLIO MASONRY
                ══════════════════════════════ */}
                <PortfolioGrid data={data} />

                <PackagePricing data={data} />
                <Testimonials data={data} />



            </div>
        </ViewsLayout>
    );
};

export default PhotographerDetail;