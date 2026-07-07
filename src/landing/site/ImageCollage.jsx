import { useState } from "react";
import { motion } from "framer-motion";
import { MousePointerClick, Sparkles } from "lucide-react";
import { IMG } from "@/data/site";
const TILES = [
    { src: IMG.heroPhotographer, x: -180, y: -40, rotate: -14 },
    { src: IMG.heroWedding, x: -90, y: 30, rotate: -6, ring: true },
    { src: IMG.heroPortrait, x: -10, y: -50, rotate: 4 },
    { src: IMG.heroVideo, x: 70, y: 20, rotate: -3, gray: true },
    { src: IMG.heroProduct, x: 150, y: -30, rotate: 10 },
    { src: IMG.heroEvent, x: 220, y: 40, rotate: 16 },
    { src: IMG.heroTravel, x: 30, y: 70, rotate: -10 },
];
export function ImageCollage() {
    const [organized, setOrganized] = useState(false);
    return (<div className="relative w-full max-w-[640px] mx-auto hidden md:flex flex-col items-center justify-center gap-8 select-none">
      {/* ambient glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-60 pointer-events-none" style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,194,26,0.22), transparent 60%)",
        }}/>

      <button type="button" onClick={() => setOrganized((v) => !v)} className="group relative w-full h-[460px] cursor-pointer focus:outline-none" aria-label="Toggle collage layout">
        <div className="absolute inset-0 flex items-center justify-center">
          {TILES.map((t, i) => (<motion.div key={i} className={`absolute w-[150px] sm:w-[180px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 ${t.ring ? "ring-2 ring-yellow shadow-[0_0_60px_rgba(255,194,26,0.35)]" : "shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]"}`} initial={{ opacity: 0, scale: 0.6, y: 60 }} animate={{
                opacity: 1,
                scale: 1,
                x: organized ? (i - (TILES.length - 1) / 2) * 70 : t.x,
                y: organized ? 0 : t.y,
                rotate: organized ? 0 : t.rotate,
                zIndex: organized ? i : TILES.length - i,
            }} transition={{
                type: "spring",
                bounce: 0.45,
                duration: 0.9,
                delay: 0.08 * i,
            }} whileHover={{ scale: 1.06, rotate: 0, zIndex: 50, transition: { duration: 0.35 } }}>
              <img src={t.src} alt="" draggable={false} loading="lazy" decoding="async" className={`w-full h-full object-cover ${t.gray ? "grayscale" : ""}`}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
            </motion.div>))}
        </div>
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex items-center gap-2 font-label text-[11px] tracking-[0.18em] text-yellow/90 uppercase">
        <MousePointerClick size={14}/>
        Click to {organized ? "scatter" : "organize"}
        <Sparkles size={14}/>
      </motion.div>
    </div>);
}
