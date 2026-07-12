import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Bell, Activity, ArrowRight, UserPlus, Wrench } from 'lucide-react'

export default function NotificationsPage() {
  const logs = [
    { id: 1, time: '10:42 AM', type: 'transfer', text: 'Sarah Jones approved transfer for MacBook AF-0114', icon: ArrowRight, color: 'text-[#0066FF]' },
    { id: 2, time: '09:15 AM', type: 'booking', text: 'Arjun Nair booked Room B2 for tomorrow', icon: Activity, color: 'text-[#00F5FF]' },
    { id: 3, time: 'Yesterday', type: 'maintenance', text: 'IT Dept marked Switch AF-022 as In Progress', icon: Wrench, color: 'text-[#BF5FFF]' },
    { id: 4, time: 'Yesterday', type: 'user', text: 'New employee David Kim added to Engineering', icon: UserPlus, color: 'text-neutral-400' },
  ]

  const alerts = [
    { id: 1, text: 'Audit Cycle Q3 requires your verification for 3 assets', time: '2 hours ago' },
    { id: 2, text: 'Transfer request #TR-992 is pending your approval', time: '5 hours ago' }
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Activity & Notifications</h1>
        <p className="text-muted-foreground text-sm">System logs, alerts, and pending actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts / Action Required */}
        <div className="lg:col-span-1 flex flex-col gap-4 order-2 lg:order-1">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" /> Action Required
          </h3>
          
          {alerts.map(alert => (
            <Card key={alert.id} className="bg-card border-orange-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-500" />
              <CardBody className="p-4 pl-5">
                <p className="text-sm font-medium text-foreground mb-2">{alert.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <button className="text-xs font-semibold text-orange-500 hover:text-orange-400">View</button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Global Activity Log */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="bg-card border-border h-full">
            <CardHeader className="border-b border-border pb-4 pt-5 px-6">
              <h2 className="text-lg font-semibold text-foreground">Global Activity Log</h2>
            </CardHeader>
            <CardBody className="px-6 py-2">
              <div className="relative border-l border-border ml-3 py-6 space-y-8">
                
                {logs.map((log) => {
                  const Icon = log.icon
                  return (
                    <div key={log.id} className="relative flex items-start gap-4">
                      {/* Node */}
                      <div className={`absolute -left-[1.1rem] top-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center ${log.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="ml-8 pt-1">
                        <p className="text-sm font-medium text-foreground mb-1">{log.text}</p>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
                    </div>
                  )
                })}

              </div>
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  )
}
