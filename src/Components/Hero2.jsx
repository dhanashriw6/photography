import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';

const Hero2 = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Carousel State
  const [activeIndex, setActiveIndex] = useState(3);
  const containerRef = useRef(null);

  const galleryImages = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80"
  ];

  // Auto-play effect for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const titleline1 = "Film Frame".split("");
  const titleline2 = "Studio".split("");

  return (
    <header style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '4rem 2rem 2rem',
      background: 'white',
      color: 'var(--color-soft-black)'
    }}>
      {/* Animated Background Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(193,154,107,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(75,46,43,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Badges - Doodle Style */}
      {/* Badge 1 - Cinematic (Star shape) */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'var(--color-paper-beige)',
          border: '3px solid var(--color-soft-black)',
          borderRadius: '50%',
          padding: '1.2rem 1.5rem',
          fontFamily: 'var(--font-body)',
          fontWeight: '600',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-soft-black)',
          boxShadow: '4px 4px 0px var(--color-soft-black)',
          transform: 'rotate(-12deg)',
          position: 'relative'
        }}>
          Cinematic
          {/* Star decoration */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            background: 'var(--color-muted-gold)',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            border: '2px solid var(--color-soft-black)'
          }} />
        </div>
      </motion.div>

      {/* Badge 2 - Creative (Blob shape) */}
      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          position: 'absolute',
          top: '40%',
          left: '7%',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'var(--color-muted-gold)',
          border: '3px solid var(--color-soft-black)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          padding: '1rem 1.8rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: '600',
          fontSize: '1rem',
          fontStyle: 'italic',
          color: 'var(--color-soft-black)',
          boxShadow: '5px 5px 0px var(--color-soft-black)',
          transform: 'rotate(8deg)'
        }}>
          Creative
        </div>
      </motion.div>

      {/* Badge 3 - Editorial (Spiky circle) */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Spiky background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-paper-beige)',
            border: '7px solid var(--color-soft-black)',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            boxShadow: '4px 4px 0px var(--color-soft-black)'
          }} />
          <span style={{
            position: 'relative',
            fontFamily: 'var(--font-body)',
            fontWeight: '700',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            color: 'var(--color-soft-black)',
            letterSpacing: '0.05em',
            zIndex: 1
          }}>
            Editorial
          </span>
        </div>
      </motion.div>

      {/* Badge 4 - Artistic (Rounded rectangle) */}
      <motion.div
        animate={{
          y: [0, 18, 0],
          x: [0, 12, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        style={{
          position: 'absolute',
          top: '45%',
          right: '15%',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'var(--color-earth-brown)',
          border: '3px solid var(--color-soft-black)',
          borderRadius: '25px',
          padding: '0.9rem 1.6rem',
          fontFamily: 'var(--font-body)',
          fontWeight: '600',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-paper-beige)',
          boxShadow: '4px 4px 0px var(--color-soft-black)',
          transform: 'rotate(-5deg)'
        }}>
          Artistic
        </div>
      </motion.div>

      {/* Badge 5 - Premium (Pill shape) */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          top: '27%',
          left: '15%',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'var(--color-soft-black)',
          border: '3px solid var(--color-soft-black)',
          borderRadius: '50px',
          padding: '0.8rem 1.5rem',
          fontFamily: 'var(--font-body)',
          fontWeight: '600',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-muted-gold)',
          boxShadow: '5px 5px 0px rgba(0,0,0,0.3)',
          transform: 'rotate(3deg)'
        }}>
          Premium
        </div>
      </motion.div>

      {/* Badge 6 - Bold (Square with rounded corners) */}
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -15, 15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        style={{
          position: 'absolute',
          top: '30%',
          right: '25%',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'var(--color-forest-green)',
          border: '3px solid var(--color-soft-black)',
          borderRadius: '15px',
          padding: '1rem 1.4rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: '700',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          color: 'var(--color-paper-beige)',
          boxShadow: '4px 4px 0px var(--color-soft-black)',
          transform: 'rotate(-8deg)'
        }}>
          Bold
        </div>
      </motion.div>


      {/* Main Content */}
      <motion.div style={{ y, opacity, textAlign: 'center', zIndex: 10, position: 'relative', marginBottom: '2rem' }}>
        {/* Decorative Line Above */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100px',
            height: '2px',
            background: 'var(--color-muted-gold)',
            margin: '0 auto 2rem',
            transformOrigin: 'center'
          }}
        />

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
          style={{
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              background: 'linear-gradient(90deg, var(--color-soft-black), var(--color-muted-gold), var(--color-soft-black))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 500,
              letterSpacing: '0.05em'
            }}
          >
            Curated Photography Marketplace
          </motion.span>
        </motion.p>

        {/* Enhanced Title */}
        <h1 className="hero-text" style={{ 
          color: 'var(--color-soft-black)', 
          margin: '1.5rem 0', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', overflow: 'hidden' }}>
              {titleline1.map((char, index) => (
                  <motion.span
                      key={index}
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.05, 
                        ease: [0.22, 1, 0.36, 1],
                        opacity: { duration: 0.5, delay: index * 0.05 }
                      }}
                      whileHover={{ 
                        y: -10, 
                        color: 'var(--color-muted-gold)',
                        transition: { duration: 0.2 }
                      }}
                      style={{ display: 'inline-block', cursor: 'none' }}
                  >
                      {char === " " ? "\u00A0" : char}
                  </motion.span>
              ))}
          </div>
          <div style={{ display: 'flex', overflow: 'hidden' }}>
              {titleline2.map((char, index) => (
                  <motion.span
                      key={index}
                      initial={{ y: 200, opacity: 0, rotateX: 90 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      transition={{ 
                        duration: 1.2, 
                        delay: 0.5 + index * 0.06, 
                        ease: [0.22, 1, 0.36, 1],
                        opacity: { duration: 0.5, delay: 0.5 + index * 0.06 }
                      }}
                      whileHover={{ 
                        y: -10,
                        rotateZ: 5,
                        color: 'var(--color-muted-gold)',
                        transition: { duration: 0.2 }
                      }}
                      style={{ 
                        fontStyle: 'italic', 
                        fontFamily: 'var(--font-heading)',
                        display: 'inline-block',
                        cursor: 'none',
                        transformStyle: 'preserve-3d'
                      }}
                  >
                      {char}
                  </motion.span>
              ))}
          </div>
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
            color: 'var(--color-earth-brown)',
            maxWidth: '600px',
            margin: '2rem auto 0',
            lineHeight: 1.6
          }}
        >
          Where <motion.span 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'var(--color-muted-gold)', fontWeight: '600' }}
          >
            artistry
          </motion.span> meets opportunity
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '3rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(138, 92, 59, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{
              background: 'var(--color-soft-black)',
              color: 'var(--color-paper-beige)',
              fontSize: '1rem',
              padding: '1.2rem 2.5rem',
              border: 'none',
              borderRadius: '50px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer'
            }}
          >
            Explore Talent <ArrowRight size={20} style={{ marginLeft: '10px' }} />
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              borderColor: 'var(--color-soft-black)',
              background: 'var(--color-soft-black)',
              color: 'var(--color-paper-beige)'
            }}
            whileTap={{ scale: 0.95 }}
            className="btn"
            style={{
              fontSize: '1rem',
              padding: '1.2rem 2.5rem',
              border: '1px solid var(--color-soft-black)',
              background: 'transparent',
              color: 'var(--color-soft-black)',
              borderRadius: '50px',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer'
            }}
          >
            Join as Photographer
          </motion.button>
        </motion.div>
      </motion.div>

      {/* 3D Curved Carousel with Enhanced Depth */}
        <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          width: '100%',
          height: '900px', // Adjusted height
          position: 'relative',
          perspective: '1500px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 'auto', // Push to bottom
          marginBottom: '2rem'
        }}
      >
        {/* Carousel Controls */}
        {/* <button 
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '5%',
            zIndex: 20,
            background: 'rgba(21, 21, 21, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid var(--color-soft-gray)',
            borderRadius: '50%',
            padding: '10px',
            cursor: 'pointer',
            color: 'var(--color-soft-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '5%',
            zIndex: 20,
            background: 'rgba(21, 21, 21, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid var(--color-soft-gray)',
            borderRadius: '50%',
            padding: '10px',
            cursor: 'pointer',
            color: 'var(--color-soft-black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowRight size={24} />
        </button> */}

        {/* Carousel Stage */}
        <div 
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transformStyle: 'preserve-3d',
          }}
        >
          {galleryImages.map((src, index) => {
            let offset = index - activeIndex;
            // Handle infinite loop logic
            if (offset > galleryImages.length / 2) offset -= galleryImages.length;
            if (offset < -galleryImages.length / 2) offset += galleryImages.length;

            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            // Arc Configuration
            const radius = 600; // Radius of the circle
            const angleStep = 15; // Degrees between each card
            const baseAngle = offset * angleStep;
            
            // Convert to radians for math
            const rad = (baseAngle * Math.PI) / 180;

            // Calculate positions based on polar coordinates (Rainbow/Fan Arc)
            // Center is top of arc (0,0)
            const x = radius * Math.sin(rad);
            // Y needs to go DOWN as we move away from center to create rainbow shape
            // cos(0) = 1, cos(small) < 1. 
            // We want y=0 at center, and y > 0 at sides.
            const y = radius * (1 - Math.cos(rad));

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  x: x,
                  y: y + (absOffset * 10), // Add extra drop for dramatic effect
                  rotateZ: baseAngle, // Rotate to match arc
                  // scale: 1 - absOffset * 0.05, // Slight scaling down
                  zIndex: galleryImages.length - absOffset,
                  opacity: Math.abs(offset) > 3 ? 0 : 1, // Fade out distant items
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  mass: 1
                }}
                style={{
                  position: 'absolute',
                  width: '280px',
                  height: '340px',
                  borderRadius: '24px', // Softer rounded corners
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: isActive 
                    ? '0 25px 50px -12px rgba(0,0,0,0.5)' 
                    : '0 10px 30px -5px rgba(0,0,0,0.3)',
                  transformOrigin: '50% 100%', // Rotate from bottom for better fan effect? Or center? Let's try center first.
                  // actually transformOrigin center is safer for specific x/y calcs.
                  cursor: 'pointer',
                  border: isActive ? '4px solid var(--color-muted-gold)' : 'none'
                }}
                onClick={() => setActiveIndex(index)}
              >
                <img 
                  src={src} 
                  alt={`Gallery ${index}`} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none' // Prevent drag issues
                  }}
                />
                
                {/* Gradient Overlay for depth */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: isActive 
                    ? 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 100%)' 
                    : 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
                  transition: 'all 0.3s ease'
                }} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </header>
  );
};

export default Hero2;
