import { motion } from "framer-motion";
export function FloatingIcon({ Icon, className = "", delay = 0, size = 28, color = "#FFC21A" }) {
    return (<motion.div aria-hidden className={`absolute pointer-events-none ${className}`} animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}>
      <Icon size={size} color={color} strokeWidth={1.4} style={{ opacity: 0.55 }}/>
    </motion.div>);
}
