import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { projectApi, resolveMediaUrl } from '../../api/index.js'
import Swal from 'sweetalert2'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    projectApi
      .list()
      .then(({ data }) => setProjects(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this project?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete',
      background: '#1a1a1a',
      color: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      await projectApi.remove(id)
      setProjects((prev) => prev.filter((p) => p._id !== id))
      // Use a toast-style popup — no separate confirmation popup needed
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        background: '#1a1a1a',
        color: '#fff',
        timer: 1200,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: err.response?.data?.message || 'Try again later',
        background: '#1a1a1a',
        color: '#fff',
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
          <p className="text-white/50 text-sm">Manage your portfolio projects</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-medium text-sm hover:scale-[1.02] transition"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="text-white/40 text-sm py-8 text-center border border-white/10 rounded-xl">
          No projects yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black/20 mb-3">
                {p.image_url ? (
                  <img src={resolveMediaUrl(p.image_url)} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
              </div>

              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{p.title}</h3>
              <p className="text-white/50 text-xs line-clamp-2 mb-3">{p.description}</p>

              <div className="flex items-center gap-2">
                <Link
                  to={`/admin/projects/${p._id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition"
                >
                  <Pencil size={12} /> Edit
                </Link>

                {p.live_url && (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/70 transition"
                  >
                    <ExternalLink size={12} /> Live
                  </a>
                )}

                <button
                  onClick={() => handleDelete(p._id)}
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
