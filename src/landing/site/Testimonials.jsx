import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data/site";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
import { ScrollFloat } from "./ScrollFloat";
import { useFilmFrameStudioRating } from "@/landing/lib/google-place.functions";
export function Testimonials() {
    const [hasMounted, setHasMounted] = useState(false);
    const { data } = useFilmFrameStudioRating();
    useEffect(() => {
        setHasMounted(true);
    }, []);
    const googleReviews = (data?.reviews ?? []).map((r) => ({
        quote: r.text,
        name: r.name,
        role: r.relativeTime ? `Google review · ${r.relativeTime}` : "Google review",
        rating: Math.round(r.rating || 5),
        avatar: r.photo,
    }));
    const source = hasMounted && googleReviews.length > 0 ? googleReviews : testimonials;
    const loop = [...source, ...source];
    return (<section className="py-20 md:py-28 bg-bg-soft overflow-hidden noise-bg">
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="text-center mb-12">
          <motion.div variants={fadeUp}><SectionLabel>Testimonials</SectionLabel></motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-7xl mt-4 text-white">
            <ScrollFloat containerClassName="block">Loved by Clients & </ScrollFloat>
            <ScrollFloat containerClassName="block text-gradient-yellow">Creatives</ScrollFloat>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl mx-auto text-white/60">
            Real stories from people using Fulltime Photographers.
          </motion.p>
        </motion.div>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-bg-soft to-transparent"/>
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-bg-soft to-transparent"/>
        <div className="marquee-track py-4" aria-label="Client testimonials carousel">
          {loop.map((t, i) => (<article key={`${t.name}-${i}`} className="mx-2 shrink-0 w-[min(84vw,340px)] sm:w-[360px] md:mx-2.5 md:w-[420px] glass-card rounded-[22px] md:rounded-[26px] p-5 sm:p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:soft-glow-yellow">
              <Quote className="text-yellow" size={24}/>
              <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-1 text-yellow mt-5">
                {Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor"/>)}
              </div>
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/10">
                  <img src={t.avatar} alt={t.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-11 w-11 rounded-full object-cover bg-white/10"/>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-white/55">{t.role}</div>
                </div>
              </div>
            </article>))}
        </div>
      </div>
    </section>);
}
