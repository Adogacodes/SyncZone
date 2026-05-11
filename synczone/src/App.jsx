import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from './context/AppContext'
import Login from './pages/Login'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Team from './pages/Team'
import Timeline from './pages/Timeline'
import Meeting from './pages/Meeting'
import MemberModal from './components/team/MemberModal'
import ProtectedRoute from './components/layout/ProtectedRoute'

function LoadingScreen() {
  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      flexDirection:  'column',
      gap:            '16px',
    }}>
      <div className="loading-spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
        Loading SyncZone...
      </p>
    </div>
  )
}

function AppRoutes() {
  const { isLoggedIn, authLoading, activePage, setActivePage } = useApp()
  const navigate  = useNavigate()
  const location  = useLocation()

  // Keep activePage in sync with the URL
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'dashboard'
    setActivePage(path)
  }, [location.pathname])

  // Navigate when activePage changes from sidebar clicks
  function handleNavigate(page) {
    setActivePage(page)
    navigate(`/${page}`)
  }

  if (authLoading) return <LoadingScreen />

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout activePage={activePage} onNavigate={handleNavigate}>
              <MemberModal />
            </AppLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="timeline"  element={<Timeline />} />
        <Route path="meeting"   element={<Meeting />} />
        <Route path="team"      element={<Team />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}