import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { AlertCircle, Plus, CalendarPlus, FileText } from 'lucide-react'
import { cn } from '../../utils/cn'

import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    available: 128,
    allocated: 76,
    activeBookings: 9,
    pendingTransfers: 3,
    upcomingReturns: 12
  })

  const [activities, setActivities] = useState([
    { id: 1, text: 'Laptop AF-0114 - allocated to Priya Singh - IT dept', type: 'allocation' },
    { id: 2, text: 'Room B2 - booking confirmed - 2:00 to 3:00 PM', type: 'booking' },
    { id: 3, text: 'Projector AF-0062 - maintenance resolved', type: 'maintenance' }
  ])

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Alert Banner */}
      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium">3 assets overdue for return - flagged for follow-up</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (KPIs and Actions) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardBody className="p-5 flex flex-col justify-center">
                <p className="text-secondary-foreground text-sm font-medium mb-1">Available</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.available}</h3>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5 flex flex-col justify-center">
                <p className="text-secondary-foreground text-sm font-medium mb-1">Allocated</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.allocated}</h3>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5 flex flex-col justify-center">
                <p className="text-secondary-foreground text-sm font-medium mb-1">Active Bookings</p>
                <h3 className="text-3xl font-bold text-foreground">{stats.activeBookings}</h3>
              </CardBody>
            </Card>
          </div>

          {/* Secondary KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardBody className="p-5 flex flex-col justify-center border-l-2 border-[#0066FF]">
                <p className="text-secondary-foreground text-sm font-medium mb-1">Pending Transfers</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.pendingTransfers}</h3>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-5 flex flex-col justify-center border-l-2 border-[#BF5FFF]">
                <p className="text-secondary-foreground text-sm font-medium mb-1">Upcoming returns</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.upcomingReturns}</h3>
              </CardBody>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4 mt-2">
            <Button variant="primary" className="gap-2" onClick={() => navigate('/app/assets')}>
              <Plus className="w-4 h-4" /> Register asset
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/app/bookings')}>
              <CalendarPlus className="w-4 h-4" /> Book resource
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate('/app/maintenance')}>
              <FileText className="w-4 h-4" /> Raise requests
            </Button>
          </div>
        </div>

        {/* Right Column (Recent Activity) */}
        <Card className="h-full">
          <CardHeader className="border-border pb-3 pt-5 px-5">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </CardHeader>
          <CardBody className="px-5 pt-2 pb-5 flex flex-col gap-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start group">
                <div className={cn(
                  "mt-1 w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor]",
                  activity.type === 'allocation' ? 'bg-[#0066FF] text-[#0066FF]' : 
                  activity.type === 'booking' ? 'bg-[#00F5FF] text-[#00F5FF]' : 
                  'bg-[#BF5FFF] text-[#BF5FFF]'
                )} />
                <p className="text-sm text-secondary-foreground group-hover:text-foreground transition-colors">
                  {activity.text}
                </p>
              </div>
            ))}
          </CardBody>
        </Card>

      </div>
    </div>
  )
}
