import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
export function CategoryCard({ title, description, image, icon }) {
    const Ic = Icons[icon] ?? Icons.Camera;
    return (<motion.article whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="group rounded-[28px] overflow-hidden bg-white border border-black/5 hover:border-yellow shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_50px_-20px_rgba(255,194,26,0.45)] transition-all">
      <div className="relative h-[220px] overflow-hidden">
        <img src={image} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
        <span className="absolute top-4 left-4 h-10 w-10 rounded-xl bg-yellow text-black flex items-center justify-center">
          <Ic size={18}/>
        </span>
        <span className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <ArrowUpRight size={16}/>
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl text-black">{title}</h3>
        <p className="mt-2 text-sm text-black/60">{description}</p>
      </div>
    </motion.article>);
}
