import { Card, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Plus, CheckCircle2, Wrench, AlertCircle, Clock } from 'lucide-react'
import { cn } from '../../utils/cn'
import toast from 'react-hot-toast'

export default function MaintenancePage() {
  const columns = [
    { id: 'todo', title: 'To Do / Requested', count: 2 },
    { id: 'in_progress', title: 'In Progress', count: 1 },
    { id: 'resolved', title: 'Resolved', count: 3 }
  ]

  const tasks = [
    { id: 1, title: 'Network switch unresponsive', asset: 'Switch AF-022', status: 'todo' },
    { id: 2, title: 'Keyboard keys sticky', asset: 'Logitech MX', status: 'todo' },
    { id: 3, title: 'Screen flickering', asset: 'Monitor AF-330', status: 'in_progress', assignee: 'John T.' },
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Maintenance Management</h1>
          <p className="text-muted-foreground text-sm">Track repairs, servicing, and technical issues</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => toast.success('New ticket form opened!')}>
          <Plus className="w-4 h-4" /> New Ticket
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="flex-shrink-0 w-[300px] flex flex-col bg-muted/20 border border-border rounded-xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-card rounded-t-xl">
              <h3 className="font-semibold text-foreground">{col.title}</h3>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">{col.count}</span>
            </div>
            
            <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
              {tasks.filter(t => t.status === col.id).map(task => (
                <Card key={task.id} className="bg-surface border-border cursor-pointer hover:border-border-strong transition-colors">
                  <CardBody className="p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">{task.title}</h4>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                        {task.asset}
                      </span>
                      {task.assignee && (
                        <div className="w-6 h-6 rounded-full bg-[#BF5FFF]/20 text-[#BF5FFF] text-[10px] flex items-center justify-center font-bold" title={task.assignee}>
                          {task.assignee.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
              
              {col.id === 'resolved' && (
                <div className="p-4 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground">
                  + 2 older resolved tickets
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
