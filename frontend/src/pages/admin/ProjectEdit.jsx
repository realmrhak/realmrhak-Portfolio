import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react'
import { projectApi, resolveMediaUrl } from '../../api/index.js'
import Swal from 'sweetalert2'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'

export default function AdminProjectEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = id && id !== 'new'

  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    live_url: '',
    long_description: '',
    tags: '',
    is_featured: false,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  const blobUrlRef = useRef(null)
  const revokeBlob = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }
  // Revoke on unmount — note we DON'T revoke when the preview is a server URL
  useEffect(() => () => revokeBlob(), [])

  useEffect(() => {
    if (!isEdit) return
    projectApi
      .get(id)
      .then(({ data }) => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          image_url: data.image_url || '',
          live_url: data.live_url || '',
          long_description: data.long_description || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          is_featured: Boolean(data.is_featured),
        })
        if (data.image_url) {
          setImagePreview(resolveMediaUrl(data.image_url))
        }
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Image too large',
        text: 'Max 5MB',
        background: '#1a1a1a',
        color: '#fff',
      })
      return
    }
    revokeBlob()
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setImageFile(file)
    setImagePreview(url)
    // Clear URL field since we're using a file
    setForm((prev) => ({ ...prev, image_url: '' }))
  }

  const removeImage = () => {
    revokeBlob()
    setImageFile(null)
    setImagePreview(null)
    setForm((prev) => ({ ...prev, image_url: '' }))
    const input = document.getElementById('project-image-input')
    if (input) input.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Title and description are required',
        background: '#1a1a1a',
        color: '#fff',
      })
      return
    }

    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    if (imageFile) {
      payload.image = imageFile
    }

    try {
      if (isEdit) {
        await projectApi.update(id, payload)
      } else {
        await projectApi.create(payload)
      }
      await Swal.fire({
        icon: 'success',
        title: isEdit ? 'Project updated' : 'Project created',
        background: '#1a1a1a',
        color: '#fff',
        timer: 1500,
        showConfirmButton: false,
      })
      navigate('/admin/projects')
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Save failed',
        text: err.response?.data?.message || 'Try again later',
        background: '#1a1a1a',
        color: '#fff',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading project..." />
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin/projects')}
        className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition"
      >
        <ArrowLeft size={14} /> Back to projects
      </button>

      <h1 className="text-2xl font-bold text-white mb-6">
        {isEdit ? 'Edit Project' : 'New Project'}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <Field label="Title *">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
            required
            className="admin-input"
          />
        </Field>

        <Field label="Description *">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            required
            className="admin-input"
          />
        </Field>

        {/* IMAGE — file upload OR URL */}
        <Field label="Project Image — upload a file (recommended) OR paste a URL">
          {/* File picker */}
          <label className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 flex items-center gap-3 cursor-pointer hover:border-white/30 transition">
            <Upload size={16} className="text-white/50" />
            <span className="text-sm text-white/70">
              {imageFile ? imageFile.name : 'Click to upload image (max 5MB, jpg/png/webp)'}
            </span>
            <input
              id="project-image-input"
              hidden
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </label>

          {/* Preview */}
          {imagePreview && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-white/10 h-40 bg-black/20">
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

          {/* OR divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/40">OR paste a URL</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
            disabled={!!imageFile}
            className="admin-input disabled:opacity-40"
          />
          <p className="text-xs text-white/40 mt-1">
            Tip: Google Drive share links don't work. Use the upload button above, or paste a direct image URL (.png/.jpg).
          </p>
        </Field>

        <Field label="Live URL">
          <input
            name="live_url"
            value={form.live_url}
            onChange={handleChange}
            placeholder="https://..."
            className="admin-input"
          />
        </Field>

        <Field label="Tags (comma-separated)">
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            className="admin-input"
          />
        </Field>

        <Field label="Long Description (optional — supports Markdown: **bold**, *italic*, # headings, - lists, [links](url), `code`)">
          <textarea
            name="long_description"
            value={form.long_description}
            onChange={handleChange}
            rows={10}
            maxLength={8000}
            placeholder={'## Key Features\n\n- Built with React + Node.js\n- **Real-time** updates via Socket.io\n- JWT authentication\n\n## Tech Stack\n\n- Frontend: React, Tailwind\n- Backend: Express, MongoDB'}
            className="admin-input"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, lineHeight: 1.6 }}
          />
        </Field>

        <label className="flex items-center gap-2 text-white/80 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
            className="w-4 h-4 accent-white"
          />
          Featured project
        </label>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-medium text-sm hover:scale-[1.02] transition disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isEdit ? 'Save Changes' : 'Create Project'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-white/60 mb-2">{label}</label>
      {children}
    </div>
  )
}
