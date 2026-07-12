import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { ShieldCheck, Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

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
          <h1 className="text-2xl font-bold text-foreground mb-1">Asset Audit</h1>
          <p className="text-muted-foreground text-sm">Conduct physical verification and discrepancy reporting</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => toast.success('New audit initialized!')}>
          <ShieldCheck className="w-4 h-4" /> Start New Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Audit Cycle */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-card border-border-strong">
            <CardHeader className="border-b border-border pb-4 pt-5 px-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">Q3 Comprehensive Audit</h2>
              <span className="bg-[#0066FF]/20 text-[#0066FF] px-3 py-1 rounded-full text-xs font-medium">In Progress</span>
            </CardHeader>
            <CardBody className="px-6 py-5 flex flex-col gap-4">
              
              {/* Progress */}
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[#0066FF] w-[65%]" />
                </div>
                <span className="text-sm font-medium text-foreground">65% Complete</span>
              </div>

              {/* Checklist */}
              <div className="border border-border rounded-xl overflow-hidden mt-4">
                <div className="bg-muted/30 p-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-foreground">Scan or search asset to verify</span>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Asset ID..." 
                      className="bg-background border border-border rounded-md pl-9 pr-3 py-1.5 text-sm text-foreground focus:outline-none w-48"
                    />
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {auditItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.id}</p>
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
                        <Button variant="outline" className="text-xs py-1.5 border-border-strong" onClick={() => toast.success(`Verified ${item.id}`)}>Verify</Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button variant="primary" className="bg-[#BF5FFF] text-white hover:bg-[#BF5FFF]/90 border-transparent" onClick={() => toast.success('Audit report submitted successfully!')}>
                  Submit Report
                </Button>
                <Button variant="outline" onClick={() => toast('Draft saved')}>
                  Save Draft
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Previous Reports */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-foreground">Past Discrepancy Reports</h3>
          
          <Card className="bg-card border-border hover:border-border-strong cursor-pointer transition-colors">
            <CardBody className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm mb-1">Q2 Audit Report</h4>
                <p className="text-xs text-muted-foreground mb-2">2 discrepancies found</p>
                <p className="text-[10px] text-muted-foreground">Completed Jun 30, 2026</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-card border-border hover:border-border-strong cursor-pointer transition-colors">
            <CardBody className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm mb-1">Q1 Audit Report</h4>
                <p className="text-xs text-muted-foreground mb-2">100% matched</p>
                <p className="text-[10px] text-muted-foreground">Completed Mar 31, 2026</p>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  )
}
