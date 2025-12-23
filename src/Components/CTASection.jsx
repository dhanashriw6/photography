import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

export default CTASection;
