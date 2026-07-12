import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import TransferRequestForm from '../../components/workflow/TransferRequestForm'
import ApprovalDialog from '../../components/workflow/ApprovalDialog'
import { ArrowRight, Filter, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function TransfersPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [approvalAction, setApprovalAction] = useState(null) // 'approve' or 'reject'

  // Mock data - replace with API calls
  const transfers = {
    pending: [
      {
        id: 'TR-001',
        asset: { tag: 'AF-0114', name: 'MacBook Pro 16"' },
        from: 'Priya Shah',
        to: 'Rajesh Kumar',
        reason: 'Project transfer to data team',
        createdAt: '2026-07-10'
      },
      {
        id: 'TR-002',
        asset: { tag: 'AF-0089', name: 'Dell Monitor' },
        from: 'Amit Patel',
        to: 'Neha Singh',
        reason: 'Department reorganization',
        createdAt: '2026-07-09'
      }
    ],
    approved: [
      {
        id: 'TR-003',
        asset: { tag: 'AF-0050', name: 'iPad Air' },
        from: 'Vikram Desai',
        to: 'Pooja Nair',
        reason: 'Manager approval',
        createdAt: '2026-07-08',
        approvedAt: '2026-07-08'
      }
    ],
    rejected: [
      {
        id: 'TR-004',
        asset: { tag: 'AF-0120', name: 'External SSD' },
        from: 'Arjun Nair',
        to: 'Sarah Johnson',
        reason: 'Cross-department transfer not approved',
        createdAt: '2026-07-07',
        rejectedAt: '2026-07-07',
        rejectionReason: 'Asset required in source department'
      }
    ]
  }

  const tabs = [
    { id: 'pending', label: 'Pending', count: transfers.pending.length, icon: Clock },
    { id: 'approved', label: 'Approved', count: transfers.approved.length, icon: CheckCircle },
    { id: 'rejected', label: 'Rejected', count: transfers.rejected.length, icon: XCircle }
  ]

  const currentTransfers = transfers[activeTab] || []

  const handleApprove = (transfer) => {
    setSelectedTransfer(transfer)
    setApprovalAction('approve')
    setShowApprovalDialog(true)
  }

  const handleReject = (transfer) => {
    setSelectedTransfer(transfer)
    setApprovalAction('reject')
    setShowApprovalDialog(true)
  }

  const handleApprovalSubmit = (data) => {
    console.log(`${approvalAction}:`, data)
    setShowApprovalDialog(false)
    // TODO: Call API to approve/reject transfer
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Asset Transfers</h1>
        <p className="text-neutral-400 text-sm">Manage transfer requests and approvals</p>
      </div>

      {/* Transfer Request Form */}
      <Card className="bg-[#111111] border-white/10">
        <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6">
          <h2 className="text-lg font-semibold text-white">New Transfer Request</h2>
        </CardHeader>
        <CardBody className="px-6 py-5">
          <TransferRequestForm />
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                isActive
                  ? 'border-[#0066FF] text-white'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                  isActive
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Transfers List */}
      {currentTransfers.length === 0 ? (
        <Card className="bg-[#111111] border-white/10">
          <CardBody className="px-6 py-12 text-center">
            <p className="text-neutral-400">No transfers in this category</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {currentTransfers.map(transfer => (
            <Card key={transfer.id} className="bg-[#111111] border-white/10 hover:border-white/20 transition-colors">
              <CardBody className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Transfer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-300 rounded">
                        {transfer.id}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {transfer.asset.name}
                      </span>
                      <span className="text-xs text-neutral-500">({transfer.asset.tag})</span>
                    </div>

                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1">
                        <p className="text-xs text-neutral-400 mb-1">From</p>
                        <p className="text-sm text-white font-medium">{transfer.from}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-400 mb-1">To</p>
                        <p className="text-sm text-white font-medium">{transfer.to}</p>
                      </div>
                    </div>

                    {transfer.reason && (
                      <p className="text-xs text-neutral-400 italic">
                        Reason: {transfer.reason}
                      </p>
                    )}

                    <p className="text-xs text-neutral-500 mt-2">
                      {new Date(transfer.createdAt).toLocaleDateString()} at{' '}
                      {new Date(transfer.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {activeTab === 'pending' && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReject(transfer)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(transfer)}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    {activeTab === 'approved' && (
                      <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded">
                        Approved
                      </span>
                    )}
                    {activeTab === 'rejected' && (
                      <span className="text-xs px-3 py-1 bg-red-500/10 text-red-500 rounded">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Dialog */}
      {showApprovalDialog && selectedTransfer && (
        <ApprovalDialog
          transfer={selectedTransfer}
          action={approvalAction}
          onSubmit={handleApprovalSubmit}
          onClose={() => setShowApprovalDialog(false)}
        />
      )}
    </div>
  )
}
