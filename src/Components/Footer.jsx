import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Mail, Send, Camera, Film, Heart, User, Phone, MessageSquare } from 'lucide-react';
import SectionSeparator from './SectionSeparator';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    message: ''
  });
  const [isHovered, setIsHovered] = useState(null);

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', color: '#E4405F', delay: 0 },
    { icon: Twitter, label: 'Twitter', color: '#1DA1F2', delay: 0.1 },
    { icon: Linkedin, label: 'LinkedIn', color: '#0A66C2', delay: 0.2 },
    { icon: Mail, label: 'Email', color: '#EA4335', delay: 0.3 }
  ];

  const footerLinks = [
    { title: 'For Clients', links: ['Browse Photographers', 'How It Works', 'Pricing', 'Portfolio Gallery'] },
    { title: 'For Photographers', links: ['Join Platform', 'Photographer Tools', 'Success Stories', 'Resources'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Press Kit', 'Contact'] }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 254, 250, 0.2)',
    background: 'rgba(255, 254, 250, 0.05)',
    color: 'var(--color-paper-beige)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const handleFocus = (e) => {
    e.target.style.background = 'rgba(255, 254, 250, 0.1)';
    e.target.style.borderColor = 'var(--color-khaki)';
  };

  const handleBlur = (e) => {
    e.target.style.background = 'rgba(255, 254, 250, 0.05)';
    e.target.style.borderColor = 'rgba(255, 254, 250, 0.2)';
  };

  return (
    <footer style={{
      position: 'relative',
      padding: '6rem 2rem 2rem',
      backgroundColor: 'var(--color-soft-black)',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 4L14 10L20 12L14 14L12 20L10 14L4 12L10 10z' fill='%23FFE24F'/%3E%3C/svg%3E")`,
      backgroundSize: '12px 12px',
      color: 'var(--color-paper-beige)',
      overflow: 'hidden'
    }}>
      <SectionSeparator flip={true} fill="var(--color-pale)" />

      {/* Animated Background Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,174,0,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,226,79,0.15) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: 0.8
        }}
      >
        <Film size={40} color="var(--color-khaki)" strokeWidth={1} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '30%',
          right: '8%',
          zIndex: 5,
          pointerEvents: 'none',
          opacity: 0.6
        }}
      >
        <Camera size={48} color="var(--color-khaki)" strokeWidth={1} />
      </motion.div>


      {/* Main Footer Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            marginBottom: '6rem',
            padding: '4rem 2rem',
            background: 'rgba(17, 18, 18, 0.7)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 226, 79, 0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '700px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              marginBottom: '1rem',
              color: 'var(--color-paper-beige)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}>
              Let's Create <span style={{ color: 'var(--color-khaki)', fontStyle: 'italic' }}>Magic</span>
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              color: 'var(--color-pale)',
              opacity: 0.8,
              lineHeight: 1.6
            }}>
              Have a project in mind or just want to say hello? Drop us a message and we'll get back to you soon.
            </p>
          </div>

          <form style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '900px'
          }}>
            <div style={{ position: 'relative', gridColumn: window.innerWidth < 768 ? 'span 2' : 'span 1' }}>
              <User size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: '3rem' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={{ position: 'relative', gridColumn: window.innerWidth < 768 ? 'span 2' : 'span 1' }}>
              <Phone size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: '3rem' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <Mail size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: '3rem' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={{ position: 'relative', gridColumn: 'span 2' }}>
              <MessageSquare size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '1rem', top: '1.2rem' }} />
              <textarea
                name="message"
                placeholder="Your Message..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: '3rem', resize: 'vertical' }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255, 174, 0, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '1rem 3rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--color-khaki)',
                  color: 'var(--color-soft-black)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}
              >
                Send Message
                <Send size={18} />
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            textAlign: 'left',
            backgroundColor: 'var(--color-soft-black)',
            padding: '2rem 2rem',
            borderRadius: '12px',
          }}
        >
          {footerLinks.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <h4 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                color: 'var(--color-khaki)',
                borderBottom: '2px solid rgba(255, 226, 79, 0.3)',
                paddingBottom: '0.5rem',
                display: 'inline-block'
              }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link, linkIdx) => (
                  <motion.li
                    key={linkIdx}
                    whileHover={{ x: 5 }}
                    style={{ marginBottom: '0.8rem' }}
                  >
                    <a
                      href="#"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        color: 'var(--color-paper-beige)',
                        textDecoration: 'none',
                        opacity: 0.7,
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.color = 'var(--color-khaki)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '0.7';
                        e.target.style.color = 'var(--color-paper-beige)';
                      }}
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(233, 212, 58, 0.1), transparent)',

        }} />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '10%',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          <div style={{
            background: 'var(--color-earth-brown)',
            border: '3px solid var(--color-paper-beige)',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '4px 4px 0px rgba(247,243,233,0.3)'
          }}>
            <Heart size={24} color="var(--color-paper-beige)" fill="var(--color-paper-beige)" />
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            padding: '2rem',
            borderRadius: '12px',
            backgroundColor: 'var(--color-soft-black)',
          }}
        >
          {/* Brand */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              color: 'var(--color-paper-beige)',
              margin: '0 0 0.5rem 0',
              cursor: 'pointer',
              letterSpacing: '1px'
            }}>
              FILM<span style={{ color: 'var(--color-khaki)' }}>FLARE</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: 0
            }}>
              © {new Date().getFullYear()} FilmFlare. Where stories come alive.
            </p>
          </div>

          {/* Social Links */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{
                  y: -5,
                  scale: 1.1,
                  backgroundColor: social.color,
                  borderColor: social.color
                }}
                onMouseEnter={() => setIsHovered(idx)}
                onMouseLeave={() => setIsHovered(null)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <social.icon
                  size={18}
                  color={isHovered === idx ? '#fff' : 'rgba(255, 255, 255, 0.6)'}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
