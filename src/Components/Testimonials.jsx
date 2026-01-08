// import React, { useRef } from 'react';
// import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
// import { Quote, Star } from 'lucide-react';

// const testimonials = [
//   {
//     id: 1,
//     name: "Elena Richardson",
//     role: "Fashion Photographer",
//     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
//     text: "FilmFlare completely transformed how I find clients. The platform is curated, professional, and the aesthetic matches my own brand perfectly.",
//     rating: 5
//   },
//   {
//     id: 2,
//     name: "Marcus Chen",
//     role: "Documentary Filmmaker",
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
//     text: "The community here is unlike any other. It’s not just a job board; it’s a place where serious creatives connect and collaborate on meaningful projects.",
//     rating: 5
//   },
//   {
//     id: 3,
//     name: "Sarah Jenkins",
//     role: "Creative Director",
//     image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
//     text: "Finding specific talent used to be a nightmare. With FilmFlare's search and portfolio tools, I can find the exact visual style I need in minutes.",
//     rating: 5
//   },
//   {
//     id: 4,
//     name: "David O'Connor",
//     role: "Indie Director",
//     image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
//     text: "I love the premium feel of the platform. It attracts high-quality clients who respect the craft. Definitely a game-changer for my career.",
//     rating: 5
//   }
// ];

// const TestimonialCard = ({ item }) => {
//   return (
//     <motion.div
//       whileHover={{ y: -10, rotate: 1 }}
//       className="testimonial-card"
//       style={{
//         background: 'var(--color-cream)',
//         padding: '2.5rem',
//         borderRadius: '24px',
//         minWidth: '400px',
//         maxWidth: '400px',
//         boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
//         border: '1px solid rgba(0,0,0,0.05)',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '1.5rem',
//         position: 'relative',
//         overflow: 'hidden'
//       }}
//     >
//        {/* Decorative Watermark */}
//        <Quote size={120} color="var(--color-orange)" style={{ 
//             position: 'absolute', 
//             top: -20, 
//             right: -20, 
//             opacity: 0.1,
//             transform: 'rotate(180deg)'
//        }} />

//        <div style={{ display: 'flex', gap: '0.2rem' }}>
//          {[...Array(item.rating)].map((_, i) => (
//            <Star key={i} size={16} fill="var(--color-orange)" stroke="none" />
//          ))}
//        </div>

//        <p style={{
//          fontFamily: 'var(--font-heading)',
//          fontSize: '1.4rem',
//          lineHeight: 1.4,
//          color: 'var(--color-black)',
//          fontStyle: 'italic',
//          position: 'relative',
//          zIndex: 1
//        }}>
//          "{item.text}"
//        </p>

//        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
//          <img 
//            src={item.image} 
//            alt={item.name} 
//            style={{
//              width: '50px',
//              height: '50px',
//              borderRadius: '50%',
//              objectFit: 'cover',
//              border: '2px solid var(--color-orange)'
//            }}
//          />
//          <div>
//            <h4 style={{ 
//              fontFamily: 'var(--font-body)', 
//              fontWeight: 700, 
//              fontSize: '0.9rem',
//              color: 'var(--color-black)'
//            }}>
//              {item.name}
//            </h4>
//            <span style={{
//              fontFamily: 'var(--font-body)',
//              fontSize: '0.8rem',
//              color: 'var(--color-teal)',
//              fontWeight: 500
//            }}>
//              {item.role}
//            </span>
//          </div>
//        </div>
//     </motion.div>
//   );
// };

// const Testimonials = () => {
//     const containerRef = useRef(null);
//     const { scrollYProgress } = useScroll({
//         target: containerRef,
//         offset: ["start end", "end start"]
//     });
    
//     // Parallax background movement
//     const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    
//     // Horizontal scroll simulation for the cards
//     // In a real horizontal scroll scenario we might use sticky positioning or a marquee.
//     // Let's create a marquee effect.

//   return (
//     <section 
//       ref={containerRef}
//       style={{
//         padding: '10rem 0',
//         background: 'var(--color-white)',
//         position: 'relative',
//         overflow: 'hidden'
//       }}
//     >
//       {/* Background Patterns */}
//       <motion.div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           y: yBg,
//           opacity: 0.5,
//           pointerEvents: 'none'
//       }}>
//           <div style={{
//               position: 'absolute',
//               top: '10%',
//               left: '-5%',
//               width: '400px',
//               height: '400px',
//               border: '1px solid var(--color-light-blue)',
//               borderRadius: '50%',
//               opacity: 0.4
//           }} />
//            <div style={{
//               position: 'absolute',
//               bottom: '10%',
//               right: '-5%',
//               width: '500px',
//               height: '500px',
//               border: '1px solid var(--color-orange)',
//               borderRadius: '50%',
//               opacity: 0.2
//           }} />
//       </motion.div>

