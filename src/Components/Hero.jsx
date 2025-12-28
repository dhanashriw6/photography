import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax for main content
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 0.9]);

  // Mouse move effect tracking
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const moveX = useSpring(mousePosition.x * 50, { stiffness: 100, damping: 20 });
  const moveY = useSpring(mousePosition.y * 50, { stiffness: 100, damping: 20 });

  // Image Columns Data
  const col1 = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
  ];
  const col2 = [
    "https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    "https://images.unsplash.com/photo-1471341971474-273d2b0b27b5?w=800&q=80",
    "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
  ];
  const col3 = [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "https://images.unsplash.com/photo-1520390138845-fd2d229dd552?w=800&q=80",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=800&q=80",
  ];

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        height: '120vh', // Extend slightly to cover elastic scrolling
        width: '100%',
        overflow: 'hidden',
        background: 'var(--color-mocha)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px'
      }}
    >
      {/* Dynamic Background Columns */}
      <motion.div 
        style={{
          position: 'absolute',
          inset: '-20%',
          display: 'flex',
          gap: '2rem',
          transform: 'rotate(-12deg) scale(1.1)',
          opacity: 0.4,
          filter: 'grayscale(30%) sepia(20%)',
          zIndex: 0,
        }}
      >
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={45} yStart="-50%" />
        <ParallaxColumn images={[...col2, ...col2, ...col2]} duration={35} reverse yStart="-20%" />
        <ParallaxColumn images={[...col3, ...col3, ...col3]} duration={50} yStart="-60%" />
        <ParallaxColumn images={[...col1, ...col1, ...col1]} duration={40} reverse yStart="-30%" />
      </motion.div>

      {/* Main Content Card - Frosted Glass Effect */}
      <motion.div
        style={{
          zIndex: 10,
          position: 'relative',
          y: y,
          opacity: opacity,
          scale: scale,
          x: moveX,
          // rotateX: moveY, // Subtle 3D tilt
          // rotateY: moveX,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           textAlign: 'center'
        }}>
          

          {/* Huge Title with Blend Mode */}
          <h1 className="hero-title" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(5rem, 15vw, 12rem)',
            lineHeight: 0.85,
            color: 'var(--color-beige)',
            textShadow: '0 20px 40px rgba(0,0,0,0.3)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }}>
            <motion.div
              initial={{ y: 100, opacity: 0, rotate: 5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            >
              FILM
            </motion.div>
            <motion.div
              initial={{ y: 100, opacity: 0, rotate: -5 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.45 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}
            >
              <span style={{ fontStyle: 'italic', fontFamily: 'serif', fontWeight: '300' }}>&</span> FRAME
            </motion.div>
          </h1>

          {/* Subtitle and Description */}
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8, duration: 1 }}
             style={{ 
               maxWidth: '600px', 
               color: 'var(--color-beige)', 
               opacity: 0.9,
               fontSize: 'clamp(1rem, 2vw, 1.2rem)',
               marginTop: '2rem',
               lineHeight: 1.6,
               fontWeight: 300
             }}
          >
            A curated sanctuary for visual storytellers. We bridge the gap between 
            <span style={{ fontStyle: 'italic', color: 'var(--color-caramel)', margin: '0 5px' }}>raw artistry</span> 
            and commercial opportunity.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            style={{
              marginTop: '3rem',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center'
            }}
          >
            <CtaButton primary>
              Explore Talent <ArrowRight size={18} />
            </CtaButton>
           <CtaButton primary>
             Join as Photographer  <ArrowRight size={18} />
            </CtaButton>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Decorative Overlay Gradient (Bottom) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '400px',
        background: 'linear-gradient(to top, var(--color-mocha) 0%, transparent 100%)',
        zIndex: 5,
        pointerEvents: 'none'
      }} />

    </div>
  );
};

// Sub-components

const ParallaxColumn = ({ images, duration, reverse, yStart = "0%" }) => (
  <motion.div
    initial={{ y: reverse ? "0%" : "-50%" }}
    animate={{ y: reverse ? "-50%" : "0%" }}
    transition={{
      duration: duration,
      ease: "linear",
      repeat: Infinity,
    }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      width: '30vw',
      position: 'relative',
      y: yStart
    }}
  >
    {images.map((src, i) => (
      <div key={i} style={{ 
        position: 'relative', 
        borderRadius: '12px', 
        overflow: 'hidden',
        height: '400px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        <img 
          src={src} 
          alt="Film Frame" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: 'grayscale(20%) contrast(1.1)' 
          }} 
        />
        <div style={{
           position: 'absolute',
           inset: 0,
           background: 'rgba(75, 46, 43, 0.2)', // Tint
           mixBlendMode: 'multiply'
        }} />
      </div>
    ))}
  </motion.div>
);

