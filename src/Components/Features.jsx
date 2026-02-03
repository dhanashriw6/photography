import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, UserCheck, Star } from "lucide-react";
import SectionSeparator from "./SectionSeparator";

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const steps = [
    {
      title: "Discover",
      desc: "Explore curated portfolios tailored to your vision",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=600&fit=crop" // Creative portfolio/gallery wall
    },
    {
      title: "Book",
      desc: "Instant scheduling with real-time availability",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop" // Calendar/planner with notes
    },
    {
      title: "Connect",
      desc: "Collaborate with verified creative professionals",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop" // People collaborating/handshake
    },
    {
      title: "Review",
      desc: "Share your experience and inspire others",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=600&fit=crop" // Feedback/rating stars
    },
  ];

  return (
    <section style={{
      padding: '8rem 2rem',
      background: 'var(--color-pale)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <SectionSeparator flip={true} fill="var(--color-black)" />
      <div className="container" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              color: 'var(--color-orange)',
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
              fontSize: '160px',
              color: 'var(--color-black)',
              fontFamily: 'Oswald',
              marginBottom: '1rem',
              width: '70%',
              margin: 'auto'
            }}
          >
            Your Journey to Perfect Imagery
          </motion.h2>
        </motion.div>

        {/* Horizontal Cards Container */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          position: 'relative',
          height: '500px',
          alignItems: 'center'
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
                  padding: isHovered ? '3rem' : '2rem',
                  transition: 'padding 0.4s ease'
                }}>
                  {/* Title - Always Visible */}
                  <motion.h3
                    animate={{
                      fontFamily: isHovered
                        ? "'Playfair Display', serif"
                        : "'Oswald', sans-serif",
                      fontSize: isHovered ? '3.5rem' : '2rem',
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
                      transition: 'all 0.4s ease'
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
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '2rem',
                        fontFamily: 'var(--font-body)'
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
      </div>
    </section>
  );
}

export default Features;