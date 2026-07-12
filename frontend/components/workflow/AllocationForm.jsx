/**
 * AllocationForm Component
 * Form for allocating assets to employees
 * Integrates with workflow validation
 */

import { useState } from 'react'
import Button from '../ui/Button'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { useAllocateAsset } from '../../hooks/useWorkflow'

export default function AllocationForm({ assets = [], employees = [], onSuccess }) {
  const { allocate, isLoading, error } = useAllocateAsset()
  const [formData, setFormData] = useState({
    assetId: '',
    employeeId: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.assetId) {
      errors.assetId = 'Please select an asset'
    }

    if (!formData.employeeId) {
      errors.employeeId = 'Please select an employee'
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})

    // Submit
    allocate(formData, {
      onSuccess: () => {
        setFormData({ assetId: '', employeeId: '' })
        onSuccess?.()
      }
    })
  }

  return (
    <Card className="bg-[#111111] border-white/10">
      <CardHeader className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold text-white">Allocate Asset</h2>
        <p className="text-sm text-neutral-400 mt-1">Assign an available asset to an employee</p>
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
                transition-colors
                ${validationErrors.assetId ? 'border-red-500/50' : 'border-white/10'}
              `}
              disabled={isLoading}
            >
              <option value="">Choose an available asset...</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.tag} - {asset.name} ({asset.status})
                </option>
              ))}
            </select>
            {validationErrors.assetId && (
              <span className="text-xs text-red-400">{validationErrors.assetId}</span>
            )}
          </div>

          {/* Employee Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-300">
              Assign To Employee *
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => {
                setFormData({ ...formData, employeeId: e.target.value })
                setValidationErrors({ ...validationErrors, employeeId: '' })
              }}
              className={`
                bg-[#0a0a0a] border rounded-lg p-2.5 text-sm text-white
                focus:outline-none focus:border-white/30
                transition-colors
                ${validationErrors.employeeId ? 'border-red-500/50' : 'border-white/10'}
              `}
              disabled={isLoading}
            >
              <option value="">Choose an employee...</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.department})
                </option>
              ))}
            </select>
            {validationErrors.employeeId && (
              <span className="text-xs text-red-400">{validationErrors.employeeId}</span>
            )}
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
            variant="primary"
            className="w-full justify-center mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Allocation'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
