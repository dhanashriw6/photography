import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUpRight, Camera as CameraFallback } from "lucide-react";
import { useState } from "react";

const MAX_VISIBLE_SUBS = 3;

export function CategoryCard({ title, description, image, icon, subcategories = [] }) {
  const Ic = Icons[icon] ?? Icons.Camera;
  const [imgError, setImgError] = useState(false);

  const visible = subcategories.slice(0, MAX_VISIBLE_SUBS);
  const remaining = subcategories.length - visible.length;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col w-full h-full rounded-xl sm:rounded-2xl lg:rounded-[28px] overflow-hidden bg-white border border-black/5 hover:border-yellow shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_50px_-20px_rgba(255,194,26,0.45)] transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden shrink-0 bg-black/5">
        {!imgError ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/[0.04]">
            <CameraFallback size={28} className="text-black/20" />
          </div>
        )}

        <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 lg:top-4 lg:left-4 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg sm:rounded-xl bg-yellow text-black flex items-center justify-center shrink-0">
          <Ic size={14} className="sm:hidden" />
          <Ic size={16} className="hidden sm:block lg:hidden" />
          <Ic size={18} className="hidden lg:block" />
        </span>

        <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 lg:top-4 lg:right-4 h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-full bg-white text-black flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition">
          <ArrowUpRight size={13} className="sm:hidden" />
          <ArrowUpRight size={15} className="hidden sm:block lg:hidden" />
          <ArrowUpRight size={16} className="hidden lg:block" />
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-5 gap-1.5 sm:gap-2">
        <h3 className="font-display text-sm sm:text-base md:text-lg lg:text-xl text-black leading-snug">
          {title}
        </h3>

        <p className="text-[11px] sm:text-xs lg:text-sm text-black/60 leading-relaxed line-clamp-2">
          {description}
        </p>

        {subcategories.length > 0 && (
          <div className="mt-auto pt-2 sm:pt-3 flex flex-wrap gap-1.5">
            {visible.map((sub) => (
              <span
                key={sub}
                className="text-[9px] sm:text-[10px] lg:text-[11px] leading-none font-medium px-1.5 sm:px-2 lg:px-2.5 py-1 sm:py-1.5 rounded-full bg-black/[0.04] text-black/70 group-hover:bg-yellow/15 group-hover:text-black transition-colors"
              >
                {sub}
              </span>
            ))}
            {remaining > 0 && (
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] leading-none font-semibold px-1.5 sm:px-2 lg:px-2.5 py-1 sm:py-1.5 rounded-full bg-black text-white">
                +{remaining}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}