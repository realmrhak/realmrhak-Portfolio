import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { LayoutDashboard, Folder, Award, MessageSquare, Layers, Menu, X, LogOut, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import Swal from 'sweetalert2'
import '../../styles/admin.css'

const menus = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Projects', icon: Folder, path: '/admin/projects' },
  { name: 'Certificates', icon: Award, path: '/admin/certificates' },
  { name: 'Comments', icon: MessageSquare, path: '/admin/comments' },
  { name: 'Messages', icon: Mail, path: '/admin/messages' },
  { name: 'Tech Stack', icon: Layers, path: '/admin/tech' },
]

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'You will need to log in again.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, logout',
      background: '#1a1a1a',
      color: '#fff',
    })
    if (result.isConfirmed) {
      logout()
      navigate('/admin/login')
    }
  }

  return (
    <>
      <div>
        <h1 className="text-lg font-semibold mb-8 tracking-wide text-white">Admin Panel</h1>
        <nav className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon
            const active = pathname === menu.path
            return (
              <Link key={menu.path} to={menu.path} onClick={onNavigate} className="block">
                <motion.div
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className={`relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    active ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.12)]' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {!active && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl bg-gradient-to-r from-white/[0.06] to-transparent" />
                  )}
                  {active && (
                    <motion.div
                      layoutId="activeSidebar"
                      className="absolute left-0 top-2 bottom-2 w-[4px] rounded-full bg-black"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <motion.div whileHover={{ rotate: -6 }} transition={{ type: 'spring', stiffness: 300 }} className="relative z-10">
                    <Icon size={17} />
                  </motion.div>
                  <span className="relative z-10 text-sm font-medium tracking-wide">{menu.name}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>

      <div>
        <div className="text-xs text-white/40 mb-2 truncate">{user?.email}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-red-400 transition"
        >
          <LogOut size={15} /> Logout
        </button>
        <div className="text-xs text-white/35 tracking-wide mt-4">© {new Date().getFullYear()} Admin</div>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!user) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-[#070707]">
      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside className="fixed left-0 top-0 h-screen w-[250px] bg-black border-r border-white/10 p-6 flex flex-col justify-between overflow-hidden z-50">
          <SidebarContent />
        </aside>
      )}

      {/* MOBILE TOPBAR + DRAWER */}
      {isMobile && (
        <>
          <div className="fixed top-0 left-0 right-0 h-[70px] bg-black/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-5 z-[60]">
            <h1 className="text-white font-semibold text-base">Admin Panel</h1>
            <button
              onClick={() => setOpen(true)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              <Menu size={20} />
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
                />
                <motion.aside
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className="fixed left-0 top-0 h-screen w-[260px] bg-black border-r border-white/10 p-6 flex flex-col justify-between z-[80]"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <SidebarContent onNavigate={() => setOpen(false)} />
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* CONTENT */}
      <main className={isMobile ? 'pt-[70px] p-4' : 'ml-[250px] p-8'}>
        <Outlet />
      </main>
    </div>
  )
}
