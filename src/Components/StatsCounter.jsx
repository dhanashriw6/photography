import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import SectionSeparator from './SectionSeparator';

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
        minWidth: '21%',
        height: '180px',
        cursor: 'pointer',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
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
        padding: '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
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

      <style>{`
        .stat-bg:hover {
          filter: brightness(0.8) saturate(1) !important;
          transform: scale(1.05);
        }
      `}</style>
    </motion.div>
  );
};

export const AnimatedText = ({ text, delay = 0 }) => {
  const characters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay
      }
    }
  };

  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
      filter: 'blur(8px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{ display: 'inline-block' }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={charVariants}
          style={{
            display: 'inline-block',
            transformOrigin: '50% 100%',
            whiteSpace: char === ' ' ? 'pre' : 'normal'
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const StatsCounter = () => {
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
      padding: '8rem 2rem',
      background: '#0a0a0a',
      overflow: 'hidden',
      minHeight: '100vh'
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
        {/* Animated Header with character-by-character reveal */}
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}
        >
          <h2 style={{
            fontSize: '150px',
            color: 'var(--color-khaki)',
            marginBottom: '1rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            perspective: '1000px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,  
          }}>
            <AnimatedText text="Our Impact in Numbers" delay={0.2} />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#f5f1e8',
              opacity: 0.7,
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Join thousands of creatives who are already making their mark
          </motion.p>

          {/* Decorative animated line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
            style={{
              height: '2px',
              width: '120px',
              background: 'linear-gradient(90deg, transparent, #ff6b35, transparent)',
              margin: '2rem auto',
              transformOrigin: 'center',
              borderRadius: '2px'
            }}
          />
        </motion.div>

        {/* Stats Cards */}
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
            />
          ))}
        </div>
      </div>

      <style>{`
        :root {
          --font-heading: system-ui, -apple-system, sans-serif;
          --font-body: system-ui, -apple-system, sans-serif;
          --color-cream: #f5f1e8;
          --color-orange: #ff6b35;
          --color-red: #d64933;
          --color-black: #0a0a0a;
        }

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