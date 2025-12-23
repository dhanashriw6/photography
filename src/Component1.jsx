import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, useAnimationFrame } from 'framer-motion';
import { Camera, ArrowRight, ArrowDown, Star, Search, UserCheck, Calendar, Award, Users, TrendingUp, MessageCircle, Check, Sparkles, Zap, Shield } from 'lucide-react';
import './App.css';

const Navigation = () => (
  <nav style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
    mixBlendMode: 'difference',
    color: 'var(--color-beige)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Camera size={24} />
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 'bold' }}>Film Frame Studio</span>
    </div>
    <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Photographers</a>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Stories</a>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Login</a>
    </div>
  </nav>
);

const Hero = () => {
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
            Join as Creator
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

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    
    React.useEffect(() => {
      const updateMousePosition = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', updateMousePosition);
      return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);
  
    return (
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-white)',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 9999
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
    );
};

// Scroll Progress Indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'var(--color-caramel)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 100
      }}
    />
  );
};

const MarqueeStrip = () => {
    return (
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="marquee-item">Cinematic</span>
          <span className="marquee-item">editorial</span>
          <span className="marquee-item">Portrait</span>
          <span className="marquee-item">Film</span>
          <span className="marquee-item">Art</span>
          <span className="marquee-item">Cinematic</span>
          <span className="marquee-item">editorial</span>
          <span className="marquee-item">Portrait</span>
          <span className="marquee-item">Film</span>
          <span className="marquee-item">Art</span>
        </div>
        <div className="marquee-content" aria-hidden="true">
          <span className="marquee-item">Cinematic</span>
          <span className="marquee-item">editorial</span>
          <span className="marquee-item">Portrait</span>
          <span className="marquee-item">Film</span>
          <span className="marquee-item">Art</span>
          <span className="marquee-item">Cinematic</span>
          <span className="marquee-item">editorial</span>
          <span className="marquee-item">Portrait</span>
          <span className="marquee-item">Film</span>
          <span className="marquee-item">Art</span>
        </div>
      </div>
    )
}

