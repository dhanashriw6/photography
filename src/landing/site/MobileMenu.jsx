import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { menuLinks } from "@/data/site";

export function MobileMenu({ open, onClose }) {
  const handleClick = (href, disabled) => {
    if (disabled) return;
    onClose();
    // wait for the panel's close animation before scrolling
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-6 right-4 md:right-8 w-[min(90vw,380px)] max-h-[85vh] overflow-y-auto
                       rounded-[32px] bg-yellow z-[70] p-6 shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="ml-auto mb-6 h-11 w-11 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition"
            >
              <X size={20} className="text-black" />
            </button>

            <nav className="flex flex-col">
              {menuLinks.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href, item.disabled)}
                  disabled={item.disabled}
                  className={`text-left py-3 border-b border-black/15 font-bold text-xl transition-colors ${
                    item.disabled
                      ? "text-black/30 cursor-not-allowed"
                      : "text-black hover:text-black/70"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}