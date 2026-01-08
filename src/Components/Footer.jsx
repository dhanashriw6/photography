import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Mail, Send, Camera, Film, Heart } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
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

  return (
    <footer style={{ 
      position: 'relative',
      padding: '6rem 2rem 2rem', 
      background: 'var(--color-soft-black)', 
      color: 'var(--color-paper-beige)',
      overflow: 'hidden'
    }}>
      {/* Animated Background Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(193,154,107,0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(138,92,59,0.25) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Decorative Badges */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '5%',
          zIndex: 15,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'var(--color-muted-gold)',
          border: '3px solid var(--color-paper-beige)',
          borderRadius: '50%',
          padding: '1rem',
          
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Camera size={28} color="var(--color-soft-black)" />
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          zIndex: 15,
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: 'var(--color-paper-beige)',
          border: '3px solid var(--color-muted-gold)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          padding: '1.2rem',
          boxShadow: '5px 5px 0px rgba(193,154,107,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Film size={26} color="var(--color-soft-black)" />
        </div>
      </motion.div>

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
          bottom: '20%',
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
          boxShadow: '4px 4px 0px rgba(244,236,220,0.3)'
        }}>
          <Heart size={24} color="var(--color-paper-beige)" fill="var(--color-paper-beige)" />
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: '5rem',
            padding: '3rem',
            background: 'rgba(244,236,220,0.05)',
            borderRadius: '30px',
            border: '2px solid rgba(244,236,220,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Send size={40} color="var(--color-muted-gold)" style={{ marginBottom: '1rem' }} />
          </motion.div>
          
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            marginBottom: '1rem',
            color: 'var(--color-paper-beige)',
            fontStyle: 'italic'
          }}>
            Stay In The Frame
          </h3>
          
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'var(--color-paper-beige)',
            opacity: 0.8,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Get exclusive photography tips, featured artists, and platform updates
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              display: 'flex',
              gap: '1rem',
              maxWidth: '500px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '1rem 1.5rem',
                borderRadius: '50px',
                border: '2px solid var(--color-muted-gold)',
                background: 'rgba(244,236,220,0.1)',
                color: 'var(--color-paper-beige)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(244,236,220,0.15)';
                e.target.style.borderColor = 'var(--color-paper-beige)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(244,236,220,0.1)';
                e.target.style.borderColor = 'var(--color-muted-gold)';
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(193,154,107,0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                border: 'none',
                background: 'var(--color-muted-gold)',
                color: 'var(--color-soft-black)',
                fontFamily: 'var(--font-body)',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Subscribe 
            </motion.button>
          </motion.div>
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
            marginBottom: '4rem',
            textAlign: 'left'
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
                marginBottom: '1.5rem',
                color: 'var(--color-muted-gold)',
                fontStyle: 'italic'
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
                        opacity: 0.8,
                        transition: 'opacity 0.3s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '1'}
                      onMouseLeave={(e) => e.target.style.opacity = '0.8'}
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
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--color-muted-gold), transparent)',
            marginBottom: '3rem',
            transformOrigin: 'center'
          }}
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}
        >
          {/* Brand */}
          <div>
            <motion.h2
              whileHover={{ scale: 1.05 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                color: 'var(--color-paper-beige)',
                margin: '0 0 0.5rem 0',
                fontStyle: 'italic',
                cursor: 'pointer'
              }}
            >
              Film Frame Studio
            </motion.h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--color-paper-beige)',
              opacity: 0.6,
              margin: 0
            }}>
              Where artistry meets opportunity
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
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: social.delay, duration: 0.4, type: 'spring' }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 360,
                  backgroundColor: social.color
                }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setIsHovered(idx)}
                onMouseLeave={() => setIsHovered(null)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: isHovered === idx ? social.color : 'rgba(244,236,220,0.1)',
                  border: `2px solid ${isHovered === idx ? social.color : 'var(--color-muted-gold)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <social.icon 
                  size={22} 
                  color={isHovered === idx ? '#fff' : 'var(--color-paper-beige)'} 
                />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(244,236,220,0.1)',
            textAlign: 'center'
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-paper-beige)',
            opacity: 0.5,
            margin: 0
          }}>
            &copy; {new Date().getFullYear()} Film Frame Studio. All Rights Reserved. Crafted with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ display: 'inline-block', color: 'var(--color-muted-gold)' }}
            >
              ♥
            </motion.span>
            {' '}for photographers
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
