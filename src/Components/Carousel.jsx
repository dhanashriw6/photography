import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel3D = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
      bg: "from-purple-100 to-purple-200"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Product Designer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
      bg: "from-teal-700 to-teal-800"
    },
    {
      id: 3,
      name: "Sarah Williams",
      role: "Marketing Lead",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
      bg: "from-slate-600 to-slate-700"
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      role: "UX Researcher",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
      bg: "from-orange-400 to-orange-500"
    },
    {
      id: 5,
      name: "David Kim",
      role: "Frontend Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
      bg: "from-indigo-600 to-indigo-700"
    },
    {
      id: 6,
      name: "James Brown",
      role: "Data Scientist",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
      bg: "from-slate-700 to-slate-800"
    },
    {
      id: 7,
      name: "Lisa Park",
      role: "Business Analyst",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop",
      bg: "from-teal-100 to-teal-200"
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const getSlidePosition = (index) => {
    const diff = index - activeIndex;
    const total = slides.length;
    
    let position = diff;
    if (diff > total / 2) position = diff - total;
    if (diff < -total / 2) position = diff + total;
    
    return position;
  };

  const getSlideStyle = (index) => {
    const position = getSlidePosition(index);
    const absPos = Math.abs(position);
    
    if (absPos > 3) {
      return {
        opacity: 0,
        transform: 'translateX(0) translateZ(-1000px) rotateY(0deg)',
        zIndex: 0,
        pointerEvents: 'none'
      };
    }

    // Inward curve calculation
    const angle = position * 35; // Rotation angle
    const radius = 550; // Radius of the curve
    const translateX = Math.sin(angle * Math.PI / 180) * radius;
    const translateZ = radius - Math.cos(angle * Math.PI / 180) * radius - 200;
    const rotateY = -angle; // Negative for inward curve
    const scale = 0.85 + (1 - absPos * 0.15);
    const opacity = 1 - absPos * 0.2;
    const zIndex = 10 - absPos;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      pointerEvents: absPos === 0 ? 'auto' : 'none'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex flex-col items-center justify-center p-8 overflow-hidden">
    

      {/* Carousel Container */}
      <div className="relative w-full max-w-7xl h-[550px] flex items-center justify-center mb-8">
        <div 
          className="relative w-full h-full flex items-center justify-center"
          style={{ 
            perspective: '600px',
            perspectiveOrigin: 'center center'
          }}
        >
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {slides.map((slide, index) => {
              const position = getSlidePosition(index);
              const isActive = position === 0;
              
              return (
                <div
                  key={slide.id}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                  style={{
                    ...getSlideStyle(index),
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className={`w-45 h-50 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${slide.bg} ${isActive ? 'ring-4 ring-white' : ''}`}>
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="w-full h-full object-cover"
                    />
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h3 className="text-white font-bold text-xl mb-1">{slide.name}</h3>
                      <p className="text-white/90 text-sm">{slide.role}</p>
                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        {/* <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button> */}
      </div>

       <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="mt-6 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        {isAutoPlay ? '⏸ Pause' : '▶ Play'} Auto-scroll
      </button>
      
    </div>
  );
};

export default Carousel3D;