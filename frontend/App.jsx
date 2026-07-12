import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './store/ThemeContext'
import AppLayout from './layouts/AppLayout'
import Toast from './components/ui/Toast'
import ErrorBoundary from './components/ErrorBoundary'

// Existing pages
import HomePage from './pages/HomePage'

import DashboardPage from './pages/app/DashboardPage'
import OrganizationPage from './pages/app/OrganizationPage'
import AssetsPage from './pages/app/AssetsPage'
import AllocationsPage from './pages/app/AllocationsPage'
import BookingsPage from './pages/app/BookingsPage'
import MaintenancePage from './pages/app/MaintenancePage'
import AuditPage from './pages/app/AuditPage'
import ReportsPage from './pages/app/ReportsPage'
import NotificationsPage from './pages/app/NotificationsPage'

// New app placeholder pages (we'll replace these with real pages next)
const Placeholder = ({ name }) => <div className="text-white h-full flex items-center justify-center text-2xl font-bold opacity-30">{name}</div>

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Placeholder name="Login" />} />
      <Route path="/register" element={<Placeholder name="Register" />} />
      
      {/* App Routes */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="organization" element={<OrganizationPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="allocations" element={<AllocationsPage />} />
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
      <BrowserRouter>
        <ThemeProvider>
          <Toast />
          <AppContent />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
