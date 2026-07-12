import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './store/ThemeContext'
import AppLayout from './layouts/AppLayout'
import Toast from './components/ui/Toast'
import ErrorBoundary from './components/ErrorBoundary'

// Existing pages
import HomePage from './pages/HomePage'

import DashboardPage from './pages/app/DashboardPage'

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
        <Route path="organization" element={<Placeholder name="Organization setup" />} />
        <Route path="assets" element={<Placeholder name="Assets" />} />
        <Route path="allocations" element={<Placeholder name="Allocation & Transfer" />} />
        <Route path="bookings" element={<Placeholder name="Resource Booking" />} />
        <Route path="maintenance" element={<Placeholder name="Maintenance" />} />
        <Route path="audit" element={<Placeholder name="Audit" />} />
        <Route path="reports" element={<Placeholder name="Reports" />} />
        <Route path="notifications" element={<Placeholder name="Notifications" />} />
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
