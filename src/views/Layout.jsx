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
    // { icon: <FiCalendar size={15} />, label: 'My Bookings', action: () => navigate('/my-bookings') },
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
      <footer style={{ background: '#fff', borderTop: '1px solid #ebebeb' }}>
        <div style={{
          margin: '0 auto',
          padding: '36px 48px 0px',
          display: 'grid',
          gridTemplateColumns: '220px 1fr auto',
          gap: '40px',
          alignItems: 'start',
        }}>

          {/* Brand */}
          <div style={{marginTop:"-60px"}}>
            <img
              src={logo}
              alt="Online Photographer logo"
              style={{ width: '200px', height: 'auto', display: 'block' }}
            />           
             {/* <p style={{ fontSize: '12px', color: '#888', marginTop: '10px', fontWeight: 500 }}>
              A community for photographer
            </p> */}
          </div>

          {/* Links — shared "Useful Links" heading + 3 columns */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>
              Useful Links
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '0 48px' }}>
              {[
                ['FAQs', 'Customer Care'],
                ['About', 'Blog'],
                ['Privacy Policy', 'Terms'],
              ].map((col, ci) => (
                <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.map(link => (
                    <a key={link} href="#" style={{
                      fontSize: '13px', color: '#555', textDecoration: 'none',
                      fontWeight: 500, transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#555'}
                    >{link}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', paddingTop: '4px' }}>
            {[
              { content: <span style={{ fontSize: '16px', fontWeight: 700 }}>in</span>, bg: '#FFAE00' },
              { content: <BsInstagram size={19} />, bg: '#FFAE00' },
              { content: <span style={{ fontSize: '16px', fontWeight: 700 }}>f</span>, bg: '#FFAE00' },
            ].map((s, i) => (
              <div key={i} style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: s.bg, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'opacity 0.2s, transform 0.2s',
              }}
    
              >
                {s.content}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #ebebeb',
          padding: '14px 48px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#999',
          fontWeight: 500,
        }}>
          © 2025 online photographer | All rights reserved by{' '}
          <span style={{ color: '#1a1a1a', fontWeight: 700 }}>DIGI- Trend.</span>
        </div>
      </footer>

      {/* Gold accent bar */}
      <div className="views-accent-bar" />
    </div>
  );
};

export default ViewsLayout;