import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ImageGallery = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]); 
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  const images = [
    { id: 1, url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80", title: "Cinematic Portraits", year: "2024" },
    { id: 2, url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", title: "Wedding Stories", year: "2023" },
    { id: 3, url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", title: "Fashion Editorials", year: "2024" },
    { id: 4, url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", title: "Commercial Shoots", year: "2023" },
  ];

  return (
    <section ref={targetRef} style={{ height: '300vh', position: 'relative' }}>
      <motion.div style={{ 
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--color-black)',
        scale
      }}>
        <motion.div style={{ 
          display: 'flex', 
          gap: '0', 
          height: '100%',
          x 
        }}>
          <div style={{ 
            minWidth: '100vw', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            padding: '0 6rem',
            borderRight: '1px solid rgba(255,255,255,0.1)'
          }}>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ color: 'var(--color-caramel)', fontFamily: 'var(--font-body)', fontSize: '1.2rem', marginBottom: '2rem', display: 'block' }}
            >
              (01) — Portfolio
            </motion.span>
            <h2 style={{ fontSize: 'clamp(4rem, 8vw, 8rem)', color: 'var(--color-beige)', lineHeight: 0.9, marginBottom: '2rem' }}>
              Visual<br/>Stories
            </h2>
            <p style={{ color: 'rgba(245, 239, 230, 0.6)', fontFamily: 'var(--font-body)', maxWidth: '400px' }}>
              A curated collection of moments captured in time. Scroll to explore the depth of our artists' vision.
            </p>
          </div>
          {images.map((img, index) => (
            <motion.div 
              key={img.id} 
              style={{ 
                position: 'relative', 
                minWidth: '60vw', 
                height: '100%',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <motion.img 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  src={img.url} 
                  alt={img.title}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    filter: 'grayscale(20%)',
                  }} 
                />
              </div>
              <motion.div 
                style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  left: 0, 
                  padding: '2rem',
                  background: 'linear-gradient(transparent, black)',
                  width: '100%'
                }}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  style={{ 
                    color: 'var(--color-caramel)', 
                    fontSize: '0.9rem', 
                    border: '1px solid var(--color-caramel)', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '50px',
                    display: 'inline-block'
                  }}
                >
                  {img.year}
                </motion.span>
                <p style={{ color: 'var(--color-beige)', fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontStyle: 'italic', marginTop: '1rem' }}>{img.title}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ImageGallery;
