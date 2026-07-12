import { useState } from 'react'
import { Download, RotateCw } from 'lucide-react'
import Button from '../ui/Button'

/**
 * QR Code Viewer Component
 * Displays and manages asset QR code
 */
export default function QRCodeViewer({ qrCode, assetNumber, onRegenerate, isRegenerating }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!qrCode.startsWith('data:')) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${assetNumber}-qrcode.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!qrCode) {
    return (
      <div className="text-center py-8 text-neutral-400">
        QR code not available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-8 flex justify-center">
        <img
          src={qrCode}
          alt={`QR code for ${assetNumber}`}
          className="w-48 h-48 bg-white p-4 rounded"
        />
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="w-4 h-4" /> Download
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>

        {onRegenerate && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="gap-2"
          >
            <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
      </div>

      <p className="text-xs text-neutral-400 text-center">
        Asset ID: {assetNumber}
      </p>
    </div>
  )
}
