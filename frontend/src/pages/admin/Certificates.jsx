import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, X, Upload } from 'lucide-react'
import { certificateApi, resolveMediaUrl } from '../../api/index.js'
import Swal from 'sweetalert2'

const empty = { title: '', issuer: '', image_url: '', issued_at: '' }

export default function AdminCertificates() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(empty)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)

  // Track the current blob URL so we can revoke it (no memory leak)
  const blobUrlRef = useRef(null)

  const revokeBlob = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }

  // Revoke on unmount
  useEffect(() => () => revokeBlob(), [])

  const load = () => {
    setLoading(true)
    certificateApi.list().then(({ data }) => setItems(data)).finally(() => setLoading(false))
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
    setForm((prev) => ({ ...prev, image_url: '' }))
  }

  const removeImage = () => {
    revokeBlob()
    setImageFile(null)
    setImagePreview(null)
    setForm((prev) => ({ ...prev, image_url: '' }))
    const input = document.getElementById('cert-image-input')
    if (input) input.value = ''
  }

  const resetForm = () => {
    revokeBlob()
    setForm(empty)
    setImageFile(null)
    setImagePreview(null)
    const input = document.getElementById('cert-image-input')
    if (input) input.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      Swal.fire({ icon: 'warning', title: 'Title is required', background: '#1a1a1a', color: '#fff' })
      return
    }
    if (!imageFile && !form.image_url.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Image required',
        text: 'Upload a file OR paste an image URL',
        background: '#1a1a1a',
        color: '#fff',
      })
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        issued_at: form.issued_at ? new Date(form.issued_at).toISOString() : null,
      }
      if (imageFile) payload.image = imageFile
      await certificateApi.create(payload)
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
      title: 'Delete this certificate?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete',
      background: '#1a1a1a',
      color: '#fff',
    })
    if (!result.isConfirmed) return
    try {
      await certificateApi.remove(id)
      setItems((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Delete failed', background: '#1a1a1a', color: '#fff' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Certificates</h1>
          <p className="text-white/50 text-sm">Manage your certificates</p>
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
            placeholder="Certificate title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="admin-input"
          />
          <input
            placeholder="Issuer (optional)"
            value={form.issuer}
            onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            className="admin-input"
          />
          <input
            type="date"
            value={form.issued_at}
            onChange={(e) => setForm({ ...form, issued_at: e.target.value })}
            className="admin-input"
          />

          {/* Image upload OR URL */}
          <label className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 flex items-center gap-3 cursor-pointer hover:border-white/30 transition">
            <Upload size={16} className="text-white/50" />
            <span className="text-sm text-white/70">
              {imageFile ? imageFile.name : 'Click to upload image (max 5MB, jpg/png/webp)'}
            </span>
            <input
              id="cert-image-input"
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </label>

          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 h-32 bg-black/20">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/70 hover:bg-red-500/30 flex items-center justify-center text-white"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/40">OR paste a URL</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <input
            placeholder="Image URL (https://...)"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            disabled={!!imageFile}
            className="admin-input disabled:opacity-40"
          />

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white text-black text-sm font-medium disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Add Certificate'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-white/40 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-white/40 text-sm py-8 text-center border border-white/10 rounded-xl">
          No certificates yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black/20 mb-3">
                <img
                  src={resolveMediaUrl(c.image_url)}
                  alt={c.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{c.title}</h3>
              {c.issuer && <p className="text-white/50 text-xs mb-3">{c.issuer}</p>}
              <button
                onClick={() => handleDelete(c._id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-300 transition"
              >
                <Trash2 size={12} /> Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
