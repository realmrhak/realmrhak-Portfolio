import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Award, MessageSquare, Mail, Layers, MailOpen } from 'lucide-react'
import { dashboardApi } from '../../api/index.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    dashboardApi
      .stats()
      .then(({ data }) => setStats(data))
      .catch((err) => {
        console.error('dashboard stats failed', err)
        setError(err.response?.data?.message || 'Failed to load stats')
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Projects', value: stats?.projects ?? 0, icon: Code, color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20' },
    { label: 'Certificates', value: stats?.certificates ?? 0, icon: Award, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20' },
    { label: 'Comments', value: stats?.comments ?? 0, icon: MessageSquare, color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20' },
    { label: 'Messages', value: stats?.messages ?? 0, icon: Mail, color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20' },
    { label: 'Unread', value: stats?.unreadMessages ?? 0, icon: MailOpen, color: 'from-red-500/20 to-red-500/5', border: 'border-red-500/20' },
    { label: 'Tech Stack', value: stats?.techStacks ?? 0, icon: Layers, color: 'from-pink-500/20 to-pink-500/5', border: 'border-pink-500/20' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-white/50 mb-8 text-sm">Overview of your portfolio content</p>

      {loading ? (
        <div className="text-white/40 text-sm">Loading stats…</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.color} p-6`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{card.value}</div>
                <div className="text-xs text-white/60 tracking-wider uppercase">{card.label}</div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
