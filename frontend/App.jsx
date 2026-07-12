import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './store/ThemeContext'
import { AuthProvider } from './store/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from './layouts/AppLayout'
import Toast from './components/ui/Toast'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'

// Existing pages
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/app/DashboardPage'
import OrganizationPage from './pages/app/OrganizationPage'
import AssetsPage from './pages/app/AssetsPage'
import AllocationsPage from './pages/app/AllocationsPage'
import TransfersPage from './pages/app/TransfersPage'
import ApprovalsPage from './pages/app/ApprovalsPage'
import BookingsPage from './pages/app/BookingsPage'
import MaintenancePage from './pages/app/MaintenancePage'
import AuditPage from './pages/app/AuditPage'
import ReportsPage from './pages/app/ReportsPage'
import NotificationsPage from './pages/app/NotificationsPage'

const queryClient = new QueryClient()

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      
      {/* Protected App Routes */}
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="organization" element={<OrganizationPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="allocations" element={<AllocationsPage />} />
        <Route path="transfers" element={<TransfersPage />} />
        <Route path="approvals" element={<ApprovalsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <Toast />
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
