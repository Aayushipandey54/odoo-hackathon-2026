import { motion } from 'framer-motion'
import { useTheme } from '../../../hooks/useTheme'
import Marquee from './Marquee'
import { TESTIMONIALS_ROW_1, TESTIMONIALS_ROW_2 } from './reviewData'
import { NoiseLayer, BackgroundGrid, AmbientGlow, GradientOrb } from '../../PremiumBackgrounds'

/**
 * Premium infinite-marquee testimonials section.
 * Two counter-scrolling rows at different speeds.
 * Fully responsive: single row on mobile, dual rows on tablet+.
 */
const TestimonialsSection = () => {
  const { isDark } = useTheme()

  return (
    <section
      id="testimonials"
      className={`relative overflow-hidden py-24 md:py-32 lg:py-40 ${
        isDark ? 'bg-[#030308]' : 'bg-[#eef2ff]'
      }`}
    >
      <NoiseLayer />
      <BackgroundGrid variant="dotted" opacity={isDark ? 0.04 : 0.02} size={60} />
      <AmbientGlow color={isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)'} size="45rem" top="20%" left="20%" delay={0} />
      <GradientOrb color1={isDark ? 'rgba(236, 72, 153, 0.03)' : 'rgba(236, 72, 153, 0.01)'} size="35rem" top="80%" left="85%" delay={2} />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Heading area */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-16 md:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`text-[11px] font-bold tracking-[0.3em] uppercase mb-6 ${
            isDark ? 'text-white/40' : 'text-black/40'
          }`}
        >
          Testimonials
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-5 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Loved by{' '}
          <span className="text-gradient">Operations & Engineering Teams</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Thousands of founders, operations leaders, and engineers trust Synapse to
          transform how their organizations operate every single day.
        </motion.p>
      </div>

      {/* Marquee rows */}
      <div className="relative z-10 flex flex-col gap-5">
        {/* Row 1 — scrolls left */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Marquee
            items={TESTIMONIALS_ROW_1}
            direction="left"
            speed={55}
            isDark={isDark}
          />
        </motion.div>

        {/* Row 2 — scrolls right, different speed (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden md:block"
        >
          <Marquee
            items={TESTIMONIALS_ROW_2}
            direction="right"
            speed={65}
            isDark={isDark}
          />
        </motion.div>
      </div>

      {/* Bottom trust line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`relative z-10 text-center text-[11px] font-medium tracking-wider mt-16 md:mt-20 ${
          isDark ? 'text-white/20' : 'text-gray-400'
        }`}
      >
        Trusted by 500+ scale-ups and enterprises globally
      </motion.p>
    </section>
  )
}

export default TestimonialsSection
