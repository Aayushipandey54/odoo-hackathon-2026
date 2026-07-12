import { useState } from 'react'
import { Upload, X, File, Loader } from 'lucide-react'
import Button from '../ui/Button'

/**
 * Document Upload Component
 * Handles document uploads with type selection
 */
export default function DocumentUpload({ assetId, onUploadSuccess, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [documentType, setDocumentType] = useState('OTHER')
  const [fileName, setFileName] = useState('')

  const documentTypes = [
    { value: 'MANUAL', label: 'Manual' },
    { value: 'WARRANTY', label: 'Warranty' },
    { value: 'INVOICE', label: 'Invoice' },
    { value: 'OTHER', label: 'Other' }
  ]

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Document size must be less than 10MB')
        return
      }

      setFileName(file.name)
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a file')
      return
    }

    if (onUploadSuccess) {
      onUploadSuccess(selectedFile, documentType)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setFileName('')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Document Type
        </label>
        <select
          value={documentType}
          onChange={e => setDocumentType(e.target.value)}
          disabled={isLoading}
          className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-white/30 disabled:opacity-50"
        >
          {documentTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
          id="document-input"
        />

        <label htmlFor="document-input" className="cursor-pointer block">
          {selectedFile ? (
            <>
              <File className="w-8 h-8 text-[#0066FF] mx-auto mb-2" />
              <p className="font-semibold text-white">{fileName}</p>
              <p className="text-xs text-neutral-400 mt-2">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="font-semibold text-white">Select document</p>
              <p className="text-sm text-neutral-400 mt-1">
                PDF, images, or Word documents
              </p>
              <p className="text-xs text-neutral-500 mt-2">Max 10MB</p>
            </>
          )}
        </label>
      </div>

      {selectedFile && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleUpload}
            disabled={isLoading}
            className="flex-1 gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Upload Document
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={clearFile}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
