import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { resolveMediaUrl } from '../../api/index.js'

export default function PortfolioCard({ title, description, index, id, image, live_url }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.75, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-[22px] sm:rounded-[26px] border border-white/10 bg-white/5 p-3 sm:p-4 backdrop-blur-xl flex flex-col min-h-[240px] sm:min-h-[270px]"
    >
      <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] mb-3">
        {image ? (
          <img
            src={resolveMediaUrl(image)}
            alt={title}
            loading="lazy"
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.03]" />
        )}
      </div>

      <h3 className="text-[15px] sm:text-[17px] font-semibold mb-2 leading-tight">{title}</h3>

      <p className="text-[12px] sm:text-[13px] text-white/60 leading-relaxed line-clamp-2 min-h-[36px] sm:min-h-[38px]">
        {description}
      </p>

      <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between gap-2">
        {live_url ? (
          <a
            href={live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[12px] sm:text-[13px] text-white/70 hover:text-white transition-all"
          >
            Live Demo
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <div className="text-[12px] sm:text-[13px] text-white/35">No Link</div>
        )}

        {id && (
          <button
            onClick={() => navigate(`/portfolio/${id}`)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2 text-[12px] sm:text-[13px]"
          >
            Details
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
