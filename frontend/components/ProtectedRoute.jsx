import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import Loader from './ui/Loader'

const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-app)]">
        <Loader size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Future RBAC implementation (if requireRole is passed)
  if (requireRole && user?.role !== requireRole) {
    // Usually redirect to an unauthorized page or dashboard
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
