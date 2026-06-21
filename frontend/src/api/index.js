import api from './client.js'

// ====== Auth ======
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
}

// ====== Projects ======
export const projectApi = {
  list: () => api.get('/projects'),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => buildMultipart(data, ['tags', 'is_featured']).then((p) => api.post('/projects', ...p)),
  update: (id, data) => buildMultipart(data, ['tags', 'is_featured']).then((p) => api.put(`/projects/${id}`, ...p)),
  remove: (id) => api.delete(`/projects/${id}`),
}

// ====== Certificates ======
export const certificateApi = {
  list: () => api.get('/certificates'),
  get: (id) => api.get(`/certificates/${id}`),
  create: (data) => buildMultipart(data).then((p) => api.post('/certificates', ...p)),
  update: (id, data) => buildMultipart(data).then((p) => api.put(`/certificates/${id}`, ...p)),
  remove: (id) => api.delete(`/certificates/${id}`),
}

// ====== Tech Stack ======
export const techApi = {
  list: () => api.get('/tech'),
  get: (id) => api.get(`/tech/${id}`),
  create: (data) => buildMultipart(data).then((p) => api.post('/tech', ...p)),
  update: (id, data) => buildMultipart(data).then((p) => api.put(`/tech/${id}`, ...p)),
  remove: (id) => api.delete(`/tech/${id}`),
}

// ====== Comments ======
export const commentApi = {
  list: () => api.get('/comments'),
  create: (formData) =>
    api.post('/comments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  like: (id) => api.put(`/comments/${id}/like`),
  togglePin: (id) => api.put(`/comments/${id}/pin`),
  remove: (id) => api.delete(`/comments/${id}`),
}

// ====== Messages (contact form) ======
export const messageApi = {
  create: (data) => api.post('/messages', data),
  list: () => api.get('/messages'),
  markRead: (id) => api.put(`/messages/${id}/read`),
  remove: (id) => api.delete(`/messages/${id}`),
}

// ====== Dashboard stats ======
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
}

// Helper: prefix backend-relative upload URLs with API origin
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')

export function resolveMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`
  return url
}

/**
 * Build a multipart/form-data payload when the data contains a File (image),
 * otherwise send plain JSON. Returns [payload, config] for axios spread.
 */
function buildMultipart(data, arrayFields = []) {
  if (!(data?.image instanceof File)) {
    return Promise.resolve([data, undefined])
  }

  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (key === 'image') {
      formData.append('image', value)
      return
    }
    if (arrayFields.includes(key) && Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v))
      return
    }
    formData.append(key, value)
  })

  return Promise.resolve([formData, { headers: { 'Content-Type': 'multipart/form-data' } }])
}