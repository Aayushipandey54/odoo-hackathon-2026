/**
 * TransferRequestForm Component
 * Form for requesting asset transfers between employees
 */

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { useRequestTransfer } from '../../hooks/useWorkflow'

export default function TransferRequestForm({ assets = [], employees = [], onSuccess }) {
  const { requestTransfer, isLoading, error } = useRequestTransfer()
  const [formData, setFormData] = useState({
    assetId: '',
    fromEmployeeId: '',
    toEmployeeId: '',
    reason: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.assetId) {
      errors.assetId = 'Please select an asset'
    }

    if (!formData.fromEmployeeId) {
      errors.fromEmployeeId = 'Please select current owner'
    }

    if (!formData.toEmployeeId) {
      errors.toEmployeeId = 'Please select new owner'
    }

    if (formData.fromEmployeeId === formData.toEmployeeId) {
      errors.toEmployeeId = 'Cannot transfer to the same employee'
    }

    if (formData.reason && formData.reason.length > 500) {
      errors.reason = 'Reason cannot exceed 500 characters'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})

    requestTransfer(
      {
        assetId: formData.assetId,
        fromEmployeeId: formData.fromEmployeeId,
        toEmployeeId: formData.toEmployeeId,
        reason: formData.reason
      },
      {
        onSuccess: () => {
          setFormData({
            assetId: '',
            fromEmployeeId: '',
            toEmployeeId: '',
            reason: ''
          })
          onSuccess?.()
        }
      }
    )
  }

  return (
    <Card className="bg-[#111111] border-white/10">
      <CardHeader className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold text-white">Request Transfer</h2>
        <p className="text-sm text-neutral-400 mt-1">Transfer an asset between employees (requires approval)</p>
      </CardHeader>

      <CardBody className="px-6 py-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Asset Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-300">
              Select Asset *
            </label>
            <select
              value={formData.assetId}
              onChange={(e) => {
                setFormData({ ...formData, assetId: e.target.value })
                setValidationErrors({ ...validationErrors, assetId: '' })
              }}
              className={`
                bg-[#0a0a0a] border rounded-lg p-2.5 text-sm text-white
                focus:outline-none focus:border-white/30
                ${validationErrors.assetId ? 'border-red-500/50' : 'border-white/10'}
              `}
              disabled={isLoading}
            >
              <option value="">Choose an allocated asset...</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.tag} - {asset.name}
                </option>
              ))}
            </select>
            {validationErrors.assetId && (
              <span className="text-xs text-red-400">{validationErrors.assetId}</span>
            )}
          </div>

          {/* From and To Employees */}
          <div className="flex items-center gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-300">
                From Employee *
              </label>
              <select
                value={formData.fromEmployeeId}
                onChange={(e) => {
                  setFormData({ ...formData, fromEmployeeId: e.target.value })
                  setValidationErrors({ ...validationErrors, fromEmployeeId: '' })
                }}
                className={`
                  bg-[#0a0a0a] border rounded-lg p-2.5 text-sm text-white
                  focus:outline-none focus:border-white/30
                  ${validationErrors.fromEmployeeId ? 'border-red-500/50' : 'border-white/10'}
                `}
                disabled={isLoading}
              >
                <option value="">Select current owner...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              {validationErrors.fromEmployeeId && (
                <span className="text-xs text-red-400">{validationErrors.fromEmployeeId}</span>
              )}
            </div>

            <div className="pt-6">
              <ArrowRight className="w-5 h-5 text-neutral-500" />
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-300">
                To Employee *
              </label>
              <select
                value={formData.toEmployeeId}
                onChange={(e) => {
                  setFormData({ ...formData, toEmployeeId: e.target.value })
                  setValidationErrors({ ...validationErrors, toEmployeeId: '' })
                }}
                className={`
                  bg-[#0a0a0a] border rounded-lg p-2.5 text-sm text-white
                  focus:outline-none focus:border-white/30
                  ${validationErrors.toEmployeeId ? 'border-red-500/50' : 'border-white/10'}
                `}
                disabled={isLoading}
              >
                <option value="">Select new owner...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              {validationErrors.toEmployeeId && (
                <span className="text-xs text-red-400">{validationErrors.toEmployeeId}</span>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-300">
              Reason (optional)
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => {
                setFormData({ ...formData, reason: e.target.value })
                setValidationErrors({ ...validationErrors, reason: '' })
              }}
              rows="3"
              placeholder="Why is this transfer needed?"
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
              {formData.reason.length}/500 characters
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="outline"
            className="w-full justify-center mt-4 text-white border-white/20 hover:bg-white/5"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit Request'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
