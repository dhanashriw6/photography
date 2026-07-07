const base = "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap";
const variants = {
    primary: "bg-yellow text-black hover:shadow-[0_0_36px_rgba(255,194,26,0.5)] hover:-translate-y-0.5",
    secondary: "border border-white/20 text-white hover:bg-white/10 hover:border-yellow/60",
    ghost: "text-white/80 hover:text-yellow",
    dark: "bg-black text-white hover:bg-yellow hover:text-black",
};
export function Button({ variant = "primary", icon, children, className = "", ...rest }) {
    return (<button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      {icon}
    </button>);
}
