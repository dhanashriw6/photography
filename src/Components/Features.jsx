import React from "react";
import { motion } from "framer-motion";
import { Search, Calendar, UserCheck, Star, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    desc: "Explore curated photographer portfolios",
  },
  {
    icon: Calendar,
    title: "Book",
    desc: "Instant scheduling with live availability",
  },
  {
    icon: UserCheck,
    title: "Connect",
    desc: "Work only with verified professionals",
  },
  {
    icon: Star,
    title: "Review",
    desc: "Share your experience & build trust",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const Features = () => {
    const steps = [
        { icon: <Search />, title: "Discover", desc: "Explore curated portfolios tailored to your vision" },
        { icon: <Calendar />, title: "Book", desc: "Instant scheduling with real-time availability" },
        { icon: <UserCheck />, title: "Connect", desc: "Collaborate with verified creative professionals" },
        { icon: <Star />, title: "Review", desc: "Share your experience and inspire others" },
      ];
    
      return (
        <section style={{ 
          padding: '12rem 2rem', 
          background: 'linear-gradient(180deg, var(--color-cream) 0%, var(--color-beige) 100%)',
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          {/* Animated Background Orbs */}
          <motion.div
            animate={{ 
              y: [0, -50, 0],
              x: [0, 30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '5%',
              right: '10%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(193,154,107,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              filter: 'blur(80px)'
            }}
          />
          <motion.div
            animate={{ 
              y: [0, 40, 0],
              x: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(75,46,43,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
              filter: 'blur(70px)'
            }}
          />

          <div className="container">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', marginBottom: '6rem', position: 'relative' }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '80px' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  height: '3px',
                  background: 'var(--color-caramel)',
                  margin: '0 auto 2rem',
                  borderRadius: '2px'
                }}
              />
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.7, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ 
                  color: 'var(--color-caramel)', 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  display: 'block',
                  marginBottom: '1.5rem'
                }}
              >
                How It Works
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{ 
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
                  color: 'var(--color-mocha)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '1rem'
                }}
              >
                Your Journey to Perfect Imagery
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--color-coffee)',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                Four simple steps to bring your creative vision to life
              </motion.p>
            </motion.div>

            {/* Cards Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '2rem',
              position: 'relative'
            }}>
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 80, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    y: -15,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '3rem 2rem',
                    border: '1px solid rgba(193,154,107,0.2)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Number Badge - Large Background */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.05 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      fontSize: '12rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'bold',
                      color: 'var(--color-mocha)',
                      lineHeight: 1,
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon Container */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.2 + 0.2,
                      duration: 0.8,
                      type: 'spring',
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, var(--color-caramel), var(--color-mocha))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '2rem',
                      boxShadow: '0 10px 30px rgba(193,154,107,0.3)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 rgba(193,154,107,0.4)',
                          '0 0 0 20px rgba(193,154,107,0)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '20px'
                      }}
                    />
                    {React.cloneElement(step.icon, { 
                      size: 36, 
                      color: 'var(--color-beige)',
                      strokeWidth: 2
                    })}
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    <h3 style={{ 
                      fontFamily: 'var(--font-heading)', 
                      fontSize: '1.8rem', 
                      marginBottom: '1rem',
                      color: 'var(--color-mocha)'
                    }}>
                      {step.title}
                    </h3>
                    <p style={{ 
                      fontSize: '1rem', 
                      lineHeight: 1.7,
                      color: 'var(--color-coffee)',
                      opacity: 0.8
                    }}>
                      {step.desc}
                    </p>
                  </motion.div>

                  {/* Step Number Badge - Small */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, type: 'spring' }}
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--color-caramel)',
                      color: 'var(--color-beige)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      zIndex: 2,
                      boxShadow: '0 4px 15px rgba(193,154,107,0.4)'
                    }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Hover Gradient Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(193,154,107,0.1), transparent)',
                      borderRadius: '24px',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ 
                textAlign: 'center', 
                marginTop: '5rem' 
              }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 50px rgba(75,46,43,0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                style={{
                  background: 'var(--color-mocha)',
                  color: 'var(--color-beige)',
                  fontSize: '1.1rem',
                  padding: '1.3rem 3rem',
                  borderRadius: '50px'
                }}
              >
                Start Your Journey <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        </section>
      );
}

export default Features;
