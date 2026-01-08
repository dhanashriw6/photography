import React from 'react';
import { Clapperboard, Camera, Aperture, Film, Palette, Sparkles, Star, Music } from 'lucide-react';


const MarqueeStrip = () => {
  const baseItems = [
    { text: "Cinematic", icon: Clapperboard },
    { text: "Editorial", icon: Aperture },
    { text: "Portrait", icon: Camera },
    { text: "Film", icon: Film },
    { text: "Art", icon: Palette },
    { text: "Design", icon: Sparkles },
    { text: "Creative", icon: Star },
    { text: "Studio", icon: Music },
  ];

  
  const items = [...baseItems];

  return (
    <div className="marquee-container">
      
      <div className="marquee-content">
        {items.map((item, index) => (
          <div 
            key={`strip-1-${index}`} 
            className="marquee-item-wrapper"
            style={{ '--i': index }}
          >
            <span className="marquee-item">
              <item.icon className="marquee-icon" size={32} />
              {item.text}
            </span>
          </div>
        ))}
      </div>
      <div className="marquee-content" aria-hidden="true">
        {items.map((item, index) => (
          <div 
            key={`strip-2-${index}`} 
            className="marquee-item-wrapper"
            style={{ '--i': index }}
          >
            <span className="marquee-item">
              <item.icon className="marquee-icon" size={32} />
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
