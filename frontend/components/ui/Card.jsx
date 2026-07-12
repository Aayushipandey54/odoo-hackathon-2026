import { cn } from '../../utils/cn'

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border bg-[var(--bg-card)] border-[var(--border-subtle)] backdrop-blur-md overflow-hidden relative shadow-premium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-t border-[var(--border-subtle)]', className)} {...props}>
      {children}
    </div>
  )
}
