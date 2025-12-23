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
  UserPaths,
  Features,
  ImageGallery,
  FAQ,
  CTASection,
  Footer
} from './Components';
import Hero2 from './Components/Hero2';

function App() {
  return (
    <div className="App">
     
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/v1" element={<Hero2 />} />
      </Routes>
   
      <ScrollProgress />
      <CustomCursor />
      <div className="grain-overlay" />
      <Navigation />
      <Hero />
      <MarqueeStrip />
      <ImageGallery />
      <div style={{ padding: '0 0' }}>
        <UserPaths />
      </div>
      {/* <Features /> */}
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;
