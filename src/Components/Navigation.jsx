import React, { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const menuItems = [
    { name: 'Categories', href: '#categories' },
    { name: 'StatsCounter', href: '#statsCounter' },
    { name: 'AboutUs', href: '#aboutUs' },
    { name: 'ChooseYourPath', href: '#chooseYourPath' },
    {name:"Portfolio",href:"#portfolio"},
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Process', href: '#process' },
    { name: 'Footer', href: '#footer' },
  ];

  const handleMenuItemClick = (href) => {
    setIsMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: isMobile ? '1.5rem' : '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        color: 'var(--color-beige)',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(1px)',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <Camera size={isMobile ? 20 : 24} />
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: isMobile ? '1.2rem' : '1.5rem', 
            fontWeight: 'bold' 
          }}>
            Online Photographer
          </span>
        </div>

        <motion.button
          whileHover={!isMobile ? {
            scale: 1.05,
            boxShadow: '0 0 40px rgba(255,174,0,0.6)',
            background: 'linear-gradient(135deg, #FFAE00, #FFE24F)'
          } : {}}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(true)}
          style={{
            background: '#FFAE00',
            color: '#111212',
            fontSize: isMobile ? '0.9rem' : '1rem',
            padding: isMobile ? '0.8rem 1.5rem' : '1rem 2rem',
            border: 'none',
            borderRadius: '50px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 20px rgba(255,174,0,0.3)',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          MENU
        </motion.button>
      </nav>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 99,
                backdropFilter: 'blur(1px)'
              }}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 200,
                duration: 0.5 
              }}
              style={{
                position: 'fixed',
                top: isMobile ? '1.5rem' : '2rem',
                right: isMobile ? '1.5rem' : '2rem',
                bottom: isMobile ? '1.5rem' : '2rem',
                width: isMobile ? 'calc(100% - 3rem)' : '350px',
                maxWidth: '90vw',
                background: 'var(--color-khaki',
                borderRadius: isMobile ? '32px' : '40px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden'
              }}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: isMobile ? '1.5rem' : '2rem',
                  right: isMobile ? '1.5rem' : '2rem',
                  background: 'rgba(17, 18, 18, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: isMobile ? '40px' : '50px',
                  height: isMobile ? '40px' : '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#111212',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={isMobile ? 20 : 24} strokeWidth={3} />
              </motion.button>

              {/* Decorative Element */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '-50px',
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(255,174,0,0.3) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />

              {/* Menu Items */}
              <nav style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '0.5rem' : '0.75rem',
                marginTop: isMobile ? '3rem' : '4rem',
                flex: 1,
                justifyContent: 'center'
              }}>
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuItemClick(item.href);
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                    whileHover={{ 
                      x: 10, 
                      color: '#FFf',
                      transition: { duration: 0.2 }
                    }}
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: isMobile ? 'clamp(1rem, 8vw, 1.3rem)' : 'clamp(1rem, 4vw, 1.3rem)',
                      fontWeight: '700',
                      color: '#111212',
                      textDecoration: 'none',
                      borderBottom: '2px solid rgba(17, 18, 18, 0.2)',
                      paddingBottom: isMobile ? '0.75rem' : '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'capitalize',
                      lineHeight: 1.2
                    }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>

             
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;