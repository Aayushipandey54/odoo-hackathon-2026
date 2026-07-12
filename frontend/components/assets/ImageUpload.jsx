import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react'
import Button from '../ui/Button'

/**
 * Image Upload Component
 * Handles drag & drop and file upload for asset images
 */
export default function ImageUpload({ assetId, onUploadSuccess, isLoading }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleDrag = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [])

  const handleChange = e => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = file => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setFileName(file.name)

    // Create preview
    const reader = new FileReader()
    reader.onload = e => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)

    // Call parent handler
    if (onUploadSuccess) {
      onUploadSuccess(file)
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setFileName('')
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="relative bg-white/5 border border-white/10 rounded-lg p-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-neutral-300">{fileName}</p>
      </div>
    )
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragActive
          ? 'border-[#00F5FF]/50 bg-[#00F5FF]/5'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isLoading}
        className="hidden"
        id="image-input"
      />

      <label htmlFor="image-input" className="cursor-pointer block">
        <div className="flex justify-center mb-3">
          {isLoading ? (
            <Loader className="w-8 h-8 text-[#00F5FF] animate-spin" />
          ) : (
            <ImageIcon className="w-8 h-8 text-neutral-400" />
          )}
        </div>

        <p className="font-semibold text-white mb-1">
          {isLoading ? 'Uploading...' : 'Upload image'}
        </p>
        <p className="text-sm text-neutral-400">
          Drag and drop or click to select
        </p>
        <p className="text-xs text-neutral-500 mt-2">
          Max 5MB • JPEG, PNG, WebP
        </p>
      </label>
    </div>
  )
}
