import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ApprovalDialog from '../../components/workflow/ApprovalDialog'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

export default function ApprovalsPage() {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [approvalAction, setApprovalAction] = useState(null)
  const [selectedApprovals, setSelectedApprovals] = useState(new Set())

  // Mock data - replace with API calls
  const approvals = [
    {
      id: 'APR-001',
      type: 'TRANSFER',
      priority: 'normal',
      entity: 'Asset Transfer',
      details: 'MacBook Pro 16" transfer from Priya Shah to Rajesh Kumar',
      reason: 'Project transfer to data team',
      requester: 'Priya Shah',
      createdAt: '2026-07-10T10:30:00',
      createdAgo: '2 hours ago'
    },
    {
      id: 'APR-002',
      type: 'TRANSFER',
      priority: 'high',
      entity: 'Asset Transfer',
      details: 'Dell Monitor transfer from Amit Patel to Neha Singh',
      reason: 'Department reorganization',
      requester: 'Amit Patel',
      createdAt: '2026-07-09T14:15:00',
      createdAgo: '1 day ago'
    },
    {
      id: 'APR-003',
      type: 'MAINTENANCE',
      priority: 'critical',
      entity: 'Maintenance Request',
      details: 'Urgent: Printer offline - needs immediate repair',
      reason: 'Device malfunction',
      requester: 'Support Team',
      createdAt: '2026-07-10T08:00:00',
      createdAgo: '4 hours ago'
    }
  ]

  const handleSelectApproval = (id) => {
    const newSelected = new Set(selectedApprovals)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedApprovals(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedApprovals.size === approvals.length) {
      setSelectedApprovals(new Set())
    } else {
      setSelectedApprovals(new Set(approvals.map(a => a.id)))
    }
  }

  const handleApprove = (approval) => {
    setSelectedApproval(approval)
    setApprovalAction('approve')
    setShowApprovalDialog(true)
  }

  const handleReject = (approval) => {
    setSelectedApproval(approval)
    setApprovalAction('reject')
    setShowApprovalDialog(true)
  }

  const handleBulkApprove = () => {
    if (selectedApprovals.size === 0) return
    console.log('Bulk approve:', Array.from(selectedApprovals))
    // TODO: Call API to bulk approve
  }

  const handleBulkReject = () => {
    if (selectedApprovals.size === 0) return
    console.log('Bulk reject:', Array.from(selectedApprovals))
    // TODO: Call API to bulk reject
  }

  const handleApprovalSubmit = (data) => {
    console.log(`${approvalAction}:`, data)
    setShowApprovalDialog(false)
    // TODO: Call API to submit approval
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-500'
      case 'high':
        return 'bg-orange-500/10 text-orange-500'
      case 'normal':
        return 'bg-blue-500/10 text-blue-500'
      default:
        return 'bg-neutral-500/10 text-neutral-500'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'TRANSFER':
        return '🔄'
      case 'MAINTENANCE':
        return '🔧'
      case 'BOOKING':
        return '📅'
      default:
        return '📋'
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Pending Approvals</h1>
        <p className="text-neutral-400 text-sm">Review and approve pending requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#111111] border-white/10">
          <CardBody className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Total Pending</p>
              <p className="text-3xl font-bold text-white mt-1">{approvals.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500 opacity-20" />
          </CardBody>
        </Card>

        <Card className="bg-[#111111] border-white/10">
          <CardBody className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Critical Priority</p>
              <p className="text-3xl font-bold text-white mt-1">
                {approvals.filter(a => a.priority === 'critical').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
          </CardBody>
        </Card>

        <Card className="bg-[#111111] border-white/10">
          <CardBody className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">Selected</p>
              <p className="text-3xl font-bold text-white mt-1">{selectedApprovals.size}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 opacity-20" />
          </CardBody>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedApprovals.size > 0 && (
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardBody className="px-6 py-4 flex items-center justify-between">
            <p className="text-white text-sm font-medium">
              {selectedApprovals.size} approval{selectedApprovals.size > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkReject}
                className="text-red-400 hover:bg-red-500/10"
              >
                Reject All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleBulkApprove}
              >
                Approve All
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Approvals List */}
      {approvals.length === 0 ? (
        <Card className="bg-[#111111] border-white/10">
          <CardBody className="px-6 py-12 text-center">
            <CheckCircle className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-400">No pending approvals</p>
            <p className="text-neutral-500 text-sm mt-1">All approvals are up to date</p>
          </CardBody>
        </Card>
      ) : (
        <Card className="bg-[#111111] border-white/10">
          <div className="divide-y divide-white/5">
            {/* Header with Select All */}
            <div className="px-6 py-3 flex items-center gap-3 border-b border-white/10">
              <input
                type="checkbox"
                checked={selectedApprovals.size === approvals.length && approvals.length > 0}
                onChange={handleSelectAll}
                className="w-5 h-5 rounded border-white/20 bg-neutral-800 cursor-pointer"
              />
              <span className="text-xs text-neutral-400">Select All</span>
            </div>

            {/* Approval Items */}
            {approvals.map(approval => (
              <div
                key={approval.id}
                className="px-6 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => handleSelectApproval(approval.id)}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedApprovals.has(approval.id)}
                  onChange={() => handleSelectApproval(approval.id)}
                  onClick={e => e.stopPropagation()}
                  className="w-5 h-5 rounded border-white/20 bg-neutral-800 cursor-pointer flex-shrink-0 mt-0.5"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getTypeIcon(approval.type)}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{approval.entity}</p>
                        <p className="text-xs text-neutral-400 mt-1">{approval.details}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize flex-shrink-0 ${getPriorityColor(approval.priority)}`}>
                      {approval.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 flex-wrap">
                    <span>Requested by: {approval.requester}</span>
                    <span>•</span>
                    <span>{approval.createdAgo}</span>
                  </div>

                  {approval.reason && (
                    <p className="text-xs text-neutral-400 mt-2 italic">
                      Reason: {approval.reason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReject(approval)}
                    className="text-red-400 hover:bg-red-500/10 px-2"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(approval)}
                    className="px-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Approval Dialog */}
      {showApprovalDialog && selectedApproval && (
        <ApprovalDialog
          approval={selectedApproval}
          action={approvalAction}
          onSubmit={handleApprovalSubmit}
          onClose={() => setShowApprovalDialog(false)}
        />
      )}
    </div>
  )
}
