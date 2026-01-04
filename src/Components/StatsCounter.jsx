import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const StatCard = ({ value, suffix, label, image, index }) => {
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
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        minWidth: '300px',
        height: '180px',
        cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
      }}
    >
      {/* Background Image */}
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

      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Number */}
        <div>
          <h3 style={{
            fontSize: '3.5rem',
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
              fontSize: '2.5rem',
              color: 'var(--color-orange)',
              fontWeight: 'bold'
            }}>
              {suffix}
            </span>
          </h3>
        </div>

        {/* Label */}
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.95rem',
          margin: 0,
          fontWeight: 500,
          letterSpacing: '0.02em'
        }}>
          {label}
        </p>
      </div>

      {/* Hover effect styles */}
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
  const stats = [
    {
      value: 1200,
      suffix: '+',
      label: 'Shoots Completed',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80' // Camera/photography
    },
    {
      value: 850,
      suffix: '+',
      label: 'Active Creatives',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80' // Team/people
    },
    {
      value: 45,
      suffix: '+',
      label: 'Awards Won',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80' // Trophy/awards
    },
    {
      value: 15,
      suffix: 'K+',
      label: 'Hours Recorded',
      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=80' // Film/video
    },
    
  ];

  return (
    <section style={{
      position: 'relative',
      padding: '8rem 2rem',
      background: 'var(--color-black)',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.4,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="container" style={{ 
        position: 'relative', 
        zIndex: 1, 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            textAlign: 'center', 
            marginBottom: '4rem' 
          }}
        >
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            color: 'var(--color-cream)', 
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)'
          }}>
            Our Impact in Numbers
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-cream)',
            opacity: 0.7,
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.1rem'
          }}>
            Join thousands of creatives who are already making their mark
          </p>
        </motion.div>

        {/* Stats Cards - Horizontal Scroll */}
        <div style={{
          display: 'flex',
          gap: '3.5rem',
          overflowX: 'auto',
          overflowY: 'hidden',
         
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-orange) transparent'
        }}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              image={stat.image}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .container > div:last-child::-webkit-scrollbar {
          height: 8px;
        }
        .container > div:last-child::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .container > div:last-child::-webkit-scrollbar-thumb {
          background: var(--color-orange);
          border-radius: 10px;
        }
        .container > div:last-child::-webkit-scrollbar-thumb:hover {
          background: var(--color-red);
        }

        @media (min-width: 1200px) {
          .container > div:last-child {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            overflow: visible;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsCounter;
