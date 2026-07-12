import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { ArrowLeft, Loader } from 'lucide-react'
import AssetForm from '../../components/assets/AssetForm'
import assetService from '../../services/assetService'
import organizationService from '../../services/organization'

/**
 * Edit Asset Page
 * Edit existing asset details
 */
export default function EditAssetPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  // Fetch asset details
  const { data: assetData, isLoading: assetLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => assetService.getById(id),
    enabled: !!id
  })

  // Fetch organization data
  const { data: organizationData, isLoading: orgLoading } = useQuery({
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

  // Update asset mutation
  const updateAssetMutation = useMutation({
    mutationFn: (data) => assetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
      navigate(`/app/assets/${id}`)
    }
  })

  const handleFormSubmit = async (data) => {
    updateAssetMutation.mutate(data)
  }

  const asset = assetData?.data
  const isLoading = assetLoading || orgLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-[#00F5FF] animate-spin" />
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="p-6 text-center text-red-400">
        Failed to load asset details
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/app/assets/${id}`)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-400 hover:text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Asset</h1>
          <p className="text-neutral-400 text-sm">{asset.assetNumber}</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-[#111111] border-white/10 p-6">
        <AssetForm
          initialData={{
            name: asset.name,
            tag: asset.tag,
            categoryId: asset.categoryId,
            departmentId: asset.departmentId,
            locationId: asset.locationId,
            serialNumber: asset.serialNumber,
            manufacturer: asset.manufacturer,
            model: asset.model,
            description: asset.description,
            purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
            purchaseCost: asset.purchaseCost || '',
            warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.split('T')[0] : '',
            condition: asset.condition
          }}
          categories={organizationData?.categories || []}
          departments={organizationData?.departments || []}
          locations={organizationData?.locations || []}
          onSubmit={handleFormSubmit}
          isLoading={updateAssetMutation.isPending}
        />
      </Card>
    </div>
  )
}
