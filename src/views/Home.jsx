import { lazy, Suspense } from 'react';
import '../landing/landing.css';
import { Header } from '@/landing/site/Header';
import { Hero } from '@/landing/site/Hero';
import { CardCarousel } from '@/landing/site/CardCarousel';
import { Categories } from '@/landing/site/Categories';
import { TrustStrip } from '@/landing/site/TrustStrip';
import { Stats } from '@/landing/site/Stats';
import { ScrollReveal } from '@/landing/site/ScrollReveal';
import FulltimeLogoLoader from '@/landing/site/LogoLoader';

// Below-the-fold sections — code-split to shrink the initial bundle.
const HowItWorks = lazy(() => import('@/landing/site/HowItWorks').then((m) => ({ default: m.HowItWorks })));
// const FeaturedPhotographers = lazy(() => import('@/landing/site/FeaturedPhotographers').then((m) => ({ default: m.FeaturedPhotographers })));
const LogoLoader = lazy(() => import('@/landing/site/LogoLoader'));
const VideoPreview = lazy(() => import('@/landing/site/VideoPreview').then((m) => ({ default: m.VideoPreview })));
const SplitCTA = lazy(() => import('@/landing/site/SplitCTA').then((m) => ({ default: m.SplitCTA })));
const Gallery = lazy(() => import('@/landing/site/Gallery').then((m) => ({ default: m.Gallery })));
const Testimonials = lazy(() => import('@/landing/site/Testimonials').then((m) => ({ default: m.Testimonials })));
const FAQAccordion = lazy(() => import('@/landing/site/FAQAccordion').then((m) => ({ default: m.FAQAccordion })));
const FinalCTA = lazy(() => import('@/landing/site/FinalCTA').then((m) => ({ default: m.FinalCTA })));
const Footer = lazy(() => import('@/landing/site/Footer').then((m) => ({ default: m.Footer })));

const SectionFallback = () => <div aria-hidden className="min-h-[40vh]" />;

const Home = () => {
  return (
    <main className="ff-landing min-h-screen bg-bg text-white overflow-x-hidden">
  <Header />
  <Hero />
  <div id="carousel"><ScrollReveal><CardCarousel /></ScrollReveal></div>
  <div id="categories"><ScrollReveal><Categories /></ScrollReveal></div>
  <div id="trust"><ScrollReveal><TrustStrip /></ScrollReveal></div>
  <div id="stats"><ScrollReveal><Stats /></ScrollReveal></div>
  <Suspense fallback={<SectionFallback />}>
    <div id="process"><ScrollReveal><HowItWorks /></ScrollReveal></div>
    {/* <div id="portfolio"><ScrollReveal><FeaturedPhotographers /></ScrollReveal></div> */}
    {/* <div id="logo-loader">        <FulltimeLogoLoader /></div> */}
    <ScrollReveal><VideoPreview /></ScrollReveal>
    <div id="choose-your-path"><ScrollReveal><SplitCTA /></ScrollReveal></div>
    <div id="gallery"><ScrollReveal><Gallery /></ScrollReveal></div>
    <div id="testimonials"><ScrollReveal><Testimonials /></ScrollReveal></div>
    <div id="faqs"><ScrollReveal><FAQAccordion /></ScrollReveal></div>
    <ScrollReveal><FinalCTA /></ScrollReveal>
    <div id="footer"><Footer /></div>
  </Suspense>
</main>
  );
};

export default Home;
