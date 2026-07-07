import { motion } from "framer-motion";
import { ParallaxScroll } from "@/landing/ui/parallax-scroll";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
import { ScrollFloat } from "./ScrollFloat";
const galleryImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
];
export function Gallery() {
    return (<section className="py-20 md:py-28 bg-bg overflow-hidden noise-bg">
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="text-center mb-10">
          <motion.div variants={fadeUp}><SectionLabel>Our Gallery</SectionLabel></motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-7xl mt-4 text-white">
            <ScrollFloat containerClassName="block">Moments Captured </ScrollFloat>
            <ScrollFloat containerClassName="block text-gradient-yellow">in Frame</ScrollFloat>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl mx-auto text-white/60">
            A curated look at shoots delivered by our verified photographers.
          </motion.p>
        </motion.div>
      </div>
      <ParallaxScroll images={galleryImages}/>
    </section>);
}
