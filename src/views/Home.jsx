import React from 'react';
import {
  Navigation,
  Hero,
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
  Testimonials,
  Categories,
} from '../Components';
import Hero2 from '../Components/Hero2';

const Home = () => {
  return (
    <div className="App">
      {/* Global elements that feel like part of the landing flow */}
      <div className="grain-overlay" />
      <Navigation />
      <ScrollProgress />

      {/* Hero 2 is the first screen users see */}
      <Hero2 />

      {/* Rest of the long-form homepage sections */}
      <Categories />
      <MarqueeStrip />
      <StatsCounter />
      <VideoShowcase />
      <Hero />
      {/* <ImageGallery /> */}
      <PinterestGrid />
      <Testimonials />
      <FAQ />
      <Features />
      {/* <CTASection /> */}

      {/* Common footer for all views */}
      <Footer />
    </div>
  );
};

export default Home;

