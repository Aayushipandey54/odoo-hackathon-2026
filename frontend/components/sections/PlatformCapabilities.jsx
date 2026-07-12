import { memo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { NoiseLayer, BackgroundGrid, AmbientGlow, GradientOrb } from '../PremiumBackgrounds'
import {
  Cpu,
  Layers,
  BarChart3,
  BotMessageSquare,
  Activity,
  BellRing,
  CalendarClock,
  TrendingUp,
} from 'lucide-react'

const CAPABILITIES = [
  {
    icon: Cpu,
    title: 'AI Automation Engine',
    description:
      'Intelligent workflow automation with real-time process insights, custom routing, and automated execution reports.',
    gradient: 'from-violet-500/15 to-purple-600/15',
    gradientLight: 'from-violet-50 to-purple-50',
    accent: 'text-violet-400',
    accentLight: 'text-violet-600',
    borderHover: 'hover:border-violet-500/30',
    borderHoverLight: 'hover:border-violet-300',
    span: '', // normal 1x1
  },
  {
    icon: Layers,
    title: 'Integration Hub',
    description:
      'Connect, sync, and orchestrate standard APIs with built-in data transformation pipelines and monitoring.',
    gradient: 'from-blue-500/15 to-cyan-600/15',
    gradientLight: 'from-blue-50 to-cyan-50',
    accent: 'text-blue-400',
    accentLight: 'text-blue-600',
    borderHover: 'hover:border-blue-500/30',
    borderHoverLight: 'hover:border-blue-300',
    span: '',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Unified data views across operations, services, pipelines, and revenue. Every metric visualized in real-time with actionable drill-downs.',
    gradient: 'from-emerald-500/15 to-teal-600/15',
    gradientLight: 'from-emerald-50 to-teal-50',
    accent: 'text-emerald-400',
    accentLight: 'text-emerald-600',
    borderHover: 'hover:border-emerald-500/30',
    borderHoverLight: 'hover:border-emerald-300',
    span: 'md:col-span-2', // wide card
  },
  {
    icon: BotMessageSquare,
    title: 'AI Workspace Assistant',
    description:
      'An intelligent assistant that resolves team queries, predicts bottleneck risks, and proposes optimal resource allocation.',
    gradient: 'from-amber-500/15 to-orange-600/15',
    gradientLight: 'from-amber-50 to-orange-50',
    accent: 'text-amber-400',
    accentLight: 'text-amber-600',
    borderHover: 'hover:border-amber-500/30',
    borderHoverLight: 'hover:border-amber-300',
    span: '',
  },
  {
    icon: Activity,
    title: 'Resource Management',
    description:
      'Organize enterprise assets and operational pipelines with capacity tracking, automated assignment, and workload leveling.',
    gradient: 'from-rose-500/15 to-pink-600/15',
    gradientLight: 'from-rose-50 to-pink-50',
    accent: 'text-rose-400',
    accentLight: 'text-rose-600',
    borderHover: 'hover:border-rose-500/30',
    borderHoverLight: 'hover:border-rose-300',
    span: '',
  },
  {
    icon: BellRing,
    title: 'Notification Routing',
    description:
      'Broadcast critical updates and system alerts across Slack, Teams, SMS, email, and webhooks with dynamic routing.',
    gradient: 'from-indigo-500/15 to-blue-600/15',
    gradientLight: 'from-indigo-50 to-blue-50',
    accent: 'text-indigo-400',
    accentLight: 'text-indigo-600',
    borderHover: 'hover:border-indigo-500/30',
    borderHoverLight: 'hover:border-indigo-300',
    span: '',
  },
  {
    icon: CalendarClock,
    title: 'Schedule Optimization',
    description:
      'Automated team calendar and meeting scheduling with conflict resolution, resource allocation, and multi-timezone coordination.',
    gradient: 'from-cyan-500/15 to-sky-600/15',
    gradientLight: 'from-cyan-50 to-sky-50',
    accent: 'text-cyan-400',
    accentLight: 'text-cyan-600',
    borderHover: 'hover:border-cyan-500/30',
    borderHoverLight: 'hover:border-cyan-300',
    span: 'md:col-span-2', // wide card
  },
  {
    icon: TrendingUp,
    title: 'Operational Efficiency',
    description:
      'Track organization-wide progress over time with machine learning-driven velocity insights, throughput predictions, and performance plans.',
    gradient: 'from-fuchsia-500/15 to-purple-600/15',
    gradientLight: 'from-fuchsia-50 to-purple-50',
    accent: 'text-fuchsia-400',
    accentLight: 'text-fuchsia-600',
    borderHover: 'hover:border-fuchsia-500/30',
    borderHoverLight: 'hover:border-fuchsia-300',
    span: '',
  },
]

const FeatureCard = memo(function FeatureCard({ feature, index, isDark }) {
  const Icon = feature.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
      className={`
        group relative rounded-2xl border p-6 sm:p-7
        transition-all duration-300 ease-out
        ${feature.span}
        ${
          isDark
            ? `bg-white/[0.02] border-white/[0.06] ${feature.borderHover} hover:bg-white/[0.04]`
            : `bg-white/60 border-black/[0.06] ${feature.borderHoverLight} hover:bg-white/80 hover:shadow-lg`
        }
      `}
      style={{ willChange: 'transform' }}
      role="article"
      aria-label={feature.title}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
          transition-opacity duration-500 pointer-events-none
          bg-gradient-to-br ${isDark ? feature.gradient : feature.gradientLight}
        `}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center mb-5
            transition-all duration-300 group-hover:scale-110
            ${
              isDark
                ? 'bg-white/[0.05] border border-white/[0.08]'
                : 'bg-black/[0.03] border border-black/[0.06]'
            }
          `}
        >
          <Icon
            className={`w-5 h-5 ${
              isDark ? feature.accent : feature.accentLight
            }`}
            strokeWidth={1.8}
          />
        </div>

        {/* Title */}
        <h3
          className={`text-base font-bold tracking-tight mb-2 ${
            isDark ? 'text-white/90' : 'text-gray-900'
          }`}
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p
          className={`text-[13px] leading-[1.7] ${
            isDark ? 'text-white/40' : 'text-gray-500'
          }`}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
})

const PlatformCapabilities = () => {
  const { isDark } = useTheme()

  return (
    <section
      id="platform"
      className={`relative overflow-hidden py-24 md:py-32 lg:py-40 ${
        isDark ? 'bg-[#030307]' : 'bg-[#e9effd]'
      }`}
    >
      <NoiseLayer />
      <BackgroundGrid variant="dotted" opacity={isDark ? 0.04 : 0.02} size={80} />
      <AmbientGlow color={isDark ? 'rgba(99, 102, 241, 0.04)' : 'rgba(99, 102, 241, 0.02)'} size="45rem" top="20%" left="80%" delay={1} />
      <GradientOrb color1={isDark ? 'rgba(236, 72, 153, 0.03)' : 'rgba(236, 72, 153, 0.01)'} size="35rem" top="75%" left="15%" delay={4} />

      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255,255,255,0.02) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(99,102,241,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-[11px] font-bold tracking-[0.3em] uppercase mb-6 ${
              isDark ? 'text-white/40' : 'text-black/40'
            }`}
          >
            Platform
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
            Everything You Need.
            <br />
            <span className="text-gradient">One Intelligent Platform.</span>
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
            Everything required to run modern operations—from workflow automation
            and integrations to AI-powered insights—in one unified
            workspace.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAPABILITIES.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={idx}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlatformCapabilities
