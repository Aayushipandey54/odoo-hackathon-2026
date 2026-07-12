import { memo, useRef, useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import TestimonialCard from './TestimonialCard'

/**
 * Infinite scrolling marquee track.
 * Duplicates children to create a seamless loop using CSS animation.
 * GPU-accelerated via translate3d. Pauses on hover.
 *
 * @param {Object[]} items - Array of testimonial data
 * @param {'left'|'right'} direction - Scroll direction
 * @param {number} speed - Duration in seconds for one full cycle
 * @param {boolean} isDark - Theme flag
 */
const Marquee = memo(function Marquee({
  items,
  direction = 'left',
  speed = 60,
  isDark,
}) {
  const trackRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Duplicate items to create seamless loop
  const duplicatedItems = [...items, ...items]

  const handleMouseEnter = useCallback(() => setIsPaused(true), [])
  const handleMouseLeave = useCallback(() => setIsPaused(false), [])

  // Apply reduced motion preference
  const animationDuration = shouldReduceMotion ? 0 : speed

  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right'

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label={`Testimonials scrolling ${direction}`}
    >
      {/* Fade edges */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-r from-black to-transparent'
            : 'bg-gradient-to-r from-[#f4f7fe] to-transparent'
        }`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-l from-black to-transparent'
            : 'bg-gradient-to-l from-[#f4f7fe] to-transparent'
        }`}
      />

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex gap-5"
        style={{
          animation: animationDuration
            ? `${animationName} ${animationDuration}s linear infinite`
            : 'none',
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <TestimonialCard
            key={`${item.name}-${idx}`}
            testimonial={item}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
})

export default Marquee
