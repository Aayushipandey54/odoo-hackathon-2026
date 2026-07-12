import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { ShieldCheck, Search, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AuditPage() {
  const auditItems = [
    { id: 'AF-0114', name: 'MacBook Pro 16"', status: 'VERIFIED' },
    { id: 'AF-0062', name: 'Sony VPL-PHZ60', status: 'MISSING' },
    { id: 'AF-0341', name: 'Herman Miller Aeron', status: 'PENDING' },
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Asset Audit</h1>
          <p className="text-neutral-400 text-sm">Conduct physical verification and discrepancy reporting</p>
        </div>
        <Button variant="primary" className="gap-2">
          <ShieldCheck className="w-4 h-4" /> Start New Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Audit Cycle */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-[#111111] border-[#0066FF]/20">
            <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Q3 Comprehensive Audit</h2>
              <span className="bg-[#0066FF]/20 text-[#0066FF] px-3 py-1 rounded-full text-xs font-medium">In Progress</span>
            </CardHeader>
            <CardBody className="px-6 py-5 flex flex-col gap-4">
              
              {/* Progress */}
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066FF] w-[65%]" />
                </div>
                <span className="text-sm font-medium text-white">65% Complete</span>
              </div>

              {/* Checklist */}
              <div className="border border-white/10 rounded-xl overflow-hidden mt-4">
                <div className="bg-white/[0.02] p-3 border-b border-white/10 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-300">Scan or search asset to verify</span>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input 
                      type="text" 
                      placeholder="Asset ID..." 
                      className="bg-[#0a0a0a] border border-white/10 rounded-md pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none w-48"
                    />
                  </div>
                </div>
                
                <div className="divide-y divide-white/5">
                  {auditItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div>
                        <p className="font-medium text-white text-sm">{item.name}</p>
                        <p className="text-xs text-neutral-500">{item.id}</p>
                      </div>
                      
                      {item.status === 'VERIFIED' && (
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                      
                      {item.status === 'MISSING' && (
                        <div className="flex items-center gap-2 text-red-500">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Missing</span>
                        </div>
                      )}
                      
                      {item.status === 'PENDING' && (
                        <Button variant="outline" className="text-xs py-1.5 border-white/20">Verify</Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                 <Button variant="primary" className="bg-[#BF5FFF] text-white hover:bg-[#BF5FFF]/90 border-transparent">
                   Generate Discrepancy Report
                 </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Previous Reports */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-white">Past Discrepancy Reports</h3>
          
          <Card className="bg-[#111111] border-white/10 hover:border-white/20 cursor-pointer transition-colors">
            <CardBody className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">Q2 Audit Report</h4>
                <p className="text-xs text-neutral-400 mb-2">2 discrepancies found</p>
                <p className="text-[10px] text-neutral-500">Completed Jun 30, 2026</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-[#111111] border-white/10 hover:border-white/20 cursor-pointer transition-colors">
            <CardBody className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm mb-1">Q1 Audit Report</h4>
                <p className="text-xs text-neutral-400 mb-2">100% matched</p>
                <p className="text-[10px] text-neutral-500">Completed Mar 31, 2026</p>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  )
}
