import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'

// Public pages — load eagerly (small)
import Home from './pages/Home.jsx'
import PortfolioDetail from './pages/PortfolioDetail.jsx'

// Admin pages — lazy load (large & rarely visited)
const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const AdminProjects = lazy(() => import('./pages/admin/Projects.jsx'))
const AdminCertificates = lazy(() => import('./pages/admin/Certificates.jsx'))
const AdminComments = lazy(() => import('./pages/admin/Comments.jsx'))
const AdminTech = lazy(() => import('./pages/admin/Tech.jsx'))
const AdminMessages = lazy(() => import('./pages/admin/Messages.jsx'))
const AdminProjectEdit = lazy(() => import('./pages/admin/ProjectEdit.jsx'))

function AdminFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: 'rgba(255,255,255,0.7)',
        background: '#050505',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '15px',
        fontWeight: 500,
        letterSpacing: '0.01em',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span>Loading admin...</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0d0d0d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    )
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/portfolio/:id" element={<PortfolioDetail />} />

      {/* Admin login */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />

      {/* Admin protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<AdminFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminProjects />
            </Suspense>
          }
        />
        <Route
          path="projects/new"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminProjectEdit />
            </Suspense>
          }
        />
        <Route
          path="projects/:id"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminProjectEdit />
            </Suspense>
          }
        />
        <Route
          path="certificates"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminCertificates />
            </Suspense>
          }
        />
        <Route
          path="comments"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminComments />
            </Suspense>
          }
        />
        <Route
          path="tech"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminTech />
            </Suspense>
          }
        />
        <Route
          path="messages"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminMessages />
            </Suspense>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
