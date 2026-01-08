import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Search, Camera, ArrowRight, Sparkles, Zap } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const [cardMousePos, setCardMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax for main content
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

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

  const userPaths = [
    { 
      id: 'customer',
      icon: Search,
      title: "Hire a Photographer",
      desc: "Find the perfect artist for your vision. Browse portfolios, compare styles, and book your ideal photographer.",
      action: "Find Talent",
      bgImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
      gradient: "linear-gradient(135deg, rgba(240, 142, 46, 0.9) 0%, rgba(200, 100, 30, 0.95) 100%)"
    },
    {
      id: 'creator',
      icon: Camera,
      title: "Join as Photographer",
      desc: "Showcase your portfolio, connect with clients, and grow your photography business on our platform.",
      action: "Start Creating",
      bgImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
      gradient: "linear-gradient(135deg, rgba(75, 46, 43, 0.9) 0%, rgba(50, 30, 28, 0.95) 100%)"
    }
  ];

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--color-mocha)',
        paddingTop: '8rem',
        paddingBottom: '8rem',
      }}
    >
      {/* Dynamic Background Columns with Parallax */}
      <motion.div 
        style={{
          position: 'absolute',
          inset: '-20%',
          display: 'flex',
          gap: '2rem',
          transform: 'rotate(-12deg) scale(1.1)',
          opacity: 0.3,
          filter: 'grayscale(40%) sepia(25%)',
          zIndex: 0,
        }}
      >
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={45} yStart="-50%" />
        <ParallaxColumn images={[...col2, ...col2, ...col2]} duration={35} reverse yStart="-20%" />
        <ParallaxColumn images={[...col3, ...col3, ...col3]} duration={50} yStart="-60%" />
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={40} reverse yStart="-30%" />
      </motion.div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(240, 142, 46, 0.08) 0%, transparent 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Main Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          y: y,
          opacity: opacity,
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
            marginBottom: '5rem',
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
              marginBottom: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(240, 142, 46, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '50px',
              border: '1px solid rgba(240, 142, 46, 0.2)',
              color: 'var(--color-orange)'
            }}
          >
            <Sparkles size={20} />
            <span style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '0.9rem',
              textTransform: 'uppercase', 
              letterSpacing: '0.15em',
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
              fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
              color: 'var(--color-cream)', 
              fontWeight: 700,
              marginBottom: '1rem',
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            Start Your Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 248, 240, 0.7)',
              maxWidth: '600px',
              margin: '0 auto',
              fontFamily: 'var(--font-body)'
            }}
          >
            Whether you're looking to hire or showcase your talent
          </motion.p>
        </motion.div>

        {/* User Path Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '3rem',
          position: 'relative'
        }}>
          {userPaths.map((item, index) => (
            <PathCard 
              key={item.id}
              item={item}
              index={index}
              isActive={activeCard === item.id}
              onHoverStart={() => setActiveCard(item.id)}
              onHoverEnd={() => setActiveCard(null)}
              mousePosition={mousePosition}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Gradient Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '300px',
        background: 'linear-gradient(to top, var(--color-mocha) 0%, transparent 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />
    </div>
  );
};

// Path Card Component with Magnetic Effect
const PathCard = ({ item, index, isActive, onHoverStart, onHoverEnd, mousePosition }) => {
  const cardRef = useRef(null);
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setLocalMouse({ x, y });
  };

  const magneticX = useSpring(isActive ? localMouse.x : 0, { stiffness: 150, damping: 15 });
  const magneticY = useSpring(isActive ? localMouse.y : 0, { stiffness: 150, damping: 15 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onMouseMove={handleCardMouseMove}
      style={{
        position: 'relative',
        height: '500px',
        borderRadius: '28px',
        overflow: 'hidden',
        cursor: 'pointer',
        x: magneticX,
        y: magneticY,
      }}
    >
      {/* Ripple Effect Container */}
      <AnimatePresence>
        {isActive && <RippleEffect />}
      </AnimatePresence>

      {/* Background Image */}
      <motion.div
        animate={{ 
          scale: isActive ? 1.15 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${item.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient Overlay */}
      <motion.div 
        animate={{
          opacity: isActive ? 1 : 0.95
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: item.gradient,
          zIndex: 1
        }} 
      />

      {/* Glassmorphic Border */}
      <motion.div
        animate={{
          opacity: isActive ? 1 : 0.5,
          scale: isActive ? 1.02 : 1
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '28px',
          padding: '2px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      />

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 5,
      }}>
        {/* Icon */}
        <motion.div
          animate={{
            scale: isActive ? 1.1 : 1,
            rotate: isActive ? 5 : 0
          }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            padding: '1.25rem',
            background: 'rgba(255, 248, 240, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 248, 240, 0.2)',
            color: 'var(--color-cream)',
          }}
        >
          {React.createElement(item.icon, { size: 36, strokeWidth: 2 })}
        </motion.div>

        {/* Text Content */}
        <div>
          <motion.h3 
            animate={{
              y: isActive ? -5 : 0
            }}
            style={{ 
              fontSize: 'clamp(2rem, 3vw, 2.75rem)', 
              marginBottom: '1rem', 
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-cream)',
              fontWeight: 700,
              lineHeight: 1.2
            }}
          >
            {item.title}
          </motion.h3>
          
          <motion.p 
            animate={{
              opacity: isActive ? 1 : 0.85,
              y: isActive ? 0 : 10
            }}
            transition={{ duration: 0.3 }}
            style={{ 
              fontFamily: 'var(--font-body)', 
              lineHeight: 1.6, 
              marginBottom: '2rem', 
              color: 'rgba(255, 248, 240, 0.9)',
              fontSize: '1.1rem'
            }}
          >
            {item.desc}
          </motion.p>
          
          <motion.button 
            animate={{
              x: isActive ? 10 : 0,
              scale: isActive ? 1.05 : 1
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="btn" 
            style={{ 
              background: 'var(--color-cream)', 
              color: 'var(--color-mocha)',
              border: 'none',
              padding: '1.25rem 2.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            {item.action} 
            <motion.div
              animate={{ x: isActive ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Shine Effect */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              zIndex: 15,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Ripple Effect Component
const RippleEffect = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ 
          duration: 1.5, 
          delay: i * 0.2,
          repeat: Infinity,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid rgba(255, 248, 240, 0.5)',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />
    ))}
  </>
);

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5
  }));

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 2,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: `${particle.x}vw`, 
            y: `${particle.y}vh`,
            opacity: 0 
          }}
          animate={{ 
            y: [`${particle.y}vh`, `${particle.y - 30}vh`, `${particle.y}vh`],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240, 142, 46, 0.8), transparent)',
            filter: 'blur(1px)'
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
           background: 'rgba(75, 46, 43, 0.2)',
           mixBlendMode: 'multiply'
        }} />
      </div>
    ))}
  </motion.div>
);

export default Hero;


















