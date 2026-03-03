import React, { useState } from 'react';
import '../index.css';
import ViewsLayout from '../Layout';
import { useNavigate } from 'react-router-dom';

const STYLES = [
  {
    id: 'classic',
    label: 'Classic',
    image: 'https://images.unsplash.com/photo-1516031190212-da133013de50?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'fashion',
    label: 'Fashion / Editorial',
    image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'documentary',
    label: 'Documentary',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'minimal',
    label: 'Minimal / Natural',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'candid',
    label: 'Candid',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'traditional',
    label: 'Traditional',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d4?auto=format&fit=crop&w=900&q=80',
  },
];

const StyleCard = ({ item, isSelected, onClick, style }) => (
  <button
    onClick={() => onClick(item.id)}
    style={{
      ...style,
      position: 'relative',
      border: isSelected ? '3px solid #F5A623' : '3px solid transparent',
      borderRadius: '18px',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: 0,
      background: 'none',
      boxShadow: isSelected
        ? '0 12px 40px rgba(245,166,35,0.35)'
        : '0 6px 24px rgba(0,0,0,0.28)',
      transition: 'all 0.25s ease',
      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
    }}
  >
    <img
      src={item.image}
      alt={item.label}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: isSelected ? 'brightness(0.95)' : 'brightness(0.72)',
        transition: '0.3s',
        display: 'block',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
      }}
    />
    <span
      style={{
        position: 'absolute',
        bottom: '13px',
        left: '0',
        right: '0',
        textAlign: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: '14px',
        letterSpacing: '0.01em',
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}
    >
      {item.label}
    </span>
  </button>
);

const StylePrefer = () => {
  const [selected, setSelected] = useState('minimal');
  const navigate = useNavigate();

  const get = (id) => STYLES.find((s) => s.id === id);

  return (
    <ViewsLayout>
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          padding: '20px 12px ',
          boxSizing: 'border-box',
          
        }}
      >
        {/* ── Main grid ── */}
        <div
          style={{
            display: 'grid',
            /* col1=left-pair | col2=documentary | col3=center | col4=candid | col5=right-pair */
            gridTemplateColumns: '165px 155px 1fr 155px 175px',
            gridTemplateRows: '240px 280px',
            gap: '14px',
            alignItems: 'stretch',
          }}
        >
          {/* ── Col 1 top: Classic ── */}
          <StyleCard
            item={get('classic')}
            isSelected={selected === 'classic'}
            onClick={setSelected}
            style={{ gridColumn: '1', gridRow: '1' }}
          />

          {/* ── Col 1 bottom: Fashion / Editorial ── */}
          <StyleCard
            item={get('fashion')}
            isSelected={selected === 'fashion'}
            onClick={setSelected}
            style={{ gridColumn: '1', gridRow: '2' }}
          />

          {/* ── Col 2 bottom: Documentary (only row 2) ── */}
          <StyleCard
            item={get('documentary')}
            isSelected={selected === 'documentary'}
            onClick={setSelected}
            style={{ gridColumn: '2', gridRow: '2' }}
          />

          {/* ── Col 2 top + col 3 top: heading block ── */}
          <div
            style={{
              gridColumn: '2 / 5',
              gridRow: '1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingLeft: '14px',
              position: 'relative',
            }}
          >
          

            {/* Heading */}
            <h2
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#111',
                margin:'auto',
                marginTop:'15%',
                
                lineHeight: 1.25,
              }}
              
            >
              What style do you prefer most.....?
            </h2>

         

            {/* ── Center: Minimal/Natural card ── */}
            <div style={{ flex: 1 }} />
          </div>

          {/* ── Col 3: Minimal / Natural — spans both rows ── */}
          <div
            style={{
              gridColumn: '3',
              gridRow: '2',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <StyleCard
              item={get('minimal')}
              isSelected={selected === 'minimal'}
              onClick={setSelected}
              style={{ flex: 1 }}
            />
            {/* Next button below center card */}
             <button type="submit" className="su-btn-primary" onClick={() => navigate('/tell-us')}>Next</button>
          </div>

          {/* ── Col 4 bottom: Candid ── */}
          <StyleCard
            item={get('candid')}
            isSelected={selected === 'candid'}
            onClick={setSelected}
            style={{ gridColumn: '4', gridRow: '2' }}
          />

          {/* ── Col 5 top: Cinematic (taller) ── */}
          <StyleCard
            item={get('cinematic')}
            isSelected={selected === 'cinematic'}
            onClick={setSelected}
            style={{ gridColumn: '5', gridRow: '1' }}
          />

          {/* ── Col 5 bottom: Traditional ── */}
          <StyleCard
            item={get('traditional')}
            isSelected={selected === 'traditional'}
            onClick={setSelected}
            style={{ gridColumn: '5', gridRow: '2' }}
          />
        </div>
      </div>

    </ViewsLayout>
  );
};

export default StylePrefer;
