import logoAsset from "@/assets/Images/Final-logo.png";
import whiteLogo from "@/assets/Images/fulltimelogo1.png";
export function Logo({ className = "", variant = false }) {
  return (<a href="#top" className={`flex items-center gap-4 ${className}`}>
    <img
      src={variant ? whiteLogo : logoAsset}
      alt="Fulltime Photographers"
      className="h-16 w-16 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
    />
      <span className="text-2xl tracking-wide text-white" style={{ fontFamily: '"Bebas Neue", "Anton", sans-serif' }}>
        Fulltime <span className="text-yellow">Photographers</span>
      </span>
    </a>);
}
