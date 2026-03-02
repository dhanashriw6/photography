import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';

const STYLES = [
  {
    id: 'classic',
    label: 'Classic',
    image:
      'https://images.unsplash.com/photo-1516031190212-da133013de50?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'fashion',
    label: 'Fashion / Editorial',
    image:
      'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'documentary',
    label: 'Documentary',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'minimal',
    label: 'Minimal / Natural',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'candid',
    label: 'Candid',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'traditional',
    label: 'Traditional',
    image:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
  },
];

const StylePrefer = () => {
  const [selected, setSelected] = useState('minimal');

  return (
    <ViewsLayout>
      <div className="w-full" style={{ maxWidth: '960px', marginBottom: '70px' }}>
        {/* Question */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p
            style={{
              fontSize: '40px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: '#111',
              marginBottom: '6px',
            }}
          >
            What style do you prefer most.....?
          </p>
        </div>

        {/* Cards Layout (matching reference) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: 'repeat(2, 220px)',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {STYLES.map((item) => {
            const isActive = item.id === selected;

            // Custom layout positions
            const layoutMap = {
              classic: { col: '1 / 2', row: '1 / 2' },
              fashion: { col: '1 / 2', row: '2 / 3' },
              documentary: { col: '2 / 3', row: '2 / 3' },
              minimal: { col: '2 / 4', row: '1 / 3' }, // big center
              candid: { col: '4 / 5', row: '1 / 2' },
              traditional: { col: '4 / 5', row: '2 / 3' },
              cinematic: { col: '5 / 6', row: '1 / 3' }, // tall right
            };

            return (
              <button
                key={item.id}
                onClick={() => setSelected(item.id)}
                style={{
                  gridColumn: layoutMap[item.id].col,
                  gridRow: layoutMap[item.id].row,
                  position: "relative",
                  border: "none",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 20px 45px rgba(0,0,0,0.35)"
                    : "0 10px 20px rgba(0,0,0,0.25)",
                  transition: "all 0.2s ease",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isActive ? "brightness(1)" : "brightness(0.8)",
                    transition: "0.3s",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2), transparent)",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "16px",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type="button" className="su-btn-primary" style={{ maxWidth: '260px' }}>
            Next
          </button>
        </div>
      </div>
    </ViewsLayout>
  );
};

export default StylePrefer;
