import { cn } from '../../utils/cn'
import { useTheme } from '../../hooks/useTheme'

export default function EmptyState({ title = 'No data found', description, action, className }) {
  const { isDark } = useTheme()
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-3xl min-h-[240px]',
        isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/10 bg-black/[0.02]',
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
        isDark ? "bg-white/5 border border-white/10" : "bg-black/5 border border-black/10"
      )}>
        <svg className={cn("w-6 h-6 opacity-40", isDark ? "text-white" : "text-black")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h4 className={cn("text-sm font-semibold mb-1", isDark ? "text-white" : "text-black")}>{title}</h4>
      {description && <p className="text-xs text-neutral-400 max-w-xs mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
