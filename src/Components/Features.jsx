import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, UserCheck, Star } from "lucide-react";
import SectionSeparator from "./SectionSeparator";
import { AnimatedText } from "./AnimatedTest";

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
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

  const steps = [
    {
      title: "Discover",
      desc: "Explore curated portfolios tailored to your vision",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=600&fit=crop"
    },
    {
      title: "Book",
      desc: "Instant scheduling with real-time availability",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop"
    },
    {
      title: "Connect",
      desc: "Collaborate with verified creative professionals",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop"
    },
    {
      title: "Review",
      desc: "Share your experience and inspire others",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop"
    },
  ];

  return (
    <section id="process" style={{
      padding: isMobile ? '4rem 1.5rem' : isTablet ? '6rem 2rem' : '8rem 2rem',
      background: 'var(--color-pale)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SectionSeparator flip={true} fill="var(--color-black)" />
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: isMobile ? '0' : '0 1rem',
        width: '100%'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '3rem' : isTablet ? '3.5rem' : '4rem',
            position: 'relative'
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              color: 'var(--color-black)',
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '0.8rem' : '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              display: 'block',
              marginBottom: isMobile ? '1rem' : '1.5rem'
            }}
          >
            How It Works
          </motion.span>
          <h2 style={{
            fontSize: isMobile
              ? 'clamp(2rem, 8vw, 3rem)'
              : isTablet
                ? 'clamp(3rem, 8vw, 5rem)'
                : 'clamp(3.5rem, 6vw, 6rem)',
            color: 'var(--color-soft-black)',
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
                Your Journey to Perfect Imagery
              </motion.span>
            ) : (
              <AnimatedText text="Your Journey to Perfect Imagery" delay={0.2} display="block" />
            )}
          </h2>
        </motion.div>

        {/* Cards Container - Adaptive Layout */}
        {isMobile ? (
          // Mobile: Vertical Stack
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                  position: 'relative',
                  height: '400px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                }}
              >
                {/* Background Image */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${step.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.6)'
                }} />

                {/* Dark Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                }} />

                {/* Content */}
                <div style={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem 1.5rem'
                }}>
                  <h3 style={{
                    color: 'white',
                    fontFamily: "'Freckle Face'",
                    fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                    fontWeight: '700',
                    lineHeight: 1.1,
                    marginBottom: '1rem',
                    textShadow: '0 2px 20px rgba(0,0,0,0.5)'
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '0',
                    fontFamily: 'Oswald'
                  }}>
                    {step.desc}
                  </p>
                </div>

                {/* Step Number Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-khaki)',
                  color: 'var(--color-black)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 20px rgba(255,140,0,0.4)'
                }}>
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        ) : isTablet ? (
          // Tablet: 2x2 Grid
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem'
          }}>
            {steps.map((step, index) => {
              const isActive = activeIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  onClick={() => setActiveIndex(index)}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: 'relative',
                    height: '350px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: isActive
                      ? '0 20px 60px rgba(0,0,0,0.4)'
                      : '0 10px 40px rgba(0,0,0,0.3)',
                    transition: 'box-shadow 0.3s ease'
                  }}
                >
                  {/* Background Image */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${step.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: isActive ? 'brightness(0.7)' : 'brightness(0.5)'
                    }}
                  />

                  {/* Dark Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                      : 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
                    transition: 'background 0.3s ease'
                  }} />

                  {/* Content */}
                  <div style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem'
                  }}>
                    <h3 style={{
                      color: 'white',
                      fontFamily: isActive ? "'Freckle Face'" : "'Oswald', sans-serif",
                      fontSize: isActive ? '3rem' : '1.8rem',
                      fontWeight: isActive ? '700' : '600',
                      lineHeight: 1.1,
                      marginBottom: isActive ? '1rem' : '0.5rem',
                      textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                      textTransform: isActive ? 'none' : 'uppercase',
                      transition: 'all 0.3s ease'
                    }}>
                      {step.title}
                    </h3>

                    <motion.p
                      animate={{
                        opacity: isActive ? 1 : 0,
                        height: isActive ? 'auto' : 0
                      }}
                      style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.9)',
                        fontFamily: 'Oswald',
                        overflow: 'hidden'
                      }}
                    >
                      {step.desc}
                    </motion.p>
                  </div>

                  {/* Step Number Badge */}
                  <motion.div
                    animate={{
                      opacity: isActive ? 0 : 1
                    }}
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'var(--color-khaki)',
                      color: 'var(--color-black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 'bold',
                      fontSize: '1.3rem',
                      boxShadow: '0 4px 20px rgba(255,140,0,0.4)',
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    {index + 1}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Desktop: Horizontal Accordion - FIXED FOR RESPONSIVENESS
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            position: 'relative',
            height: 'clamp(450px, 50vh, 550px)',
            alignItems: 'center',
            width: '100%'
          }}>
            {steps.map((step, index) => {
              const isHovered = hoveredIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    flex: isHovered ? 2.5 : (isAnyHovered ? 0.5 : 1),
                    opacity: isAnyHovered ? (isHovered ? 1 : 0.4) : 1,
                  }}
                  style={{
                    position: 'relative',
                    height: '100%',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: isHovered
                      ? '0 30px 80px rgba(0,0,0,0.5)'
                      : '0 10px 40px rgba(0,0,0,0.3)',
                    transition: 'box-shadow 0.4s ease',
                    minWidth: '80px'
                  }}
                >
                  {/* Background Image */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${step.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: isHovered ? 'brightness(0.7)' : 'brightness(0.5)',
                      transition: 'filter 0.4s ease'
                    }}
                  />

                  {/* Dark Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: isHovered
                      ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                      : 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)',
                    transition: 'background 0.4s ease'
                  }} />

                  {/* Content Container */}
                  <div style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: isHovered ? 'clamp(2rem, 3vw, 3rem)' : '2rem',
                    transition: 'padding 0.4s ease'
                  }}>
                    {/* Title - Always Visible */}
                    <motion.h3
                      animate={{
                        fontFamily: isHovered
                          ? "'Freckle Face'"
                          : "'Oswald', sans-serif",
                        fontSize: isHovered
                          ? 'clamp(2.5rem, 4vw, 4.5rem)'
                          : 'clamp(1.5rem, 2vw, 2rem)',
                        marginBottom: isHovered ? '1.5rem' : '0.5rem'
                      }}
                      transition={{ duration: 0.4 }}
                      style={{
                        color: 'white',
                        fontWeight: isHovered ? '700' : '600',
                        lineHeight: 1.1,
                        textTransform: isHovered ? 'none' : 'uppercase',
                        letterSpacing: isHovered ? '-0.02em' : '0.05em',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        writingMode: isHovered ? 'horizontal-tb' : (isAnyHovered ? 'vertical-rl' : 'horizontal-tb'),
                        transform: isHovered ? 'none' : (isAnyHovered ? 'rotate(180deg)' : 'none'),
                        transition: 'all 0.4s ease',
                        wordBreak: 'keep-all',
                        whiteSpace: isHovered ? 'normal' : 'nowrap'
                      }}
                    >
                      {step.title}
                    </motion.h3>

                    {/* Expanded Content - Only on Hover */}
                    <motion.div
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        height: isHovered ? 'auto' : 0,
                      }}
                      transition={{ duration: 0.4 }}
                      style={{
                        overflow: 'hidden'
                      }}
                    >
                      <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
                      >
                        <p style={{
                          fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                          lineHeight: 1.6,
                          color: 'rgba(255,255,255,0.9)',
                          marginBottom: '2rem',
                          fontFamily: 'Oswald'
                        }}>
                          {step.desc}
                        </p>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Step Number Badge */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      opacity: isHovered ? 0 : 1
                    }}
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      background: 'var(--color-khaki)',
                      color: 'var(--color-black)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 'bold',
                      fontSize: '1.3rem',
                      boxShadow: '0 4px 20px rgba(255,140,0,0.4)',
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    {index + 1}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Features;