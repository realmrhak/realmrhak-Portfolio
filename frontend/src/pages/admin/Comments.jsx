import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pin, Trash2, Heart } from 'lucide-react'
import { commentApi, resolveMediaUrl } from '../../api/index.js'
import Swal from 'sweetalert2'

export default function AdminComments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    commentApi.list().then(({ data }) => setItems(data)).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleTogglePin = async (id) => {
    try {
      const { data } = await commentApi.togglePin(id)
      setItems((prev) =>
        prev
          .map((c) => (c._id === id ? { ...c, is_pinned: data.is_pinned } : c))
          .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
      )
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Toggle pin failed', background: '#1a1a1a', color: '#fff' })
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete',
      background: '#1a1a1a',
      color: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      await commentApi.remove(id)
      setItems((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete failed', background: '#1a1a1a', color: '#fff' })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Comments</h1>
      <p className="text-white/50 text-sm mb-6">Manage visitor comments</p>

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-white/40 text-sm py-8 text-center border border-white/10 rounded-xl">
          No comments yet.
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {items.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`rounded-2xl border p-4 flex gap-3 ${
                c.is_pinned
                  ? 'border-purple-500/30 bg-purple-500/5'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold shrink-0">
                {c.name?.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  {c.is_pinned && (
                    <span className="px-2 py-[2px] rounded-full bg-purple-500/15 border border-purple-500/20 text-[10px] text-purple-300">
                      PINNED
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-1 text-[11px] text-white/40">
                    <Heart size={11} /> {c.likes || 0}
                  </span>
                </div>
                <p className="text-[13px] text-white/60 mb-1">{c.comment}</p>
                <p className="text-[10px] text-white/30">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                </p>
                {c.image_url && (
                  <img
                    src={resolveMediaUrl(c.image_url)}
                    alt="Comment"
                    className="mt-3 rounded-xl max-h-40 object-cover border border-white/10"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleTogglePin(c._id)}
                  className={`p-2 rounded-lg transition ${
                    c.is_pinned
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 hover:bg-white/10 text-white/70'
                  }`}
                  title={c.is_pinned ? 'Unpin' : 'Pin to top'}
                >
                  <Pin size={12} />
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition"
                  title="Delete"
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
