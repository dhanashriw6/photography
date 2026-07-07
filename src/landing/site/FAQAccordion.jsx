import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { faqs } from "@/data/site";
import { Button } from "./Button";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
export function FAQAccordion() {
    const [open, setOpen] = useState(0);
    return (<section className="py-20 md:py-28 bg-bg noise-bg">
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14 grid lg:grid-cols-[1fr_1.3fr] gap-12">
        <motion.div variants={stagger} {...inView}>
          <motion.div variants={fadeUp}><SectionLabel>FAQ</SectionLabel></motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-6xl mt-4 text-white leading-[0.95]">
            Got Questions? <br />
            <span className="text-gradient-yellow">We Have Answers.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-white/60">
            Everything you need to know before you book or get started.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button variant="secondary">Contact Support</Button>
          </motion.div>
        </motion.div>

        <motion.div variants={stagger} {...inView} className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const active = open === i;
            return (<motion.div key={f.q} variants={fadeUp} className={`rounded-2xl border transition-colors ${active ? "border-yellow/50 bg-yellow/[0.04]" : "border-white/10 bg-white/[0.02]"}`}>
                <button onClick={() => setOpen(active ? null : i)} className="w-full flex items-center justify-between gap-4 text-left p-5 md:p-6">
                  <span className={`font-semibold ${active ? "text-yellow" : "text-white"}`}>{f.q}</span>
                  <span className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center transition ${active ? "bg-yellow text-black" : "bg-white/10 text-white"}`}>
                    {active ? <Minus size={16}/> : <Plus size={16}/>}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="overflow-hidden">
                      <p className="px-6 pb-6 text-white/65 leading-relaxed">{f.a}</p>
                    </motion.div>)}
                </AnimatePresence>
              </motion.div>);
        })}
        </motion.div>
      </div>
    </section>);
}
