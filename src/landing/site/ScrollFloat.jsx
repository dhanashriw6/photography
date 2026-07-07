import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollFloat.css";
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}
export function ScrollFloat({ children, scrollContainerRef, containerClassName = "", textClassName = "", animationDuration = 1, ease = "power3.out", scrollStart = "top 88%", scrollEnd = "top 38%", stagger = 0.02, as: Tag = "span", }) {
    const containerRef = useRef(null);
    const splitText = useMemo(() => {
        const text = typeof children === "string" ? children : "";
        return text.split("").map((char, index) => (<span className="char" key={index}>
        {char === " " ? "\u00A0" : char}
      </span>));
    }, [children]);
    useEffect(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const scroller = scrollContainerRef && scrollContainerRef.current
            ? scrollContainerRef.current
            : window;
        const charElements = el.querySelectorAll(".char");
        gsap.set(charElements, {
            opacity: 1,
            visibility: "visible",
            clearProps: "filter",
        });
        const tween = gsap.fromTo(charElements, {
            willChange: "opacity, transform",
            opacity: 1,
            yPercent: 34,
            scaleY: 1.12,
            scaleX: 0.98,
            transformOrigin: "50% 0%",
        }, {
            duration: animationDuration,
            ease,
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger,
            immediateRender: true,
            scrollTrigger: {
                trigger: el,
                scroller: scroller,
                start: scrollStart,
                end: scrollEnd,
                scrub: 0.8,
                invalidateOnRefresh: true,
                onUpdate: () => {
                    gsap.set(charElements, { opacity: 1, visibility: "visible" });
                },
                onLeave: () => {
                    gsap.set(charElements, { opacity: 1, visibility: "visible", yPercent: 0, scaleY: 1, scaleX: 1 });
                },
            },
        });
        const refresh = () => ScrollTrigger.refresh();
        const t = setTimeout(refresh, 100);
        return () => {
            clearTimeout(t);
            tween.scrollTrigger?.kill();
            tween.kill();
            gsap.set(charElements, { clearProps: "all" });
        };
    }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, children]);
    return (<Tag ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Tag>);
}
export default ScrollFloat;
