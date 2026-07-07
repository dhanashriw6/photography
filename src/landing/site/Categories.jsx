import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/site";
import { CategoryCard } from "./CategoryCard";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
export function Categories() {
    return (<section id="categories" className="section-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <motion.div variants={fadeUp}><SectionLabel tone="light">Explore</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-7xl mt-4 text-black">
              Popular Categories
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl text-black/60">
              Explore photography services by occasion, style, and business need.
            </motion.p>
          </div>
          <motion.a variants={fadeUp} href="#" className="group inline-flex items-center gap-2 text-black font-semibold text-sm">
            Explore all categories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1"/>
          </motion.a>
        </motion.div>
        <motion.div variants={stagger} {...inView} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => (<motion.div key={c.title} variants={fadeUp}>
              <CategoryCard {...c}/>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