const CtaButton = ({ children, primary }) => {
  const [isHovered, setHovered] = useState(false);
  
  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '1rem 2rem',
        borderRadius: '99px',
        border: '1px solid',
        borderColor: primary ? 'var(--color-beige)' : 'rgba(245, 239, 230, 0.3)',
        background: primary ? 'var(--color-beige)' : 'transparent',
        color: primary ? 'var(--color-mocha)' : 'var(--color-beige)',
        fontSize: '1rem',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative',
        overflow: 'hidden',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}
    >
      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </span>
      {/* Fill Animation */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '0%' : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: primary ? 'var(--color-caramel)' : 'var(--color-beige)',
          zIndex: 1
        }}
      />
      {primary && (
         <motion.div 
           animate={{ x: isHovered ? '0%' : '-100%' }}
           style={{
             position: 'absolute',
             inset: 0,
             background: 'var(--color-caramel)',
             zIndex: 1
           }}
           transition={{ duration: 0.3 }}
         />
      )}
      {!primary && (
         <motion.div 
           animate={{ opacity: isHovered ? 0.1 : 0 }}
           style={{
             position: 'absolute',
             inset: 0,
             background: 'white',
             zIndex: 1
           }}
         />
      )}
    </motion.button>
  );
};

export default Hero;


















    // <motion.div 
    //     initial={{ opacity: 0, y: 50 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     transition={{ delay: 2, duration: 1 }}
    //     style={{
    //       width: '100%',
    //       height: '400px', // Adjusted height
    //       position: 'relative',
    //       perspective: '1500px',
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       marginTop: 'auto', // Push to bottom
    //       marginBottom: '2rem'
    //     }}
    //   >
    //     {/* Carousel Controls */}
    //     <button 
    //       onClick={handlePrev}
    //       style={{
    //         position: 'absolute',
    //         left: '5%',
    //         zIndex: 20,
    //         background: 'rgba(21, 21, 21, 0.1)',
    //         backdropFilter: 'blur(5px)',
    //         border: '1px solid var(--color-soft-gray)',
    //         borderRadius: '50%',
    //         padding: '10px',
    //         cursor: 'pointer',
    //         color: 'var(--color-soft-black)',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center'
    //       }}
    //     >
    //       <ArrowLeft size={24} />
    //     </button>
    //     <button 
    //       onClick={handleNext}
    //       style={{
    //         position: 'absolute',
    //         right: '5%',
    //         zIndex: 20,
    //         background: 'rgba(21, 21, 21, 0.1)',
    //         backdropFilter: 'blur(5px)',
    //         border: '1px solid var(--color-soft-gray)',
    //         borderRadius: '50%',
    //         padding: '10px',
    //         cursor: 'pointer',
    //         color: 'var(--color-soft-black)',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'center'
    //       }}
    //     >
    //       <ArrowRight size={24} />
    //     </button>

    //     {/* Carousel Stage */}
    //     <div 
    //       ref={containerRef}
    //       style={{
    //         position: 'relative',
    //         width: '100%',
    //         height: '100%',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         transformStyle: 'preserve-3d',
    //       }}
    //     >
    //       {galleryImages.map((src, index) => {
    //         let offset = index - activeIndex;
    //         if (offset > galleryImages.length / 2) offset -= galleryImages.length;
    //         if (offset < -galleryImages.length / 2) offset += galleryImages.length;

    //         const absOffset = Math.abs(offset);
    //         const isActive = offset === 0;
            
    //         return (
    //           <motion.div
    //             key={index}
    //             initial={false}
    //             animate={{
    //               x: offset * 220,
    //               z: -absOffset * 100 - (absOffset * 50),
    //               rotateY: offset * -15,
    //               scale: 1 - absOffset * 0.1,
    //               opacity: Math.abs(offset) > 3 ? 0 : 1 - absOffset * 0.15,
    //             }}
    //             transition={{
    //               type: "spring",
    //               stiffness: 200,
    //               damping: 25,
    //               mass: 1
    //             }}
    //             style={{
    //               position: 'absolute',
    //               width: '260px',
    //               height: '350px',
    //               borderRadius: '16px',
    //               overflow: 'hidden',
    //               background: '#fff',
    //               boxShadow: isActive ? '0 20px 50px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.1)',
    //               transformStyle: 'preserve-3d',
    //               zIndex: galleryImages.length - absOffset,
    //               cursor: 'pointer',
    //             }}
    //             onClick={() => setActiveIndex(index)}
    //           >
    //             <img 
    //               src={src} 
    //               alt={`Gallery ${index}`} 
    //               style={{
    //                 width: '100%',
    //                 height: '100%',
    //                 objectFit: 'cover',
    //                 filter: isActive ? 'none' : 'grayscale(30%) brightness(0.9)',
    //                 transition: 'filter 0.5s ease'
    //               }}
    //             />
    //             {!isActive && (
    //               <div style={{
    //                 position: 'absolute',
    //                 inset: 0,
    //                 background: 'rgba(244, 239, 232, 0.4)',
    //                 pointerEvents: 'none'
    //               }} />
    //             )}
    //           </motion.div>
    //         );
    //       })}
    //     </div>
    //   </motion.div>

