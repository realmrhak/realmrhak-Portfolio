import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, X, Upload, Layers } from 'lucide-react'
import { techApi, resolveMediaUrl } from '../../api/index.js'
import Swal from 'sweetalert2'

const empty = { name: '', logo_url: '', category: 'General' }

export default function AdminTech() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

  const blobUrlRef = useRef(null)
  const revokeBlob = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }
  useEffect(() => () => revokeBlob(), [])

  const load = () => {
    setLoading(true)
    techApi.list().then(({ data }) => setItems(data)).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: 'warning', title: 'Max 5MB', background: '#1a1a1a', color: '#fff' })
      return
    }
    revokeBlob()
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setImageFile(file)
    setImagePreview(url)
    setForm((prev) => ({ ...prev, logo_url: '' }))
  }

  const removeImage = () => {
    revokeBlob()
    setImageFile(null)
    setImagePreview(null)
    setForm((prev) => ({ ...prev, logo_url: '' }))
    const input = document.getElementById('tech-image-input')
    if (input) input.value = ''
  }

  const resetForm = () => {
    revokeBlob()
    setForm(empty)
    setImageFile(null)
    setImagePreview(null)
    const input = document.getElementById('tech-image-input')
    if (input) input.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      Swal.fire({ icon: 'warning', title: 'Name is required', background: '#1a1a1a', color: '#fff' })
      return
    }
    setSaving(true)
    try {
      const payload = { ...form }
      if (imageFile) payload.image = imageFile
      await techApi.create(payload)
      resetForm()
      setShowForm(false)
      load()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to save',
        text: err.response?.data?.message || 'Try again later',
        background: '#1a1a1a',
        color: '#fff',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete this tech stack item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete',
      background: '#1a1a1a',
      color: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      await techApi.remove(id)
      setItems((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete failed', background: '#1a1a1a', color: '#fff' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tech Stack</h1>
          <p className="text-white/50 text-sm">Manage technologies you work with</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-medium text-sm hover:scale-[1.02] transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-3"
        >
          <input
            placeholder="Tech name (e.g. React)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="admin-input"
          />
          <input
            placeholder="Category (e.g. Frontend)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="admin-input"
          />

          {/* Logo upload OR URL */}
          <label className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 flex items-center gap-3 cursor-pointer hover:border-white/30 transition">
            <Upload size={16} className="text-white/50" />
            <span className="text-sm text-white/70">
              {imageFile ? imageFile.name : 'Click to upload logo (max 5MB, jpg/png/webp/svg)'}
            </span>
            <input
              id="tech-image-input"
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </label>

          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 h-20 w-20 bg-black/20">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-black/70 hover:bg-red-500/30 flex items-center justify-center text-white"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/40">OR paste a URL</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <input
            placeholder="Logo URL (https://...)"
            value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            disabled={!!imageFile}
            className="admin-input disabled:opacity-40"
          />

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Add Tech'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-white/40 text-sm py-8 text-center border border-white/10 rounded-xl">
          No tech stack items yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col items-center text-center group relative"
            >
              {t.logo_url ? (
                <img
                  src={resolveMediaUrl(t.logo_url)}
                  alt={t.name}
                  className="w-12 h-12 object-contain mb-2"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                  <Layers size={18} className="text-white/40" />
                </div>
              )}
              <p className="text-xs text-white/80 font-medium">{t.name}</p>
              <p className="text-[10px] text-white/40">{t.category}</p>
              <button
                onClick={() => handleDelete(t._id)}
                className="mt-2 opacity-0 group-hover:opacity-100 transition px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[10px] text-red-300 flex items-center gap-1"
              >
                <Trash2 size={10} /> Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
