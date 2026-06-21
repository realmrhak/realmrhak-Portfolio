import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * Reusable loading spinner for admin pages.
 * Uses Poppins font (matches the rest of the admin panel) and
 * an animated Loader2 icon from lucide-react.
 *
 * Usage: <LoadingSpinner text="Loading projects..." />
 */
export default function LoadingSpinner({
    text = 'Loading…',
    size = 20,
    className = '',
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center justify-center gap-3 py-12 text-white/60 ${className}`}
            style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.01em',
            }}
        >
            <Loader2 size={size} className="animate-spin text-white/70" />
            <span>{text}</span>
        </motion.div>
    )
}