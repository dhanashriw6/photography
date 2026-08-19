import { motion } from "framer-motion";
import { ArrowRight, Camera, Film, Sparkles, Star } from "lucide-react";
import { Button } from "./Button";
import { FloatingIcon } from "./FloatingIcon";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
import { ScrollFloat } from "./ScrollFloat";
import { useNavigate } from "react-router-dom";
export function FinalCTA() {
    const navigate = useNavigate();
    return (<section className="relative py-24 md:py-32 overflow-hidden noise-bg" style={{ background: "linear-gradient(135deg, #FFC21A 0%, #F6B800 45%, #1A1208 100%)" }}>
      <FloatingIcon Icon={Camera} className="top-12 left-[8%]" color="#000"/>
      <FloatingIcon Icon={Sparkles} className="top-16 right-[12%]" delay={0.4} color="#000"/>
      <FloatingIcon Icon={Film} className="bottom-16 left-[18%]" delay={0.9} color="#000"/>
      <FloatingIcon Icon={Star} className="bottom-20 right-[20%]" delay={1.3} color="#000" size={22}/>

      <motion.div variants={stagger} {...inView} className="relative z-10 mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-8xl text-black leading-[0.92]">
          <ScrollFloat containerClassName="block">Ready to Capture Your</ScrollFloat>
          <br />
          <ScrollFloat containerClassName="block">Next Moment?</ScrollFloat>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-6 text-black/75 text-lg max-w-xl mx-auto">
          Find verified photographers or join the creative network today.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3 justify-center">
          <Button variant="dark" icon={<ArrowRight size={16}/>} onClick={() => navigate("/pre-launch/customer")}>Find a Photographer</Button>
          <button onClick={() => navigate("/pre-launch/photographer")} className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold border-2 border-black text-black hover:bg-black hover:text-yellow transition">
            Join as Photographer
          </button>
        </motion.div>
      </motion.div>
    </section>);
}
