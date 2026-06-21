import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: false,
})

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Only clear if we actually had a token (don't touch public sessions)
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // redirect to login if on an admin route
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api
