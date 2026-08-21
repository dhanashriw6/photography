import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { categories } from "@/data/site";
import { CategoryCard } from "./CategoryCard";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function Categories() {
  const trackRef = useRef(null);
  // more cards per page on larger screens so the pagination math feels right
  const pages = chunk(categories, 6);

  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section id="categories" className="section-cream py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 lg:px-14">
        <motion.div
          variants={stagger}
          {...inView}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 sm:gap-6 mb-8 sm:mb-10 md:mb-12"
        >
          <div>
            <motion.div variants={fadeUp}>
              <SectionLabel tone="light">Explore</SectionLabel>
            </motion.div>
            <motion.h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl mt-3 sm:mt-4 text-black" variants={fadeUp}>
              Popular Categories
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-black/60">
              Explore photography services by occasion, style, and business need.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="flex items-center justify-between md:justify-start gap-3">
            <a href="#" className="group inline-flex items-center gap-2 text-black font-semibold text-sm">
              Explore all categories
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                aria-label="Previous categories"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                aria-label="Next categories"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-black/15 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={trackRef}
          variants={stagger}
          {...inView}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 sm:gap-8 lg:gap-10 -mx-3 px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full min-w-full shrink-0 snap-start"
            >
              {page.map((c) => (
                <motion.div key={c.title} variants={fadeUp} className="h-full">
                  <CategoryCard {...c} />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* prev/next visible below lg where the header buttons are hidden */}
        <div className="flex md:hidden items-center justify-center gap-3 mt-5 sm:mt-6">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Previous categories"
            className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center active:bg-black active:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Next categories"
            className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center active:bg-black active:text-white transition-colors"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}