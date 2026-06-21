import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { messageApi } from '../../api/index.js'
import Swal from 'sweetalert2'

export default function AdminMessages() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    messageApi.list().then(({ data }) => setItems(data)).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await messageApi.markRead(id)
      setItems((prev) =>
        prev.map((m) => (m._id === id ? { ...m, is_read: true } : m))
      )
    } catch {
      Swal.fire({ icon: 'error', title: 'Update failed', background: '#1a1a1a', color: '#fff' })
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this message?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete',
      background: '#1a1a1a',
      color: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      await messageApi.remove(id)
      setItems((prev) => prev.filter((m) => m._id !== id))
    } catch {
      Swal.fire({ icon: 'error', title: 'Delete failed', background: '#1a1a1a', color: '#fff' })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Messages</h1>
      <p className="text-white/50 text-sm mb-6">Contact form submissions</p>

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-white/40 text-sm py-8 text-center border border-white/10 rounded-xl">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {items.map((m, i) => (
            <motion.div
              key={m._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`rounded-2xl border p-4 ${
                m.is_read ? 'border-white/10 bg-white/[0.02]' : 'border-amber-500/30 bg-amber-500/5'
              }`}
            >
              <div className="flex items-start justify-between mb-2 gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white">{m.name}</h3>
                    {!m.is_read && (
                      <span className="px-2 py-[2px] rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] text-amber-300">
                        NEW
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${encodeURIComponent(m.email)}`}
                    className="text-xs text-white/50 hover:text-white transition"
                  >
                    {m.email}
                  </a>
                </div>
                <span className="text-[10px] text-white/30 shrink-0">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                </span>
              </div>

              <p className="text-[13px] text-white/70 mb-3 whitespace-pre-wrap">{m.message}</p>

              <div className="flex gap-2">
                {!m.is_read && (
                  <button
                    onClick={() => handleMarkRead(m._id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/70 transition"
                  >
                    <MailOpen size={12} /> Mark as read
                  </button>
                )}
                <a
                  href={`mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Re: your message')}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/70 transition"
                >
                  <Mail size={12} /> Reply
                </a>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-300 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
