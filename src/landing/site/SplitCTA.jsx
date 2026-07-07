import { motion } from "framer-motion";
import { ArrowRight, Camera, UserPlus } from "lucide-react";
import { IMG } from "@/data/site";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
const cards = [
    { title: "Hire a Photographer", text: "Find the perfect photographer for your event, project, or special moment.", cta: "Find a Photographer", image: IMG.splitClient, Icon: Camera },
    { title: "Join as Photographer", text: "Showcase your talent, manage bookings, and grow your creative business.", cta: "Create Profile", image: IMG.splitPhotographer, Icon: UserPlus },
];
export function SplitCTA() {
    return (<section id="pricing" className="py-20 md:py-28 bg-bg">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="grid md:grid-cols-2 gap-5">
          {cards.map((c) => (<motion.article key={c.title} variants={fadeUp} whileHover={{ y: -6 }} className="group relative h-[420px] rounded-[28px] overflow-hidden border border-white/10">
              <img src={c.image} alt={c.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 card-overlay"/>
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                <span className="h-12 w-12 rounded-2xl bg-yellow text-black flex items-center justify-center mb-5">
                  <c.Icon size={20}/>
                </span>
                <h3 className="font-display text-4xl md:text-5xl text-white">
                  <span className="text-gradient-yellow">{c.title.split(" ")[0]}</span> {c.title.split(" ").slice(1).join(" ")}
                </h3>
                <p className="mt-3 text-white/75 max-w-md">{c.text}</p>
                <button className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-yellow transition">
                  {c.cta} <ArrowRight size={14}/>
                </button>
              </div>
            </motion.article>))}
        </motion.div>
      </div>
    </section>);
}
