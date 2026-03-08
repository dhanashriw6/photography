import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import logo from '../assets/Images/logo1.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BsInstagram } from 'react-icons/bs';
import { FiUser, FiEdit2, FiCalendar, FiLogOut, FiAlertCircle } from 'react-icons/fi';

const navItems = [
  { label: 'Home', to: '/home' },
  { label: 'About Us', to: '/about-us' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Blog', to: '/blog' },
];

const IgIcon = () => <BsInstagram size={17} />;

/* ── Avatar Dropdown ── */
const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItems = [
    { icon: <FiEdit2 size={15} />, label: 'Edit Profile', action: () => navigate('/edit-profile') },
    { icon: <FiAlertCircle size={15} />, label: 'Raise a Dispute', action: () => navigate('/dispute'), danger: true },
    { divider: true },
    { icon: <FiLogOut size={15} />, label: 'Logout', action: () => navigate('/'), danger: true },
  ];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: open ? '2px solid #E8A317' : '2px solid #ddd',
          background: open ? '#FFF3D6' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: open ? '#E8A317' : '#555',
          transition: 'border-color 0.2s, background 0.2s, color 0.2s',
          outline: 'none',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.borderColor = '#E8A317';
            e.currentTarget.style.color = '#E8A317';
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.borderColor = '#ddd';
            e.currentTarget.style.color = '#555';
          }
        }}
      >
        <FiUser size={18} />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: '200px',
              background: '#fff',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.07)',
              overflow: 'hidden',
              zIndex: 1000,
            }}
          >
            {/* User info header */}
            <div style={{
              padding: '14px 16px 12px',
              borderBottom: '1px solid #f5f5f5',
              background: 'linear-gradient(135deg, #FFF3D6 0%, #fff8ea 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: '#E8A317', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0, color: '#fff',
                }}>
                  <FiUser size={16} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>John Doe</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#999', fontWeight: 500 }}>john@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div style={{ padding: '6px 0' }}>
              {menuItems.map((item, i) => {
                if (item.divider) return (
                  <div key={i} style={{ height: '1px', background: '#f5f5f5', margin: '4px 0' }} />
                );
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { item.action(); setOpen(false); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: item.danger ? '#e53935' : '#333',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = item.danger ? '#fff5f5' : '#f9f9f9';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ color: item.danger ? '#e53935' : '#E8A317', display: 'flex' }}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
            onClick={() => navigate('/home')}
            className="flex items-center"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: "10px" }}
          >
            <img
              src={logo}
              alt="Online Photographer logo"
              className="w-[224px]"
            />
          </button>

          {/* Nav + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <nav className="hidden md:flex items-center gap-7">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => navigate(item.to)}
                    className={`views-nav-link ${active ? ' views-nav-link--active' : ''}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Avatar with dropdown */}
            <AvatarDropdown />
          </div>
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
              <div className="su-social-icon ig"><BsInstagram size={17} /></div>
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