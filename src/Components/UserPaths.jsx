import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, ArrowRight, Aperture, Focus } from 'lucide-react';

const ShutterBlades = ({ isOpen }) => {
  const blades = [0, 60, 120, 180, 240, 300];
  
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      borderRadius: '16px', // Matches card border radius
      pointerEvents: 'none',
      zIndex: 3
    }}>
      {blades.map((angle, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: isOpen ? angle + 20 : angle,
            scale: isOpen ? 0 : 1.2,
            opacity: isOpen ? 0 : 1
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            background: 'var(--color-black)',
            transformOrigin: '0% 0%',
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
          }}
        />
      ))}
    </div>
  );
};

const ViewfinderCorners = () => (
  <>
    <div style={{ position: 'absolute', top: '20px', left: '20px', width: '20px', height: '20px', borderTop: '2px solid rgba(255,255,255,0.5)', borderLeft: '2px solid rgba(255,255,255,0.5)', pointerEvents: 'none', zIndex: 20 }} />
    <div style={{ position: 'absolute', top: '20px', right: '20px', width: '20px', height: '20px', borderTop: '2px solid rgba(255,255,255,0.5)', borderRight: '2px solid rgba(255,255,255,0.5)', pointerEvents: 'none', zIndex: 20 }} />
    <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '20px', height: '20px', borderBottom: '2px solid rgba(255,255,255,0.5)', borderLeft: '2px solid rgba(255,255,255,0.5)', pointerEvents: 'none', zIndex: 20 }} />
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '20px', height: '20px', borderBottom: '2px solid rgba(255,255,255,0.5)', borderRight: '2px solid rgba(255,255,255,0.5)', pointerEvents: 'none', zIndex: 20 }} />
  </>
);

const UserPaths = () => {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section style={{ 
      padding: '10rem 2rem', 
      background: 'var(--color-black)', 
      color: 'var(--color-beige)', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Background Ambience */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(193,154,107,0.1) 0%, transparent 60%)',
        opacity: 0.6
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
             style={{ 
               display: 'inline-flex', 
               alignItems: 'center', 
               gap: '0.5rem',
               marginBottom: '1rem',
               color: 'var(--color-caramel)'
             }}
          >
            <Aperture className="spin-slow" size={20} />
            <span style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '0.9rem',
              textTransform: 'uppercase', 
              letterSpacing: '0.2em' 
            }}>
              Choose Your Lens
            </span>
          </motion.div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--color-beige)' }}>
            Start Your Journey
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          
          {[
            { 
              id: 'customer',
              icon: Search,
              title: "Hire a Photographer",
              desc: "Find the perfect artist for your vision. Search by style, location, and budget.",
              action: "Find Talent",
              bgImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80"
            },
            {
              id: 'creator',
              icon: Camera,
              title: "Join as Photographer",
              desc: "Showcase your portfolio, manage bookings, and grow your business.",
              action: "Start Creating",
              bgImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80"
            }
          ].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onHoverStart={() => setActiveCard(item.id)}
              onHoverEnd={() => setActiveCard(null)}
              style={{
                position: 'relative',
                height: '450px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'var(--color-mocha)',
                cursor: 'pointer',
                border: '1px solid rgba(245, 239, 230, 0.1)'
              }}
            >
              {/* Background Image with Zoom */}
              <motion.div
                animate={{ 
                  scale: activeCard === item.id ? 1.1 : 1,
                  filter: activeCard === item.id ? 'grayscale(0%) brightness(0.7)' : 'grayscale(100%) brightness(0.4)'
                }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${item.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              
              {/* Overlay Gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)',
                zIndex: 1
              }} />

              {/* Viewfinder Elements */}
              <ViewfinderCorners />
              
              {/* Shutter Blades Animation */}
              <ShutterBlades isOpen={activeCard === item.id} />
              
              {/* Shutter Mechanism (Decorative Animation) */}
              <motion.div
                animate={{
                  rotate: activeCard === item.id ? 180 : 0,
                  opacity: activeCard === item.id ? 0 : 0.3,
                  scale: activeCard === item.id ? 1.5 : 1
                }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                  y: '-50%',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                <Aperture size={300} strokeWidth={0.5} style={{ opacity: 0.2 }} />
              </motion.div>

              {/* Flash Effect on Hover */}
              <AnimatePresence>
                 {activeCard === item.id && (
                    <motion.div
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'white',
                        zIndex: 20,
                        pointerEvents: 'none'
                      }}
                    />
                 )}
              </AnimatePresence>

              {/* Content */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '2.5rem',
                zIndex: 5,
                transform: 'translateZ(0)'
              }}>
                <motion.div
                   animate={{ 
                     y: activeCard === item.id ? 0 : 20,
                     opacity: activeCard === item.id ? 1 : 0.8
                   }}
                   transition={{ duration: 0.5 }}
                >
                   <motion.div 
                     style={{ 
                       marginBottom: '1.5rem',
                       display: 'inline-block',
                       padding: '1rem',
                       background: 'rgba(255,255,255,0.1)',
                       backdropFilter: 'blur(10px)',
                       borderRadius: '12px',
                       color: 'var(--color-caramel)'
                     }}
                     whileHover={{ rotate: 15, scale: 1.1 }}
                   >
                     {React.createElement(item.icon, { size: 32 })}
                   </motion.div>
                   
                   <h3 style={{ 
                     fontSize: '2rem', 
                     marginBottom: '0.8rem', 
                     fontFamily: 'var(--font-heading)',
                     color: 'white'
                   }}>
                     {item.title}
                   </h3>
                   
                   <p style={{ 
                     fontFamily: 'var(--font-body)', 
                     lineHeight: 1.6, 
                     marginBottom: '2rem', 
                     opacity: 0.8,
                     color: 'rgba(255,255,255,0.8)',
                     height: activeCard === item.id ? 'auto' : '0',
                     overflow: 'hidden',
                     transition: 'all 0.5s ease'
                   }}>
                     {item.desc}
                   </p>
                   
                   <motion.button 
                     animate={{ 
                       x: activeCard === item.id ? 0 : -20,
                       opacity: activeCard === item.id ? 1 : 0
                     }}
                    //  onClick={()=>console.log("clicked")}
                     className="btn" 
                     style={{ 
                       background: 'var(--color-caramel)', 
                       color: 'var(--color-mocha)',
                       border: 'none',
                       padding: '1rem 2rem',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '0.5rem',
                       fontWeight: 'bold'
                     }}
                   >
                     {item.action} <ArrowRight size={18} />
                   </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default UserPaths;
