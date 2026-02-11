import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionSeparator from './SectionSeparator';

const testimonials = [
  {
    id: 1,
    name: "Elena Richardson",
    role: "Fashion Photographer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    text: "I finally have headshots that feel like me. The process was seamless.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Documentary Filmmaker",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    text: "Found my go-to event photographer in minutes. Consistently elite.",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    text: "The architectural shots helped us close the deal in record time.",
    rating: 5
  },
  {
    id: 4,
    name: "David O'Connor",
    role: "Indie Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    text: "They captured the texture and movement of our collection perfectly.",
    rating: 5
  },
  {
    id: 5,
    name: "Sophie Laurent",
    role: "Fashion Designer",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    text: "A truly professional experience from start to finish. Highly recommended.",
    rating: 5
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Real Estate Agent",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    text: "The aerial shots gave our listing a completely new perspective.",
    rating: 5
  }
];

const TestimonialCard = ({ item, index }) => {
  // Random rotation for natural feel
  const rotations = [-2, 1, -1, 2, -1.5, 1.5];
  const rotate = rotations[index % rotations.length];

  return (
    <div
      style={{
        transform: `rotate(${rotate}deg)`,
        margin: '0 1.5rem',
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
      }}
      className="polaroid-wrapper"
    >
      <motion.div
        whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
        style={{
          background: '#ffffff',
          padding: '1rem 1rem 3rem 1rem', // Large bottom padding for text
          width: '320px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          transformOrigin: 'top center'
        }}
      >
        {/* Tape Effect */}
        <div style={{
          position: 'absolute',
          top: -15,
          left: '50%',
          transform: 'translateX(-50%) rotate(-1deg)',
          width: '120px',
          height: '35px',
          backgroundColor: 'rgba(236, 230, 109, 0.4)',
          borderLeft: '2px solid rgba(255,255,255,0.1)',
          borderRight: '2px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(2px)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          zIndex: 5,
          opacity: 0.8
        }}>
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(45deg, transparent 40%, rgba(255,248,220, 0.6) 40%, rgba(255,248,220, 0.6) 60%, transparent 60%)',
            opacity: 0.3
          }} />
        </div>

        {/* Image Area */}
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          background: '#f0f0f0',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'sepia(0.1) saturate(1.1) contrast(1.1)' // Slight vintage feel
            }}
          />
          <div style={{ // Subtle inner shadow/vignette
            position: 'absolute', inset: 0,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Text Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: '0.5rem'
        }}>
          {/* Rating */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem', opacity: 0.8 }}>
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} size={14} fill="var(--color-orange)" stroke="none" />
            ))}
          </div>

          <p style={{
            fontFamily: '"Shadows Into Light", "Kalam", cursive, var(--font-body)', // Fallback to body
            fontSize: '1rem',
            lineHeight: 1.4,
            color: '#333',
            fontStyle: 'italic',
            marginBottom: '1.5rem',
            padding: '0 0.5rem'
          }}>
            "{item.text}"
          </p>

          <div style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--color-black)',
              marginBottom: '0',
              lineHeight: 1
            }}>
              {item.name}
            </h4>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--color-gray)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {item.role}
            </span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      style={{
        padding: '8rem 0 0 0',
        background: 'var(--color-pale)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <SectionSeparator flip={true}  />
      {/* Background Decor */}
      <motion.div style={{
        position: 'absolute', inset: 0, y: yBg, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 60%)',
        opacity: 0.6,
        fontFamily: 'Oswald'
      }} />

      <div className="container" style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontSize: '160px',
          color: 'var(--color-black)',
          fontWeight: 400, // Thinner, more elegant
          marginBottom: '1.5rem',
          lineHeight: 1,
          fontFamily: "Oswald",
          letterSpacing: '-0.02em',
        }}>
          Voice of the Community
        </h2>
        <p style={{
         fontFamily: "Oswald",
          color: 'var(--color-gray)',
          maxWidth: '600px',
          margin: '0 auto',
          fontSize: '1.1rem'
        }}>
          Real stories from the creatives shaping the industry.
        </p>
      </div>

      {/* Marquee Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        padding: '4rem 0'
      }}>

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            display: 'flex',
            gap: '0', // Controlled by card margin
            width: 'max-content',
            paddingLeft: '0',
            alignItems: 'flex-start'
          }}
        >
          {/* Duplicate list multiple times for seamless loop */}
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((item, index) => (
            <TestimonialCard key={`${item.id}-${index}`} item={item} index={index} />
          ))}
        </motion.div>

        {/* Vignette / Fade Edges */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100px', height: '100%',
          background: 'linear-gradient(to right, var(--color-paper-beige), transparent)',
          zIndex: 20, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '100px', height: '100%',
          background: 'linear-gradient(to left, var(--color-paper-beige), transparent)',
          zIndex: 20, pointerEvents: 'none'
        }} />
      </div>
    </section>
  );
};

export default Testimonials;