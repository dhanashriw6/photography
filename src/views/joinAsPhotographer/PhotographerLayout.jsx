import React, { useState, useRef, useEffect } from 'react';
import '../index.css';
import logo from '../../assets/Images/Final-logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BsInstagram } from 'react-icons/bs';
import { FiUser, FiEdit2, FiLogOut, FiAlertCircle, FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'Home', to: '/join-as-photographer/home' },
  // { label: 'About Us', to: '/about-us' },
  // { label: 'FAQs', to: '/faqs' },
  // { label: 'Blog', to: '/blog' },
];

/* ── Avatar Dropdown ── */
const AvatarDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

 const isLoggedIn = !!localStorage.getItem('authToken');

const menuItems = [
  ...(isLoggedIn
    ? [
        {
          icon: <FiEdit2 size={15} />,
          label: 'Edit Profile',
          action: () => navigate('/join-as-photographer/edit-profile'),
        },
      ]
    : []),

  { divider: true },

  {
    icon: <FiLogOut size={15} />,
    label: 'Logout',
    action: handleLogout,
    danger: true,
  },
];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '38px', height: '38px', borderRadius: '50%',
          border: open ? '2px solid #E8A317' : '2px solid #ddd',
          background: open ? '#FFF3D6' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: open ? '#E8A317' : '#555',
          transition: 'border-color 0.2s, background 0.2s, color 0.2s',
          outline: 'none', flexShrink: 0,
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.borderColor = '#E8A317'; e.currentTarget.style.color = '#E8A317'; } }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#555'; } }}
      >
        <FiUser size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: '200px', background: '#fff', borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', zIndex: 1000,
            }}
          >
            <div style={{
              padding: '14px 16px 12px', borderBottom: '1px solid #f5f5f5',
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

            <div style={{ padding: '6px 0' }}>
              {menuItems.map((item, i) => {
                if (item.divider) return <div key={i} style={{ height: '1px', background: '#f5f5f5', margin: '4px 0' }} />;
                return (
                  <button
                    key={i} type="button"
                    onClick={() => { item.action(); setOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 16px', background: 'transparent', border: 'none',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      color: item.danger ? '#e53935' : '#333', textAlign: 'left',
                      transition: 'background 0.15s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = item.danger ? '#fff5f5' : '#f9f9f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
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

/* ── Mobile Drawer ── */
const MobileDrawer = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Close on route change
  useEffect(() => { onClose(); }, [location.pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
              zIndex: 1100,
            }}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '260px', background: '#fff', zIndex: 1101,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px', borderBottom: '1px solid #f0f0f0',
            }}>
              <img src={logo} alt="logo" style={{ width: '140px', height: 'auto' }} />
              <button
                type="button" onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#555', padding: '4px', display: 'flex',
                }}
              >
                <FiX size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <button
                    key={item.to} type="button"
                    onClick={() => navigate(item.to)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      padding: '13px 24px', background: active ? '#FFF3D6' : 'transparent',
                      border: 'none', borderLeft: active ? '3px solid #E8A317' : '3px solid transparent',
                      cursor: 'pointer', fontSize: '15px', fontWeight: active ? 700 : 500,
                      color: active ? '#E8A317' : '#333', textAlign: 'left',
                      fontFamily: 'inherit', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#fafafa'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Social icons at bottom */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid #f0f0f0',
              display: 'flex', gap: '10px',
            }}>
              {[
                { content: <span style={{ fontSize: '16px', fontWeight: 700 }}>in</span> },
                { content: <BsInstagram size={17} /> },
                { content: <span style={{ fontSize: '16px', fontWeight: 700 }}>f</span> },
              ].map((s, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#FFAE00', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  {s.content}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Main Layout ── */
const PhotographerLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            onClick={() => navigate('/join-as-photographer/home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '10px' }}
          >
            <img src={logo} alt="Fulltime Photographer logo" className="w-[140px] md:w-[140px]" />
          </button>

          {/* Desktop nav + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <nav className="hidden md:flex items-center gap-7">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <button
                    key={item.to} type="button"
                    onClick={() => navigate(item.to)}
                    className={`views-nav-link${active ? ' views-nav-link--active' : ''}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <AvatarDropdown />

            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex md:hidden"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#555', padding: '4px',  alignItems: 'center',
              }}
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
{/* ── Footer ── */}
<footer
  style={{
    background: '#fff',
    borderTop: '1px solid #ebebeb',
    marginTop: 'auto',
  }}
>
  <div
    style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '56px 32px 40px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '40px',
    }}
    className="md:!grid-cols-[1.3fr_1fr_1fr_1fr]"
  >
    {/* Brand */}
    <div>
      <img
        src={logo}
        alt="Fulltime Photographer"
        style={{ width: '160px', height: 'auto', display: 'block' }}
      />

      <p
        style={{
          fontSize: '13.5px',
          color: '#777',
          lineHeight: 1.7,
          marginTop: '16px',
          marginBottom: 0,
          maxWidth: '260px',
        }}
      >
        Connecting talented photographers with clients who value creativity,
        professionalism, and unforgettable moments.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        {[
          <span style={{ fontSize: '14px', fontWeight: 700 }}>in</span>,
          <BsInstagram size={17} />,
          <span style={{ fontSize: '14px', fontWeight: 700 }}>f</span>,
        ].map((icon, index) => (
          <div
            key={index}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#FFAE00',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {icon}
          </div>
        ))}
      </div>
    </div>

    {/* Useful Links */}
    <div>
      <h4
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#1a1a1a',
          margin: '0 0 20px',
          letterSpacing: '0.2px',
        }}
      >
        Useful Links
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          ['Home', '/join-as-photographer/home'],
          ['About Us', '/about-us'],
          ['FAQs', '/faqs'],
          ['Blog', '/blog'],
          ['Contact', '/contact'],
        ].map(([label, to]) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '13.5px',
              color: '#555',
              fontWeight: 500,
              fontFamily: 'inherit',
              width: 'fit-content',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* For Photographers */}
    <div>
      <h4
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#1a1a1a',
          margin: '0 0 20px',
          letterSpacing: '0.2px',
        }}
      >
        For Photographers
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          ['Join as Photographer', '/join-as-photographer'],
          ['KYC Verification', '/kyc-verification'],
          ['Photographer Login', '/photographer-login'],
          ['Dashboard', '/dashboard'],
          ['Support', '/support'],
        ].map(([label, to]) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '13.5px',
              color: '#555',
              fontWeight: 500,
              fontFamily: 'inherit',
              width: 'fit-content',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* Contact */}
    <div>
      <h4
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: '#1a1a1a',
          margin: '0 0 20px',
          letterSpacing: '0.2px',
        }}
      >
        Contact Us
      </h4>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontSize: '13.5px',
          color: '#555',
          fontWeight: 500,
        }}
      >
        <span>support@fulltimephotographer.com</span>
        <span>+91 98765 43210</span>
        <span>Rajkot, Gujarat, India</span>
        <span>Mon - Sat : 10:00 AM - 7:00 PM</span>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div
    style={{
      borderTop: '1px solid #ebebeb',
      padding: '18px 32px',
      textAlign: 'center',
      fontSize: '12px',
      color: '#999',
      fontWeight: 500,
    }}
  >
    © {new Date().getFullYear()} Fulltime Photographer. All Rights Reserved.{' '}
    <span style={{ color: '#1a1a1a', fontWeight: 700 }}>by DiGi Trend</span>
  </div>
</footer>

      <div className="views-accent-bar" />
    </div>
  );
};

export default PhotographerLayout;