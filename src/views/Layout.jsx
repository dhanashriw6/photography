import React from 'react';
import './index.css';
import logo from '../assets/Images/logo1.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Find a Photographer', to: '/find-photographer' },
  { label: 'Join as Photographer', to: '/join-photographer' },
];

const IgIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
  </svg>
);

const ViewsLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="views-shell min-h-screen flex flex-col">

      {/* ── Header ── */}
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="views-header"
      >
        <div className="w-full h-full px-3 py-2 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img
              src={logo}
              alt="Online Photographer logo"
              className="h-9 w-9 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
            <div style={{ lineHeight: 1.1 }}>
              <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f5a623' }}>
                Online
              </span>
              <span style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '0.06em' }}>
                PHOT<span style={{ color: '#f5a623' }}>O</span>GRAPHER
              </span>
            </div>
          </button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className={`views-nav-link${active ? ' views-nav-link--active' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </motion.header>

      {/* ── Main ── */}
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 flex justify-center px-4 py-10 md:py-14"
      >
        {children}
      </motion.main>

      {/* ── Footer ── */}
      <footer className="views-footer">
        <div className="views-footer-top">
          {/* Brand */}
          <div className="views-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={logo} alt="logo" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ lineHeight: 1.1 }}>
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f5a623' }}>Online</span>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '0.06em' }}>
                  PHOT<span style={{ color: '#f5a623' }}>O</span>GRAPHER
                </span>
              </div>
            </div>
            <p className="tagline">A community for photographer</p>
          </div>

          {/* Useful Links */}
          <div className="views-footer-col">
            <h4>Useful Links</h4>
            <a href="#">FAQs</a>
            <a href="#">Customer Care</a>
            <a href="#">Blog</a>
          </div>

          {/* More links */}
          <div className="views-footer-col">
            <h4>&nbsp;</h4>
            <a href="#">About</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>

          {/* Empty spacer */}
          <div />

          {/* Social icons */}
          <div>
            <div className="views-footer-social">
              <div className="su-social-icon li">in</div>
              <div className="su-social-icon ig"><IgIcon /></div>
              <div className="su-social-icon fb">f</div>
            </div>
          </div>
        </div>

        <div className="views-footer-bottom">
          © 2025 online photographer | All rights reserved by <span>DIGI- Trend.</span>
        </div>
      </footer>

      {/* Gold accent bar */}
      <div className="views-accent-bar" />
    </div>
  );
};

export default ViewsLayout;