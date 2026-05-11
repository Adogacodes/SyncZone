import { Navigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, authLoading } = useApp()

  if (authLoading) return null

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return children
}