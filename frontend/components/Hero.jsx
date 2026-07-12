import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { Link } from 'react-router-dom'
import { NoiseLayer, BackgroundGrid, AmbientGlow, FloatingParticles } from './PremiumBackgrounds'

const Hero = () => {
  const { isDark } = useTheme()

  const bgClass = isDark ? 'bg-[#000000]' : 'bg-gradient-to-b from-[#eef2ff] via-white to-white'
  const eyebrowColor = isDark ? 'text-gray-400' : 'text-gray-500'
  const headlineColor = isDark ? 'text-white' : 'text-gray-900'
  const quoteColor = isDark ? 'text-gray-400' : 'text-neutral-500'

  return (
    <section
      id="hero"
      className={`relative min-h-[90vh] sm:min-h-screen py-20 sm:py-0 flex flex-col items-center justify-center overflow-hidden ${bgClass}`}
    >
      <NoiseLayer />
      <BackgroundGrid variant="dotted" opacity={isDark ? 0.05 : 0.03} size={60} />
      <AmbientGlow color={isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(99, 102, 241, 0.04)'} size="50rem" top="30%" left="50%" delay={0} />
      <AmbientGlow color={isDark ? 'rgba(236, 72, 153, 0.04)' : 'rgba(236, 72, 153, 0.02)'} size="40rem" top="70%" left="20%" delay={3} />
      <FloatingParticles count={25} maxOpacity={isDark ? 0.07 : 0.05} />



      <div className="relative w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center" style={{ zIndex: 1 }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`text-xs font-semibold tracking-[0.25em] uppercase mb-10 ${eyebrowColor}`}
        >
          For Modern Enterprise Teams
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className={`font-serif leading-[1.08] tracking-tight mb-8 ${headlineColor}`}
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
          }}
        >
          Architecting the
          <br />
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 400,
              color: isDark ? '#ffffff' : '#111827',
            }}
          >
            future
          </span>{' '}
          of work.
        </motion.h1>

        {/* Quote subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className={`text-base sm:text-lg leading-relaxed max-w-xl mb-14 ${quoteColor}`}
          style={{ fontStyle: 'italic' }}
        >
          "Transforming operations through intelligence. The best systems are not managed—they are
          engineered."
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link
            to="/register"
            id="hero-cta-btn"
          >
            <motion.span
              whileHover={{ scale: 1.04, backgroundColor: isDark ? '#222' : '#111' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 cursor-pointer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 36px',
                borderRadius: '9999px',
                backgroundColor: isDark ? '#111' : '#000',
                color: '#fff',
                fontSize: '0.925rem',
                fontWeight: 500,
                letterSpacing: '0.01em',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)',
                boxShadow: isDark
                  ? '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.6)'
                  : '0 4px 24px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              Start building
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ zIndex: 1 }}
      >
        <div
          className={`w-5 h-8 rounded-full border flex items-start justify-center pt-1.5 ${ isDark ? 'border-white/15' : 'border-gray-300'
          }`}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)' }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
