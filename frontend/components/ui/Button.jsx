import { cn } from '../../utils/cn'

export default function Button({ children, className, variant = 'primary', size = 'md', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-white text-black hover:bg-neutral-200 border border-neutral-300 shadow-sm',
    secondary: 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700',
    outline: 'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
    ghost: 'text-neutral-700 hover:bg-neutral-150 dark:text-neutral-300 dark:hover:bg-white/5',
    danger: 'bg-red-600 text-white hover:bg-red-500 border border-red-600',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