//       <div className="container" style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 2 }}>
//         <h2 style={{ 
//             fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
//             color: 'var(--color-black)', 
//             marginBottom: '1rem' 
//         }}>
//             Voice of the Community
//         </h2>
//         <p style={{
//             fontFamily: 'var(--font-body)',
//             color: 'var(--color-black)',
//             opacity: 0.7,
//             maxWidth: '600px',
//             margin: '0 auto'
//         }}>
//             Hear from the photographers and filmmakers who are already creating their legacy with FilmFlare.
//         </p>
//       </div>

//       {/* Marquee/Scroll Container */}
//       <div style={{
//           display: 'flex',
//           overflow: 'hidden',
//           width: '100%',
//           position: 'relative',
//           padding: '2rem 0',
          
//       }}>
//           {/* We duplicate the list to create an infinite loop effect */}
//           <motion.div 
//             animate={{ x: ["0%", "-50%"] }}
//             transition={{ 
//                 duration: 40, 
//                 repeat: Infinity, 
//                 ease: "linear" 
//             }}
//             style={{
//                 display: 'flex',
//                 gap: '2rem',
//                 paddingLeft: '2rem',
//                 width: 'max-content'
//             }}
//           >
//               {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
//                   <TestimonialCard key={`${item.id}-${index}`} item={item} />
//               ))}
//           </motion.div>
          
//           {/* Gradient Fade Edges */}
//           <div style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               width: '150px',
//               height: '100%',
//               background: 'linear-gradient(to right, var(--color-white), transparent)',
//               zIndex: 10,
//               pointerEvents: 'none'
//           }} />
//           <div style={{
//               position: 'absolute',
//               top: 0,
//               right: 0,
//               width: '150px',
//               height: '100%',
//               background: 'linear-gradient(to left, var(--color-white), transparent)',
//               zIndex: 10,
//               pointerEvents: 'none'
//           }} />
//       </div>
//     </section>
//   );
// };

// export default Testimonials;


import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote, ThumbsUp, Star, Heart } from 'lucide-react';
import SectionSeparator from './SectionSeparator';

const testimonials = [
  {
    id: 1,
    type: "wide-left-avatar",
    name: "Victoria Linton",
    text: "Praesent urna neque viverra justo ultrices dui. Est lorem ipsum dolor sit amet consectetur adipiscing.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
  },
  {
    id: 2,
    type: "hero-center",
    name: "Fanny Dean",
    role: "Director",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
    text: "A scelerisque purus semper eget duis at tellus. Amet cursus sit amet dictum sit justo.",
    heading: "EXCELLENT JOB!",
    rating: 5
  },
  {
    id: 3,
    type: "wide-simple",
    name: "ArtfulWotton",
    heading: "Client Review",
    text: "Rhoncus neque viverra justo ultrices duist lorem dolor sed consect adipiscing.",
   
  },
  {
    id: 4,
    type: "bubble-left",
    name: "Dimitri Woodhouse",
    handle: "@yournamehere",
    text: "Mauris in aliquam se fringilla morbi tincidunt augue amet dui massa.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    rating: 5
  },
  {
    id: 5,
    type: "pill",
    name: "Nelly Vane",
    text: "Varius duis at consectetur lorem donec. Et tortor at risus viverra.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    rating: 5,
    icon: ThumbsUp
  },
  {
    id: 6,
    type: "square-bottom",
    name: "Hindley Micawber",
    handle: "@yoursocialmedia",
    heading: "Top-notch!",
    text: "Rhoncus urna neque viverra justo nec ultrices dui. Est lorem ipsum dolor sit amet.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5
  },
  {
    id: 7,
    type: "speech-bubble",
    name: "Catherine Doe",
    handle: "@CatherineDoe",
    heading: "TESTIMONIAL",
    text: "In hac habitasse platea dictumst quisque sagitise pur convallis.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80"
  },
  // {
  //   id: 8,
  //   type: "square-photo",
  //   name: "Recommended!",
  //   rating: 5,
  //   text: "Habitant morbi tristique et netus blandit molestie.",
  //   image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80"
  // },
   {
    id: 9,
    type: "quote-right",
    name: "JaneProkovich",
    handle: "@JaneProkovich",
    text: "Vestibulum mattis enim aulit tortor se ullamcorper morbi pretium.",
    quoteIcon: true
  }
];

