/**
 * ApprovalDialog Component
 * Modal for approving or rejecting transfer requests
 * Reusable for any approval workflow
 */

import { useState } from 'react'
import { X, CheckCircle, XCircle } from 'lucide-react'
import Button from '../ui/Button'
import { Card } from '../ui/Card'

export default function ApprovalDialog({
  isOpen = false,
  title = 'Approve or Reject',
  description = '',
  request = null,
  onApprove = null,
  onReject = null,
  onClose = null,
  isLoading = false,
  error = null
}) {
  const [action, setAction] = useState(null) // 'approve' or 'reject'
  const [comments, setComments] = useState('')
  const [reason, setReason] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  const handleApprove = async () => {
    const errors = {}

    if (comments.length > 500) {
      errors.comments = 'Comments cannot exceed 500 characters'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    onApprove?.({ comments })
  }

  const handleReject = async () => {
    const errors = {}

    if (!reason || reason.trim() === '') {
      errors.reason = 'Please provide a reason for rejection'
    }

    if (reason.length > 500) {
      errors.reason = 'Reason cannot exceed 500 characters'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    onReject?.({ reason })
  }

  const resetForm = () => {
    setAction(null)
    setComments('')
    setReason('')
    setValidationErrors({})
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="bg-[#1a1a1a] border-white/20 w-full max-w-md shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              {description && (
                <p className="text-sm text-neutral-400 mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Request Details */}
            {request && (
              <div className="bg-[#0a0a0a] rounded-lg p-4 space-y-2 text-sm">
                {request.asset && (
                  <div>
                    <span className="text-neutral-400">Asset:</span>
                    <span className="text-white ml-2">{request.asset.tag} - {request.asset.name}</span>
                  </div>
                )}
                {request.fromEmployee && (
                  <div>
                    <span className="text-neutral-400">From:</span>
                    <span className="text-white ml-2">{request.fromEmployee.name}</span>
                  </div>
                )}
                {request.toEmployee && (
                  <div>
                    <span className="text-neutral-400">To:</span>
                    <span className="text-white ml-2">{request.toEmployee.name}</span>
                  </div>
                )}
                {request.reason && (
                  <div>
                    <span className="text-neutral-400">Reason:</span>
                    <span className="text-white ml-2">{request.reason}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Selection */}
            {!action && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAction('approve')}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-green-500/30 hover:border-green-500/60 hover:bg-green-500/10 transition-colors text-green-400"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Approve</span>
                </button>
                <button
                  onClick={() => setAction('reject')}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 transition-colors text-red-400"
                >
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Reject</span>
                </button>
              </div>
            )}

            {/* Approve Form */}
            {action === 'approve' && (
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-300">
                    Comments (optional)
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => {
                      setComments(e.target.value)
                      setValidationErrors({ ...validationErrors, comments: '' })
                    }}
                    rows="3"
                    placeholder="Add any additional comments..."
                    className={`
                      bg-[#0a0a0a] border rounded-lg p-3 text-sm text-white
                      focus:outline-none focus:border-white/30
                      resize-none
                      ${validationErrors.comments ? 'border-red-500/50' : 'border-white/10'}
                    `}
                    disabled={isLoading}
                  />
                  {validationErrors.comments && (
                    <span className="text-xs text-red-400">{validationErrors.comments}</span>
                  )}
                  <span className="text-xs text-neutral-500">
                    {comments.length}/500 characters
                  </span>
                </div>
              </div>
            )}

            {/* Reject Form */}
            {action === 'reject' && (
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-300">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value)
                      setValidationErrors({ ...validationErrors, reason: '' })
                    }}
                    rows="3"
                    placeholder="Why are you rejecting this request?"
                    className={`
                      bg-[#0a0a0a] border rounded-lg p-3 text-sm text-white
                      focus:outline-none focus:border-white/30
                      resize-none
                      ${validationErrors.reason ? 'border-red-500/50' : 'border-white/10'}
                    `}
                    disabled={isLoading}
                  />
                  {validationErrors.reason && (
                    <span className="text-xs text-red-400">{validationErrors.reason}</span>
                  )}
                  <span className="text-xs text-neutral-500">
                    {reason.length}/500 characters
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-white/10">
            {action ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                  }}
                  disabled={isLoading}
                  className="text-white border-white/20 hover:bg-white/5"
                >
                  Back
                </Button>
                {action === 'approve' ? (
                  <Button
                    variant="primary"
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Approving...' : 'Approve'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleReject}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? 'Rejecting...' : 'Reject'}
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full justify-center text-white border-white/20 hover:bg-white/5"
              >
                Close
              </Button>
            )}
          </div>
        </Card>
      </div>
    </>
  )
}
