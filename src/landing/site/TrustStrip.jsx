import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { trustFeatures } from "@/data/site";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
export function TrustStrip() {
    return (<section className="py-20 md:py-24 bg-bg noise-bg">
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="text-center mb-12">
          <motion.div variants={fadeUp}><SectionLabel>Why us</SectionLabel></motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl text-white mt-4">
            Why Choose <span className="text-gradient-yellow">Fulltime Photographers?</span>
          </motion.h2>
        </motion.div>
        <motion.div variants={stagger} {...inView} className="glass-card rounded-[28px] p-6 md:p-3 grid grid-cols-1 md:grid-cols-4 md:divide-x md:divide-white/10">
          {trustFeatures.map((f) => {
            const Ic = Icons[f.icon] ?? Icons.Shield;
            return (<motion.div key={f.title} variants={fadeUp} className="p-6 flex items-start gap-4">
                <span className="h-12 w-12 rounded-full bg-yellow text-black flex items-center justify-center shrink-0 yellow-glow">
                  <Ic size={20}/>
                </span>
                <div>
                  <h3 className="font-display text-lg text-white">{f.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{f.text}</p>
                </div>
              </motion.div>);
        })}
        </motion.div>
      </div>
    </section>);
}