const UserPaths = () => {
  return (
    <section style={{ padding: '8rem 2rem', background: 'var(--color-mocha)', color: 'var(--color-beige)', position: 'relative', overflow: 'hidden' }}>
      {/* Floating Particles */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(193,154,107,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }}
      />
      <motion.div
        animate={{ 
          y: [0, 40, 0],
          x: [0, -30, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(193,154,107,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(50px)'
        }}
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              color: 'var(--color-caramel)', 
              fontFamily: 'var(--font-body)', 
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em'
            }}
          >
            Two Paths, One Platform
          </motion.span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: '1rem' }}>
            Choose Your Journey
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          
          {/* Customer Path */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ 
              y: -10,
              boxShadow: '0 20px 60px rgba(193,154,107,0.3)',
              borderColor: 'var(--color-caramel)'
            }}
            style={{ 
              padding: '3rem', 
              border: '1px solid rgba(245, 239, 230, 0.2)', 
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)',
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            className="card-hover"
          >
            <motion.div 
              style={{ marginBottom: '2rem' }}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Search size={48} color="var(--color-caramel)" />
            </motion.div>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Hire a Photographer</h3>
            <p style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: '2rem', opacity: 0.8 }}>
              Find the perfect artist for your vision. Search by style, location, and budget. Transparent pricing and secure booking.
            </p>
            <motion.a 
              href="#" 
              className="btn btn-primary" 
              style={{ borderColor: 'var(--color-beige)', color: 'var(--color-beige)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 5px 20px rgba(193,154,107,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Find Talent <ArrowRight size={18} />
            </motion.a>
          </motion.div>

          {/* Creator Path */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ 
              y: -10,
              boxShadow: '0 20px 60px rgba(193,154,107,0.3)',
              borderColor: 'var(--color-caramel)'
            }}
            style={{ 
              padding: '3rem', 
              border: '1px solid rgba(245, 239, 230, 0.2)', 
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            className="card-hover"
          >
            <motion.div 
              style={{ marginBottom: '2rem' }}
              whileHover={{ scale: 1.2, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Camera size={48} color="var(--color-caramel)" />
            </motion.div>
            <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Join as Creator</h3>
            <p style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: '2rem', opacity: 0.8 }}>
              Showcase your portfolio, manage bookings, and grow your business. We handle the logistics so you can focus on art.
            </p>
            <motion.a 
              href="#" 
              className="btn btn-primary" 
              style={{ borderColor: 'var(--color-beige)', color: 'var(--color-beige)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 5px 20px rgba(193,154,107,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating <ArrowRight size={18} />
            </motion.a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const Features = () => {
    const steps = [
        { icon: <Search />, title: "Discover", desc: "Browse portfolios" },
        { icon: <Calendar />, title: "Book", desc: "Seamless scheduling" },
        { icon: <UserCheck />, title: "Connect", desc: "Verified artists" },
        { icon: <Star />, title: "Review", desc: "Share experience" },
      ];
    
      return (
        <section style={{ padding: '8rem 2rem', background: 'var(--color-beige)' }}>
          <div className="container">
            <div style={{ borderTop: '1px solid var(--color-mocha)', padding: '2rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: '1 1 300px' }}>
                    <h2 style={{ fontSize: '3rem', maxWidth: '400px' }}>The Innovative Process</h2>
                </div>
                <div style={{ flex: '2 1 600px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {steps.map((step, index) => (
                        <div key={index}>
                            <motion.div 
                                style={{ marginBottom: '1rem', color: 'var(--color-mocha)' }}
                                whileHover={{ rotate: 15, scale: 1.1 }}
                            >
                                {React.cloneElement(step.icon, { size: 40 })}
                            </motion.div>
                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{step.title}</h4>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </section>
      );
}

const ImageGallery = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: targetRef });
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]); 
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

    const images = [
      { id: 1, url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80", title: "Cinematic Portraits", year: "2024" },
      { id: 2, url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", title: "Wedding Stories", year: "2023" },
      { id: 3, url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", title: "Fashion Editorials", year: "2024" },
      { id: 4, url: "https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80", title: "Commercial Shoots", year: "2023" },
      { id: 5, url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", title: "Artistic Vision", year: "2024" },
    ];
  
    return (
      <section ref={targetRef} style={{ height: '300vh', position: 'relative' }}>
        <motion.div style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-black)',
          scale
        }}>
          <motion.div style={{ 
            display: 'flex', 
            gap: '0', 
            height: '100%',
            x 
          }}>
            <div style={{ 
              minWidth: '100vw', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              padding: '0 6rem',
              borderRight: '1px solid rgba(255,255,255,0.1)'
            }}>
               <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 style={{ color: 'var(--color-caramel)', fontFamily: 'var(--font-body)', fontSize: '1.2rem', marginBottom: '2rem', display: 'block' }}
               >
                 (01) — Portfolio
               </motion.span>
               <h2 style={{ fontSize: 'clamp(4rem, 8vw, 8rem)', color: 'var(--color-beige)', lineHeight: 0.9, marginBottom: '2rem' }}>
                 Visual<br/>Stories
               </h2>
               <p style={{ color: 'rgba(245, 239, 230, 0.6)', fontFamily: 'var(--font-body)', maxWidth: '400px' }}>
                 A curated collection of moments captured in time. Scroll to explore the depth of our artists' vision.
               </p>
            </div>
            {images.map((img, index) => (
                <motion.div 
                  key={img.id} 
                  style={{ 
                    position: 'relative', 
                    minWidth: '60vw', 
                    height: '100%',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden'
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <motion.img 
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      src={img.url} 
                      alt={img.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        filter: 'grayscale(20%)',
                      }} 
                    />
                  </div>
                  <motion.div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '0', 
                      left: 0, 
                      padding: '2rem',
                      background: 'linear-gradient(transparent, black)',
                      width: '100%'
                    }}
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      style={{ 
                        color: 'var(--color-caramel)', 
                        fontSize: '0.9rem', 
                        border: '1px solid var(--color-caramel)', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '50px',
                        display: 'inline-block'
                      }}
                    >
                      {img.year}
                    </motion.span>
                    <p style={{ color: 'var(--color-beige)', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontStyle: 'italic', marginTop: '1rem' }}>{img.title}</p>
                  </motion.div>
                </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    )
}

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Stats Section with Animated Numbers
const StatsCounter = () => {
  const stats = [
    { icon: <Users size={40} />, value: 500, suffix: "+", label: "Verified Artists" },
    { icon: <Award size={40} />, value: 2000, suffix: "+", label: "Projects Completed" },
    { icon: <TrendingUp size={40} />, value: 98, suffix: "%", label: "Client Satisfaction" },
    { icon: <Star size={40} />, value: 4.9, suffix: "/5", label: "Average Rating" },
  ];

  return (
    <section style={{ padding: '8rem 2rem', background: 'var(--color-cream)', position: 'relative', overflow: 'hidden' }}>
      {/* Floating Background Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(193,154,107,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ 
              color: 'var(--color-caramel)', 
              fontFamily: 'var(--font-body)', 
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Sparkles size={20} /> Our Impact
          </motion.span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: '1rem', color: 'var(--color-mocha)' }}>
            Numbers That Speak
          </h2>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem' 
        }}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                style={{ 
                  color: 'var(--color-caramel)', 
                  marginBottom: '1rem',
                  display: 'inline-block'
                }}
              >
                {stat.icon}
              </motion.div>
              <h3 style={{ 
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', 
                color: 'var(--color-mocha)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '0.5rem'
              }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </h3>
              <p style={{ 
                color: 'var(--color-coffee)', 
                fontSize: '1rem',
                fontFamily: 'var(--font-body)'
              }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Carousel
const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Wedding Client",
      text: "Film Frame Studio connected us with an incredible photographer who captured our special day perfectly. The platform made everything seamless!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80"
    },
    {
      name: "James Rodriguez",
      role: "Fashion Photographer",
      text: "As a creator, this platform has transformed my business. The booking system is intuitive and I've tripled my client base in 6 months.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
    },
    {
      name: "Emily Chen",
      role: "Brand Manager",
      text: "We've hired multiple photographers through Film Frame for our campaigns. The quality and professionalism are consistently outstanding.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80"
    }
  ];

  return (
    <section style={{ padding: '8rem 2rem', background: 'var(--color-mocha)', color: 'var(--color-beige)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ 
              color: 'var(--color-caramel)', 
              fontFamily: 'var(--font-body)', 
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <MessageCircle size={20} /> Testimonials
          </motion.span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: '1rem' }}>
            What People Say
          </h2>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '2.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(245, 239, 230, 0.1)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + i * 0.1 }}
                  >
                    <Star size={20} fill="var(--color-caramel)" color="var(--color-caramel)" />
                  </motion.div>
                ))}
              </div>
              <p style={{ 
                fontFamily: 'var(--font-body)', 
                lineHeight: 1.8, 
                marginBottom: '2rem',
                fontSize: '1.05rem'
              }}>
                "{testimonial.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src={testimonial.image} 
                  alt={testimonial.name}
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--color-caramel)'
                  }}
                />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
                    {testimonial.name}
                  </h4>
                  <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Plans with 3D Tilt Effect
const PricingPlans = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/session",
      features: ["1 Hour Session", "20 Edited Photos", "Online Gallery", "Basic Retouching"],
      icon: <Zap size={32} />,
      popular: false
    },
    {
      name: "Professional",
      price: "$199",
      period: "/session",
      features: ["4 Hour Session", "100 Edited Photos", "Premium Gallery", "Advanced Retouching", "Print Rights", "Rush Delivery"],
      icon: <Award size={32} />,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited Sessions", "Unlimited Photos", "Dedicated Manager", "Full Rights", "Priority Support", "Custom Branding"],
      icon: <Shield size={32} />,
      popular: false
    }
  ];

  return (
    <section style={{ padding: '8rem 2rem', background: 'var(--color-beige)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.span 
            style={{ 
              color: 'var(--color-caramel)', 
              fontFamily: 'var(--font-body)', 
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em'
            }}
          >
            Pricing
          </motion.span>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginTop: '1rem', color: 'var(--color-mocha)' }}>
            Choose Your Plan
          </h2>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -15,
                rotateY: 5,
                rotateX: 5,
                scale: 1.03
              }}
              style={{
                background: plan.popular ? 'var(--color-mocha)' : 'white',
                color: plan.popular ? 'var(--color-beige)' : 'var(--color-mocha)',
                padding: '3rem 2rem',
                borderRadius: '20px',
                border: plan.popular ? '2px solid var(--color-caramel)' : '1px solid rgba(75, 46, 43, 0.1)',
                position: 'relative',
                transformStyle: 'preserve-3d',
                boxShadow: plan.popular ? '0 20px 60px rgba(75, 46, 43, 0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '20px',
                    background: 'var(--color-caramel)',
                    color: 'var(--color-mocha)',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  Popular
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6 }}
                style={{ 
                  color: plan.popular ? 'var(--color-caramel)' : 'var(--color-mocha)',
                  marginBottom: '1.5rem'
                }}
              >
                {plan.icon}
              </motion.div>

              <h3 style={{ 
                fontSize: '1.8rem', 
                fontFamily: 'var(--font-heading)',
                marginBottom: '1rem'
              }}>
                {plan.name}
              </h3>

              <div style={{ marginBottom: '2rem' }}>
                <span style={{ 
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', 
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 'bold'
                }}>
                  {plan.price}
                </span>
                <span style={{ opacity: 0.7 }}>{plan.period}</span>
              </div>

              <ul style={{ 
                listStyle: 'none', 
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.75rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem'
                    }}
                  >
                    <Check size={18} color={plan.popular ? 'var(--color-caramel)' : 'var(--color-mocha)'} />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: plan.popular ? 'var(--color-caramel)' : 'var(--color-mocha)',
                  color: plan.popular ? 'var(--color-mocha)' : 'var(--color-beige)',
                  borderColor: plan.popular ? 'var(--color-caramel)' : 'var(--color-mocha)'
                }}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Section with Accordion Animation
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a photographer?",
      answer: "Simply browse our curated portfolio of verified photographers, filter by style and location, and book directly through our platform. You'll receive instant confirmation and can communicate with your photographer through our messaging system."
    },
    {
      question: "What's included in the booking fee?",
      answer: "Our booking fee covers platform access, secure payment processing, booking management, and customer support. The photographer's rate is separate and clearly displayed on their profile."
    },
    {
      question: "Can I cancel or reschedule?",
      answer: "Yes! We offer flexible cancellation policies. Free cancellation up to 48 hours before your session. Rescheduling is always free and can be done through your dashboard."
    },
    {
      question: "How do photographers get verified?",
      answer: "All photographers go through a rigorous verification process including portfolio review, background checks, and client reference verification to ensure quality and professionalism."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are securely processed and protected by our buyer guarantee."
    }
  ];

  return (
    <section style={{ padding: '8rem 2rem', background: 'var(--color-cream)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-mocha)' }}>
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(75, 46, 43, 0.1)'
              }}
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                whileHover={{ backgroundColor: 'rgba(193,154,107,0.05)' }}
                style={{
                  width: '100%',
                  padding: '1.5rem 2rem',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  color: 'var(--color-mocha)',
                  textAlign: 'left'
                }}
              >
                {faq.question}
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowDown size={24} />
                </motion.div>
              </motion.button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ 
                  padding: '0 2rem 2rem 2rem',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.8,
                  color: 'var(--color-coffee)'
                }}>
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section with Magnetic Button
const CTASection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <section style={{ 
      padding: '10rem 2rem', 
      background: 'var(--color-black)',
      color: 'var(--color-beige)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(193,154,107,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(193,154,107,0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(193,154,107,0.15) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            style={{ 
              fontSize: 'clamp(3rem, 7vw, 6rem)', 
              lineHeight: 1.1,
              marginBottom: '2rem',
              fontFamily: 'var(--font-heading)'
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Create<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--color-caramel)' }}>Something Beautiful?</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ 
              fontSize: '1.2rem', 
              marginBottom: '3rem',
              fontFamily: 'var(--font-body)',
              maxWidth: '600px',
              margin: '0 auto 3rem'
            }}
          >
            Join thousands of clients and creators who trust Film Frame Studio for exceptional photography experiences.
          </motion.p>

          <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block' }}
          >
            <motion.button
              ref={buttonRef}
              animate={{ x: mousePosition.x, y: mousePosition.y }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn"
              style={{
                padding: '1.5rem 4rem',
                fontSize: '1.1rem',
                background: 'var(--color-caramel)',
                color: 'var(--color-mocha)',
                borderColor: 'var(--color-caramel)',
                fontWeight: 'bold',
                boxShadow: '0 10px 40px rgba(193,154,107,0.3)'
              }}
            >
              Get Started Now <ArrowRight />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="App">
      <ScrollProgress />
      <CustomCursor />
      <div className="grain-overlay" />
      <Navigation />
      <Hero />
      <MarqueeStrip />
      <ImageGallery />
      <div style={{ padding: '0 0' }}>
          <UserPaths />
      </div>
      <StatsCounter />
      <Features />
      <Testimonials />
      <PricingPlans />
      <FAQ />
      <CTASection />
      <footer style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        background: 'var(--color-black)', 
        color: 'var(--color-beige)' 
      }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>Film Frame Studio</p>
        <p style={{ marginTop: '1rem', opacity: 0.5, fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>&copy; 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;
