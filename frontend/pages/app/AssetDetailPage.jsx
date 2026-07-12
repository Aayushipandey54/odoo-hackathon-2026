import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { ArrowLeft, Edit, Loader } from 'lucide-react'
import AssetDetailCard from '../../components/assets/AssetDetailCard'
import AssetTimeline from '../../components/assets/AssetTimeline'
import QRCodeViewer from '../../components/assets/QRCodeViewer'
import ImageUpload from '../../components/assets/ImageUpload'
import DocumentUpload from '../../components/assets/DocumentUpload'
import assetService from '../../services/assetService'

/**
 * Asset Detail Page
 * Comprehensive asset view with timeline, images, documents, and QR code
 */
export default function AssetDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showDocUpload, setShowDocUpload] = useState(false)

  // Fetch asset details
  const { data: assetData, isLoading, error } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => assetService.getById(id),
    enabled: !!id
  })

  const asset = assetData?.data

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: ({ file, isPrimary }) => assetService.uploadImage(id, file, isPrimary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
      setShowImageUpload(false)
    }
  })

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, docType }) => assetService.uploadDocument(id, file, docType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
      setShowDocUpload(false)
    }
  })

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: (imageId) => assetService.deleteImage(id, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
    }
  })

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (docId) => assetService.deleteDocument(id, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
    }
  })

  // Regenerate QR code mutation
  const regenerateQRMutation = useMutation({
    mutationFn: () => assetService.regenerateQRCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] })
    }
  })

  const handleImageUpload = async (file) => {
    uploadImageMutation.mutate({ file, isPrimary: false })
  }

  const handleDocumentUpload = async (file, docType) => {
    uploadDocumentMutation.mutate({ file, docType })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 text-[#00F5FF] animate-spin" />
      </div>
    )
  }

  if (error || !asset) {
    return (
      <div className="p-6 text-center text-red-400">
        Failed to load asset details
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/assets')}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400 hover:text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
            <p className="text-neutral-400 text-sm">{asset.assetNumber}</p>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate(`/app/assets/${id}/edit`)}
          className="gap-2"
        >
          <Edit className="w-4 h-4" /> Edit
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Asset Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#111111] border-white/10 p-6">
            <AssetDetailCard
              asset={asset}
              onDeleteImage={(imageId) => deleteImageMutation.mutate(imageId)}
              onDeleteDocument={(docId) => deleteDocumentMutation.mutate(docId)}
              isDeletingImage={deleteImageMutation.isPending}
              isDeletingDocument={deleteDocumentMutation.isPending}
            />
          </Card>

          {/* Image Upload Section */}
          <Card className="bg-[#111111] border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Image</h3>
              {showImageUpload && (
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="text-sm text-neutral-400 hover:text-white"
                >
                  Close
                </button>
              )}
            </div>

            {showImageUpload ? (
              <ImageUpload
                assetId={id}
                onUploadSuccess={handleImageUpload}
                isLoading={uploadImageMutation.isPending}
              />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowImageUpload(true)}
                className="w-full"
              >
                + Add Image
              </Button>
            )}
          </Card>

          {/* Document Upload Section */}
          <Card className="bg-[#111111] border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Document</h3>
              {showDocUpload && (
                <button
                  onClick={() => setShowDocUpload(false)}
                  className="text-sm text-neutral-400 hover:text-white"
                >
                  Close
                </button>
              )}
            </div>

            {showDocUpload ? (
              <DocumentUpload
                assetId={id}
                onUploadSuccess={handleDocumentUpload}
                isLoading={uploadDocumentMutation.isPending}
              />
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDocUpload(true)}
                className="w-full"
              >
                + Add Document
              </Button>
            )}
          </Card>

          {/* Timeline */}
          <Card className="bg-[#111111] border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Asset Timeline</h3>
            <AssetTimeline assetId={id} />
          </Card>
        </div>

        {/* Right Column: QR Code & Info */}
        <div className="space-y-6">
          {/* QR Code */}
          <Card className="bg-[#111111] border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">QR Code</h3>
            {asset.qrCode && (
              <QRCodeViewer
                qrCode={asset.qrCode}
                assetNumber={asset.assetNumber}
                onRegenerate={() => regenerateQRMutation.mutate()}
                isRegenerating={regenerateQRMutation.isPending}
              />
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="bg-[#111111] border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="pb-3 border-b border-white/10">
                <p className="text-xs text-neutral-500 uppercase">Images</p>
                <p className="text-2xl font-bold text-white">{asset.images?.length || 0}</p>
              </div>
              <div className="pb-3 border-b border-white/10">
                <p className="text-xs text-neutral-500 uppercase">Documents</p>
                <p className="text-2xl font-bold text-white">{asset.documents?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase">Timeline Events</p>
                <p className="text-2xl font-bold text-white">{asset.timeline?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
