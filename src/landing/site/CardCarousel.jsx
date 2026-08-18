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

// How much of the viewport width the ring should try to span on large
// screens. Kept below 1 so there's still a bit of breathing room at the
// edges, and capped in px so ultra-wide/4K monitors don't blow the ring
// out to an unreasonable size.
const TARGET_VIEWPORT_FILL = 0.94;
const MAX_RING_DIAMETER = 2400;
const EM_PX = 8; // approximates 0.5em at a 16px base font size

export function CardCarousel() {
  const [cardWidth, setCardWidth] = useState(250);
  const [ringGap, setRingGap] = useState(0);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;

      const width = Math.round(vw / 2.95);
      const w = Math.min(480, Math.max(132, width));
      setCardWidth(w);

      // The ring's natural diameter is fixed to card width (diameter =
      // cardWidth / tan(halfAngle)). Once cardWidth hits its cap on large
      // screens, the ring stops growing even though the container keeps
      // getting wider, leaving empty space on both sides. Adding an
      // independent radial "gap" lets the ring keep expanding to fill the
      // viewport without inflating (and cropping) the individual cards.
      const N = images.length;
      const halfAngle = Math.PI / N;
      const targetDiameter = Math.min(vw * TARGET_VIEWPORT_FILL, MAX_RING_DIAMETER);
      const rawGap = (Math.tan(halfAngle) * targetDiameter) / 2 - w / 2 - EM_PX;
      setRingGap(Math.max(0, Math.round(rawGap)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="relative py-16 md:py-24 noise-bg overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,194,26,0.08), transparent 60%)",
        }}
      />
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
        <CylinderCarousel
          images={images}
          animationDuration={32}
          cardWidth={cardWidth}
          gap={ringGap}
          className="h-[clamp(280px,48vw,700px)]"
        />
      </div>
    </section>
  );
}