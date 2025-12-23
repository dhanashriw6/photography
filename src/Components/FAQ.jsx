import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, Sparkles } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

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
      padding: '10rem 2rem', 
      background: 'linear-gradient(135deg, var(--color-mocha) 0%, #5a3a2f 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(245,239,230,0.05) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        opacity: 0.3
      }} />

      {/* Floating Orbs */}
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
          left: '5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(193,154,107,0.2) 0%, transparent 70%)',
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
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(193,154,107,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(120px)'
        }}
      />

      <div className="container" style={{ maxWidth: '1400px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: 'rgba(193,154,107,0.15)',
              borderRadius: '50px',
              marginBottom: '2rem',
              border: '1px solid rgba(193,154,107,0.3)'
            }}
          >
            <span style={{
              color: 'var(--color-caramel)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: '600'
            }}>
              Got Questions?
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ 
              fontSize: 'clamp(3rem, 6vw, 5rem)', 
              color: 'var(--color-beige)',
              marginBottom: '1.5rem',
              lineHeight: 1.1
            }}
          >
            We Have <span style={{ fontStyle: 'italic', color: 'var(--color-caramel)' }}>Answers</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '1.2rem',
              color: 'var(--color-beige)',
              maxWidth: '700px',
              margin: '0 auto'
            }}
          >
            Everything you need to know to get started with Film Frame Studio
          </motion.p>
        </motion.div>

        {/* Split Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '4rem',
          alignItems: 'start'
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
                      padding: '2rem',
                      background: isOpen 
                        ? 'linear-gradient(135deg, rgba(193,154,107,0.2), rgba(193,154,107,0.1))' 
                        : 'rgba(255,255,255,0.03)',
                      border: `2px solid ${isOpen ? 'var(--color-caramel)' : 'rgba(245,239,230,0.1)'}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem'
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
                        minWidth: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: isOpen 
                          ? 'var(--color-caramel)' 
                          : 'rgba(193,154,107,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isOpen ? 'var(--color-mocha)' : 'var(--color-caramel)'
                      }}
                    >
                      {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                    </motion.div>

                    {/* Question Text */}
                    <div style={{ flex: 1 }}>
                      <motion.span
                        animate={{ 
                          color: isOpen ? 'var(--color-caramel)' : 'var(--color-beige)'
                        }}
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                          fontWeight: '500',
                          display: 'block'
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
                        color: isOpen ? 'var(--color-caramel)' : 'rgba(245,239,230,0.5)',
                        fontWeight: '700',
                        fontFamily: 'var(--font-heading)'
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                  </motion.button>

                  {/* Active Indicator */}
                  {isOpen && (
                    <motion.div
                      layoutId="activeIndicator"
                      style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '50%',
                        width: '4px',
                        height: '60%',
                        background: 'var(--color-caramel)',
                        borderRadius: '4px',
                        transform: 'translateY(-50%)'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
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
              padding: '4rem',
              border: '1px solid rgba(193,154,107,0.2)',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop:"5rem"
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
                    fontSize: '8rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 'bold',
                    color: 'rgba(193,154,107,0.15)',
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
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    color: 'var(--color-beige)',
                    marginBottom: '2rem',
                    fontFamily: 'var(--font-heading)',
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
                    fontSize: '1.15rem',
                    lineHeight: 1.8,
                    color: 'var(--color-beige)',
                    fontFamily: 'var(--font-body)'
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
                    background: 'linear-gradient(90deg, var(--color-caramel), transparent)',
                    marginTop: '2rem',
                    borderRadius: '2px'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '8rem',
            textAlign: 'center',
            padding: '4rem',
            background: 'rgba(193,154,107,0.1)',
            borderRadius: '30px',
            border: '1px solid rgba(193,154,107,0.2)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <h3 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-beige)',
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)'
          }}>
            Still Need Help?
          </h3>
          <p style={{
            color: 'var(--color-beige)',
            opacity: 0.8,
            marginBottom: '2.5rem',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}>
            Our dedicated support team is available 24/7 to assist you
          </p>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 60px rgba(193,154,107,0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            className="btn"
            style={{
              background: 'var(--color-caramel)',
              color: 'var(--color-mocha)',
              borderColor: 'var(--color-caramel)',
              padding: '1.3rem 3rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '50px'
            }}
          >
            Contact Support Team
          </motion.button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default FAQ;