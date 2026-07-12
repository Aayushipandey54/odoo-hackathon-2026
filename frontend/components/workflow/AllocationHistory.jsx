import { Card, CardHeader, CardBody } from '../ui/Card'
import { History, Calendar, User, Check, X } from 'lucide-react'

export default function AllocationHistory({ allocations = [], isLoading = false }) {
  if (isLoading) {
    return (
      <Card className="bg-[#111111] border-white/10">
        <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex items-center gap-2">
          <History className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-white">Allocation History</h2>
        </CardHeader>
        <CardBody className="px-6 py-5">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-neutral-800 rounded animate-pulse" />
            ))}
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!allocations || allocations.length === 0) {
    return (
      <Card className="bg-[#111111] border-white/10">
        <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex items-center gap-2">
          <History className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-white">Allocation History</h2>
        </CardHeader>
        <CardBody className="px-6 py-5 text-center">
          <p className="text-neutral-400 text-sm">No allocation history yet</p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="bg-[#111111] border-white/10">
      <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex items-center gap-2">
        <History className="w-5 h-5 text-neutral-400" />
        <h2 className="text-lg font-semibold text-white">Allocation History</h2>
      </CardHeader>
      <CardBody className="px-6 py-5">
        <div className="space-y-4">
          {allocations.map(allocation => (
            <div
              key={allocation.id}
              className="flex items-start gap-4 border-l-2 border-[#0066FF] pl-4 py-2 hover:bg-white/5 rounded-r transition-colors"
            >
              <div className="flex-shrink-0 pt-1">
                {allocation.returnedAt ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 bg-blue-500 rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">
                    {allocation.employee?.name || 'Unknown Employee'}
                  </span>
                  {allocation.returnedAt && (
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded">
                      Returned
                    </span>
                  )}
                  {!allocation.returnedAt && (
                    <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(allocation.allocatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {allocation.returnedAt && (
                    <div className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>
                        Returned {new Date(allocation.returnedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {allocation.conditionOnReturn && (
                    <div className="flex items-center gap-1">
                      <span className="capitalize">{allocation.conditionOnReturn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
