export function SectionLabel({ children, tone = "dark", className = "" }) {
    const onCream = tone === "light" ? "on-cream" : "";
    const dot = tone === "dark" ? "bg-yellow" : "bg-black";
    return (<span className={`section-label-pill ${onCream} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`}/>
      {children}
    </span>);
}
