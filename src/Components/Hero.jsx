import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Search, Camera, ArrowRight, Sparkles, Zap } from 'lucide-react';
import SectionSeparator from './SectionSeparator';
import { AnimatedText } from './AnimatedTest';

const Hero = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { scrollY } = useScroll();

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

  // Parallax for main content (disabled on mobile for performance)
  const y = useTransform(scrollY, [0, 1000], [0, isMobile ? 0 : 200]);

  // Mouse move effect tracking (desktop only)
  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile]);

  // Image Columns Data
  const col1 = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
  ];
  const col2 = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
  ];
  const col3 = [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&q=80",
  ];

  const userPaths = [
    {
      id: 'customer',
      icon: Search,
      title: "Hire a Photographer",
      desc: "Find the perfect artist for your vision. Browse portfolios, compare styles, and book your ideal photographer.",
      action: "Find Talent",
      bgImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
      gradient: "linear-gradient(135deg, rgba(240, 142, 46, 0.95) 0%, rgba(200, 100, 30, 0.98) 100%)",
      accent: "var(--color-orange)"
    },
    {
      id: 'creator',
      icon: Camera,
      title: "Join as Photographer",
      desc: "Showcase your portfolio, connect with clients, and grow your photography business on our platform.",
      action: "Start Creating",
      bgImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
      gradient: "linear-gradient(135deg, rgba(240, 142, 46, 0.95) 0%, rgba(200, 100, 30, 0.98) 100%)",
      accent: "var(--color-orange)"
    }
  ];

  return (
    <div
      id="chooseYourPath"
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: isMobile ? '120vh' : '200vh',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--color-black)',
        paddingTop: isMobile ? '5rem' : isTablet ? '6rem' : '8rem',
        paddingBottom: isMobile ? '4rem' : isTablet ? '6rem' : '8rem',
        color: 'var(--color-cream)'
      }}
    >
      {/* Background with Parallax Columns - Simplified on mobile */}
      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute',
            inset: '-20%',
            display: 'flex',
            gap: '2rem',
            transform: 'rotate(-12deg) scale(1.1)',
            filter: 'grayscale(100%) sepia(10%) contrast(1.2)',
            zIndex: 1,
          }}
        >
          <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={45} yStart="-50%" />
          <ParallaxColumn images={[...col2, ...col2, ...col2]} duration={35} reverse yStart="-20%" />
          <ParallaxColumn images={[...col3, ...col3, ...col3]} duration={50} yStart="-60%" />
          <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={40} reverse yStart="-30%" />
        </motion.div>
      )}

      {/* Mobile: Static background */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${col1[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%) brightness(0.3)',
          zIndex: 1
        }} />
      )}

      {/* Floating Particles - Desktop only */}
      {!isMobile && <FloatingParticles />}

      {/* Heavy Gradient Fade for Readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isMobile
          ? 'linear-gradient(to bottom, rgba(13, 13, 13, 0.7) 0%, rgba(10, 10, 10, 0.85) 100%)'
          : 'linear-gradient(to bottom, rgba(13, 13, 13, 0.4) 0%, rgba(10, 10, 10, 0.6) 100%)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Main Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 20,
          y: y,
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '0 1.5rem' : '0 2rem',
        }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '3rem' : isTablet ? '4rem' : '6rem',
            position: 'relative'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: isMobile ? '1.5rem' : '2rem',
              padding: isMobile ? '0.4rem 1rem' : '0.5rem 1.25rem',
              background: 'rgba(255, 226, 79, 0.25)',
              borderRadius: '100px',
              border: '1px solid rgba(255, 226, 79, 0.4)',
              color: '#FFE24F',
              boxShadow: '0 0 20px rgba(255, 226, 79, 0.35)'
            }}
          >
            <Sparkles size={isMobile ? 14 : 16} fill="currentColor" />
            <span style={{
              fontSize: isMobile ? '0.7rem' : '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: 600
            }}>
              Choose Your Path
            </span>
          </motion.div>

          <h2 style={{
            fontSize: isMobile ? 'clamp(2.5rem, 10vw, 4rem)' : isTablet ? 'clamp(4rem, 10vw, 6rem)' : '140px',
            color: 'var(--color-khaki)',
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Start Your Journey
              </motion.span>
            ) : (
              // Animated text for desktop
              <AnimatedText text="Start Your Journey" delay={0.2} />
            )}
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: isMobile ? 0.5 : 0.5 }}
            style={{
              fontSize: isMobile ? 'clamp(0.95rem, 4vw, 1.1rem)' : 'clamp(1.1rem, 2vw, 1.35rem)',
              color: 'rgba(247, 243, 232, 0.6)',
              maxWidth: isMobile ? '100%' : '650px',
              margin: '0 auto',
              lineHeight: 1.6,
              padding: isMobile ? '0 1rem' : '0'
            }}
          >
            Connect with world-class photographers or showcase your own artistic vision to a global audience.
          </motion.p>
        </motion.div>

        {/* User Path Cards */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1.5rem' : '1.5rem',
          width: '100%',
          height: isMobile ? 'auto' : isTablet ? '500px' : '550px',
          position: 'relative',
          zIndex: 20,
          maxWidth: '1200px',
          margin: '0 auto',
          paddingBottom: isMobile ? '2rem' : '3rem'
        }}>
          {userPaths.map((item) => (
            <PathCard
              key={item.id}
              item={item}
              isActive={activeCard === item.id}
              setActive={setActiveCard}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          ))}
        </div>
      </motion.div>

      {/* Decorative Bottom Fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: isMobile ? '200px' : '400px',
        background: 'linear-gradient(to top, var(--color-black) 10%, transparent 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* Scalloped Section Separator */}
      <SectionSeparator flip={true} />
    </div>
  );
};

