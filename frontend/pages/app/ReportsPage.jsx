import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { PieChart, BarChart2, TrendingUp, Download } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Reports & Analytics</h1>
          <p className="text-neutral-400 text-sm">Actionable insights on asset utilization and lifecycle</p>
        </div>
        <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Most Used Assets */}
        <Card className="bg-[#111111] border-white/10">
          <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#0066FF]" />
            <h2 className="text-lg font-semibold text-white">Most Utilized Resources</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
              <span className="text-sm font-medium text-white">Conference Room B2</span>
              <span className="text-xs font-semibold text-[#0066FF] bg-[#0066FF]/20 px-2 py-1 rounded">34 bookings this month</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
              <span className="text-sm font-medium text-white">Company Van AF-343</span>
              <span className="text-xs font-semibold text-[#0066FF] bg-[#0066FF]/20 px-2 py-1 rounded">21 trips this month</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
              <span className="text-sm font-medium text-white">Projector AF-335</span>
              <span className="text-xs font-semibold text-[#0066FF] bg-[#0066FF]/20 px-2 py-1 rounded">18 uses</span>
            </div>
          </CardBody>
        </Card>

        {/* Idle Assets */}
        <Card className="bg-[#111111] border-white/10">
          <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex items-center gap-3">
            <PieChart className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-white">Idle Assets</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-orange-500/20">
              <span className="text-sm font-medium text-white">Camera AF-0301</span>
              <span className="text-xs font-medium text-orange-500">unused 60+ days</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-orange-500/20">
              <span className="text-sm font-medium text-white">Executive Chair AF-0410</span>
              <span className="text-xs font-medium text-orange-500">unused 45 days</span>
            </div>
            
            <Button variant="outline" className="w-full mt-2 border-white/10 text-xs">Review Idle Inventory</Button>
          </CardBody>
        </Card>

        {/* Maintenance / Retirement */}
        <Card className="bg-[#111111] border-white/10 md:col-span-2">
          <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-[#BF5FFF]" />
            <h2 className="text-lg font-semibold text-white">Upcoming Maintenance & Retirement</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col md:flex-row gap-6">
            
            <div className="flex-1 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Service Due</h4>
              <div className="border-l-2 border-[#BF5FFF] pl-4 py-1">
                <p className="text-sm font-medium text-white">Forklift AF-0087</p>
                <p className="text-xs text-neutral-400">Scheduled service in 5 days</p>
              </div>
              <div className="border-l-2 border-[#BF5FFF] pl-4 py-1">
                <p className="text-sm font-medium text-white">HVAC System Central</p>
                <p className="text-xs text-neutral-400">Scheduled service in 12 days</p>
              </div>
            </div>

            <div className="w-px bg-white/10 hidden md:block" />

            <div className="flex-1 flex flex-col gap-3">
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Nearing Retirement</h4>
              <div className="border-l-2 border-red-500 pl-4 py-1">
                <p className="text-sm font-medium text-white">Laptop AF-0020</p>
                <p className="text-xs text-neutral-400">4 years old - depreciate cycle complete</p>
              </div>
            </div>

          </CardBody>
        </Card>

      </div>
    </div>
  )
}
