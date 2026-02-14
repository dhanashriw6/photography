import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import SectionSeparator from './SectionSeparator';
import { AnimatedText } from './AnimatedTest';

const StatCard = ({ value, suffix, label, image, index, isMobile }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000, bounce: 0 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  const displayValue = useRef(null);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (displayValue.current) {
        displayValue.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
      style={{
        position: 'relative',
        borderRadius: isMobile ? '20px' : '24px',
        overflow: 'hidden',
        minWidth: isMobile ? '280px' : '21%',
        height: isMobile ? '160px' : '180px',
        cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        flexShrink: 0
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.6) saturate(0.8)',
        transition: 'all 0.4s ease'
      }}
        className="stat-bg"
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: isMobile ? '1.5rem' : '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{
            fontSize: isMobile ? '2.5rem' : '3.5rem',
            fontFamily: 'var(--font-heading)',
            color: '#fff',
            margin: 0,
            lineHeight: 1,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.2rem'
          }}>
            <span ref={displayValue}>0</span>
            <span style={{
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              color: 'var(--color-orange)',
              fontWeight: 'bold'
            }}>
              {suffix}
            </span>
          </h3>
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: isMobile ? '0.85rem' : '0.95rem',
          margin: 0,
          fontWeight: 500,
          letterSpacing: '0.02em'
        }}>
          {label}
        </p>
      </div>

      <style>{`
        .stat-bg:hover {
          filter: brightness(0.8) saturate(1) !important;
          transform: scale(1.05);
        }
      `}</style>
    </motion.div>
  );
};


const StatsCounter = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  const stats = [
    {
      value: 1200,
      suffix: '+',
      label: 'Shoots Completed',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80'
    },
    {
      value: 850,
      suffix: '+',
      label: 'Active Creatives',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80'
    },
    {
      value: 45,
      suffix: '+',
      label: 'Awards Won',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80'
    },
    {
      value: 15000,
      suffix: '+',
      label: 'Hours Recorded',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80'
    },
  ];

  return (
    <section style={{
      position: 'relative',
      padding: isMobile ? '4rem 1.5rem' : isTablet ? '6rem 2rem' : '8rem 2rem',
      background: '#0a0a0a',
      overflow: 'hidden',
      minHeight: isMobile ? 'auto' : '100vh'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.4,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      <SectionSeparator flip={false} />
      <div className="container" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Animated Header */}
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '3rem' : '4rem',
            maxWidth: '100%',
            overflow: 'visible'
          }}
        >
          <h2 style={{
            fontSize: isMobile ? 'clamp(2rem, 8vw, 3.5rem)' : isTablet ? 'clamp(3rem, 8vw, 5rem)' : 'clamp(80px, 10vw, 150px)',
            color: 'var(--color-khaki)',
            marginBottom: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            perspective: '1000px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            padding: isMobile ? '0 1rem' : '0',
            whiteSpace: isMobile || isTablet ? 'normal' : 'nowrap',
            overflow: 'visible',
            maxWidth: '100%',
            display: 'block',
            width: '100%'
          }}>
            {isMobile ? (
              // Simple fade-in for mobile (better performance)
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ display: 'block' }}
              >
                Our Impact in Numbers
              </motion.span>
            ) : (
              // Animated text for desktop - with block display
              <AnimatedText text="Our Impact in Numbers" delay={0.2} display="block" />
            )}
          </h2>

          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: isMobile ? 0.3 : 1.2 }}
            style={{
              fontFamily: 'Oswald',
              color: '#f5f1e8',
              opacity: 0.7,
              maxWidth: isMobile ? '100%' : '600px',
              margin: '0 auto',
              fontSize: isMobile ? '1rem' : '1.1rem',
              lineHeight: 1.6,
              padding: isMobile ? '0 1rem' : '0',
              display: 'block',
              clear: 'both'
            }}
          >
            Join thousands of creatives who are already making their mark
          </motion.p> */}

          {/* Decorative animated line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: isMobile ? 0.5 : 1.5, ease: "easeInOut" }}
            style={{
              height: '2px',
              width: isMobile ? '80px' : '120px',
              background: 'linear-gradient(90deg, transparent, #ff6b35, transparent)',
              margin: isMobile ? '1.5rem auto' : '2rem auto',
              transformOrigin: 'center',
              borderRadius: '2px'
            }}
          />
        </motion.div>

        {/* Stats Cards */}
        {isMobile ? (
          // Mobile: Horizontal scroll
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#ff6b35 transparent',
            paddingBottom: '1rem',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always'
                }}
              >
                <StatCard
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  image={stat.image}
                  index={index}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>
        ) : isTablet ? (
          // Tablet: 2x2 Grid
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                image={stat.image}
                index={index}
                isMobile={false}
              />
            ))}
          </div>
        ) : (
          // Desktop: Original 4-column layout
          <div style={{
            display: 'flex',
            gap: '3.5rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: '#ff6b35 transparent'
          }}>
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                image={stat.image}
                index={index}
                isMobile={false}
              />
            ))}
          </div>
        )}

        {/* Mobile scroll indicator */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0.5, 1, 0.5], x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              color: 'var(--color-orange)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-body)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Swipe to explore</span>
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </motion.div>
        )}
      </div>

      <style>{`
        :root {
          --font-heading: system-ui, -apple-system, sans-serif;
          --font-body: system-ui, -apple-system, sans-serif;
          --color-cream: #f5f1e8;
          --color-orange: #ff6b35;
          --color-red: #d64933;
          --color-black: #0a0a0a;
          --color-khaki: #FFE24F;
        }

        /* Scrollbar styling for mobile and desktop */
        .container > div::-webkit-scrollbar {
          height: 6px;
        }
        .container > div::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .container > div::-webkit-scrollbar-thumb {
          background: var(--color-orange);
          border-radius: 10px;
        }
        .container > div::-webkit-scrollbar-thumb:hover {
          background: var(--color-red);
        }

        /* Desktop: Grid layout */
        @media (min-width: 1200px) {
          .container > div:not(.mobile-scroll-indicator) {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            overflow: visible !important;
            gap: 2rem !important;
          }
          
          .container > div:not(.mobile-scroll-indicator) > * {
            min-width: auto !important;
          }
        }

        /* Smooth scrolling for mobile */
        @media (max-width: 767px) {
          .container > div {
            scroll-padding: 0 1.5rem;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Hide scrollbar on mobile for cleaner look */
        @media (max-width: 767px) {
          .container > div::-webkit-scrollbar {
            display: none;
          }
        }

        /* Tablet specific adjustments */
        @media (min-width: 768px) and (max-width: 1023px) {
          .container > div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsCounter;