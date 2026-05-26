import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CursorContext = createContext();

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

export const CursorProvider = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState('default');

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
      {children}
    </CursorContext.Provider>
  );
};

const CustomCursor = () => {
  const { cursorVariant } = useCursor();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    document.body.classList.add('has-custom-cursor');

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable elements
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      );
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      width: '32px',
      height: '32px',
      backgroundColor: 'var(--color-khaki)',
      mixBlendMode: 'difference',
    },
    camera: {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      width: '80px',
      height: '80px',
      backgroundColor: '#FFAE00', // Solid background for camera icon visibility
      mixBlendMode: 'normal',
    },
    pointer: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      width: '48px',
      height: '48px',
      backgroundColor: 'var(--color-khaki)',
      mixBlendMode: 'difference',
    }
  };

  const currentVariant = cursorVariant === 'camera' ? 'camera' : (isPointer ? 'pointer' : 'default');

  return (
    <>
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={currentVariant}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <AnimatePresence mode="wait">
          {cursorVariant === 'camera' && (
            <motion.div
              key="camera-icon"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%' }}
            >
              <img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=80&h=80&fit=crop&auto=format"
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  // borderRadius: '50%',
                }}
                draggable={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default CustomCursor;