const RenderCard = ({ item }) => {
  const commonShadow = "0 10px 40px -10px rgba(0,0,0,0.1)";

  // Components based on type
  if (item.type === "hero-center") {
    return (
      <motion.div 
        whileHover={{ y: -5 }}
        style={{
        gridArea: "hero",
        background: "#FFFBF2",
        borderRadius: "24px",
        padding: "3rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        boxShadow: commonShadow
      }}>
        <div style={{
          position: "absolute",
          top: "-40px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          padding: "5px",
          background: "#FFFBF2"
        }}>
            <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
        </div>
        <div style={{ marginTop: "3rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", letterSpacing: "1px", marginBottom: "0.5rem" }}>{item.heading}</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "1rem" }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#C6A87C" stroke="none"/>)}
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: "1.6", color: "#666", marginBottom: "1.5rem" }}>"{item.text}"</p>
          <div style={{ fontFamily: "cursive", fontSize: "1.5rem", color: "#666" }}>{item.name}</div>
        </div>
      </motion.div>
    );
  }

  if (item.type === "wide-left-avatar") {
    return (
       <motion.div 
         whileHover={{ x: 5 }}
         style={{
         gridArea: "wide1",
         background: "#FFF",
         borderRadius: "20px",
         padding: "1.5rem 1.5rem 1.5rem 4rem",
         position: "relative",
         boxShadow: commonShadow,
         display: "flex",
         flexDirection: "column",
         justifyContent: "center"
       }}>

          <div style={{
              position: "absolute",
              left: "-30px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "4px solid #FFF",
              zIndex: 2
          }}>
              <img src={item.image} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", top: "10px", right: "15px" }}>
            <Quote size={24} fill="#666" stroke="none" style={{ opacity: 0.2, transform: "scale(-1, 1)" }} />
          </div>
          <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: "bold" }}>{item.name}</h4>
          <div style={{ display: "flex", gap: "2px", margin: "0.2rem 0 0.5rem" }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#FFC107" stroke="none"/>)}
          </div>
          <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: "1.4" }}>{item.text}</p>
       </motion.div>
    );
  }

  if (item.type === "wide-simple") {
      return (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{
              gridArea: "wide2",
              background: "#FFF",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: commonShadow,
              borderLeft: "4px solid #D4C5A8"
          }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem" }}>{item.heading}</h4>
                  <span style={{ fontSize: "0.8rem", color: "#999" }}>@{item.name}</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "1rem", fontStyle: "italic" }}>
                  "{item.text}"
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "bold", opacity: 0.6, cursor: "pointer" }}>{item.action}</span>
                  <div style={{ display: "flex", gap: "10px" }}>
                      <Heart size={14} /> 
                  </div>
              </div>
          </motion.div>
      )
  }

  if (item.type === "bubble-left") {
      return (
          <motion.div style={{
              gridArea: "bubble1",
              background: "#FFF",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: commonShadow,
              position: "relative"
          }}>
              <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "1.5rem", textAlign: "center" }}>
                  "{item.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src={item.image} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                  <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>{item.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "#999" }}>{item.handle}</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex" }}>
                       {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#FFC107" stroke="none"/>)}
                  </div>
              </div>
              {/* Little triangle for speech bubble effect */}
              <div style={{ position: "absolute", right: "-10px", top: "50%", width: "20px", height: "20px", background: "#FFF", transform: "rotate(45deg)", zIndex: -1 }} />
          </motion.div>
      )
  }

  if (item.type === "pill") {
      return (
          <motion.div 
            whileHover={{ x: -5 }}
            style={{
              gridArea: "pill",
              background: "#FFF",
              borderRadius: "50px", // Pill shape
              padding: "1rem 2rem 1rem 1rem",
              boxShadow: commonShadow,
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              position: "relative"
          }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%",  overflow: "hidden", flexShrink: 0 }}>
                  <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                       <h4 style={{ textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px" }}>{item.name}</h4>
                       {item.icon && <item.icon size={16} fill="#A69076" color="#FFF" />}
                  </div>
                  <p style={{ fontSize: "0.7rem", color: "#666", lineHeight: "1.3", marginBottom: "5px" }}>{item.text}</p>
                   <div style={{ display: "flex", gap: "2px" }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="#FFC107" stroke="none"/>)}
                   </div>
              </div>
          </motion.div>
      )
  }
  
  if (item.type === "square-bottom") {
      return (
          <motion.div style={{
              gridArea: "square1",
              background: "#FFF",
              borderRadius: "20px",
              padding: "2rem 1.5rem",
              boxShadow: commonShadow,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
          }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem" }}>{item.heading}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "1rem" }}>{item.text}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginTop: "1rem" }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#CCC" stroke="none"/>)}
                      <span style={{ fontSize: "0.7rem", color: "#999", marginLeft: "4px" }}>(5.0)</span>
                  </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#F4EFE6", padding: "10px", borderRadius: "12px" }}>
                   <img src={item.image} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
                   <div style={{ overflow: "hidden" }}>
                       <div style={{ fontSize: "0.8rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                       <div style={{ fontSize: "0.7rem", color: "#888" }}>{item.handle}</div>
                   </div>
              </div>
          </motion.div>
      )
  }

  if (item.type === "speech-bubble") {
      return (
        <motion.div style={{
            gridArea: "speech",
            background: "#FFF",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: commonShadow,
            position: "relative"
        }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                 <div style={{ width: "80px", height: "100px", borderRadius: "12px", overflow: "hidden", flexShrink: 0  }}>
                      <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 </div>
                 <div>
                     <div style={{ fontSize: "0.7rem", letterSpacing: "2px", color: "#666", marginBottom: "5px" }}>{item.heading}</div>
                     <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "#444" }}>"{item.text}"</p>
                     <div style={{ marginTop: "10px", fontWeight: "bold", fontSize: "0.8rem" }}>{item.handle}</div>
                 </div>
            </div>
             <div style={{ display: "flex", gap: "2px", justifyContent: "center", background: "#7D6E5D", padding: "5px", borderRadius: "20px", width: "80px", margin: "0 auto" }}>
                   {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#FFF" stroke="none"/>)}
             </div>
             {/* Speech tail */}
             <div style={{ position: "absolute", bottom: "-10px", left: "20%", width: "20px", height: "20px", background: "#FFF", transform: "rotate(45deg)" }} />
        </motion.div>
      )
  }

  if (item.type === "square-photo") {
      return (
          <motion.div style={{
              gridArea: "photo",
              borderRadius: "20px",
              boxShadow: commonShadow,
              overflow: "hidden",
              position: "relative"
          }}>
              <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "1.5rem", background: "#FFF" }}>
                  <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "bold", marginBottom: "5px" }}>{item.name}</div>
                   <div style={{ display: "flex", gap: "2px", marginBottom: "5px" }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#FFC107" stroke="none"/>)}
                   </div>
                  <p style={{ fontSize: "0.7rem", color: "#666" }}>{item.text}</p>
              </div>
          </motion.div>
      )
  }

  // Fallback / Quote Right
  return (
      <motion.div style={{
          gridArea: "quote",
          background: "#FFF",
          borderRadius: "20px 20px 20px 0",
          padding: "2rem",
          boxShadow: commonShadow,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
      }}>
           <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.5" }}>"{item.text}"</p>
           <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <Quote size={30} fill="#8D7B68" stroke="none" style={{ transform: "rotate(180deg)" }} />
               <div style={{ fontSize: "0.8rem", color: "#999" }}>{item.handle}</div>
           </div>
      </motion.div>
  );
}

