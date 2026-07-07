import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
export function CameraShutterLoader() {
    const [phase, setPhase] = useState("start");
    const [contentReady, setContentReady] = useState(false);
    const canvasRef = useRef(null);
    useEffect(() => {
        // Give the page a moment to start rendering content underneath
        const readyTimer = setTimeout(() => setContentReady(true), 100);
        const openingTimer = setTimeout(() => setPhase("opening"), 300);
        const zoomTimer = setTimeout(() => setPhase("zoom"), 900);
        const doneTimer = setTimeout(() => setPhase("done"), 1600);
        return () => {
            clearTimeout(readyTimer);
            clearTimeout(openingTimer);
            clearTimeout(zoomTimer);
            clearTimeout(doneTimer);
        };
    }, []);
    // Draw subtle lens reflection on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const dpr = window.devicePixelRatio || 1;
        const size = 280 * dpr;
        canvas.width = size;
        canvas.height = size;
        ctx.scale(dpr, dpr);
        // Dark glass base
        const cx = 140;
        const cy = 140;
        const r = 130;
        // Outer dark ring gradient
        const ringGrad = ctx.createRadialGradient(cx, cy, r - 8, cx, cy, r);
        ringGrad.addColorStop(0, "rgba(20,20,22,0.95)");
        ringGrad.addColorStop(1, "rgba(45,45,48,0.9)");
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = ringGrad;
        ctx.fill();
        // Inner glass surface
        const glassGrad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, r - 12);
        glassGrad.addColorStop(0, "rgba(60,60,65,0.6)");
        glassGrad.addColorStop(0.5, "rgba(30,30,33,0.85)");
        glassGrad.addColorStop(1, "rgba(15,15,18,0.95)");
        ctx.beginPath();
        ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
        ctx.fillStyle = glassGrad;
        ctx.fill();
        // Subtle concentric rings (lens element markings)
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 0.5;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.arc(cx, cy, r - 8 - i * 18, 0, Math.PI * 2);
            ctx.stroke();
        }
        // Lens flare / reflection arc
        ctx.beginPath();
        ctx.arc(cx - 50, cy - 50, 60, 0, Math.PI * 2);
        const flareGrad = ctx.createRadialGradient(cx - 50, cy - 50, 0, cx - 50, cy - 50, 60);
        flareGrad.addColorStop(0, "rgba(255,255,255,0.08)");
        flareGrad.addColorStop(0.6, "rgba(255,255,255,0.02)");
        flareGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = flareGrad;
        ctx.fill();
        // Secondary small reflection dot
        ctx.beginPath();
        ctx.arc(cx + 60, cy + 50, 20, 0, Math.PI * 2);
        const dotGrad = ctx.createRadialGradient(cx + 60, cy + 50, 0, cx + 60, cy + 50, 20);
        dotGrad.addColorStop(0, "rgba(255,255,255,0.06)");
        dotGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = dotGrad;
        ctx.fill();
    }, []);
    // Aperture blade paths — 8 blades forming an iris
    const bladeCount = 8;
    const maxRadius = 120;
    const minRadius = 2;
    function getBladePath(index, openRatio) {
        const angleStep = (Math.PI * 2) / bladeCount;
        const baseAngle = index * angleStep;
        const currentRadius = minRadius + (maxRadius - minRadius) * openRatio;
        // Each blade is a quadrilateral
        const a1 = baseAngle - angleStep * 0.35;
        const a2 = baseAngle + angleStep * 0.35;
        const innerR = currentRadius * 0.15;
        const x1 = 140 + Math.cos(a1) * currentRadius;
        const y1 = 140 + Math.sin(a1) * currentRadius;
        const x2 = 140 + Math.cos(a2) * currentRadius;
        const y2 = 140 + Math.sin(a2) * currentRadius;
        const x3 = 140 + Math.cos(a2) * innerR;
        const y3 = 140 + Math.sin(a2) * innerR;
        const x4 = 140 + Math.cos(a1) * innerR;
        const y4 = 140 + Math.sin(a1) * innerR;
        return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`;
    }
    const openRatio = phase === "start" ? 0 : phase === "opening" ? 0.7 : phase === "zoom" ? 1 : 1;
    return (<AnimatePresence>
      {phase !== "done" && (<motion.div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden" style={{
                background: phase === "start"
                    ? "#070707"
                    : phase === "opening"
                        ? "rgba(7,7,7,0.92)"
                        : "rgba(7,7,7,0.5)",
                backdropFilter: phase === "zoom" ? "blur(2px)" : "none",
            }} initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
          {/* The lens assembly container */}
          <motion.div className="relative" style={{ width: 320, height: 320 }} animate={{
                scale: phase === "zoom" ? 8 : phase === "opening" ? 1.05 : 1,
                opacity: phase === "zoom" ? 0 : 1,
            }} transition={{
                scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.5, ease: "easeOut" },
            }}>
            {/* Outer barrel ring */}
            <div className="absolute inset-0 rounded-full">
              <svg viewBox="0 0 280 280" className="w-full h-full">
                <defs>
                  <linearGradient id="barrelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1c"/>
                    <stop offset="50%" stopColor="#2a2a2e"/>
                    <stop offset="100%" stopColor="#151517"/>
                  </linearGradient>
                  <linearGradient id="ringHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0.02)"/>
                  </linearGradient>
                </defs>

                {/* Outer metal barrel */}
                <circle cx="140" cy="140" r="138" fill="url(#barrelGrad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                <circle cx="140" cy="140" r="132" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>

                {/* Grip ridges on barrel */}
                {Array.from({ length: 40 }).map((_, i) => {
                const angle = (i / 40) * Math.PI * 2;
                const x1 = 140 + Math.cos(angle) * 134;
                const y1 = 140 + Math.sin(angle) * 134;
                const x2 = 140 + Math.cos(angle) * 138;
                const y2 = 140 + Math.sin(angle) * 138;
                return (<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>);
            })}

                {/* Inner lens housing */}
                <circle cx="140" cy="140" r="126" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2"/>
                <circle cx="140" cy="140" r="124" fill="#0d0d0f"/>
              </svg>
            </div>

            {/* Lens glass canvas */}
            <canvas ref={canvasRef} className="absolute" style={{
                width: 280,
                height: 280,
                top: 20,
                left: 20,
                borderRadius: "50%",
            }}/>

            {/* Aperture blades SVG */}
            <svg viewBox="0 0 280 280" className="absolute" style={{ width: 280, height: 280, top: 20, left: 20 }}>
              <defs>
                <radialGradient id="bladeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1a1a1e"/>
                  <stop offset="100%" stopColor="#0a0a0c"/>
                </radialGradient>
              </defs>
              {Array.from({ length: bladeCount }).map((_, i) => (<motion.path key={i} d={getBladePath(i, 0)} fill="url(#bladeGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" animate={{
                    d: getBladePath(i, openRatio),
                }} transition={{
                    duration: 0.55,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: i * 0.02,
                }}/>))}
            </svg>

            {/* Center brand text — appears as lens focuses */}
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none" animate={{
                opacity: phase === "start" ? 0.6 : phase === "opening" ? 0.3 : 0,
                scale: phase === "start" ? 1 : 0.85,
            }} transition={{ duration: 0.5 }}>
              <span className="text-[11px] tracking-[0.3em] uppercase" style={{
                fontFamily: "'Bebas Neue', sans-serif",
                color: "rgba(255,255,255,0.25)",
            }}>
                Lens
              </span>
            </motion.div>

            {/* Focus ring indicator dots */}
            <motion.div className="absolute" style={{
                width: 280,
                height: 280,
                top: 20,
                left: 20,
            }} animate={{ opacity: phase === "start" ? 1 : 0 }} transition={{ duration: 0.4 }}>
              <svg viewBox="0 0 280 280" className="w-full h-full">
                {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i / 60) * Math.PI * 2;
                const r = 135;
                const x = 140 + Math.cos(angle) * r;
                const y = 140 + Math.sin(angle) * r;
                const isMajor = i % 5 === 0;
                return (<circle key={i} cx={x} cy={y} r={isMajor ? 1.2 : 0.6} fill={isMajor ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}/>);
            })}
              </svg>
            </motion.div>
          </motion.div>

          {/* Vignette overlay that fades with the zoom */}
          <motion.div className="absolute inset-0 pointer-events-none" style={{
                background: "radial-gradient(circle at center, transparent 0%, transparent 25%, rgba(7,7,7,0.4) 60%, rgba(7,7,7,0.9) 100%)",
            }} animate={{
                opacity: phase === "zoom" ? 0 : 1,
            }} transition={{ duration: 0.6 }}/>
        </motion.div>)}
    </AnimatePresence>);
}
