import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import AssetForm from '../../components/assets/AssetForm'
import ImageUpload from '../../components/assets/ImageUpload'
import assetService from '../../services/assetService'
import organizationService from '../../services/organization'

/**
 * Register Asset Page
 * Multi-step asset registration with image upload
 */
export default function RegisterAssetPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Form, 2: Upload, 3: Success
  const [newAssetId, setNewAssetId] = useState(null)
  const [newAssetNumber, setNewAssetNumber] = useState(null)

  // Fetch organization data
  const { data: organizationData } = useQuery({
    queryKey: ['organizationData'],
    queryFn: async () => {
      const [categories, departments, locations] = await Promise.all([
        organizationService.getCategories(),
        organizationService.getDepartments(),
        organizationService.getLocations()
      ])
      return { categories, departments, locations }
    }
  })

  // Create asset mutation
  const createAssetMutation = useMutation({
    mutationFn: (data) => assetService.create(data),
    onSuccess: (response) => {
      const asset = response.data
      setNewAssetId(asset.id)
      setNewAssetNumber(asset.assetNumber)
      setStep(2)
    }
  })

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: ({ assetId, file }) => assetService.uploadImage(assetId, file, true),
    onSuccess: () => {
      setStep(3)
    }
  })

  const handleFormSubmit = async (data) => {
    createAssetMutation.mutate(data)
  }

  const handleImageUpload = async (file) => {
    if (newAssetId) {
      uploadImageMutation.mutate({ assetId: newAssetId, file })
    }
  }

  const handleSkipImage = () => {
    setStep(3)
  }

  const handleViewAsset = () => {
    navigate(`/app/assets/${newAssetId}`)
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/app/assets')}
          className="p-2 hover:bg-white/10 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-400 hover:text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Register New Asset</h1>
          <p className="text-neutral-400 text-sm">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-colors ${
              s <= step ? 'bg-[#0066FF]' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Asset Form */}
      {step === 1 && (
        <Card className="bg-[#111111] border-white/10 p-6">
          <AssetForm
            categories={organizationData?.categories || []}
            departments={organizationData?.departments || []}
            locations={organizationData?.locations || []}
            onSubmit={handleFormSubmit}
            isLoading={createAssetMutation.isPending}
          />
        </Card>
      )}

      {/* Step 2: Image Upload */}
      {step === 2 && (
        <Card className="bg-[#111111] border-white/10 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Add Asset Image</h2>
            <p className="text-neutral-400 text-sm">Upload a primary image for this asset (optional)</p>
          </div>

          <ImageUpload
            assetId={newAssetId}
            onUploadSuccess={handleImageUpload}
            isLoading={uploadImageMutation.isPending}
          />

          <div className="mt-6 flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={handleSkipImage}
              disabled={uploadImageMutation.isPending}
            >
              Skip for Now
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card className="bg-[#111111] border-white/10 p-8">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircle className="w-16 h-16 text-[#00F5FF]" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Asset Registered Successfully!</h2>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg mb-6">
              <p className="text-sm text-neutral-400 mb-1">Asset Number</p>
              <p className="text-xl font-semibold text-white font-mono">{newAssetNumber}</p>
            </div>

            <p className="text-neutral-400 mb-6">
              Your asset has been registered and is ready to be allocated or managed.
            </p>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant="primary"
                onClick={handleViewAsset}
              >
                View Asset Details
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  setStep(1)
                  setNewAssetId(null)
                  setNewAssetNumber(null)
                }}
              >
                Register Another Asset
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
