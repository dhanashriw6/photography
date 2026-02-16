import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
import SectionSeparator from './SectionSeparator';
import { useCursor } from './CustomCursor';

const Hero2 = () => {
  const { setCursorVariant } = useCursor();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 1000], [1, 0]);

  // Carousel State
  const [activeIndex, setActiveIndex] = useState(3);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const galleryImages = [
    { type: 'image', src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80" },
    { type: 'video', src: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" },
    { type: 'image', src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80" },
    { type: 'video', src: "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4" },
    { type: 'image', src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
    { type: 'video', src: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" },
    { type: 'image', src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
  ];

  // Auto-play effect for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const shootText = "Shoot.".split("");
  const editText = "Edit.".split("");
  const deliverText = "Deliver.".split("");
  const repeatText = "Repeat.".split("");

  // Responsive badge component
  const FloatingBadge = ({ children, style, animate, transition, clipPath, rays, petals }) => {
    if (isMobile) return null; // Hide badges on mobile

    return (
      <motion.div
        animate={animate}
        transition={transition}
        style={style}
      >
        {rays ? (
          <div style={{
            position: 'relative',
            width: '95px',
            height: '95px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '3px',
                  height: '45px',
                  background: 'linear-gradient(to bottom, #FFE24F, transparent)',
                  top: '50%',
                  left: '50%',
                  transformOrigin: 'top center',
                  transform: `translate(-50%, -100%) rotate(${i * 30}deg)`
                }}
              />
            ))}
            <div style={{
              position: 'relative',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#FEEFA3',
              border: '2px solid #FFAE00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255,226,79,0.4)',
              zIndex: 1
            }}>
              {children}
            </div>
          </div>
        ) : petals ? (
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  background: '#FEEFA3',
                  border: '2px solid #FFAE00',
                  top: '50%',
                  left: '50%',
                  transformOrigin: 'center center',
                  transform: `translate(-50%, -50%) translate(${Math.cos(i * 72 * Math.PI / 180) * 25}px, ${Math.sin(i * 72 * Math.PI / 180) * 25}px)`
                }}
              />
            ))}
            <div style={{
              position: 'relative',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              background: '#111212',
              border: '2px solid #FFAE00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255,174,0,0.4)',
              zIndex: 1
            }}>
              {children}
            </div>
          </div>
        ) : clipPath ? (
          <div style={{
            position: 'relative',
            width: '90px',
            height: '90px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: '#FEEFA3',
              clipPath: clipPath,
              boxShadow: '0 0 25px rgba(255,226,79,0.4)'
            }} />
            {children}
          </div>
        ) : (
          children
        )}
      </motion.div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111212',
      color: '#FFFEFA',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      <header style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: isMobile ? '4rem' : '7rem',
        paddingBottom: isMobile ? '2rem' : '0',
        background: '#111212',
        color: '#FFFEFA'
      }}>
        {/* Animated Background Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: isMobile ? '300px' : '600px',
            height: isMobile ? '300px' : '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,174,0,0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none'
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            width: isMobile ? '400px' : '700px',
            height: isMobile ? '400px' : '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,226,79,0.12) 0%, transparent 70%)',
            filter: 'blur(100px)',
            pointerEvents: 'none'
          }}
        />

        {/* Floating Badges - Only on Desktop */}
        <FloatingBadge
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            zIndex: 5,
            pointerEvents: 'none'
          }}
          animate={{
            y: [-10, -20, -10],
            x: [1200, 1250, 1200],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div style={{
            background: '#FEEFA3',
            border: '2px solid #FFAE00',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            padding: '1rem 1.5rem',
            fontWeight: '700',
            fontSize: '0.85rem',
            textTransform: 'capitalize',
            letterSpacing: '0.05em',
            color: '#111212',
            boxShadow: '0 0 20px rgba(255,174,0,0.3)',
            transform: 'rotate(-12deg)',
            position: 'relative'
          }}>
            Timeless
          </div>
        </FloatingBadge>

        <FloatingBadge
          style={{
            position: 'absolute',
            top: '40%',
            right: '10%',
            zIndex: 5,
            pointerEvents: 'none'
          }}
          animate={{
            y: [-10, -12, 0],
            x: [-1050, -1100, -1050],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div style={{
            background: '#FEEFA3',
            border: '2px solid #FFAE00',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            padding: '1rem 1.8rem',
            fontWeight: '700',
            fontSize: '1rem',
            color: '#111212',
            boxShadow: '0 0 25px rgba(255,174,0,0.4)',
            transform: 'rotate(8deg)'
          }}>
            Creative
          </div>
        </FloatingBadge>

        <FloatingBadge
          style={{
            position: 'absolute',
            top: '22%',
            left: '15%',
            zIndex: 5,
            pointerEvents: 'none'
          }}
          animate={{
            y: [0, -1, 0],
            x: [1000, 1050, 1000],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <div style={{
            background: '#2E2D2B',
            border: '2px solid #FFAE00',
            borderRadius: '50px',
            padding: '0.7rem 1.3rem',
            fontWeight: '600',
            fontSize: '0.75rem',
            textTransform: 'capitalize',
            letterSpacing: '0.05em',
            color: '#FEEFA3',
            boxShadow: '0 0 20px rgba(255,174,0,0.3)',
            transform: 'rotate(3deg)'
          }}>
            Studio & On-Location Shoots
          </div>
        </FloatingBadge>

        <FloatingBadge
          style={{
            position: 'absolute',
            top: '18%',
            right: '12%',
            zIndex: 5,
            pointerEvents: 'none'
          }}
          animate={{
            x: [-950, -1000, -950],
            y: [-90, -80, -90],
            rotate: [0, 360],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          clipPath='polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        >
          <span style={{
            position: 'relative',
            fontWeight: '700',
            fontSize: '0.8rem',
            color: '#111212',
            letterSpacing: '0.05em',
            zIndex: 1
          }}>
            Edgy
          </span>
        </FloatingBadge>

        <FloatingBadge
          style={{
            position: 'absolute',
            top: '32%',
            right: '8%',
            zIndex: 5,
            pointerEvents: 'none'
          }}
          animate={{
            x: [-100, -150, -100],
            y: [0, 12, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          rays={true}
        >
          <span style={{
            fontWeight: '700',
            fontSize: '0.8rem',
            color: '#111212',
            letterSpacing: '0.05em'
          }}>
            Bold
          </span>
        </FloatingBadge>

        <FloatingBadge
          style={{
            position: 'absolute',
            bottom: '40%',
            left: '8%',
            zIndex: 5,
            pointerEvents: 'none'
          }}
          animate={{
            x: [200, 250, 200],
            y: [0, -12, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
          petals={true}
        >
          <span style={{
            fontWeight: '700',
            fontSize: '0.65rem',
            color: '#FEEFA3',
            letterSpacing: '0.05em'
          }}>
            Fresh
          </span>
        </FloatingBadge>

        <SectionSeparator />

        {/* Main Content */}
        <motion.div style={{
          y: isMobile ? 0 : y,
          opacity: isMobile ? 1 : opacity,
          textAlign: 'center',
          zIndex: 10,
          position: 'relative',
          padding: isMobile ? '0 1rem' : '0'
        }}>
          {/* Decorative Line Above */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: isMobile ? '60px' : '100px',
              height: '2px',
              background: '#FFAE00',
              margin: '0 auto 2rem',
              transformOrigin: 'center',
              boxShadow: '0 0 10px rgba(255,174,0,0.5)'
            }}
          />

          <h1
            onMouseEnter={() => setCursorVariant('camera')}
            onMouseLeave={() => setCursorVariant('default')}
            style={{
              margin: '1.5rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              fontWeight: '900'
            }}>
            {/* Mobile: Stack all words vertically */}
            {/* Desktop: Two rows */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              textTransform: 'capitalize',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '0.5rem' : '0'
            }}>
              {/* Shoot. */}
              <div style={{
                display: 'flex',
                overflow: 'visible',
                padding: isMobile ? '0.25rem 0' : '0.5rem 2rem',
                justifyContent: 'center'
              }}>
                {shootText.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={!isMobile ? {
                      scale: 1.15,
                      y: -15,
                      transition: { duration: 0.3 }
                    } : {}}
                    style={{
                      display: 'inline-block',
                      cursor: isMobile ? 'default' : 'pointer',
                      fontSize: isMobile ? 'clamp(2.5rem, 12vw, 4rem)' : 'clamp(3.5rem, 10vw, 7rem)',
                      color: '#FFE24F',
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>

              {/* Edit. */}
              <div style={{
                display: 'flex',
                overflow: 'visible',
                padding: isMobile ? '0.25rem 0' : '0.5rem 1.5rem',
                justifyContent: 'center'
              }}>
                {editText.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 200, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3 + index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={!isMobile ? {
                      scale: 1.15,
                      y: -15,
                      transition: { duration: 0.3 }
                    } : {}}
                    style={{
                      display: 'inline-block',
                      cursor: isMobile ? 'default' : 'pointer',
                      fontSize: isMobile ? 'clamp(2.5rem, 12vw, 4rem)' : 'clamp(3.5rem, 10vw, 7rem)',
                      color: '#FFE24F',
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              textTransform: 'capitalize',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '0.5rem' : '0'
            }}>
              {/* Deliver. */}
              <div style={{
                display: 'flex',
                overflow: 'visible',
                padding: isMobile ? '0.25rem 0' : '0.5rem 2rem',
                justifyContent: 'center',
                marginLeft: isMobile ? '0' : '-1rem',
                marginRight: isMobile ? '0' : '-1rem'
              }}>
                {deliverText.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 200, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.6 + index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={!isMobile ? {
                      scale: 1.15,
                      y: -15,
                      transition: { duration: 0.3 }
                    } : {}}
                    style={{
                      display: 'inline-block',
                      cursor: isMobile ? 'default' : 'pointer',
                      fontSize: isMobile ? 'clamp(2.5rem, 12vw, 4rem)' : 'clamp(3.5rem, 10vw, 7rem)',
                      color: '#FFE24F',
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Repeat. */}
              <div style={{
                display: 'flex',
                overflow: 'visible',
                padding: isMobile ? '0.25rem 0' : '0.5rem 2rem',
                justifyContent: 'center'
              }}>
                {repeatText.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: 0.9 + index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={!isMobile ? {
                      scale: 1.15,
                      y: -15,
                      transition: { duration: 0.3 }
                    } : {}}
                    style={{
                      display: 'inline-block',
                      cursor: isMobile ? 'default' : 'pointer',
                      fontSize: isMobile ? 'clamp(2.5rem, 12vw, 4rem)' : 'clamp(3.5rem, 10vw, 7rem)',
                      color: '#FFE24F',
                      letterSpacing: '-0.03em',
                      textShadow: '0 2px 20px rgba(0,0,0,0.3)'
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            </div>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: 'relative',
              display: 'inline-block',
              width: isMobile ? '95%' : '60%',
              margin: 'auto',
            }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                fontWeight: 800,
                letterSpacing: '0.08em',
                fontSize: isMobile ? 'clamp(1.2rem, 5vw, 2rem)' : '40px',
                color: '#FFF',
              }}
            >
              Find the Right Photographer. Book with Confidence.
            </motion.span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '1.5rem',
              marginTop: '3rem',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              padding: isMobile ? '0 1rem' : '0'
            }}
          >
            <motion.button
              whileHover={!isMobile ? {
                scale: 1.05,
                boxShadow: '0 0 40px rgba(255,174,0,0.6)',
                background: 'linear-gradient(135deg, #FFAE00, #FFE24F)'
              } : {}}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#FFAE00',
                color: '#111212',
                fontSize: isMobile ? '1.1rem' : '1.5rem',
                padding: isMobile ? '1rem 2rem' : '1.2rem 2.5rem',
                border: 'none',
                borderRadius: '50px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 20px rgba(255,174,0,0.3)',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center'
              }}
            >
              Find a Photographer <ArrowRight size={isMobile ? 18 : 20} />
            </motion.button>
            <motion.button
              whileHover={!isMobile ? {
                scale: 1.05,
                borderColor: '#FFAE00',
                background: '#FFAE00',
                color: '#111212',
                boxShadow: '0 0 30px rgba(255,174,0,0.4)'
              } : {}}
              whileTap={{ scale: 0.95 }}
              style={{
                fontSize: isMobile ? '1.1rem' : '1.5rem',
                padding: isMobile ? '1rem 2rem' : '1.2rem 2.5rem',
                border: '2px solid #FEEFA3',
                background: 'transparent',
                color: '#FEEFA3',
                borderRadius: '50px',
                fontWeight: '600',
                cursor: 'pointer',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Join as Photographer
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 3D Curved Carousel - Adjusted for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            width: '100%',
            height: isMobile ? '350px' : '500px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: isMobile ? '3rem' : '5rem'
          }}
        >
          {isMobile ? (
            // Simple carousel for mobile
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '300px',
              height: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '250px',
                  height: '300px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: '0 25px 50px -12px rgba(255,174,0,0.4), 0 0 30px rgba(255,174,0,0.3)',
                  border: '3px solid #FFAE00',
                }}
              >
                {galleryImages[activeIndex].type === 'video' ? (
                  <video
                    src={galleryImages[activeIndex].src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <img
                    src={galleryImages[activeIndex].src}
                    alt={`Gallery ${activeIndex}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)'
                }} />
              </motion.div>

              {/* Navigation dots */}
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px'
              }}>
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      width: idx === activeIndex ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: idx === activeIndex ? '#FFAE00' : 'rgba(255,174,0,0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            // 3D carousel for desktop
            <div
              style={{
                perspective: '1000px',
                perspectiveOrigin: 'center center',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div
                ref={containerRef}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d'
                }}
              >
                {galleryImages.map((item, index) => {
                  let offset = index - activeIndex;
                  const totalImages = galleryImages.length;

                  if (offset > totalImages / 2) {
                    offset = offset - totalImages;
                  } else if (offset < -totalImages / 2) {
                    offset = offset + totalImages;
                  }

                  const absOffset = Math.abs(offset);
                  const isActive = offset === 0;

                  if (absOffset > 3.5) {
                    return null;
                  }

                  const angle = offset * 25;
                  const radius = 600;
                  const translateX = Math.sin(angle * Math.PI / 180) * radius;
                  const translateZ = radius - Math.cos(angle * Math.PI / 180) * radius - 200;
                  const rotateY = -angle;
                  const scale = 1;
                  const opacity = absOffset > 3 ? 0 : 1;
                  const zIndex = Math.round(10 - absOffset);

                  return (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity: opacity,
                        zIndex: zIndex
                      }}
                      transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-140px',
                        marginTop: '-170px',
                        width: '250px',
                        height: '300px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: '#fff',
                        boxShadow: isActive
                          ? '0 25px 50px -12px rgba(255,174,0,0.4), 0 0 30px rgba(255,174,0,0.3)'
                          : '0 10px 30px -5px rgba(0,0,0,0.5)',
                        transformStyle: 'preserve-3d',
                        cursor: 'pointer',
                        border: isActive ? '3px solid #FFAE00' : '1px solid rgba(255,174,0,0.2)',
                        pointerEvents: absOffset === 0 ? 'auto' : 'none'
                      }}
                      onClick={() => setActiveIndex(index)}
                    >
                      {item.type === 'video' ? (
                        <video
                          src={item.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none'
                          }}
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt={`Gallery ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none'
                          }}
                        />
                      )}

                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: isActive
                          ? 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)'
                          : 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
                        transition: 'all 0.3s ease'
                      }} />

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            position: 'absolute',
                            bottom: '15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40px',
                            height: '4px',
                            background: '#FFAE00',
                            borderRadius: '2px',
                            boxShadow: '0 0 15px rgba(255,174,0,0.8)'
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </header>
    </div>
  );
};

export default Hero2;