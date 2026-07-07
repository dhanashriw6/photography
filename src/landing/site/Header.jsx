import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-3 md:top-4 inset-x-0 z-50 px-2"
      >
        <div
          className={`mx-auto w-full h-[64px] md:h-[68px] px-3 md:px-6 flex items-center justify-between gap-3 md:gap-6 nav-pill transition-all duration-300 ${
            scrolled ? "shadow-[0_18px_60px_-20px_rgba(0,0,0,0.7)]" : ""
          }`}
        >
          <Logo variant={true} />

          {/* <div className="hidden lg:flex items-center gap-3">
            <button
              className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-yellow hover:border-yellow/50 transition"
              aria-label="Language"
            >
              <Globe size={16} />
            </button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              variant="primary"
              className="hover:shadow-[0_0_24px_rgba(255,194,26,0.45)]"
              onClick={() => navigate("/find-photographer")}
            >
              Sign Up
            </Button>
          </div> */}

          <button
            className="h-11 px-6 rounded-full bg-yellow text-black font-bold text-sm tracking-wide
                       shadow-[0_0_24px_rgba(255,194,26,0.55)] hover:shadow-[0_0_32px_rgba(255,194,26,0.75)]
                       transition-shadow"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            MENU
          </button>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}