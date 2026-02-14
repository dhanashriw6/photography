import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';
import SectionSeparator from './SectionSeparator';
import { AnimatedText } from './AnimatedTest';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const faqs = [
    {
      question: "How do I book a photographer?",
      answer: "Simply browse our curated portfolio of verified photographers, filter by style and location, and book directly through our platform. You'll receive instant confirmation and can communicate with your photographer through our messaging system.",
      icon: <HelpCircle size={24} />
    },
    {
      question: "What's included in the booking fee?",
      answer: "Our booking fee covers platform access, secure payment processing, booking management, and customer support. The photographer's rate is separate and clearly displayed on their profile.",
      icon: <Sparkles size={24} />
    },
    {
      question: "Can I cancel or reschedule?",
      answer: "Yes! We offer flexible cancellation policies. Free cancellation up to 48 hours before your session. Rescheduling is always free and can be done through your dashboard.",
      icon: <MessageCircle size={24} />
    },
    {
      question: "How do photographers get verified?",
      answer: "All photographers go through a rigorous verification process including portfolio review, background checks, and client reference verification to ensure quality and professionalism.",
      icon: <HelpCircle size={24} />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are securely processed and protected by our buyer guarantee.",
      icon: <Sparkles size={24} />
    }
  ];

  return (
    <section style={{
      padding: isMobile ? '4rem 1.5rem' : isTablet ? '6rem 2rem' : '10rem 2rem',
      background: 'linear-gradient(135deg, var(--color-dark-slate-gray) 0%, #1a1816 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SectionSeparator flip={true} fill="#FEEFA3" />

      {/* Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(247,244,233,0.05) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        opacity: 0.3
      }} />

      {/* Floating Orbs - Responsive sizing */}
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 40, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '10%',
          left: isMobile ? '-10%' : '5%',
          width: isMobile ? '250px' : '400px',
          height: isMobile ? '250px' : '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 174, 0, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(100px)'
        }}
      />
      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -30, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: 'absolute',
          bottom: '5%',
          right: isMobile ? '-10%' : '10%',
          width: isMobile ? '300px' : '500px',
          height: isMobile ? '300px' : '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 174, 0, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(120px)'
        }}
      />

      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative', 
        zIndex: 1,
        padding: isMobile ? '0' : '0 2rem',
        width: '100%'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '3rem' : isTablet ? '4rem' : '6rem' 
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
              marginBottom: isMobile ? '1.5rem' : '2rem',
              padding: isMobile ? '0.4rem 1rem' : '0.5rem 1.25rem',
              background: 'rgba(255, 226, 79, 0.25)',
              borderRadius: '100px',
              border: '1px solid rgba(255, 226, 79, 0.4)',
              color: '#FFE24F',
              boxShadow: '0 0 20px rgba(255, 226, 79, 0.35)'
            }}
          >
            <span style={{
              color: 'var(--color-khaki)',
              fontSize: isMobile ? '0.75rem' : '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: '600'
            }}>
              Got Questions?
            </span>
          </motion.div>

          <h2 style={{
            fontSize: isMobile 
              ? 'clamp(2.5rem, 10vw, 4rem)' 
              : isTablet 
                ? 'clamp(4rem, 10vw, 6rem)' 
                : 'clamp(4rem, 8vw, 9rem)',
            color: 'var(--color-khaki)',
            marginBottom: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            perspective: '1000px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            whiteSpace: isMobile || isTablet ? 'normal' : 'nowrap',
            overflow: 'visible',
            display: 'block',
            width: '100%'
          }}>
            {isMobile ? (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ display: 'block' }}
              >
                We Have Answers
              </motion.span>
            ) : (
              <AnimatedText text="We Have Answers" delay={0.2} display="block" />
            )}
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: isMobile ? '1rem' : '1.2rem',
              color: 'var(--color-old-lace)',
              maxWidth: isMobile ? '100%' : '700px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Everything you need to know to get started with Film Frame Studio
          </motion.p>
        </motion.div>

        {/* Layout - Stack on mobile/tablet, split on desktop */}
        {isMobile || isTablet ? (
          // Mobile/Tablet: Single column accordion
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? '1rem' : '1.5rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: isOpen
                      ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.4), rgba(26, 26, 26, 0.2))'
                      : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${isOpen ? 'var(--color-khaki)' : 'rgba(247, 244, 233, 0.1)'}`,
                    borderRadius: isMobile ? '16px' : '20px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.4s ease'
                  }}
                >
                  {/* Question Button */}
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '1.25rem' : '1.5rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: isMobile ? '0.75rem' : '1rem'
                    }}
                  >
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isOpen ? 1.1 : 1,
                        rotate: isOpen ? 180 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        minWidth: isMobile ? '40px' : '45px',
                        height: isMobile ? '40px' : '45px',
                        borderRadius: '50%',
                        background: isOpen
                          ? 'var(--color-khaki)'
                          : 'rgba(255, 174, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? 'var(--color-black)' : 'var(--color-khaki)',
                        flexShrink: 0
                      }}
                    >
                      {isOpen ? <Minus size={isMobile ? 18 : 20} /> : <Plus size={isMobile ? 18 : 20} />}
                    </motion.div>

                    {/* Question Text */}
                    <div style={{ flex: 1 }}>
                      <motion.span
                        animate={{
                          color: isOpen ? 'var(--color-khaki)' : 'var(--color-old-lace)'
                        }}
                        style={{
                          fontSize: isMobile ? 'clamp(0.95rem, 4vw, 1.1rem)' : 'clamp(1.1rem, 2vw, 1.3rem)',
                          fontWeight: isOpen ? '700' : '500',
                          display: 'block',
                          fontFamily: "Oswald",
                          lineHeight: 1.3
                        }}
                      >
                        {faq.question}
                      </motion.span>
                    </div>

                    {/* Number Badge */}
                    <motion.div
                      animate={{
                        scale: isOpen ? 1.15 : 1,
                        opacity: isOpen ? 1 : 0.5
                      }}
                      style={{
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        color: isOpen ? 'var(--color-khaki)' : 'rgba(247, 244, 233, 0.5)',
                        fontWeight: '700',
                        fontFamily: "Oswald",
                        flexShrink: 0
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                  </button>

                  {/* Answer - Expandable */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: isMobile ? '1rem 1.25rem 1.5rem' : '1.5rem 1.5rem 2rem',
                          paddingLeft: isMobile ? '4.5rem' : '5rem'
                        }}>
                          <p style={{
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            lineHeight: 1.7,
                            color: 'var(--color-old-lace)',
                            opacity: 0.9,
                            fontFamily: "Oswald",
                            margin: 0
                          }}>
                            {faq.answer}
                          </p>

                          {/* Decorative line */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '60px' }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            style={{
                              height: '2px',
                              background: 'linear-gradient(90deg, var(--color-khaki), transparent)',
                              marginTop: '1rem',
                              borderRadius: '2px'
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Desktop: Split layout with sticky answer panel
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
            maxWidth: '100%'
          }}>
            {/* Left Side - Questions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    style={{ position: 'relative' }}
                  >
                    <motion.button
                      onClick={() => setOpenIndex(index)}
                      whileHover={{ x: 10 }}
                      style={{
                        width: '100%',
                        padding: '1.75rem',
                        background: isOpen
                          ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.3), rgba(26, 26, 26, 0.1))'
                          : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${isOpen ? 'var(--color-khaki)' : 'rgba(247, 244, 233, 0.1)'}`,
                        borderRadius: '20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.25rem'
                      }}
                    >
                      {/* Icon */}
                      <motion.div
                        animate={{
                          scale: isOpen ? 1.1 : 1,
                          rotate: isOpen ? 360 : 0
                        }}
                        transition={{ duration: 0.5 }}
                        style={{
                          minWidth: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: isOpen
                            ? 'var(--color-khaki)'
                            : 'rgba(255, 174, 0, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOpen ? 'var(--color-black)' : 'var(--color-khaki)',
                          flexShrink: 0
                        }}
                      >
                        {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                      </motion.div>

                      {/* Question Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <motion.span
                          animate={{
                            color: isOpen ? 'var(--color-khaki)' : 'var(--color-old-lace)'
                          }}
                          style={{
                            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                            fontWeight: isOpen ? '700' : '500',
                            display: 'block',
                            fontFamily: "Oswald",
                            lineHeight: 1.3
                          }}
                        >
                          {faq.question}
                        </motion.span>
                      </div>

                      {/* Number Badge */}
                      <motion.div
                        animate={{
                          scale: isOpen ? 1.2 : 1,
                          opacity: isOpen ? 1 : 0.5
                        }}
                        style={{
                          fontSize: '0.85rem',
                          color: isOpen ? 'var(--color-khaki)' : 'rgba(247, 244, 233, 0.5)',
                          fontWeight: '700',
                          fontFamily: "Oswald",
                          flexShrink: 0
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </motion.div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side - Answer Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{
                position: 'sticky',
                top: '100px',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(30px)',
                borderRadius: '30px',
                padding: 'clamp(2.5rem, 4vw, 4rem)',
                border: '1px solid rgba(255, 174, 0, 0.2)',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={openIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Large Number */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    style={{
                      fontSize: 'clamp(5rem, 10vw, 8rem)',
                      fontFamily: "Oswald",
                      fontWeight: 'bold',
                      color: 'var(--color-khaki)',
                      lineHeight: 1,
                      marginBottom: '2rem'
                    }}
                  >
                    {String(openIndex + 1).padStart(2, '0')}
                  </motion.div>

                  {/* Answer Title */}
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                      color: 'var(--color-old-lace)',
                      marginBottom: '1.5rem',
                      fontFamily: "Oswald",
                      lineHeight: 1.3
                    }}
                  >
                    {faqs[openIndex].question}
                  </motion.h3>

                  {/* Answer Text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                      lineHeight: 1.8,
                      color: 'var(--color-old-lace)',
                      fontFamily: "Oswald",
                    }}
                  >
                    {faqs[openIndex].answer}
                  </motion.p>

                  {/* Decorative Element */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100px' }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    style={{
                      height: '3px',
                      background: 'linear-gradient(90deg, var(--color-khaki), transparent)',
                      marginTop: '2rem',
                      borderRadius: '2px'
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;