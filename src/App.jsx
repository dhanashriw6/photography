import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import all components
import {
  Navigation,
  Hero,
  CustomCursor,
  ScrollProgress,
  MarqueeStrip,
  Features,
  ImageGallery,
  FAQ,
  CTASection,
  Footer,
  VideoShowcase,
  PinterestGrid,
  StatsCounter,
  Testimonials
} from './Components';
import Hero2 from './Components/Hero2';

function App() {
  return (
    <div className="App">
     
      <Routes>
        <Route path="/" element={<Hero2 />} />
        <Route path="/v1" element={<Hero2 />} />
      </Routes>
   
      <ScrollProgress />
      <CustomCursor />
      <div className="grain-overlay" />
      <Navigation />
      <MarqueeStrip />
      <Hero />
      {/* <ImageGallery /> */}
      <VideoShowcase />
      <StatsCounter />
      <PinterestGrid />
      <Testimonials />
      {/* <Features /> */}
      <FAQ />
      {/* <CTASection /> */}
      <Footer />
    </div>
  );
}

export default App;