//     @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

// :root {
//   /* New Palette */
//   --color-soft-black: #151515;
//   --color-paper-beige: #F4EFE8;
//   --color-muted-gold: #E1B65C;
//   --color-earth-brown: #8A5C3B;
//   --color-soft-gray: #AFA8A2;
//   --color-forest-green: #3A8F6F;

//   /* Mapping to existing variable names for backward compatibility (best effort) */
//   --color-mocha: var(--color-soft-black);
//   --color-coffee: var(--color-earth-brown);
//   --color-caramel: var(--color-muted-gold);
//   --color-beige: var(--color-paper-beige);
//   --color-cream: #FAF7F2;
//   /* Kept or matching paper beige? Let's keep distinct if needed, or map to paper beige */
//   --color-black: var(--color-soft-black);
//   --color-white: #ffffff;

//   --font-heading: 'Cormorant Garamond', serif;
//   --font-body: 'Montserrat', sans-serif;

//   --spacing-xs: 0.5rem;
//   --spacing-sm: 1rem;
//   --spacing-md: 2rem;
//   --spacing-lg: 4rem;
//   --spacing-xl: 8rem;

//   --transition-slow: 0.6s cubic-bezier(0.22, 1, 0.36, 1);
//   --transition-normal: 0.3s ease-out;
// }

// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }

// body {
//   font-family: var(--font-body);
//   background-color: var(--color-beige);
//   color: var(--color-mocha);
//   overflow-x: hidden;
//   -webkit-font-smoothing: antialiased;
// }

// h1,
// h2,
// h3,
// h4,
// h5,
// h6 {
//   font-family: var(--font-heading);
//   font-weight: 600;
//   line-height: 1.1;
// }

// img {
//   max-width: 100%;
//   display: block;
// }

// /* Film Grain Overlay */
// .grain-overlay {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   pointer-events: none;
//   z-index: 9999;
//   opacity: 0.05;
//   background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
// }

// /* Utilities */
// .container {
//   max-width: 1400px;
//   margin: 0 auto;
//   padding: 0 var(--spacing-sm);
// }

// .btn {
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   padding: 1rem 2rem;
//   border: 1px solid currentColor;
//   border-radius: 9999px;
//   font-family: var(--font-body);
//   font-size: 0.9rem;
//   text-transform: uppercase;
//   letter-spacing: 0.1em;
//   transition: all var(--transition-normal);
//   cursor: pointer;
//   background: transparent;
//   color: var(--color-mocha);
//   text-decoration: none;
// }

// .btn:hover {
//   background-color: var(--color-mocha);
//   color: var(--color-beige);
// }

// .btn-primary {
//   background-color: var(--color-mocha);
//   color: var(--color-beige);
//   border-color: var(--color-mocha);
// }

// .btn-primary:hover {
//   background-color: var(--color-coffee);
//   border-color: var(--color-coffee);
// }

// /* Cursor Cleanup */
// body {
//   cursor: none;
//   /* We will use a custom cursor */
// }

