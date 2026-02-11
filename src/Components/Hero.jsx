import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Search, Camera, ArrowRight, Sparkles, Zap } from 'lucide-react';
import SectionSeparator from './SectionSeparator';

const Hero = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const { scrollY } = useScroll();

  // Parallax for main content
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  // Removed opacity fade to ensure visibility at all times


  // Mouse move effect tracking
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '200vh',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--color-black)',
        paddingTop: '8rem',
        paddingBottom: '8rem',
        color: 'var(--color-cream)'
      }}
    >
      {/* Background with Parallax Columns - Kept as requested */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-20%',
          display: 'flex',
          gap: '2rem',
          transform: 'rotate(-12deg) scale(1.1)',
          // opacity: 0.15, // Reduced flexibility for better text contrast
          filter: 'grayscale(100%) sepia(10%) contrast(1.2)',
          zIndex: 1,
        }}
      >
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={45} yStart="-50%" />
        <ParallaxColumn images={[...col2, ...col2, ...col2]} duration={35} reverse yStart="-20%" />
        <ParallaxColumn images={[...col3, ...col3, ...col3]} duration={50} yStart="-60%" />
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={40} reverse yStart="-30%" />
      </motion.div>

      {/* Floating Particles - Visual enhancements */}
      <FloatingParticles />

      {/* Heavy Gradient Fade for Readability - Made darker */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(13, 13, 13, 0.4) 0%, rgba(10, 10, 10, 0.6) 100%)',
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
          padding: '0 2rem',
        }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            textAlign: 'center',
            marginBottom: '6rem',
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
              marginBottom: '2rem',
              padding: '0.5rem 1.25rem',

              background: 'rgba(255, 226, 79, 0.25)', // #FFE24F with transparency
              borderRadius: '100px',
              border: '1px solid rgba(255, 226, 79, 0.4)',
              color: '#FFE24F',
              boxShadow: '0 0 20px rgba(255, 226, 79, 0.35)'
            }}
          >

            <Sparkles size={16} fill="currentColor" />
            <span style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: 600
            }}>
              Choose Your Path
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: '160px',
              color: 'var(--color-khaki)',
              fontWeight: 400, // Thinner, more elegant
              marginBottom: '1.5rem',
              lineHeight: 1,
              fontFamily: "Oswald",
              letterSpacing: '-0.02em',
              textShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            {/* Start Your <span style={{ color: 'var(--color-khaki)', fontStyle: 'italic' }}>Journey</span> */}
            Start Your Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
              color: 'rgba(247, 243, 232, 0.6)',
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Connect with world-class photographers or showcase your own artistic vision to a global audience.
          </motion.p>
        </motion.div>

        {/* User Path Cards - Cinematic Accordion Style */}
        <div className="flex flex-col md:flex-row gap-6 w-full h-auto md:h-[550px] relative z-20 mx-auto max-w-7xl pb-12">
          {userPaths.map((item) => (
            <PathCard
              key={item.id}
              item={item}
              isActive={activeCard === item.id}
              setActive={setActiveCard}
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
        height: '400px',
        background: 'linear-gradient(to top, var(--color-black) 10%, transparent 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* Scalloped Section Separator */}
      <SectionSeparator flip={true} />
    </div>
  );
};

// New Cinematic Accordion Card
const PathCard = ({ item, isActive, setActive }) => {
  return (
    <motion.div
      layout
      onHoverStart={() => setActive(item.id)}
      onHoverEnd={() => setActive(null)}
      className={`relative flex-1 group overflow-hidden rounded-3xl cursor-pointer border border-white/10 transition-all duration-500 ease-in-out ${isActive ? 'flex-[2]' : 'flex-1'} min-h-[400px] md:min-h-0`}
      style={{
        fontFamily: "Oswald",
      }}
    >
      {/* Background Image */}
      <motion.div
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0 w-full h-full"
      >
        {/* <img
          src={item.bgImage}
          alt={item.title}
          className="w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0"
        /> */}
        {/* Dark Overlay that lightens on hover */}
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-500" />

        {/* Color Gradient Accent */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-80"
          style={{ background: item.gradient }}
        />
      </motion.div>

      {/* Content Container */}
      <div className="absolute inset-0 p-8 flex flex-col justify-center items-center z-10 text-center transition-colors duration-500 bg-black/40 group-hover:bg-black/60">

        {/* Icon & Title Wrapper */}
        <div className="flex flex-col gap-4 items-center transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
          <div
            className="flex items-center justify-center p-2 h-15 w-15 rounded-full mb-6 text-cream backdrop-blur-md border border-white/20 transition-colors duration-300 shadow-lg"
            style={{
              backgroundColor: isActive ? item.accent : 'rgba(255,255,255,0.1)',
              color: isActive ? '#fff' : 'var(--color-cream)'
            }}
          >
            {React.createElement(item.icon, { size: 32, strokeWidth: 1.5 })}
          </div>

          <h3 style={{ fontFamily: "Oswald", }} className={`${isActive ? 'text-5xl' : 'text-4xl'} font-heading font-bold text-cream mb-4 leading-tight drop-shadow-lg`}>
            {item.title}
          </h3>
        </div>

        {/* Description & Action - Hidden by default, revealed on hover/active */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden flex flex-col gap-6 items-center w-full"
        >
          <p className="text-lg text-gray-200 font-body leading-relaxed mb-8 max-w-lg mx-auto drop-shadow-md">
            {item.desc}
          </p>

          <button
            className="flex items-center gap-3 p-2 w-50  h-15 justify-center rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              backgroundColor: item.accent,
              color: '#fff',
              // boxShadow: `0 4px 20px -5px ${item.accent}`
            }}
          >
            {item.action}
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>

      {/* Decorative Border Glow on Active */}
      <div
        className={`absolute inset-0 rounded-3xl border-2 transition-opacity duration-300 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ borderColor: item.accent }}
      />
    </motion.div>
  );
};

// Simple Floating Particles
const FloatingParticles = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
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
        // boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
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
          // background: 'rgba(26, 26, 26, 0.3)',
          // mixBlendMode: 'multiply'
        }} />
      </div>
    ))}
  </motion.div>
);

export default Hero;
