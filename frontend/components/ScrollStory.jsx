import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { NoiseLayer, BackgroundGrid, AmbientGlow, GradientOrb } from './PremiumBackgrounds'
import {
  AlertCircle,
  ClipboardList,
  AlertTriangle,
  PhoneOff,
  TrendingDown,
  Clock,
  Sparkles,
  Check,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Brain,
  Zap,
  Bot,
  BarChart3
} from 'lucide-react'

const ScrollStory = () => {
  const { isDark } = useTheme()

  const ref1 = useRef(null)
  const ref2 = useRef(null)
  const ref3 = useRef(null)

  const inView1 = useInView(ref1, { once: true, margin: '-100px' })
  const inView2 = useInView(ref2, { once: true, margin: '-100px' })
  const inView3 = useInView(ref3, { once: true, margin: '-100px' })

  const bgClass = isDark ? 'bg-gradient-to-b from-[#000000] to-[#040409]' : 'bg-gradient-to-b from-[#f8fafc] to-[#edf2ff]'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'

  const beforeItems = [
    { icon: ClipboardList, text: 'Manual script scheduling & shell trigger checks' },
    { icon: AlertTriangle, text: 'Node usage calculation in Excel with constant errors' },
    { icon: PhoneOff, text: 'No real-time notification alerts with teams' },
    { icon: TrendingDown, text: 'No machine learning insights into system performance' },
    { icon: Clock, text: '4+ hours/day wasted on manual deployments' },
  ]

  const afterItems = [
    { icon: CheckCircle2, text: 'AI-based workflow routing with anomaly detection' },
    { icon: DollarSign, text: 'Automated node metrics & usage billing' },
    { icon: MessageSquare, text: 'Instant slack notification alerts via Webhooks' },
    { icon: Brain, text: 'AI pipeline predictor & system bottleneck alerts' },
    { icon: Zap, text: 'Save 4+ hours on releases every single day' },
  ]

  const engineCards = [
    { icon: Brain, title: 'Predictive AI Engine', desc: 'Forecasts queue latencies, load balances, and processing performance before they bottleneck.', color: 'text-purple-400 bg-purple-500/10' },
    { icon: Zap, title: 'Zero-touch Automation', desc: 'Deployments, alert routing, scaling limits, and metric gathering run automatically without manual input.', color: 'text-amber-400 bg-amber-500/10' },
    { icon: BarChart3, title: 'Real-time Analytics', desc: "Live dashboards show you exactly what's happening across all servers, workflows, and operations.", color: 'text-blue-400 bg-blue-500/10' },
  ]

  return (
    <section className={`${bgClass} py-32 overflow-hidden relative`} id="story">
      <NoiseLayer />
      <BackgroundGrid variant="dotted" opacity={isDark ? 0.04 : 0.02} size={60} />
      <AmbientGlow color={isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)'} size="40rem" top="15%" left="20%" delay={0} />
      <GradientOrb color1={isDark ? 'rgba(139, 92, 246, 0.03)' : 'rgba(139, 92, 246, 0.01)'} size="35rem" top="75%" left="80%" delay={3} />
      <div className="container-fluid relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-4 ${isDark ? 'text-white/40' : 'text-black/40'}`}>The Transformation</p>
          <h2 className={`text-4xl md:text-5xl font-black ${textPrimary}`}>
            The Problem.{' '}
            <span className="text-gradient">The Solution.</span>
          </h2>
        </motion.div>

        <div className="space-y-32">
          {/* Section 1: The Problem */}
          <div ref={ref1} className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-6">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Before Synapse</span>
              </div>
              <h3 className={`text-3xl md:text-4xl font-black mb-4 ${textPrimary}`}>
                Death by Spreadsheets
              </h3>
              <p className={`text-lg ${textSecondary} mb-8 leading-relaxed`}>
                Traditional teams drown in manual scripts — crontab managers, billing logs, handwritten incident reports, 
                missed follow-ups, and zero visibility into deployment health.
              </p>
              <div className="space-y-3">
                {beforeItems.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView1 ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-red-500/5 border border-red-500/10 text-red-300' : 'bg-red-50 border border-red-100 text-red-950'}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-red-500" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Messy spreadsheet mockup */}
              <div className={`rounded-2xl border p-6 font-mono text-xs overflow-hidden relative ${isDark ? 'bg-gray-900/50 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className={`ml-2 text-xs ${textSecondary}`}>cluster_deployments_manual_v3.xlsx</span>
                </div>
                <div className={`grid grid-cols-5 gap-px text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {['Node','Mon','Tue','Wed','Cost'].map((h) => (
                    <div key={h} className={`py-1 px-2 text-xs font-bold ${isDark ? 'bg-gray-700' : 'bg-gray-300'} text-gray-200`}>{h}</div>
                  ))}
                  {[
                    ['Node-01','OK','FAIL','OK','OVERRUN'],
                    ['Node-02','FAIL','FAIL','FAIL','OK'],
                    ['Node-03','OK','OK','?','OVERRUN'],
                    ['Node-04','FAIL','OK','OK','WARNING'],
                    ['Node-05','?','?','FAIL','OVERRUN'],
                    ['Node-06','OK','FAIL','FAIL','OK'],
                  ].map((row, ri) => (
                    row.map((cell, ci) => {
                      const isStatus = cell === 'OVERRUN' || cell === 'OK' || cell === 'WARNING' || cell === 'FAIL'
                      return (
                        <div
                          key={`${ri}-${ci}`}
                          className={`py-2 px-1 text-xs flex items-center justify-center border-b ${isDark ? 'border-gray-800' : 'border-gray-200'} ${
                            cell === 'FAIL' ? 'text-red-400 font-bold' :
                            cell === 'OK' ? 'text-green-400' :
                            cell === '?' ? 'text-yellow-400 animate-pulse font-bold' :
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {isStatus ? (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              cell === 'FAIL' || cell === 'OVERRUN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              cell === 'OK' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {cell}
                            </span>
                          ) : cell}
                        </div>
                      )
                    })
                  ))}
                </div>
                <div className="absolute top-2 right-2">
                  <div className="bg-red-500/20 border border-red-500/40 text-red-400 text-xs px-2.5 py-1 rounded-md font-semibold">
                    156 exceptions flagged
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Section 2: Enter Synapse */}
          <div ref={ref2} className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1 relative"
            >
              {/* Futuristic dashboard mockup */}
              <div className={`rounded-2xl border overflow-hidden shadow-2xl ${isDark ? 'bg-[#0d0d14] border-white/10' : 'bg-white border-gray-200'}`}>
                <div className={`flex items-center gap-3 px-4 py-3 border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className={`text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Synapse AI Control — Live</span>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Pipelines', value: '1,248', color: 'from-blue-500/10 to-indigo-500/5 text-blue-400 border-blue-500/10' },
                    { label: 'Throughput', value: '94.2%', color: 'from-amber-500/10 to-orange-500/5 text-amber-400 border-amber-500/10' },
                    { label: 'Node Cost', value: '₹14.2L', color: 'from-green-500/10 to-emerald-500/5 text-green-400 border-green-500/10' },
                  ].map(({ label, value, color }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView2 ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className={`rounded-xl p-3 border bg-gradient-to-br ${color}`}
                    >
                      <p className={`text-[10px] font-semibold mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                      <p className={`text-base font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                      <p className="text-[9px] opacity-75 font-semibold">Real-time</p>
                    </motion.div>
                  ))}
                </div>
                <div className={`mx-4 mb-4 rounded-xl p-3 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-tight mb-2.5 flex items-center gap-1.5 ${isDark ? 'text-white/60' : 'text-gray-900/60'}`}>
                    <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI Recommendations
                  </p>
                  <div className="space-y-1.5">
                    <p className={`text-xs flex items-center gap-1.5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Check className="w-3 h-3 text-green-400 flex-shrink-0" /> Autoscale trigger sent automatically
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" /> Bottleneck risk analyzed — fallbacks routing
                    </p>
                    <p className={`text-xs flex items-center gap-1.5 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" /> Deployment reports compiled
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider">After Synapse</span>
              </div>
              <h3 className={`text-3xl md:text-4xl font-black mb-4 ${textPrimary}`}>
                Your Workflows, Fully Automated
              </h3>
              <p className={`text-lg ${textSecondary} mb-8 leading-relaxed`}>
                Synapse replaces chaos with clarity. Every process — API building, alerts, integrations, 
                throughput analytics — runs on autopilot powered by AI.
              </p>
              <div className="space-y-3">
                {afterItems.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView2 ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-green-500/5 border border-green-500/10 text-green-300' : 'bg-green-50 border border-green-100 text-green-950'}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Section 3: AI & Automation */}
          <div ref={ref3}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white/60' : 'text-black/60'}`}>Neural Engine</span>
              </div>
              <h3 className={`text-3xl md:text-4xl font-black mb-4 ${textPrimary}`}>
                Automation & Intelligence{' '}
                <span className="text-gradient">at Scale</span>
              </h3>
              <p className={`text-lg ${textSecondary} max-w-2xl mx-auto`}>
                Synapse AI continuously learns from your system data to predict bottlenecks, 
                automate workflows, and give you insights you never had before.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {engineCards.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className={`glass-card p-6 text-center hover:border-white/20 transition-all flex flex-col items-center`}
                >
                  <div className={`p-4 rounded-full ${color} mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${textPrimary}`}>{title}</h4>
                  <p className={`text-sm ${textSecondary}`}>{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScrollStory
