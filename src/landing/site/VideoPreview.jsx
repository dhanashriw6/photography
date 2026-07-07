import { motion } from "framer-motion";
import { BatteryFull, Play } from "lucide-react";
import { useRef, useState } from "react";
import { IMG } from "@/data/site";
import { Button } from "./Button";
import { SectionLabel } from "./SectionLabel";
import { fadeUp, inView, stagger } from "@/landing/lib/motion";
const WEDDING_VIDEO_URL = "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4";
export function VideoPreview() {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const handlePlay = () => {
        setPlaying(true);
        requestAnimationFrame(() => {
            videoRef.current?.play().catch(() => { });
        });
    };
    return (<section className="section-cream py-20 md:py-28 relative">
      <svg className="absolute -top-px left-0 right-0 w-full h-12 text-bg" preserveAspectRatio="none" viewBox="0 0 1440 60">
        <path d="M0,60 C360,0 1080,80 1440,20 L1440,0 L0,0 Z" fill="currentColor"/>
      </svg>
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <motion.div variants={stagger} {...inView} className="text-center mb-12">
          <motion.div variants={fadeUp}><SectionLabel tone="light">Showreel</SectionLabel></motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-5xl md:text-7xl mt-4 text-black">
            See the Platform in Action
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-xl mx-auto mt-4 text-black/60">
            A quick look at how clients discover, book, and collaborate with verified photographers.
          </motion.p>
        </motion.div>

        <motion.div {...inView} variants={fadeUp} whileHover={{ y: -6 }} className="relative rounded-[32px] bg-black p-3 md:p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] mx-auto max-w-[1100px]">
          <div className="relative rounded-[24px] overflow-hidden aspect-video">
            <video ref={videoRef} src={WEDDING_VIDEO_URL} poster={IMG.videoThumb} className="absolute inset-0 w-full h-full object-cover" playsInline controls={playing} preload="metadata" onEnded={() => setPlaying(false)}/>
            {!playing && <div className="absolute inset-0 bg-black/30 pointer-events-none"/>}
            {/* HUD top */}
            <div className={`absolute top-4 left-5 right-5 flex items-center justify-between text-white text-xs font-mono transition-opacity ${playing ? "opacity-0" : "opacity-100"}`}>
              <span className="font-label text-yellow">Fulltime Photographers</span>
              <span className="inline-flex items-center gap-1"><BatteryFull size={16}/> 100%</span>
            </div>
            <div className={`absolute top-12 left-5 inline-flex items-center gap-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity ${playing ? "opacity-0" : "opacity-100"}`}>
              <span className="h-2 w-2 rounded-full bg-white rec-dot"/> REC
            </div>
            {/* HUD bottom */}
            <div className={`absolute bottom-4 left-5 right-5 flex items-center justify-between text-white text-xs font-mono transition-opacity ${playing ? "opacity-0" : "opacity-100"}`}>
              <span>ISO 800 · F5.6 · 1/50</span>
              <span>00:00:14:08</span>
            </div>
            {/* play */}
            {!playing && (<button onClick={handlePlay} aria-label="Play wedding ceremony video" className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-yellow text-black flex items-center justify-center hover:scale-110 hover:shadow-[0_0_60px_rgba(255,194,26,0.7)] transition-all">
                <Play size={28} fill="currentColor"/>
              </button>)}
            {/* corner ticks */}
            {["top-2 left-2 border-l-2 border-t-2", "top-2 right-2 border-r-2 border-t-2", "bottom-2 left-2 border-l-2 border-b-2", "bottom-2 right-2 border-r-2 border-b-2"].map(c => <span key={c} className={`absolute h-6 w-6 border-yellow pointer-events-none transition-opacity ${playing ? "opacity-0" : "opacity-100"} ${c}`}/>)}
          </div>
        </motion.div>

        <div className="text-center mt-10">
          <Button variant="dark" onClick={handlePlay}><Play size={14} fill="currentColor"/> Watch Showreel</Button>
        </div>
      </div>
    </section>);
}
