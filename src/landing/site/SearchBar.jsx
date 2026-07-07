import { motion } from "framer-motion";
import { CalendarDays, MapPin, Search, Tag } from "lucide-react";
import { popularChips } from "@/data/site";
export function SearchBar() {
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }} className="hero-search-wrapper relative z-20 mx-auto max-w-[1060px] px-4">
      <div className="search-bar glass-card rounded-[28px] min-h-[70px] md:min-h-[78px] p-3 md:p-4 md:px-[22px] flex flex-col md:flex-row md:items-stretch gap-2">
        <Field icon={<Tag size={16}/>} label="What’s the event?" placeholder="Wedding, Portrait, Product..."/>
        <Divider />
        <Field icon={<MapPin size={16}/>} label="Where?" placeholder="City or location"/>
        <Divider />
        <Field icon={<CalendarDays size={16}/>} label="When?" placeholder="Select date"/>
        <button className="md:ml-1 h-12 md:h-auto md:w-auto md:px-6 rounded-full bg-yellow text-black font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_36px_rgba(255,194,26,0.6)] hover:-translate-y-0.5 transition" aria-label="Search photographers">
          <Search size={18}/> <span>Search</span>
        </button>
      </div>
      <div className="search-chips flex flex-wrap items-center gap-2 mt-3 px-2">
        <span className="font-label text-xs text-muted-brand">Popular:</span>
        {popularChips.map((c) => (<button key={c} className="text-xs px-4 py-1.5 rounded-full border border-white/15 text-white/80 hover:bg-yellow hover:text-black hover:border-yellow transition">
            {c}
          </button>))}
      </div>
    </motion.div>);
}
function Field({ icon, label, placeholder }) {
    return (<label className="flex-1 group flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/5 transition cursor-text">
      <span className="h-8 w-8 rounded-full bg-yellow/15 text-yellow flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="flex flex-col flex-1 min-w-0">
        <span className="font-label text-[10px] text-muted-brand">{label}</span>
        <input placeholder={placeholder} className="bg-transparent outline-none text-sm text-white placeholder:text-white/40 w-full"/>
      </span>
    </label>);
}
function Divider() {
    return <span className="hidden md:block w-px self-stretch bg-white/10 my-2"/>;
}
