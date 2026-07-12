import { cn } from '../../utils/cn'

export default function SectionContainer({ children, className, id, ...props }) {
  return (
    <section
      id={id}
      className={cn('py-20 md:py-32 relative overflow-hidden', className)}
      {...props}
    >
      <div className="relative max-w-7xl mx-auto px-6 z-10 w-full">
        {children}
      </div>
    </section>
  )
}
