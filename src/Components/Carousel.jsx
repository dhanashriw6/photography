import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ScrollSwirl = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const projects = [
    {
      id: 1,
      title: "UI/UX",
      subtitle: "Probieze",
      category: "Design",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
      gradient: "from-purple-600 to-purple-800"
    },
    {
      id: 2,
      title: "WordPress",
      subtitle: "BlackBox",
      category: "Development",
      image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=600&fit=crop",
      gradient: "from-teal-600 to-teal-800"
    },
    {
      id: 3,
      title: "Framer",
      subtitle: "RxGStudios",
      category: "Animation",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
      gradient: "from-orange-500 to-orange-700"
    },
    {
      id: 4,
      title: "React",
      subtitle: "CodeFlow",
      category: "Frontend",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
      gradient: "from-indigo-600 to-indigo-800"
    },
    {
      id: 5,
      title: "Design",
      subtitle: "Studio",
      category: "Creative",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      gradient: "from-slate-600 to-slate-800"
    },
    {
      id: 6,
      title: "Mobile",
      subtitle: "AppForge",
      category: "Apps",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
      gradient: "from-pink-600 to-pink-800"
    },
    {
      id: 7,
      title: "Brand",
      subtitle: "Identity",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      gradient: "from-amber-600 to-amber-800"
    }
  ];

  const createTransforms = (index) => {
    const totalProjects = projects.length;
    const progressPerItem = 1 / totalProjects;
    const startProgress = index * progressPerItem;
    const endProgress = (index + 1) * progressPerItem;
    
    // Determine side - creates S-shape by alternating
    const isLeftSide = index % 2 === 0;
    
    // Y position - each card moves from top to its position
    const yStart = -200 - (index * 100);
    const yEnd = index * 200;
    const y = useTransform(
      scrollYProgress,
      [Math.max(0, startProgress - 0.1), startProgress, endProgress, Math.min(1, endProgress + 0.1)],
      [yStart, yEnd, yEnd, yEnd + 100]
    );
    
    // X position - creates the S-curve swirl
    const xStart = 0;
    const xPeak = isLeftSide ? -350 : 350;
    const xEnd = isLeftSide ? -380 : 380;
    const x = useTransform(
      scrollYProgress,
      [Math.max(0, startProgress - 0.1), startProgress, startProgress + 0.05, endProgress],
      [xStart, xStart, xPeak, xEnd]
    );
    
    // Opacity - fade in as it comes into view
    const opacity = useTransform(
      scrollYProgress,
      [
        Math.max(0, startProgress - 0.15),
        startProgress - 0.05,
        startProgress + 0.05,
        endProgress,
        Math.min(1, endProgress + 0.15)
      ],
      [0, 0.3, 1, 1, 0.6]
    );
    
    // Scale - grows as it comes into view
    const scale = useTransform(
      scrollYProgress,
      [
        Math.max(0, startProgress - 0.1),
        startProgress,
        startProgress + 0.05,
        endProgress
      ],
      [0.7, 0.85, 1, 0.95]
    );
    
    // Rotation - adds dynamic tilt
    const rotateStart = isLeftSide ? -15 : 15;
    const rotatePeak = isLeftSide ? -8 : 8;
    const rotateEnd = isLeftSide ? -4 : 4;
    const rotate = useTransform(
      scrollYProgress,
      [startProgress - 0.05, startProgress, endProgress],
      [rotateStart, rotatePeak, rotateEnd]
    );

    return { x, y, opacity, scale, rotate };
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] -top-80 -left-80 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute w-[700px] h-[700px] top-1/4 -right-64 bg-teal-500/10 rounded-full blur-[100px] animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '-3s' }} />
        <div className="absolute w-[600px] h-[600px] bottom-0 left-1/3 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '-6s' }} />
        <div className="absolute w-[500px] h-[500px] top-2/3 right-1/4 bg-orange-500/10 rounded-full blur-[100px] animate-pulse" 
             style={{ animationDuration: '9s', animationDelay: '-4s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-8xl md:text-9xl font-black mb-6 tracking-tighter">
            <span className="bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
              Our Work
            </span>
          </h1>
          <p className="text-gray-400 text-sm tracking-[0.4em] uppercase font-bold">
            Scroll Down
          </p>
        </motion.div>
      </div>

      {/* Scroll Container */}
      <div ref={containerRef} style={{ height: '600vh' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            {projects.map((project, index) => {
              const transforms = createTransforms(index);
              
              return (
                <motion.div
                  key={project.id}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    x: transforms.x,
                    y: transforms.y,
                    opacity: transforms.opacity,
                    scale: transforms.scale,
                    rotate: transforms.rotate,
                    zIndex: projects.length - index
                  }}
                >
                  <motion.div
                    className="relative w-[500px] h-[350px] md:w-[550px] md:h-[380px] rounded-3xl overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] cursor-pointer"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 40px 100px -25px rgba(0,0,0,0.95)'
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                      style={{ 
                        filter: 'brightness(0.7) contrast(1.15) saturate(1.1)'
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 mix-blend-multiply`} />
                    
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-10">
                      <div className="text-[10px] uppercase tracking-[4px] text-white/60 font-black mb-3 letter-spacing-widest">
                        {project.category}
                      </div>
                      <h3 className="text-6xl font-black text-white leading-[0.9] mb-3 drop-shadow-2xl">
                        {project.title}
                      </h3>
                      <p className="text-2xl font-light text-white/95 tracking-wide drop-shadow-lg">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Border Glow */}
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="fixed bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
      >
        <span className="text-[10px] tracking-[4px] uppercase text-gray-600 font-black">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg 
            className="w-6 h-6 text-gray-600" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </motion.div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-teal-500 to-orange-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
};

export default ScrollSwirl;