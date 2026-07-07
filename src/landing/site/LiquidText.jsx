import { useEffect, useRef } from "react";
import { cn } from "@/landing/lib/utils";
/**
 * Smooth "liquid" hover effect on text.
 * Preserves the original font / color / gradient by only animating
 * per-letter transforms (translate + scale). No canvas, no shader, no jank.
 */
export function LiquidText({ text, className, intensity = 14, radius = 120, }) {
    const wrapRef = useRef(null);
    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap)
            return;
        const letters = Array.from(wrap.querySelectorAll("[data-liquid-letter]"));
        if (!letters.length)
            return;
        // per-letter state: current + target offsets
        const state = letters.map(() => ({
            cx: 0,
            cy: 0,
            tx: 0,
            ty: 0,
            ts: 1,
            cs: 1,
        }));
        let centers = [];
        const measure = () => {
            centers = letters.map((el) => {
                const r = el.getBoundingClientRect();
                return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            });
        };
        measure();
        let pointerX = -9999;
        let pointerY = -9999;
        let active = false;
        let raf = 0;
        const onMove = (e) => {
            pointerX = e.clientX;
            pointerY = e.clientY;
            active = true;
        };
        const onLeave = () => {
            active = false;
        };
        const tick = () => {
            for (let i = 0; i < letters.length; i++) {
                const c = centers[i];
                let tx = 0;
                let ty = 0;
                let ts = 1;
                if (active && c) {
                    const dx = c.x - pointerX;
                    const dy = c.y - pointerY;
                    const dist = Math.hypot(dx, dy);
                    if (dist < radius) {
                        // smooth falloff (cosine)
                        const f = 0.5 + 0.5 * Math.cos((dist / radius) * Math.PI);
                        const dirX = dist > 0.0001 ? dx / dist : 0;
                        const dirY = dist > 0.0001 ? dy / dist : 0;
                        tx = dirX * f * intensity;
                        ty = dirY * f * intensity - f * 6; // slight lift
                        ts = 1 + f * 0.08;
                    }
                }
                const s = state[i];
                s.tx = tx;
                s.ty = ty;
                s.ts = ts;
                // lerp toward target for buttery feel
                const k = 0.18;
                s.cx += (s.tx - s.cx) * k;
                s.cy += (s.ty - s.cy) * k;
                s.cs += (s.ts - s.cs) * k;
                letters[i].style.transform = `translate3d(${s.cx.toFixed(2)}px, ${s.cy.toFixed(2)}px, 0) scale(${s.cs.toFixed(3)})`;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        const onResize = () => measure();
        const onScroll = () => measure();
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, { passive: true });
        // re-measure after fonts/layout settle
        const t1 = window.setTimeout(measure, 120);
        const t2 = window.setTimeout(measure, 600);
        return () => {
            cancelAnimationFrame(raf);
            wrap.removeEventListener("pointermove", onMove);
            wrap.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [text, intensity, radius]);
    // Split into letters; preserve spaces
    const chars = Array.from(text);
    return (<span ref={wrapRef} className={cn("liquid-text inline-block", className)} aria-label={text}>
      {chars.map((ch, i) => ch === " " ? (<span key={i} aria-hidden="true" className="inline-block">
            &nbsp;
          </span>) : (<span key={i} data-liquid-letter aria-hidden="true" className="inline-block will-change-transform" style={{ transition: "none" }}>
            {ch}
          </span>))}
    </span>);
}
export default LiquidText;
