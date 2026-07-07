import React from "react";
import { cn } from "@/landing/lib/utils";
export const CylinderCarousel = React.forwardRef(({ images, className, containerClassName, cardClassName, animationDuration = 32, cardWidth = 250, ...props }, ref) => {
    const N = images.length;
    const customStyle = {
        "--n": N,
        "--w": `${cardWidth}px`,
        "--ba": `calc(1turn / var(--n))`,
        "--anim-dur": `${animationDuration}s`,
    };
    return (<div ref={ref} className={cn("relative left-1/2 w-screen max-w-none -translate-x-1/2 flex items-center justify-center overflow-hidden", className)} style={{ perspective: "1200px" }} {...props}>
        <div className={cn("relative grid place-items-center [transform-style:preserve-3d]", "[animation:ry_var(--anim-dur)_linear_infinite]", containerClassName)} style={customStyle}>
          <style>{`@keyframes ry { to { transform: rotateY(1turn); } }`}</style>

          {images.map((img, i) => (<img key={i} src={img.src} alt={img.alt || `Carousel image ${i}`} className={cn("[grid-area:1/1] object-cover rounded-sm md:rounded-md [backface-visibility:hidden] shadow-2xl", cardClassName)} style={{
                width: "var(--w)",
                aspectRatio: "7/10",
                ["--i"]: i,
                transform: "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
            }}/>))}
        </div>
      </div>);
});
CylinderCarousel.displayName = "CylinderCarousel";