// Cinematic Accordion Card - Mobile Optimized
const PathCard = ({ item, isActive, setActive, isMobile, isTablet }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInteraction = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
    } else {
      setActive(item.id);
    }
  };

  return (
    <motion.div
      layout
      onHoverStart={() => !isMobile && setActive(item.id)}
      onHoverEnd={() => !isMobile && setActive(null)}
      onClick={handleInteraction}
      style={{
        position: 'relative',
        flex: isMobile ? 'none' : (isActive ? 2 : 1),
        overflow: 'hidden',
        borderRadius: isMobile ? '24px' : '32px',
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.5s ease-in-out',
        minHeight: isMobile ? (isExpanded ? '500px' : '300px') : isTablet ? '450px' : '400px',
        fontFamily: "Oswald",
      }}
    >
      {/* Background Image */}
      <motion.div
        animate={{ scale: (isActive || isExpanded) ? 1.05 : 1 }}
        transition={{ duration: 0.7 }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      >
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: (isActive || isExpanded) ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',
          transition: 'background 0.5s'
        }} />

        {/* Color Gradient Accent */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: (isActive || isExpanded) ? 0.8 : 0.4,
            mixBlendMode: 'overlay',
            transition: 'opacity 0.5s',
            background: item.gradient
          }}
        />
      </motion.div>

      {/* Content Container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: isMobile ? '2rem 1.5rem' : isTablet ? '2rem' : '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        textAlign: 'center',
        transition: 'background 0.5s',
        background: (isActive || isExpanded) ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)'
      }}>
        {/* Icon & Title Wrapper */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '1rem' : '1rem',
          alignItems: 'center',
          transform: (isActive || isExpanded) ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'transform 0.5s ease-out'
        }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              height: isMobile ? '56px' : '60px',
              width: isMobile ? '56px' : '60px',
              borderRadius: '50%',
              marginBottom: isMobile ? '1rem' : '1.5rem',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              backgroundColor: (isActive || isExpanded) ? item.accent : 'rgba(255,255,255,0.1)',
              color: (isActive || isExpanded) ? '#fff' : 'var(--color-cream)'
            }}
          >
            {React.createElement(item.icon, {
              size: isMobile ? 28 : 32,
              strokeWidth: 1.5
            })}
          </div>

          <h3 style={{
            fontFamily: "Oswald",
            fontSize: isMobile
              ? (isExpanded ? 'clamp(2rem, 6vw, 2.5rem)' : 'clamp(1.8rem, 5vw, 2.2rem)')
              : (isActive ? 'clamp(2.5rem, 4vw, 3rem)' : 'clamp(2rem, 3vw, 2.5rem)'),
            fontWeight: 'bold',
            color: 'var(--color-cream)',
            marginBottom: isMobile ? '1rem' : '1rem',
            lineHeight: 1.2,
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            transition: 'font-size 0.3s ease'
          }}>
            {item.title}
          </h3>
        </div>

        {/* Description & Action - Visible on mobile when expanded, on desktop when active */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: (isActive || isExpanded) ? 1 : 0,
            height: (isActive || isExpanded) ? 'auto' : 0
          }}
          transition={{ duration: 0.4 }}
          style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '1.5rem' : '1.5rem',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <p style={{
            fontSize: isMobile ? '0.95rem' : '1rem',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'Oswald',
            lineHeight: 1.6,
            marginBottom: isMobile ? '1rem' : '2rem',
            maxWidth: isMobile ? '100%' : '450px',
            margin: '0 auto',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            {item.desc}
          </p>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: isMobile ? '0.9rem 1.8rem' : '1rem 2rem',
              justifyContent: 'center',
              borderRadius: '50px',
              fontSize: isMobile ? '0.8rem' : '0.85rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: item.accent,
              color: '#fff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
              }
            }}
          >
            {item.action}
            <ArrowRight size={isMobile ? 16 : 18} />
          </button>
        </motion.div>
      </div>

      {/* Decorative Border Glow on Active */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: isMobile ? '24px' : '32px',
          border: '2px solid',
          borderColor: item.accent,
          opacity: (isActive || isExpanded) ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
};

// Simple Floating Particles
const FloatingParticles = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 3 }}>
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: Math.random() * 100 + "%", x: Math.random() * 100 + "%" }}
          animate={{ opacity: [0, 0.4, 0], y: "-=100px" }}
          transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 10 }}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'var(--color-orange)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }}
        />
      ))}
    </div>
  );
};

// Parallax Column Component
const ParallaxColumn = ({ images, duration, reverse, yStart = "0%" }) => (
  <motion.div
    initial={{ y: reverse ? "0%" : "-50%" }}
    animate={{ y: reverse ? "-50%" : "0%" }}
    transition={{
      duration: duration,
      ease: "linear",
      repeat: Infinity,
    }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      width: '30vw',
      position: 'relative',
      y: yStart
    }}
  >
    {images.map((src, i) => (
      <div key={i} style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        height: '400px',
        width: '100%',
      }}>
        <img
          src={src}
          alt="Online Photographer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(10%) contrast(1.1)'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
        }} />
      </div>
    ))}
  </motion.div>
);

export default Hero;