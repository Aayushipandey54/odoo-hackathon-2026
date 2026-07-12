import { cn } from '../../utils/cn'

export default function Input({ label, error, className, id, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border bg-surface text-foreground text-sm transition-all focus:outline-none focus:ring-1',
          error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
            : 'border-border focus:border-blue-500 focus:ring-blue-500',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}
    </div>
  )
}
