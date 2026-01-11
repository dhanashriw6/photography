import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Elena Richardson",
    role: "Fashion Photographer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    text: "fulltime photographer completely transformed how I find clients. The platform is curated, professional, and the aesthetic matches my own brand perfectly.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Documentary Filmmaker",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    text: "The community here is unlike any other. It’s not just a job board; it’s a place where serious creatives connect and collaborate on meaningful projects.",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    text: "Finding specific talent used to be a nightmare. With fulltime photographer's search and portfolio tools, I can find the exact visual style I need in minutes.",
    rating: 5
  },
  {
    id: 4,
    name: "David O'Connor",
    role: "Indie Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    text: "I love the premium feel of the platform. It attracts high-quality clients who respect the craft. Definitely a game-changer for my career.",
    rating: 5
  }
];

const TestimonialCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ y: -10, rotate: 1 }}
      className="testimonial-card"
      style={{
        background: 'var(--color-cream)',
        padding: '2.5rem',
        borderRadius: '24px',
        minWidth: '400px',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
       {/* Decorative Watermark */}
       <Quote size={120} color="var(--color-orange)" style={{ 
            position: 'absolute', 
            top: -20, 
            right: -20, 
            opacity: 0.1,
            transform: 'rotate(180deg)'
       }} />

       <div style={{ display: 'flex', gap: '0.2rem' }}>
         {[...Array(item.rating)].map((_, i) => (
           <Star key={i} size={16} fill="var(--color-orange)" stroke="none" />
         ))}
       </div>

       <p style={{
         fontFamily: 'var(--font-heading)',
         fontSize: '1.4rem',
         lineHeight: 1.4,
         color: 'var(--color-black)',
         fontStyle: 'italic',
         position: 'relative',
         zIndex: 1
       }}>
         "{item.text}"
       </p>

       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
         <img 
           src={item.image} 
           alt={item.name} 
           style={{
             width: '50px',
             height: '50px',
             borderRadius: '50%',
             objectFit: 'cover',
             border: '2px solid var(--color-orange)'
           }}
         />
         <div>
           <h4 style={{ 
             fontFamily: 'var(--font-body)', 
             fontWeight: 700, 
             fontSize: '0.9rem',
             color: 'var(--color-black)'
           }}>
             {item.name}
           </h4>
           <span style={{
             fontFamily: 'var(--font-body)',
             fontSize: '0.8rem',
             color: 'var(--color-teal)',
             fontWeight: 500
           }}>
             {item.role}
           </span>
         </div>
       </div>
    </motion.div>
  );
};

const Testimonials = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    // Parallax background movement
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    
    // Horizontal scroll simulation for the cards
    // In a real horizontal scroll scenario we might use sticky positioning or a marquee.
    // Let's create a marquee effect.

  return (
    <section 
      ref={containerRef}
      style={{
        padding: '10rem 0',
        background: 'var(--color-white)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Patterns */}
      <motion.div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          y: yBg,
          opacity: 0.5,
          pointerEvents: 'none'
      }}>
          <div style={{
              position: 'absolute',
              top: '10%',
              left: '-5%',
              width: '400px',
              height: '400px',
              border: '1px solid var(--color-light-blue)',
              borderRadius: '50%',
              opacity: 0.4
          }} />
           <div style={{
              position: 'absolute',
              bottom: '10%',
              right: '-5%',
              width: '500px',
              height: '500px',
              border: '1px solid var(--color-orange)',
              borderRadius: '50%',
              opacity: 0.2
          }} />
      </motion.div>

      <div className="container" style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 2 }}>
        <h2 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            color: 'var(--color-black)', 
            marginBottom: '1rem' 
        }}>
            Voice of the Community
        </h2>
        <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-black)',
            opacity: 0.7,
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            Hear from the photographers and filmmakers who are already creating their legacy with fulltime photographer.
        </p>
      </div>

      {/* Marquee/Scroll Container */}
      <div style={{
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
          position: 'relative',
          padding: '2rem 0',
          
      }}>
          {/* We duplicate the list to create an infinite loop effect */}
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
            }}
            style={{
                display: 'flex',
                gap: '2rem',
                paddingLeft: '2rem',
                width: 'max-content'
            }}
          >
              {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
                  <TestimonialCard key={`${item.id}-${index}`} item={item} />
              ))}
          </motion.div>
          
          {/* Gradient Fade Edges */}
          <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '150px',
              height: '100%',
              background: 'linear-gradient(to right, var(--color-white), transparent)',
              zIndex: 10,
              pointerEvents: 'none'
          }} />
          <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '150px',
              height: '100%',
              background: 'linear-gradient(to left, var(--color-white), transparent)',
              zIndex: 10,
              pointerEvents: 'none'
          }} />
      </div>
    </section>
  );
};

export default Testimonials;