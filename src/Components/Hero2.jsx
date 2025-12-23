import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

const Hero2 = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Parallax effects for different layers
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 250]);
  const y3 = useTransform(scrollY, [0, 500], [0, 100]);
  const rotate1 = useTransform(scrollY, [0, 500], [0, 10]);
  const rotate2 = useTransform(scrollY, [0, 500], [0, -15]);

  const titleline1 = "Film Frame".split("");
  const titleline2 = "Studio".split("");

  // Floating poster images
  const posters = [
    { 
      url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80",
      position: { top: '15%', left: '8%' },
      delay: 0.3,
      yTransform: y1,
      rotate: rotate1
    },
    { 
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
      position: { top: '60%', left: '12%' },
      delay: 0.5,
      yTransform: y2,
      rotate: rotate2
    },
    { 
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80",
      position: { top: '20%', right: '10%' },
      delay: 0.4,
      yTransform: y3,
      rotate: rotate1
    },
    { 
      url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
      position: { top: '65%', right: '8%' },
      delay: 0.6,
      yTransform: y1,
      rotate: rotate2
    }
  ];

  return (
    <header style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem',
      background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-beige) 100%)'
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

      {/* Floating Poster Images with Parallax */}
      {posters.map((poster, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1.2, 
            delay: poster.delay,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{
            position: 'absolute',
            ...poster.position,
            y: poster.yTransform,
            rotate: poster.rotate,
            zIndex: 1
          }}
        >
          <motion.div
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              zIndex: 20
            }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              width: '200px',
              height: '280px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              border: '8px solid white',
              cursor: 'none'
            }}
          >
            <motion.img
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src={poster.url}
              alt="Photography"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(20%) contrast(1.1)'
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Main Content with Enhanced Animations */}
      <motion.div style={{ y, opacity, textAlign: 'center', zIndex: 10, position: 'relative' }}>
        {/* Decorative Line Above */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100px',
            height: '2px',
            background: 'var(--color-caramel)',
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
              background: 'linear-gradient(90deg, var(--color-mocha), var(--color-caramel), var(--color-mocha))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Curated Photography Marketplace
          </motion.span>
        </motion.p>

        {/* Enhanced Title with Stagger and Bounce */}
        <h1 className="hero-text" style={{ 
          color: 'var(--color-mocha)', 
          margin: '1.5rem 0', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Background Text Shadow Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ delay: 1.5 }}
            style={{
              position: 'absolute',
              fontSize: 'clamp(4rem, 10vw, 10rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'bold',
              color: 'var(--color-mocha)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(1.2)',
              zIndex: -1,
              pointerEvents: 'none'
            }}
          >
            FILM FRAME
          </motion.div>

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
                        color: 'var(--color-caramel)',
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
                        color: 'var(--color-caramel)',
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

        {/* Tagline with Typewriter Effect */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)',
            color: 'var(--color-coffee)',
            maxWidth: '600px',
            margin: '2rem auto 0',
            lineHeight: 1.6
          }}
        >
          Where <motion.span 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'var(--color-caramel)', fontWeight: '600' }}
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
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(75,46,43,0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{
              background: 'var(--color-mocha)',
              color: 'var(--color-beige)',
              fontSize: '1rem',
              padding: '1.2rem 2.5rem'
            }}
          >
            Explore Talent <ArrowRight size={20} />
          </motion.button>
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              borderColor: 'var(--color-mocha)',
              background: 'var(--color-mocha)',
              color: 'var(--color-beige)'
            }}
            whileTap={{ scale: 0.95 }}
            className="btn"
            style={{
              fontSize: '1rem',
              padding: '1.2rem 2.5rem'
            }}
          >
            Join as Photographer
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: '8vh',
          left: '50%',
          x: '-50%',
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--color-mocha)',
            fontFamily: 'var(--font-body)'
          }}
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ 
            scaleY: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={32} strokeWidth={1} color="var(--color-mocha)" />
        </motion.div>
      </motion.div>
    </header>
  );
};

export default Hero2;
