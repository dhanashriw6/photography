import React from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <nav style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
    // mixBlendMode: 'difference',
    color: 'var(--color-beige)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Camera size={24} />
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 'bold' }}>Online Photographer</span>
    </div>
    {/* <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Photographers</a>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Stories</a>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Login</a>
 
    </div> */}
    <div
      whileHover={{
        scale: 1.05,
        boxShadow: '0 0 40px rgba(255,174,0,0.6)',
        background: 'linear-gradient(135deg, #FFAE00, #FFE24F)'
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: '#FFAE00',
        color: '#111212',
        fontSize: '1rem',
        padding: '1rem 2rem',
        border: 'none',
        borderRadius: '50px',

        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 0 20px rgba(255,174,0,0.3)'
      }}
    >
      Login
    </div>
  </nav>
);

export default Navigation;
