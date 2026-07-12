import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Settings, Package, ArrowRightLeft, CalendarClock, Wrench, ShieldCheck, PieChart, Bell, LogOut, Sun, Moon } from 'lucide-react'
import { cn } from '../utils/cn'
import { useAuth } from '../store/AuthContext'
import { useTheme } from '../hooks/useTheme'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  
  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'Organization setup', path: '/app/organization', icon: Settings },
    { label: 'Assets', path: '/app/assets', icon: Package },
    { label: 'Allocation & Transfer', path: '/app/allocations', icon: ArrowRightLeft },
    { label: 'Resource Booking', path: '/app/bookings', icon: CalendarClock },
    { label: 'Maintenance', path: '/app/maintenance', icon: Wrench },
    { label: 'Audit', path: '/app/audit', icon: ShieldCheck },
    { label: 'Reports', path: '/app/reports', icon: PieChart },
    { label: 'Notifications', path: '/app/notifications', icon: Bell },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-satoshi">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col pt-6 pb-4">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-bold tracking-tight">AssetFlow</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 border",
                  isActive 
                    ? "bg-primary/10 border-primary/20 font-medium text-primary shadow-sm" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 mt-auto space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button 
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background relative">
        <div className="absolute inset-0 bg-matrix pointer-events-none opacity-80"></div>
        <div className="max-w-6xl mx-auto p-8 h-full relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
