import { cn } from '../../utils/cn'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative shadow-premium',
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
    <div className={cn('px-6 py-4 border-b border-white/5 bg-white/5', className)} {...props}>
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
    <div className={cn('px-6 py-4 border-t border-white/5', className)} {...props}>
      {children}
    </div>
  )
}
