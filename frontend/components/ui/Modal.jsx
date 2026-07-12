import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

import { useTheme } from '../../hooks/useTheme'

export default function Modal({ isOpen, onClose, title, children, className }) {
  const { isDark } = useTheme()
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={cn(
              'relative w-full max-w-lg rounded-3xl p-6 shadow-2xl z-10',
              isDark 
                ? 'bg-neutral-900 border border-neutral-800 text-white' 
                : 'bg-white border border-neutral-200 text-black',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {title && <h3 className="text-lg font-bold">{title}</h3>}
              <button
                onClick={onClose}
                className={cn(
                  "p-1 rounded-full transition-all ml-auto",
                  isDark 
                    ? "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10" 
                    : "bg-black/5 border border-black/10 text-black/60 hover:text-black hover:bg-black/10"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
