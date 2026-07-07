import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import { stats } from "@/data/site";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
function Count({ value, suffix }) {
    const ref = useRef(null);
    const visible = useInView(ref, { once: true, margin: "-80px" });
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!visible)
            return;
        const duration = 1600;
        const start = performance.now();
        let raf = 0;
        const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            setN(Math.floor(p * value));
            if (p < 1)
                raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [visible, value]);
    return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}
export function Stats() {
    return (<section className="relative py-20 md:py-28 bg-bg-soft overflow-hidden">
      <Sparkles className="absolute left-10 top-16 text-yellow/40" size={60}/>
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-yellow/40 to-transparent"/>
      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="text-center mb-14">
          <motion.div variants={fadeUp}><SectionLabel>Our Impact</SectionLabel></motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl text-white mt-4">
            Numbers That <span className="text-gradient-yellow">Build Trust</span>
          </motion.h2>
        </motion.div>
        <motion.div variants={stagger} {...inView} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((s) => (<motion.div key={s.label} variants={fadeUp} className="text-center">
              <div className="font-display text-5xl md:text-7xl text-gradient-yellow">
                <Count value={s.value} suffix={s.suffix}/>
              </div>
              <div className="font-label text-xs text-muted-brand mt-3">{s.label}</div>
            </motion.div>))}
        </motion.div>
      </div>
    </section>);
}