// a,
// button,
// .btn {
//   cursor: none;
//   /* Ensure interactive elements don't show default cursor */
// }

// /* Marquee Animation */
// /* Marquee Animation */
// @keyframes scroll {
//   0% {
//     transform: translateX(0);
//   }

//   100% {
//     transform: translateX(-100%);
//   }
// }

// @keyframes wave {
//   0% {
//     transform: translateY(-15px) rotate(-3deg);
//   }

//   100% {
//     transform: translateY(15px) rotate(3deg);
//   }
// }

// .marquee-container {
//   overflow: hidden;
//   display: flex;
//   white-space: nowrap;
//   padding: 4rem 0;
//   /* Increase padding to accommodate wave amplitude */
//   background-color: var(--color-coffee);
//   color: var(--color-beige);
//   position: relative;
//   /* Add a mask for soft edges? Optional */
// }

// .marquee-content {
//   display: flex;
//   animation: scroll 40s linear infinite;
//   /* Slower speed for elegance */
//   align-items: center;
// }

// .marquee-item-wrapper {
//   /* The wrapper handles the vertical wave motion */
//   /* We use a negative delay based on index to create the wave pattern */
//   animation: wave 2.5s ease-in-out infinite alternate;
//   animation-delay: calc(var(--i) * -0.3125s);
//   /* 2.5s / 8 (or 16) approx. Needs to be tuned for smoothness */
//   /* For simple phase alignment: just ensure smooth visual flow. Precision isn't strictly required for the wave itself to look good, 
//      but for the loop to be perfect, the phase at the join must match.
     
//      If we have 16 items repeated. 
//      We interpret the wave as continuous.
//   */
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 0 3rem;
//   /* Spacing between items */
// }

// .marquee-item {
//   font-family: var(--font-heading);
//   font-size: 3.5rem;
//   text-transform: uppercase;
//   font-style: italic;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   transition: all 0.3s ease;
//   cursor: pointer;
// }

// .marquee-icon {
//   color: var(--color-muted-gold);
//   transition: transform 0.3s ease;
// }

// /* Hover Effects */
// .marquee-container:hover .marquee-content {
//   animation-play-state: paused;
// }

// /* We also pause the wave so the items stop bobbing when you try to click/read */
// .marquee-container:hover .marquee-item-wrapper {
//   animation-play-state: paused;
// }

// .marquee-item:hover {
//   transform: scale(1.1);
//   color: var(--color-white);
//   text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
// }

// .marquee-item:hover .marquee-icon {
//   transform: rotate(15deg) scale(1.2);
//   color: var(--color-white);
// }

// /* New Animations */
// @keyframes pulse {

//   0%,
//   100% {
//     opacity: 1;
//   }

//   50% {
//     opacity: 0.7;
//   }
// }

// @keyframes float {

//   0%,
//   100% {
//     transform: translateY(0);
//   }

//   50% {
//     transform: translateY(-20px);
//   }
// }

// @keyframes shimmer {
//   0% {
//     background-position: -1000px 0;
//   }

//   100% {
//     background-position: 1000px 0;
//   }
// }

// @keyframes glow {

//   0%,
//   100% {
//     box-shadow: 0 0 20px rgba(193, 154, 107, 0.3);
//   }

//   50% {
//     box-shadow: 0 0 40px rgba(193, 154, 107, 0.6);
//   }
// }

// /* Utility Classes */
// .animate-pulse {
//   animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
// }

// .animate-float {
//   animation: float 3s ease-in-out infinite;
// }

// .animate-glow {
//   animation: glow 2s ease-in-out infinite;
// }

// /* Smooth Scrolling */
// html {
//   scroll-behavior: smooth;
// }

// /* Selection Styling */
// ::selection {
//   background-color: var(--color-caramel);
//   color: var(--color-mocha);
// }

// .text-mask-anim {
//   background: linear-gradient(45deg,
//       var(--color-mocha) 0%,
//       var(--color-caramel) 25%,
//       #4a3c31 50%,
//       var(--color-caramel) 75%,
//       var(--color-mocha) 100%);
//   background-size: 200% auto;
//   color: transparent;
//   -webkit-background-clip: text;
//   background-clip: text;
//   animation: shine 5s linear infinite;
// }

// @keyframes shine {
//   to {
//     background-position: 200% center;
//   }
// }