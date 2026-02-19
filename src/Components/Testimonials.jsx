import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionSeparator from './SectionSeparator';
import { AnimatedText } from './AnimatedTest';

const testimonials = [
  {
    id: 1,
    name: "Elena Richardson",
    role: "Fashion Photographer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    text: "I finally have headshots that feel like me. The process was seamless.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Documentary Filmmaker",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    text: "Found my go-to event photographer in minutes. Consistently elite.",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    text: "The architectural shots helped us close the deal in record time.",
    rating: 5
  },
  {
    id: 4,
    name: "David O'Connor",
    role: "Indie Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    text: "They captured the texture and movement of our collection perfectly.",
    rating: 5
  },
  {
    id: 5,
    name: "Sophie Laurent",
    role: "Fashion Designer",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    text: "A truly professional experience from start to finish. Highly recommended.",
    rating: 5
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Real Estate Agent",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    text: "The aerial shots gave our listing a completely new perspective.",
    rating: 5
  }
];

const TestimonialCard = ({ item, index, isMobile }) => {
  // Random rotation for natural feel (reduced on mobile)
  const rotations = [-2, 1, -1, 2, -1.5, 1.5];
  const rotate = isMobile ? 0 : rotations[index % rotations.length];

  return (
    <div
      style={{
        transform: `rotate(${rotate}deg)`,
        margin: isMobile ? '0 0.75rem' : '0 1.5rem',
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
      }}
      className="polaroid-wrapper"
    >
      <motion.div
        whileHover={!isMobile ? { scale: 1.05, rotate: 0, zIndex: 10 } : {}}
        whileTap={isMobile ? { scale: 0.98 } : {}}
        style={{
          background: '#ffffff',
          padding: isMobile ? '0.75rem 0.75rem 2.5rem 0.75rem' : '1rem 1rem 3rem 1rem',
          width: isMobile ? '260px' : '320px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '0.75rem' : '1rem',
          position: 'relative',
          transformOrigin: 'top center'
        }}
      >
        {/* Tape Effect - Hidden on very small screens */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            top: -15,
            left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: '120px',
            height: '35px',
            backgroundColor: 'rgba(236, 230, 109, 0.4)',
            borderLeft: '2px solid rgba(255,255,255,0.1)',
            borderRight: '2px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(2px)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            zIndex: 5,
            opacity: 0.8
          }}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(45deg, transparent 40%, rgba(255,248,220, 0.6) 40%, rgba(255,248,220, 0.6) 60%, transparent 60%)',
              opacity: 0.3
            }} />
          </div>
        )}

        {/* Image Area */}
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          background: '#f0f0f0',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'sepia(0.1) saturate(1.1) contrast(1.1)'
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Text Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          {/* Rating */}
          <div style={{
            display: 'flex',
            gap: '2px',
            marginBottom: isMobile ? '0.4rem' : '0.5rem',
            opacity: 0.8
          }}>
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} size={isMobile ? 12 : 14} fill="var(--color-orange)" stroke="none" />
            ))}
          </div>

          <p style={{
            fontFamily: '"Shadows Into Light", "Kalam", cursive, var(--font-body)',
            fontSize: isMobile ? '0.9rem' : '1rem',
            lineHeight: 1.4,
            color: '#333',
            fontStyle: 'italic',
            marginBottom: isMobile ? '1rem' : '1.5rem',
            padding: '0 0.5rem'
          }}>
            "{item.text}"
          </p>

          <div style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: isMobile ? '1rem' : '1.1rem',
              color: 'var(--color-black)',
              marginBottom: '0',
              lineHeight: 1
            }}>
              {item.name}
            </h4>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              color: 'var(--color-gray)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {item.role}
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      style={{
        padding: isMobile ? '4rem 0 0 0' : isTablet ? '6rem 0 0 0' : '8rem 0 0 0',
        background: 'var(--color-pale)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <SectionSeparator flip={true} />

      {/* Background Decor */}
      <motion.div style={{
        position: 'absolute',
        inset: 0,
        y: isMobile ? 0 : yBg,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 60%)',
        opacity: 0.6,
        fontFamily: 'Oswald'
      }} />

      <div
        className="container"
        style={{
          textAlign: 'center',
          marginBottom: isMobile ? '2.5rem' : isTablet ? '3rem' : '4rem',
          position: 'relative',
          zIndex: 2,
          padding: isMobile ? '0 1.5rem' : '0 2rem'
        }}
      >
        <h2 style={{
          fontSize: isMobile
            ? 'clamp(2rem, 8vw, 3rem)'
            : isTablet
              ? 'clamp(3rem, 8vw, 5rem)'
              : '140px',
          color: 'var(--color-soft-black)',
          marginBottom: '1rem',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          perspective: '1000px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
        }}>
          {isMobile ? (
            // Simple fade for mobile
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Voice of the Community
            </motion.span>
          ) : (
            // Animated text for desktop
            <AnimatedText text="Voice of the Community" delay={0.2} />
          )}
        </h2>
        <p style={{
          fontFamily: "Oswald",
          color: 'var(--color-black)',
          maxWidth: isMobile ? '100%' : '600px',
          margin: '0 auto',
          fontSize: isMobile ? '1rem' : '1.1rem',
          lineHeight: 1.6
        }}>
          Real stories from the creatives shaping the industry.
        </p>
      </div>

      {/* Marquee Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: isMobile ? '2rem 0' : isTablet ? '3rem 0' : '4rem 0'
      }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: isMobile ? 40 : isTablet ? 50 : 60,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            display: 'flex',
            gap: '0',
            width: 'max-content',
            paddingLeft: '0',
            alignItems: 'flex-start',
            // Pause on hover (desktop only)
            animationPlayState: 'running'
          }}
          whileHover={!isMobile ? { animationPlayState: 'paused' } : {}}
        >
          {/* Duplicate list multiple times for seamless loop */}
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((item, index) => (
            <TestimonialCard
              key={`${item.id}-${index}`}
              item={item}
              index={index}
              isMobile={isMobile}
            />
          ))}
        </motion.div>

        {/* Vignette / Fade Edges */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isMobile ? '60px' : '100px',
          height: '100%',
          background: 'linear-gradient(to right, var(--color-pale), transparent)',
          zIndex: 20,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: isMobile ? '60px' : '100px',
          height: '100%',
          background: 'linear-gradient(to left, var(--color-pale), transparent)',
          zIndex: 20,
          pointerEvents: 'none'
        }} />
      </div>

      {/* Mobile scroll indicator */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            textAlign: 'center',
            paddingBottom: '2rem',
            color: 'var(--color-black)',
            fontSize: '0.85rem',
            fontFamily: 'Oswald',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>Swipe to see more</span>
          <span style={{ fontSize: '1.2rem' }}>→</span>
        </motion.div>
      )}

      <style>{`
        /* Touch scrolling optimization for mobile */
        @media (max-width: 767px) {
          .polaroid-wrapper {
            -webkit-tap-highlight-color: transparent;
          }
        }

        /* Hover effects only on desktop */
        @media (min-width: 768px) {
          .polaroid-wrapper:hover {
            z-index: 10;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;