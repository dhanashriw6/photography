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
    mixBlendMode: 'difference',
    color: 'var(--color-beige)'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Camera size={24} />
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 'bold' }}>Film Frame Studio</span>
    </div>
    <div style={{ display: 'flex', gap: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Photographers</a>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Stories</a>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Login</a>
      {/* <Link to="/v1">V1</Link> */}
  <Link to="/v1" style={{ color: 'inherit', textDecoration: 'none' }}>
  v2
</Link>
    </div>
  </nav>
);

export default Navigation;
