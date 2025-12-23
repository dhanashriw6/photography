import React from 'react';

const MarqueeStrip = () => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span className="marquee-item">Cinematic</span>
        <span className="marquee-item">editorial</span>
        <span className="marquee-item">Portrait</span>
        <span className="marquee-item">Film</span>
        <span className="marquee-item">Art</span>
        <span className="marquee-item">Cinematic</span>
        <span className="marquee-item">editorial</span>
        <span className="marquee-item">Portrait</span>
        <span className="marquee-item">Film</span>
        <span className="marquee-item">Art</span>
      </div>
      <div className="marquee-content" aria-hidden="true">
        <span className="marquee-item">Cinematic</span>
        <span className="marquee-item">editorial</span>
        <span className="marquee-item">Portrait</span>
        <span className="marquee-item">Film</span>
        <span className="marquee-item">Art</span>
        <span className="marquee-item">Cinematic</span>
        <span className="marquee-item">editorial</span>
        <span className="marquee-item">Portrait</span>
        <span className="marquee-item">Film</span>
        <span className="marquee-item">Art</span>
      </div>
    </div>
  );
};

export default MarqueeStrip;
