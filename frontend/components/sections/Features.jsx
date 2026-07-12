import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { NoiseLayer, BackgroundGrid, AmbientGlow } from '../PremiumBackgrounds'
import {
  Users, Zap, DollarSign, BarChart2, Brain, MessageSquare,
  BookOpen, Target, ShieldCheck, Terminal, CheckCircle, Clock
} from 'lucide-react'

const featuresData = {
  Enterprise: [
    {
      icon: ShieldCheck,
      title: 'Security & Governance',
      desc: 'Complete organizational security and compliance management.',
      points: ['Identity SSO / SAML', 'Role-based access controls', 'Audit log trails', 'Compliance reporting']
    },
    {
      icon: Zap,
      title: 'Process Automation',
      desc: 'End-to-end workflow automation with zero manual intervention.',
      points: ['Event-driven triggers', 'Dynamic conditional routing', 'Custom webhooks', 'Execution history logs']
    },
    {
      icon: DollarSign,
      title: 'Automated Billing & metering',
      desc: 'Unified billing and expense routing across pipelines.',
      points: ['Automated invoicing', 'Multi-currency gateway', 'Subscription management', 'Usage-based metering']
    },
    {
      icon: BarChart2,
      title: 'Team Analytics Dashboard',
      desc: 'Real-time operational insights for enterprise departments.',
      points: ['System health metrics', 'Throughput & latency', 'Resource saturation', 'Custom KPI reports']
    },
    {
      icon: Brain,
      title: 'AI Workload Predictor',
      desc: 'Predict workload demands and proactively flag resource limits.',
      points: ['Machine learning models', 'Anomaly detection warnings', 'Cost forecasting reports', 'Proactive scaling policies']
    },
    {
      icon: MessageSquare,
      title: 'Unified Communication Hub',
      desc: 'One pipeline for all system and team notifications.',
      points: ['Slack & Teams connectors', 'Instant pager integration', 'SMS & Email gateways', 'Incident response logs']
    },
  ],
  Developers: [
    {
      icon: BookOpen,
      title: 'Intelligent API Builder',
      desc: 'Design, test, and deploy production APIs in seconds.',
      points: ['Auto-generated docs', 'JSON schema validation', 'Mock server mode', 'Version management']
    },
    {
      icon: CheckCircle,
      title: 'Automated Testing',
      desc: 'AI-assisted unit and integration test generation.',
      points: ['Test suite auto-runner', 'Coverage report maps', 'Edge-case detection', 'CI/CD pipeline hooks']
    },
    {
      icon: Terminal,
      title: 'Live Sandbox Integration',
      desc: 'Interactive playground environments in one click.',
      points: ['Direct CLI playground', 'Isolated environment', 'Instant debug logs', 'State snapshotting']
    },
    {
      icon: Target,
      title: 'Deployment Analytics',
      desc: 'Monitor deployment health and error rates in real time.',
      points: ['Error rate tracking', 'Latency distribution', 'Memory leak detection', 'Traffic analysis']
    },
  ],
  Operations: [
    {
      icon: Target,
      title: 'Adaptive Workflows',
      desc: 'Dynamic routing paths for all automated processes.',
      points: ['Intelligent error recovery', 'Custom fallback actions', 'Conditional retry rules', 'Real-time routing']
    },
    {
      icon: ShieldCheck,
      title: 'System Hardening',
      desc: 'Automated threat detection and compliance checks.',
      points: ['Vulnerability scanning', 'Encrypted backups', 'Real-time intrusion alerts', 'Access policy review']
    },
    {
      icon: MessageSquare,
      title: 'AI Co-Pilot Support',
      desc: '24/7 technical and system operations guidance.',
      points: ['Instant script generation', 'CLI command helper', 'Contextual error debugging', 'Incident playbook advice']
    },
    {
      icon: Clock,
      title: 'Maintenance Scheduler',
      desc: 'Reduce system downtime with predictive schedules.',
      points: ['Smart maintenance windows', 'Task priority sorting', 'Downtime countdowns', 'Uptime metrics tracking']
    },
  ]
}

const FeatureCard = ({ feature, index, tabColor }) => {
  const { isDark } = useTheme()
  const Icon = feature.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative rounded-2xl p-8 transition-all duration-300 ${
        isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-gray-50 border border-gray-100'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${
          isDark 
            ? `bg-${tabColor}-500/10 text-${tabColor}-400 border border-${tabColor}-500/20 ${tabColor === 'emerald' ? 'shadow-[0_0_20px_-5px_rgba(var(--emerald-rgb),0.3)]' : 'shadow-[0_0_20px_-5px_rgba(var(--white-rgb),0.3)]'}` 
            : `bg-${tabColor}-50 text-${tabColor}-600 border border-${tabColor}-100`
        }`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {feature.title}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {feature.desc}
        </p>

        {/* Dynamic points grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-auto pt-4 border-t border-white/[0.05]">
          {feature.points.map((point, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-white/40' : 'bg-gray-400'}`} />
              <span className={`text-[11px] md:text-xs tracking-tight ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const Features = () => {
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('Enterprise')

  const tabConfigs = {
    Enterprise: { label: 'Enterprise', color: 'white' },
    Developers: { label: 'Developers', color: 'white' },
    Operations: { label: 'Operations', color: 'emerald' }
  }

  const tabs = Object.values(tabConfigs)
  const activeConfig = tabConfigs[activeTab]

  return (
    <section id="features" className={`py-20 md:py-32 relative overflow-hidden ${isDark ? 'bg-[#030308]' : 'bg-gradient-to-b from-[#edf2ff] via-white to-white'}`}>
      <NoiseLayer />
      <BackgroundGrid variant="line" opacity={isDark ? 0.03 : 0.015} size={80} />
      <AmbientGlow color={isDark ? 'rgba(139, 92, 246, 0.05)' : 'rgba(99, 102, 241, 0.02)'} size="50rem" top="40%" left="50%" delay={1} />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            className={`font-serif leading-[1.1] mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontFamily: "'Playfair Display', Georgia, serif"
            }}
          >
            Everything your <span className={`italic font-normal transition-colors duration-500 ${isDark ? `text-${activeConfig.color}-400` : `text-${activeConfig.color}-600`}`}>{activeTab}</span> needs
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Powerful, specialized modules built for administrators, developers, and operations teams.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className={`inline-flex p-1 rounded-full ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'}`}>
            {tabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`relative px-8 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeTab === tab.label 
                    ? (isDark ? `text-${tab.color}-400` : `text-${tab.color}-700`) 
                    : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-black')
                }`}
              >
                {activeTab === tab.label && (
                  <motion.div
                    layoutId="activeFeatureTab"
                    className={`absolute inset-0 rounded-full shadow-lg ${isDark ? `bg-${tab.color}-500/10 border border-${tab.color}-500/20` : 'bg-white shadow-sm border border-gray-200'}`}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {featuresData[activeTab].map((feature, i) => (
              <FeatureCard key={`${activeTab}-${feature.title}`} feature={feature} index={i} tabColor={activeConfig.color} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
