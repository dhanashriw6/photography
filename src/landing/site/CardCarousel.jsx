import { useEffect, useState } from "react";
import { CylinderCarousel } from "@/landing/ui/cylinder-carousel";
import { IMG } from "@/data/site";
import { ScrollFloat } from "./ScrollFloat";
const images = [
    { src: IMG.heroWedding, alt: "Wedding" },
    { src: IMG.heroPortrait, alt: "Portrait" },
    { src: IMG.heroTravel, alt: "Travel" },
    { src: IMG.heroProduct, alt: "Product" },
    { src: IMG.heroEvent, alt: "Event" },
    { src: IMG.catFashion, alt: "Fashion" },
    { src: IMG.catCommercial, alt: "Commercial" },
    { src: IMG.bubble1, alt: "Creative" },
    { src: IMG.bubble4, alt: "Studio" },
    { src: IMG.ph1, alt: "Photographer" },
];
export function CardCarousel() {
    const [cardWidth, setCardWidth] = useState(250);
    useEffect(() => {
        const update = () => {
            const width = Math.round(window.innerWidth / 2.95);
            setCardWidth(Math.min(480, Math.max(132, width)));
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return (<section className="relative py-16 md:py-24 noise-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(circle at center, rgba(255,194,26,0.08), transparent 60%)",
        }}/>
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 text-center">
        <h2 className="font-display editorial-display">
          <ScrollFloat containerClassName="block tone-muted">Make every shoot</ScrollFloat>
          <ScrollFloat containerClassName="block text-gradient-yellow">the experience.</ScrollFloat>
        </h2>
        <p className="max-w-2xl mx-auto mt-6 text-white/65 text-base md:text-lg">
          From first search to final delivery — a glimpse of the moments
          our photographers create every day.
        </p>
      </div>
      <div className="relative mt-8 w-screen left-1/2 -translate-x-1/2 overflow-hidden md:mt-12">
        <CylinderCarousel images={images} animationDuration={32} cardWidth={cardWidth} className="h-[clamp(280px,48vw,700px)]"/>
      </div>
    </section>);
}
