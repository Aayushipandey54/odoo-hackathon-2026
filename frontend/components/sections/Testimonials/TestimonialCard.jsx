import { memo } from 'react'
import { Quote } from 'lucide-react'
import Avatar from './Avatar'

/**
 * Individual testimonial card with glassmorphism styling.
 * Designed to live inside the Marquee track.
 */
const TestimonialCard = memo(function TestimonialCard({ testimonial, isDark }) {
  const { name, role, institution, review } = testimonial

  return (
    <article
      className={`
        group relative flex-shrink-0 w-[340px] sm:w-[380px] rounded-2xl border p-6
        transition-all duration-300 ease-out select-none
        ${
          isDark
            ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(255,255,255,0.04)]'
            : 'bg-white/70 border-black/[0.06] hover:bg-white/90 hover:border-black/[0.10] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
        }
        backdrop-blur-sm
      `}
      style={{ willChange: 'transform' }}
    >
      {/* Quote icon */}
      <div
        className={`mb-4 ${
          isDark ? 'text-white/[0.08]' : 'text-black/[0.06]'
        } group-hover:${isDark ? 'text-white/[0.14]' : 'text-black/[0.10]'} transition-colors duration-300`}
      >
        <Quote className="w-6 h-6" strokeWidth={1.5} />
      </div>

      {/* Review text */}
      <p
        className={`text-[13px] leading-[1.7] mb-6 line-clamp-5 ${
          isDark ? 'text-white/60' : 'text-gray-600'
        }`}
      >
        {review}
      </p>

      {/* Author info */}
      <div className="flex items-center gap-3 mt-auto">
        <Avatar name={name} isDark={isDark} size={36} />
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold tracking-tight truncate ${
              isDark ? 'text-white/90' : 'text-gray-900'
            }`}
          >
            {name}
          </p>
          <p
            className={`text-[11px] tracking-wide truncate ${
              isDark ? 'text-white/35' : 'text-gray-500'
            }`}
          >
            {role} · {institution}
          </p>
        </div>
      </div>
    </article>
  )
})

export default TestimonialCard
