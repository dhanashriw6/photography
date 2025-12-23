import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax for main content
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 0.9]);

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

  const moveX = useSpring(mousePosition.x * 50, { stiffness: 100, damping: 20 });
  const moveY = useSpring(mousePosition.y * 50, { stiffness: 100, damping: 20 });

  // Image Columns Data
  const col1 = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
  ];
  const col2 = [
    "https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    "https://images.unsplash.com/photo-1471341971474-273d2b0b27b5?w=800&q=80",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
  ];
  const col3 = [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd552?w=800&q=80",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&q=80",
  ];

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        height: '120vh', // Extend slightly to cover elastic scrolling
        width: '100%',
        overflow: 'hidden',
        background: 'var(--color-mocha)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px'
      }}
    >
      {/* Dynamic Background Columns */}
      <motion.div 
        style={{
          position: 'absolute',
          inset: '-20%',
          display: 'flex',
          gap: '2rem',
          transform: 'rotate(-12deg) scale(1.1)',
          opacity: 0.4,
          filter: 'grayscale(30%) sepia(20%)',
          zIndex: 0,
        }}
      >
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={45} yStart="-50%" />
        <ParallaxColumn images={[...col2, ...col2, ...col2]} duration={35} reverse yStart="-20%" />
        <ParallaxColumn images={[...col3, ...col3, ...col3]} duration={50} yStart="-60%" />
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={40} reverse yStart="-30%" />
      </motion.div>

      {/* Main Content Card - Frosted Glass Effect */}
      <motion.div
        style={{
          zIndex: 10,
          position: 'relative',
          y: y,
          opacity: opacity,
          scale: scale,
          x: moveX,
          // rotateX: moveY, // Subtle 3D tilt
          // rotateY: moveX,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           textAlign: 'center'
        }}>
          

          {/* Huge Title with Blend Mode */}
          <h1 className="hero-title" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(5rem, 15vw, 12rem)',
            lineHeight: 0.85,
            color: 'var(--color-beige)',
            textShadow: '0 20px 40px rgba(0,0,0,0.3)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }}>
            <motion.div
              initial={{ y: 100, opacity: 0, rotate: 5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            >
              FILM
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.45 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}
            >
              <span style={{ fontStyle: 'italic', fontFamily: 'serif', fontWeight: '300' }}>&</span> FRAME
            </motion.div>
          </h1>

          {/* Subtitle and Description */}
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8, duration: 1 }}
             style={{ 
               maxWidth: '600px', 
               color: 'var(--color-beige)', 
               opacity: 0.9,
               fontSize: 'clamp(1rem, 2vw, 1.2rem)',
               marginTop: '2rem',
               lineHeight: 1.6,
               fontWeight: 300
             }}
          >
            A curated sanctuary for visual storytellers. We bridge the gap between 
            <span style={{ fontStyle: 'italic', color: 'var(--color-caramel)', margin: '0 5px' }}>raw artistry</span> 
            and commercial opportunity.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              marginTop: '3rem',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center'
            }}
          >
            <CtaButton primary>
              Explore Talent <ArrowRight size={18} />
            </CtaButton>
           <CtaButton primary>
             Join as Photographer  <ArrowRight size={18} />
            </CtaButton>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Decorative Overlay Gradient (Bottom) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '400px',
        background: 'linear-gradient(to top, var(--color-mocha) 0%, transparent 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />

    </div>
  );
};

// Sub-components

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
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <img 
          src={src} 
          alt="Film Frame" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: 'grayscale(20%) contrast(1.1)' 
          }} 
        />
        <div style={{
           position: 'absolute',
           inset: 0,
           background: 'rgba(75, 46, 43, 0.2)', // Tint
           mixBlendMode: 'multiply'
        }} />
      </div>
    ))}
  </motion.div>
);

const CtaButton = ({ children, primary }) => {
  const [isHovered, setHovered] = useState(false);
  
  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '1rem 2rem',
        borderRadius: '99px',
        border: '1px solid',
        borderColor: primary ? 'var(--color-beige)' : 'rgba(245, 239, 230, 0.3)',
        background: primary ? 'var(--color-beige)' : 'transparent',
        color: primary ? 'var(--color-mocha)' : 'var(--color-beige)',
        fontSize: '1rem',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}
    >
      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </span>
      {/* Fill Animation */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '0%' : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: primary ? 'var(--color-caramel)' : 'var(--color-beige)',
          zIndex: 1
        }}
      />
      {primary && (
         <motion.div 
           animate={{ x: isHovered ? '0%' : '-100%' }}
           style={{
             position: 'absolute',
             inset: 0,
             background: 'var(--color-caramel)',
             zIndex: 1
           }}
           transition={{ duration: 0.3 }}
         />
      )}
      {!primary && (
         <motion.div 
           animate={{ opacity: isHovered ? 0.1 : 0 }}
           style={{
             position: 'absolute',
             inset: 0,
             background: 'white',
             zIndex: 1
           }}
         />
      )}
    </motion.button>
  );
};

export default Hero;


















