import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { PieChart, BarChart2, TrendingUp, Download } from 'lucide-react'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm">Actionable insights on asset utilization and lifecycle</p>
        </div>
        <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-muted" onClick={() => toast.success('CSV Export started!')}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Most Used Assets */}
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border pb-4 pt-5 px-6 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#0066FF]" />
            <h2 className="text-lg font-semibold text-foreground">Most Utilized Resources</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
              <span className="text-sm font-medium text-foreground">Conference Room B2</span>
              <span className="text-xs font-semibold text-[#0066FF] bg-[#0066FF]/20 px-2 py-1 rounded">34 bookings this month</span>
            </div>
            <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
              <span className="text-sm font-medium text-foreground">Company Van AF-343</span>
              <span className="text-xs font-semibold text-[#0066FF] bg-[#0066FF]/20 px-2 py-1 rounded">21 trips this month</span>
            </div>
            <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
              <span className="text-sm font-medium text-foreground">Projector AF-335</span>
              <span className="text-xs font-semibold text-[#0066FF] bg-[#0066FF]/20 px-2 py-1 rounded">18 uses</span>
            </div>
          </CardBody>
        </Card>

        {/* Idle Assets */}
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border pb-4 pt-5 px-6 flex items-center gap-3">
            <PieChart className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-foreground">Idle Assets</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-muted p-3 rounded-lg border border-orange-500/20">
              <span className="text-sm font-medium text-foreground">Camera AF-0301</span>
              <span className="text-xs font-medium text-orange-500">unused 60+ days</span>
            </div>
            <div className="flex justify-between items-center bg-muted p-3 rounded-lg border border-orange-500/20">
              <span className="text-sm font-medium text-foreground">Executive Chair AF-0410</span>
              <span className="text-xs font-medium text-orange-500">unused 45 days</span>
            </div>
            
            <Button variant="outline" className="w-full mt-2 border-border text-xs hover:bg-muted" onClick={() => toast('Loading idle inventory report...')}>Review Idle Inventory</Button>
          </CardBody>
        </Card>

        {/* Maintenance / Retirement */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader className="border-b border-border pb-4 pt-5 px-6 flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-[#BF5FFF]" />
            <h2 className="text-lg font-semibold text-foreground">Upcoming Maintenance & Retirement</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col md:flex-row gap-6">
            
            <div className="flex-1 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Service Due</h4>
              <div className="border-l-2 border-[#BF5FFF] pl-4 py-1">
                <p className="text-sm font-medium text-foreground">Forklift AF-0087</p>
                <p className="text-xs text-muted-foreground">Scheduled service in 5 days</p>
              </div>
              <div className="border-l-2 border-[#BF5FFF] pl-4 py-1">
                <p className="text-sm font-medium text-foreground">HVAC System Central</p>
                <p className="text-xs text-muted-foreground">Scheduled service in 12 days</p>
              </div>
            </div>

            <div className="w-px bg-border hidden md:block" />

            <div className="flex-1 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nearing Retirement</h4>
              <div className="border-l-2 border-red-500 pl-4 py-1">
                <p className="text-sm font-medium text-foreground">Laptop AF-0020</p>
                <p className="text-xs text-muted-foreground">4 years old - depreciate cycle complete</p>
              </div>
            </div>

          </CardBody>
        </Card>

      </div>
    </div>
  )
}
