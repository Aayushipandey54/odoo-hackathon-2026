import { cn } from '../../utils/cn'

export default function Loader({ className, size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          'border-white/10 border-t-white rounded-full animate-spin',
          sizes[size],
          className
        )}
      />
    </div>
  )
}
