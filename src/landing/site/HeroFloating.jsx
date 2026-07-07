import { motion } from "framer-motion";
import { Aperture, Camera, Clapperboard, MapPin, Sparkles, Star, Video } from "lucide-react";
const items = [
    // top-left camera badge
    {
        kind: "icon",
        icon: Camera,
        variant: "badge",
        style: { top: "8%", left: "4%", transform: "rotate(-8deg)" },
        anim: { y: [0, -10, 0], rotate: [-8, -5, -8], duration: 6, delay: 0 },
    },
    // verified pill upper-left
    {
        kind: "pill",
        label: "Verified Shoots",
        variant: "dark",
        style: { top: "22%", left: "7%", transform: "rotate(-4deg)" },
        anim: { y: [0, 8, 0], rotate: [-4, -2, -4], duration: 7, delay: 0.6 },
    },
    // top-right clapper
    {
        kind: "icon",
        icon: Clapperboard,
        variant: "badge",
        style: { top: "10%", right: "5%", transform: "rotate(8deg)" },
        anim: { y: [0, -12, 0], rotate: [8, 11, 8], duration: 6.5, delay: 0.3 },
    },
    // on-location pill right
    {
        kind: "pill",
        label: "On-Location",
        variant: "yellow",
        style: { top: "26%", right: "6%", transform: "rotate(5deg)" },
        anim: { y: [0, 10, 0], rotate: [5, 7, 5], duration: 7.5, delay: 1 },
    },
    // aperture left middle
    {
        kind: "icon",
        icon: Aperture,
        variant: "soft",
        style: { top: "52%", left: "5%", transform: "rotate(-6deg)" },
        anim: { y: [0, -8, 0], rotate: [-6, -3, -6], duration: 8, delay: 0.4 },
        size: 30,
    },
    // video icon bottom-left (tablet+)
    {
        kind: "icon",
        icon: Video,
        variant: "soft",
        style: { bottom: "26%", left: "10%", transform: "rotate(6deg)" },
        extraClass: "hero-floating-tablet",
        anim: { y: [0, 10, 0], rotate: [6, 9, 6], duration: 7, delay: 1.4 },
        size: 26,
    },
    // product shoot pill bottom-left (desktop only)
    {
        kind: "pill",
        label: "Product Shoot",
        variant: "dark",
        style: { bottom: "16%", left: "8%", transform: "rotate(4deg)" },
        extraClass: "hero-floating-extra",
        anim: { y: [0, -8, 0], rotate: [4, 6, 4], duration: 8, delay: 1.1 },
    },
    // secure booking pill bottom-right (desktop only)
    {
        kind: "pill",
        label: "Secure Booking",
        variant: "yellow",
        style: { bottom: "20%", right: "9%", transform: "rotate(-5deg)" },
        extraClass: "hero-floating-extra",
        anim: { y: [0, 12, 0], rotate: [-5, -3, -5], duration: 7.5, delay: 0.8 },
    },
    // map pin right middle
    {
        kind: "icon",
        icon: MapPin,
        variant: "soft",
        style: { bottom: "34%", right: "4%" },
        extraClass: "hero-floating-tablet",
        anim: { y: [0, -10, 0], rotate: [0, 4, 0], duration: 6.5, delay: 1.6 },
        size: 24,
    },
    // sparkle top-mid-right
    {
        kind: "icon",
        icon: Sparkles,
        variant: "soft",
        style: { top: "44%", right: "12%" },
        extraClass: "hero-floating-extra",
        anim: { y: [0, -6, 0], rotate: [0, 6, 0], duration: 5.5, delay: 0.2 },
        size: 20,
    },
    // tiny star bottom-mid-left
    {
        kind: "icon",
        icon: Star,
        variant: "soft",
        style: { top: "12%", left: "30%" },
        extraClass: "hero-floating-tablet",
        anim: { y: [0, -8, 0], rotate: [0, 10, 0], duration: 6, delay: 1.8 },
        size: 16,
    },
];
export function HeroFloating() {
    return (<>
      {items.map((it, i) => {
            const className = `float-item ${it.extraClass ?? ""}`;
            return (<motion.div key={i} className={className} style={it.style} animate={{ y: it.anim.y, x: it.anim.x ?? [0, 0, 0], rotate: it.anim.rotate }} transition={{ duration: it.anim.duration, repeat: Infinity, ease: "easeInOut", delay: it.anim.delay }}>
            {it.kind === "icon" ? (it.variant === "badge" ? (<div className="floating-icon-badge">
                  <it.icon size={it.size ?? 22} strokeWidth={1.6}/>
                </div>) : (<div className="floating-icon-soft" style={{ opacity: 0.6 }}>
                  <it.icon size={it.size ?? 24} strokeWidth={1.5}/>
                </div>)) : (<div className={it.variant === "yellow" ? "floating-pill-yellow" : "floating-pill-dark"}>
                {it.label}
              </div>)}
          </motion.div>);
        })}
    </>);
}
