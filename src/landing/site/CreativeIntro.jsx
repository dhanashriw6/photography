import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { IMG } from "@/data/site";
import { Button } from "./Button";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
import { ScrollFloat } from "./ScrollFloat";
const bubbles = [
    { src: IMG.bubble1, className: "left-[6%] top-[10%] w-20 h-20 md:w-28 md:h-28", delay: 0 },
    { src: IMG.bubble2, className: "left-[12%] bottom-[14%] w-24 h-24 md:w-32 md:h-32", delay: 0.6 },
    { src: IMG.bubble3, className: "right-[8%] top-[8%] w-20 h-20 md:w-28 md:h-28", delay: 0.3 },
    { src: IMG.bubble4, className: "right-[14%] bottom-[18%] w-24 h-24 md:w-36 md:h-36", delay: 0.9 },
    { src: IMG.bubble5, className: "left-[42%] top-[2%] w-16 h-16 md:w-24 md:h-24", delay: 1.2 },
];
export function CreativeIntro() {
    return (<section className="relative pt-14 pb-24 md:pt-16 md:pb-32 noise-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(255,194,26,0.08), transparent 50%)" }}/>
      <div className="relative mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        {bubbles.map((b, i) => (<motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }} className={`absolute rounded-full overflow-hidden border border-white/15 hidden md:block ${b.className}`}>
            <motion.img src={b.src} alt="" className="w-full h-full object-cover" animate={{ y: [0, -10, 0] }} transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: b.delay }}/>
          </motion.div>))}
        <motion.div variants={stagger} {...inView}>
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow/40 bg-yellow/10 font-label text-[11px] text-yellow">
            <BadgeCheck size={14}/> Trusted Creative Network
          </motion.span>
          <motion.h2 variants={fadeUp} className="font-display editorial-display mt-7">
            <ScrollFloat containerClassName="block tone-muted">Make every shoot</ScrollFloat>
            <br />
            <ScrollFloat containerClassName="block text-gradient-yellow">the experience.</ScrollFloat>
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto mt-6 text-white/65 text-lg">
            From first search to final delivery, Fulltime Photographers makes
            it simple to find the right creative for your moment.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex justify-center">
            <Button variant="primary" icon={<ArrowRight size={16}/>}>Explore Platform</Button>
          </motion.div>
        </motion.div>
      </div>
    </section>);
}
