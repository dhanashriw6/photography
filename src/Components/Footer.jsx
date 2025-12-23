import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center', 
      background: 'var(--color-black)', 
      color: 'var(--color-beige)' 
    }}>
      <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>Film Frame Studio</p>
      <p style={{ marginTop: '1rem', opacity: 0.5, fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>&copy; 2025 All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
