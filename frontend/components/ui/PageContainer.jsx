import { cn } from '../../utils/cn'

export default function PageContainer({ children, className, ...props }) {
  return (
    <div
      className={cn('min-h-screen w-full flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]', className)}
      {...props}
    >
      {children}
    </div>
  )
}
