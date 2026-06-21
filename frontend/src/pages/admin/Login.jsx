import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Swal from 'sweetalert2'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Track the pending navigation timer so we can cancel it on unmount.
  const navTimerRef = useRef(null)
  useEffect(() => () => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current)
  }, [])

  const handleLogin = async (e) => {
    e?.preventDefault?.()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('Please fill email and password')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      // Close any existing popup before showing the success one
      Swal.close()
      await Swal.fire({
        icon: 'success',
        title: 'Login successful',
        background: '#1a1a1a',
        color: '#fff',
        timer: 1200,
        showConfirmButton: false,
      })
      const redirectTo = location.state?.from?.pathname || '/admin/dashboard'
      navTimerRef.current = setTimeout(() => navigate(redirectTo), 200)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute w-[500px] h-[500px] bg-white/[0.03] blur-[120px] rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-white/[0.02] blur-[120px] rounded-full bottom-[-120px] right-[-100px]" />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 sm:p-8 shadow-[0_0_60px_rgba(255,255,255,0.03)]">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-sm text-white/40 mt-2">Login to access dashboard panel</p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-sm text-white/50 mb-2 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                <input
                  type="email"
                  placeholder="admin@rifqi.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-[56px] rounded-2xl bg-[#0c0c0c] border border-white/10 pl-12 pr-4 text-white outline-none focus:border-white/20 transition"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-white/50 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full h-[56px] rounded-2xl bg-[#0c0c0c] border border-white/10 pl-12 pr-14 text-white outline-none focus:border-white/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] rounded-2xl bg-white text-black font-medium hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
