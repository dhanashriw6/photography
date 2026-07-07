import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, Facebook, Instagram, Linkedin, Send, Twitter, Youtube } from "lucide-react";
import { footerLinks } from "@/data/site";
import { Logo } from "./Logo";
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}
const MARQUEE_ITEMS = [
    "Verified Photographers",
    "Every Story Captured",
    "Cinematic Quality",
    "Trusted Marketplace",
    "Book In Minutes",
];
function MarqueeRow() {
    return (<div className="flex shrink-0 items-center gap-10 px-5 font-display text-3xl md:text-4xl uppercase tracking-tight text-white/40">
      {MARQUEE_ITEMS.map((t, i) => (<span key={i} className="flex items-center gap-10 whitespace-nowrap">
          {t}
          <span className="text-yellow">✦</span>
        </span>))}
    </div>);
}
export function Footer() {
    const wrapperRef = useRef(null);
    const giantRef = useRef(null);
    useEffect(() => {
        if (typeof window === "undefined" || !wrapperRef.current)
            return;
        const ctx = gsap.context(() => {
            gsap.fromTo(giantRef.current, { y: "12vh", scale: 0.85, opacity: 0 }, {
                y: "0vh",
                scale: 1,
                opacity: 1,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top 80%",
                    end: "bottom bottom",
                    scrub: 1,
                },
            });
        }, wrapperRef);
        return () => ctx.revert();
    }, []);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    return (<footer ref={wrapperRef} className="relative isolate overflow-hidden bg-bg-soft border-t border-white/10 pt-16 pb-8">
      {/* Aurora glow */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl" style={{
            background: "radial-gradient(circle, rgba(255,194,26,0.25) 0%, rgba(255,138,0,0.12) 40%, transparent 70%)",
        }}/>
      {/* Grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{
            backgroundSize: "60px 60px",
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            maskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)",
        }}/>

      {/* Marquee */}
      <div className="relative mb-16 overflow-hidden border-y border-white/10 py-5">
        <div className="flex w-max animate-[footerMarquee_40s_linear_infinite]">
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
        </div>
        <style>{`@keyframes footerMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          <div className="sm:col-span-2">
            <Logo variant={true} />
            <p className="mt-5 text-sm text-white/55 max-w-xs leading-relaxed">
              The trusted marketplace to find and book verified photographers for every occasion.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[Instagram, Twitter, Facebook, Youtube, Linkedin].map((Ic, i) => (<a key={i} href="#" aria-label="Social" className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:bg-yellow hover:text-black hover:border-yellow transition">
                  <Ic size={15}/>
                </a>))}
            </div>
          </div>

          {footerLinks.map((col) => (<div key={col.title}>
              <div className="font-label text-xs text-yellow mb-4">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (<li key={l}>
                    <a href="#" className="text-sm text-white/60 hover:text-white transition">
                      {l}
                    </a>
                  </li>))}
              </ul>
            </div>))}
        </div>

        <div className="mt-14 pt-10 border-t border-white/10 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
          <div className="max-w-md">
            <h3 className="font-display text-2xl text-white">Stay in the frame.</h3>
            <p className="text-sm text-white/55 mt-1">
              Get featured shoots, creator stories, and platform updates.
            </p>
          </div>
          <form className="flex w-full md:w-auto items-center gap-2 glass-card rounded-full p-1.5 pl-5">
            <input type="email" required placeholder="Enter your email" className="bg-transparent outline-none text-sm text-white placeholder:text-white/40 flex-1 min-w-[200px] py-2"/>
            <button className="rounded-full bg-yellow text-black px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:shadow-[0_0_24px_rgba(255,194,26,0.55)] transition">
              Subscribe <Send size={14}/>
            </button>
          </form>
        </div>

        {/* Giant brand text */}
        <div ref={giantRef} aria-hidden className="relative mt-16 select-none text-center" style={{
            fontFamily: "Anton, sans-serif",
            fontSize: "clamp(4rem, 22vw, 22rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,194,26,0.25) 50%, transparent 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
        }}>
          FULLTIME
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-white/45">
          <span>© 2026 Fulltime Photographers. All rights reserved.</span>
          <span>Crafted with care for clients and creatives.</span>
          <button onClick={scrollToTop} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white/70 hover:bg-yellow hover:text-black hover:border-yellow transition self-start md:self-auto">
            Back to top <ArrowUp size={14}/>
          </button>
        </div>
      </div>
    </footer>);
}
