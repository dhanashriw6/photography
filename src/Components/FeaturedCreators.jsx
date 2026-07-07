import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, MapPin, Star } from "lucide-react";
import { featuredPhotographers, photographerFilters } from "../data/site";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "../utils/motion";
export default function FeaturedPhotographers() {
    const [filter, setFilter] = useState("All");
    const list = filter === "All" ? featuredPhotographers : featuredPhotographers.filter(p => p.category === filter);
    return (<section id="photographers" className="py-20 md:py-28 bg-bg noise-bg">
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <motion.div variants={fadeUp}><SectionLabel>Featured</SectionLabel></motion.div>
            <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-7xl mt-4 text-white">
              Featured <span className="text-gradient-yellow">creators</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-xl text-white/60">
              Explore verified photographers ready for your next shoot.
            </motion.p>
          </div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {photographerFilters.map(f => (<button key={f} onClick={() => setFilter(f)} className={`text-xs px-4 py-2 rounded-full border transition ${filter === f
                ? "bg-yellow text-black border-yellow"
                : "border-white/15 text-white/70 hover:text-yellow hover:border-yellow/50"}`}>
                {f}
              </button>))}
          </motion.div>
        </motion.div>

        <motion.div variants={stagger} {...inView} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {list.map((p) => (<motion.article key={p.name} variants={fadeUp} whileHover={{ y: -6 }} className="group glass-card rounded-[26px] overflow-hidden">
              <div className="relative h-[280px] overflow-hidden">
                <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                <span className={`absolute top-3 left-3 text-[10px] font-label px-2.5 py-1 rounded-full ${p.available ? "bg-yellow text-black" : "bg-black/70 text-white/80"}`}>
                  {p.available ? "Available" : "Booked"}
                </span>
                <span className="absolute top-3 right-3 h-8 w-8 rounded-full bg-bg/70 backdrop-blur text-yellow flex items-center justify-center">
                  <BadgeCheck size={14}/>
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl text-white truncate">{p.name}</h3>
                    <p className="text-xs text-white/55 mt-0.5">{p.category} Photographer</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow text-sm font-semibold">
                    <Star size={14} fill="currentColor"/>{p.rating}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                  <span className="inline-flex items-center gap-1"><MapPin size={12}/>{p.city}</span>
                  <span>From <span className="text-white font-semibold">{p.price}</span></span>
                </div>
                <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-yellow hover:text-black text-white text-sm font-semibold py-2.5 transition">
                  View Profile <ArrowUpRight size={14}/>
                </button>
              </div>
            </motion.article>))}
        </motion.div>
      </div>
    </section>);
}