const Testimonials = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    // Parallax background movement
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    return (
    <section 
      ref={containerRef}
      style={{
        padding: '8rem 2rem',
        background: 'rgba(212, 197, 168, 0.4)', // Warm Beige / Light Brown
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <SectionSeparator flip={true} />
      {/* Background Decor */}
      <motion.div style={{ position: 'absolute', inset: 0, y: yBg, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
              position: 'absolute',
              top: '-10%',
              right: '-10%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
              opacity: 0.6
          }} />
      </motion.div>

      <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>
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
            Hear from the photographers and filmmakers who are already creating their legacy with FilmFlare.
        </p>
      </div>
          
          {/* Main Grid Layout */}
          <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr 1fr",
              gridTemplateRows: "auto auto auto",
              gap: "2rem",
              gridTemplateAreas: `
                "wide1 hero wide2"
                "bubble1 hero pill"
                "square1 speech photo"
                "square1 speech quote"
              `
          }}>
              {/* Note: I'm mapping manually to match the specific areas. A real map would check types. */}
              {testimonials.map(item => <RenderCard key={item.id} item={item} />)}
          </div>
          
      </div>

      {/* Mobile Adaptation Style Override */}
      <style>{`
        @media (max-width: 1024px) {
            .container > div {
                grid-template-columns: 1fr 1fr !important;
                grid-template-areas: 
                    "hero hero"
                    "wide1 wide2"
                    "bubble1 pill"
                    "square1 photo"
                    "speech quote" !important;
            }
        }
        @media (max-width: 768px) {
             .container > div {
                display: flex !important;
                flex-direction: column;
                gap: 1.5rem;
            }
        }
      `}</style>

    </section>
  );
};

export default Testimonials;

