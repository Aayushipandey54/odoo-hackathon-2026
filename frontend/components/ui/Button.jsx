import { cn } from '../../utils/cn'

export default function Button({ children, className, variant = 'primary', size = 'md', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    primary: 'bg-foreground text-background hover:opacity-90 shadow-sm',
    secondary: 'bg-card text-foreground hover:bg-muted border border-border',
    outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted',
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
