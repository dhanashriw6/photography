import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PinterestGrid = () => {
   
   const images = [
  "https://picsum.photos/600/900?random=1",
  "https://picsum.photos/900/600?random=2",
  "https://picsum.photos/600/800?random=3",
  "https://picsum.photos/800/600?random=4",
  "https://picsum.photos/600/600?random=5",
  "https://picsum.photos/600/950?random=6",
  "https://picsum.photos/700/900?random=7",
  "https://picsum.photos/650/650?random=8",
  "https://picsum.photos/600/1000?random=9",
  "https://picsum.photos/600/850?random=10",
  "https://picsum.photos/900/650?random=11",
  "https://picsum.photos/600/900?random=12",
  "https://picsum.photos/850/600?random=13",
  "https://picsum.photos/600/880?random=14",
//   "https://picsum.photos/900/600?random=15",
];

    return (
        <section className="pinterest-grid-section">
            {/* Animated Background Elements */}
            <div className="pinterest-bg-pattern" />
            <motion.div 
                className="pinterest-blob blob-1"
                animate={{ 
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
             <motion.div 
                className="pinterest-blob blob-2"
                animate={{ 
                    x: [0, -80, 0],
                    y: [0, 60, 0],
                    scale: [1, 1.3, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
            />

            <div className="pinterest-grid-container">
                {images.map((src, index) => (
                    <PinterestItem key={index} src={src} index={index} />
                ))}
            </div>
        </section>
    );
};

const PinterestItem = ({ src, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

    const variants = {
        hidden: { 
            opacity: 0, 
            y: 100, 
            scale: 0.95,
            filter: "blur(10px)"
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            filter: "blur(0px)",
            transition: { 
                type: "spring",
                stiffness: 60,
                damping: 20,
                duration: 1.2, 
                delay: (index % 4) * 0.15 
            }
        }
    };

    return (
        <motion.div 
            ref={ref}
            className="pinterest-item"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            whileHover={{ 
                scale: 1.05, 
                zIndex: 10,
                transition: { duration: 0.4, ease: "easeOut" }
            }}
            style={{ willChange: 'transform, opacity, filter' }} // Performance optimization
        >
            <img src={src} alt="FilmFlare Capture" loading="lazy" />
            
            {/* Optional: Add a subtle overlay on hover if desired, or keep clean as requested */}
            <motion.div 
                className="item-overlay"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
                    pointerEvents: 'none'
                }}
            />
        </motion.div>
    );
};

export default PinterestGrid;
