import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { clientSteps, photographerSteps } from "@/data/site";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
import FulltimeLogoLoader from "./LogoLoader";
function Card({ kind, title, subtitle, steps }) {
    const isClient = kind === "client";
    const accent = isClient ? "bg-black text-yellow" : "bg-yellow text-black";
    const offset = isClient ? "lg:translate-y-0" : "lg:translate-y-10";
    return (<motion.div variants={fadeUp} className={`relative rounded-[32px] bg-white border border-black/5 p-8 md:p-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] transform ${offset}`}>
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-yellow to-transparent"/>
      <div className="flex items-center gap-3">
        <span className={`font-label text-[11px] px-3 py-1 rounded-full ${accent}`}>{title}</span>
        <span className="text-xs text-black/40">{steps.length} steps</span>
      </div>
      <h3 className="font-display text-3xl md:text-4xl mt-4 text-black tracking-tight">{subtitle}</h3>

      <div className="mt-10 relative">
        {/* animated connector */}
        <svg className="hidden md:block absolute left-0 right-0 top-7 h-2 w-full pointer-events-none" viewBox="0 0 600 4" preserveAspectRatio="none">
          <motion.line x1="20" x2="580" y1="2" y2="2" stroke="#FFC21A" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.2, ease: "easeOut" }}/>
        </svg>
        <div className="md:hidden absolute left-7 top-2 bottom-2 w-px border-l border-dashed border-yellow/60"/>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-3">
          {steps.map((s, i) => {
            const Ic = Icons[s.icon] ?? Icons.Circle;
            return (<motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: "easeOut" }} whileHover={{ y: -4 }} className="group relative md:text-center flex md:flex-col gap-4 md:gap-3 items-start md:items-center">
                <span className="relative h-14 w-14 rounded-full bg-black text-yellow flex items-center justify-center shrink-0 z-10 transition-shadow group-hover:shadow-[0_0_30px_rgba(255,194,26,0.55)]">
                  <Ic size={20}/>
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-yellow text-black text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {i + 1}
                  </span>
                </span>
                <div className="md:mt-2">
                  <div className="font-semibold text-black tracking-tight">{s.title}</div>
                  <p className="text-xs text-black/55 mt-1 leading-relaxed">{s.text}</p>
                </div>
              </motion.div>);
        })}
        </div>
      </div>
    </motion.div>);
}
export function HowItWorks() {
    return (<section id="how" className="section-cream cream-noise py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="text-center mb-16">
          <motion.div variants={fadeUp}><SectionLabel tone="light">How it works</SectionLabel></motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-7xl mt-4 text-black">
            Simple Steps, <br className="md:hidden"/> <span className="text-gradient-yellow">Amazing</span> Results
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl mx-auto text-black/60">
            A smooth booking journey for clients and a growth platform for photographers.
          </motion.p>
        </motion.div>
        <motion.div variants={stagger} {...inView} className="grid lg:grid-cols-2 gap-8 items-start">
          <Card kind="client" title="For Clients" subtitle="Book in four simple steps" steps={clientSteps}/>
          <Card kind="photographer" title="For Photographers" subtitle="Grow your photography business" steps={photographerSteps}/>
        </motion.div>
      </div>
    </section>);
}
