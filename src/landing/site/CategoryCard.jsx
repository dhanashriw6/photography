import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";

const MAX_VISIBLE_SUBS = 4;

export function CategoryCard({ title, description, image, icon, subcategories = [] }) {
  const Ic = Icons[icon] ?? Icons.Camera;
  const visible = subcategories.slice(0, MAX_VISIBLE_SUBS);
  const remaining = subcategories.length - visible.length;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col h-full rounded-[28px] overflow-hidden bg-white border border-black/5 hover:border-yellow shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_50px_-20px_rgba(255,194,26,0.45)] transition-all"
    >
      <div className="relative h-[180px] overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute top-4 left-4 h-10 w-10 rounded-xl bg-yellow text-black flex items-center justify-center">
          <Ic size={18} />
        </span>
        <span className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl text-black leading-tight">{title}</h3>
        <p className="mt-1.5 text-sm text-black/60 line-clamp-2">{description}</p>

        {subcategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {visible.map((sub) => (
              <span
                key={sub}
                className="text-[11px] leading-none font-medium px-2.5 py-1.5 rounded-full bg-black/[0.04] text-black/70 group-hover:bg-yellow/15 group-hover:text-black transition-colors"
              >
                {sub}
              </span>
            ))}
            {remaining > 0 && (
              <span className="text-[11px] leading-none font-semibold px-2.5 py-1.5 rounded-full bg-black text-white">
                +{remaining} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}