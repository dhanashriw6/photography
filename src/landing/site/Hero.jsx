import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Aperture, Camera, Sparkles, Star } from "lucide-react";
import { fadeUp, stagger } from "@/landing/lib/motion";
import { Button } from "./Button";
import { FloatingIcon } from "./FloatingIcon";
import { HeroFloating } from "./HeroFloating";
import { LiquidText } from "./LiquidText";
import { useFilmFrameStudioRating } from "@/landing/lib/google-place.functions";
import heroBgVideo from "@/assets/Videos/herovideo.mp4";
const lineReveal = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const yellowReveal = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
    },
};
export function Hero() {
    const navigate = useNavigate();
    const { data } = useFilmFrameStudioRating();
    const rating = data?.rating ?? null;
    const reviewCount = data?.userRatingCount ?? null;
    const reviewers = (data?.reviewers ?? []).slice(0, 4);
    return (<section id="top" className="hero-section relative overflow-hidden noise-bg flex items-center min-h-[100dvh] pt-[110px] pb-8">
      {/* cinematic video background */}
      <video autoPlay loop muted playsInline preload="auto" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[0.32] pointer-events-none [filter:brightness(0.55)_contrast(1.1)_saturate(1.05)]" src={heroBgVideo}/>

      {/* readability overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(255,194,26,0.10), transparent 45%), linear-gradient(to bottom, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.45) 40%, rgba(8,8,10,0.82) 100%)",
        }}/>

      {/* subtle ambient glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vw] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,194,26,0.16), transparent 60%)" }}/>
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,107,53,0.08), transparent 65%)" }}/>

      {/* dot texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.18]" style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}/>

      {/* minimal drifting icons */}
      <FloatingIcon Icon={Camera} className="top-[22%] left-[8%] opacity-40" delay={0} size={22}/>
      <FloatingIcon Icon={Sparkles} className="top-[18%] right-[10%] opacity-40" delay={0.6} size={20} color="#F8F1DF"/>
      <FloatingIcon Icon={Aperture} className="bottom-[18%] left-[12%] opacity-30" delay={1.2} size={22}/>
      <FloatingIcon Icon={Star} className="bottom-[22%] right-[12%] opacity-30" delay={1.6} size={18}/>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="relative z-10 mx-auto w-full max-w-[1080px] px-6 md:px-10 text-center flex flex-col items-center">
        <HeroFloating />
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow/40 bg-yellow/10 font-label text-[12px] tracking-[0.12em] text-yellow mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow animate-pulse"/>
          Verified. Trusted. Professional.
        </motion.div>

        <h1 className="hero-title text-white text-center mx-auto">
          <motion.span variants={lineReveal} className="block whitespace-nowrap tone-muted">
            <LiquidText text="Book Verified"/>
          </motion.span>
          <motion.span variants={yellowReveal} className="hero-accent-line block whitespace-nowrap text-gradient-yellow">
            <LiquidText text="Photographers"/>
          </motion.span>
          <motion.span variants={lineReveal} className="block whitespace-nowrap tone-muted">
            <LiquidText text="for Every"/>
          </motion.span>
          <motion.span variants={yellowReveal} className="hero-accent-line block whitespace-nowrap">
            <span className=" text-gradient-yellow">
              <LiquidText text="Moment."/>
            </span>
          </motion.span>
        </h1>

        <motion.p variants={fadeUp} className="hero-subtext max-w-[720px] mx-auto text-[clamp(16px,1.15vw,19px)] text-white/70 leading-[1.42] mb-[26px]">
          Browse portfolios, compare styles, check availability, and book
          trusted photographers — all in one place.
        </motion.p>

        <motion.div variants={fadeUp} className="hero-actions flex flex-wrap justify-center gap-3.5 mb-7">
          <Button variant="primary" icon={<ArrowRight size={16}/>} onClick={() => navigate("/find-photographer")}>Find a Photographer</Button>
          <Button variant="secondary" onClick={() => navigate("/join-as-photographer")}>Join as Photographer</Button>
        </motion.div>

        <motion.div variants={fadeUp} className="hero-trust flex items-center justify-center gap-4 mb-[34px]">
          <div className="flex -space-x-3">
            {reviewers.map((r, i) => (<img key={i} src={r.photo} alt={r.name} referrerPolicy="no-referrer" className="h-9 w-9 rounded-full object-cover ring-2 ring-bg bg-white/10"/>))}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 text-yellow">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="currentColor"/>)}
              <span className="text-white text-sm ml-1 font-semibold">
                {rating != null ? rating.toFixed(1) : "—"}
              </span>
            </div>
            <p className="text-[11px] text-white/55 mt-0.5">
              {reviewCount != null
            ? `Based on ${reviewCount.toLocaleString()}+ Google reviews`
            : "Loading Google reviews…"}
            </p>
          </div>
        </motion.div>

      </motion.div>
    </section>);
}
