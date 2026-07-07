export const fadeUp = {
    hidden: { opacity: 0, y: 34 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
export const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};
export const inView = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-80px" },
};
