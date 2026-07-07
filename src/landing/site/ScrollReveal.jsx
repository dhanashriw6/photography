import { motion, useReducedMotion } from "framer-motion";
/**
 * Wraps a section and reveals it with a smooth fade + rise + blur
 * the first time it scrolls into view.
 */
export function ScrollReveal({ children, delay = 0, y = 60 }) {
    const reduce = useReducedMotion();
    if (reduce)
        return <>{children}</>;
    return (<motion.div initial={{ opacity: 0, y, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-12% 0px -12% 0px" }} transition={{
            duration: 0.95,
            delay,
            ease: [0.22, 1, 0.36, 1],
        }} style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </motion.div>);
}
export default ScrollReveal;
