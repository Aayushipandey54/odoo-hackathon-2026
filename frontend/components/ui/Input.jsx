import { cn } from '../../utils/cn'

export default function Input({ label, error, className, id, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl border bg-transparent text-sm transition-all focus:outline-none focus:ring-1',
          error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
            : 'border-neutral-300 focus:border-neutral-800 focus:ring-neutral-800 dark:border-neutral-800 dark:focus:border-white/50 dark:focus:ring-white/50',
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
