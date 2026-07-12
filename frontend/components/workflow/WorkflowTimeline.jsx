/**
 * WorkflowTimeline Component
 * Displays immutable timeline of asset lifecycle events
 */

import { ChevronRight, Calendar, User, FileText } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'

const eventIconConfig = {
  ASSET_ALLOCATED: {
    icon: '📋',
    label: 'Asset Allocated',
    color: 'border-blue-500'
  },
  ASSET_RETURNED: {
    icon: '↩️',
    label: 'Asset Returned',
    color: 'border-green-500'
  },
  ASSET_TRANSFERRED: {
    icon: '↔️',
    label: 'Asset Transferred',
    color: 'border-purple-500'
  },
  MAINTENANCE_STARTED: {
    icon: '🔧',
    label: 'Maintenance Started',
    color: 'border-yellow-500'
  },
  MAINTENANCE_COMPLETED: {
    icon: '✓',
    label: 'Maintenance Completed',
    color: 'border-green-500'
  },
  AUDIT_COMPLETED: {
    icon: '✓',
    label: 'Audit Completed',
    color: 'border-blue-500'
  },
  QR_CODE_GENERATED: {
    icon: '🔲',
    label: 'QR Code Generated',
    color: 'border-gray-500'
  }
}

export default function WorkflowTimeline({ events = [], isLoading = false }) {
  if (isLoading) {
    return (
      <Card className="bg-[#111111] border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Asset Timeline</h2>
        </CardHeader>
        <CardBody className="px-6 py-8">
          <div className="text-center text-neutral-400">Loading timeline...</div>
        </CardBody>
      </Card>
    )
  }

  if (!events || events.length === 0) {
    return (
      <Card className="bg-[#111111] border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <h2 className="text-lg font-semibold text-white">Asset Timeline</h2>
        </CardHeader>
        <CardBody className="px-6 py-8">
          <div className="text-center text-neutral-400">No timeline events yet</div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="bg-[#111111] border-white/10">
      <CardHeader className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold text-white">Asset Timeline</h2>
      </CardHeader>
      <CardBody className="px-6 py-5">
        <div className="space-y-0">
          {events.map((event, index) => {
            const config = eventIconConfig[event.event] || {
              icon: '📝',
              label: event.event,
              color: 'border-neutral-500'
            }

            return (
              <div key={event.id || index} className="flex items-start gap-4 pb-6 last:pb-0">
                {/* Timeline marker */}
                <div className="flex flex-col items-center pt-1">
                  <div className={`border-2 ${config.color} rounded-full w-10 h-10 flex items-center justify-center bg-[#0a0a0a] text-lg`}>
                    {config.icon}
                  </div>
                  {index < events.length - 1 && (
                    <div className={`w-0.5 h-12 ${config.color} border-l-2 mt-2`} />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pt-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-white">
                      {config.label}
                    </h3>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <p className="text-sm text-neutral-300 mb-2">
                      {event.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.createdAt).toLocaleDateString()} at{' '}
                      {new Date(event.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>

                    {event.performedBy && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.performedBy}
                      </span>
                    )}
                  </div>

                  {/* Additional details */}
                  {event.details && typeof event.details === 'object' && Object.keys(event.details).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <details className="text-xs text-neutral-400 cursor-pointer hover:text-neutral-300 transition-colors">
                        <summary className="flex items-center gap-1">
                          <ChevronRight className="w-3 h-3" />
                          View details
                        </summary>
                        <pre className="mt-2 p-2 bg-[#0a0a0a] rounded text-xs overflow-auto max-h-40 border border-white/10">
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardBody>
    </Card>
  )
}
