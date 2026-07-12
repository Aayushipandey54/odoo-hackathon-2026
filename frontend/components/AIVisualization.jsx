import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { NoiseLayer, BackgroundGrid, AmbientGlow } from './PremiumBackgrounds'
import { Target, Lightbulb, TrendingUp, RefreshCw } from 'lucide-react'

const AIVisualization = () => {
  const { isDark } = useTheme()
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight

    const nodeColors = ['#FFFFFF', '#A1A1AA', '#52525B', '#27272A', '#18181B']

    const layers = [
      { x: 0.1, count: 4 },
      { x: 0.3, count: 6 },
      { x: 0.5, count: 8 },
      { x: 0.7, count: 6 },
      { x: 0.9, count: 4 },
    ]

    const nodes = []

    layers.forEach((layer, li) => {
      const spacing = H / (layer.count + 1)
      for (let i = 0; i < layer.count; i++) {
        nodes.push({
          x: layer.x * W,
          y: spacing * (i + 1),
          layer: li,
          radius: 4 + Math.random() * 3,
          color: nodeColors[li % nodeColors.length],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          active: false,
          activeCooldown: 0,
        })
      }
    })

    const connections = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].layer === nodes[i].layer + 1) {
          connections.push({ from: i, to: j, progress: 0, active: false, speed: 0.005 + Math.random() * 0.01 })
        }
      }
    }

    let tick = 0
    const signals = []

    const fireRandomSignal = () => {
      const fromNodes = nodes.filter(n => n.layer === 0)
      const fromNode = fromNodes[Math.floor(Math.random() * fromNodes.length)]
      const fromIdx = nodes.indexOf(fromNode)
      const conns = connections.filter(c => c.from === fromIdx)
      if (conns.length) {
        const conn = conns[Math.floor(Math.random() * conns.length)]
        signals.push({ conn, progress: 0, color: fromNode.color })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      tick++

      if (tick % 60 === 0) fireRandomSignal()

      // Update signals
      for (let i = signals.length - 1; i >= 0; i--) {
        signals[i].progress += 0.015
        if (signals[i].progress >= 1) {
          // Activate destination node and propagate
          const destIdx = signals[i].conn.to
          nodes[destIdx].active = true
          nodes[destIdx].activeCooldown = 20

          if (nodes[destIdx].layer < 4) {
            const nextConns = connections.filter(c => c.from === destIdx)
            if (nextConns.length) {
              const nextConn = nextConns[Math.floor(Math.random() * nextConns.length)]
              signals.push({ conn: nextConn, progress: 0, color: signals[i].color })
            }
          }
          signals.splice(i, 1)
        }
      }

      // Draw connections
      connections.forEach(conn => {
        const from = nodes[conn.from]
        const to = nodes[conn.to]
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw signal particles
      signals.forEach(sig => {
        const from = nodes[sig.conn.from]
        const to = nodes[sig.conn.to]
        const x = from.x + (to.x - from.x) * sig.progress
        const y = from.y + (to.y - from.y) * sig.progress

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = sig.color
        ctx.fill()
        ctx.fill()
      })

      // Draw nodes
      nodes.forEach(node => {
        node.pulse += node.pulseSpeed
        const pulseFactor = 0.8 + 0.2 * Math.sin(node.pulse)
        const r = node.radius * pulseFactor

        if (node.activeCooldown > 0) {
          node.activeCooldown--
          if (node.activeCooldown === 0) node.active = false
        }



        // Node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = node.active ? node.color : node.color + '80'
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animId)
  }, [isDark])

  const items = [
    { icon: Target, title: 'Process Bottleneck Detection', desc: 'Identifies latency and process stalls 2 hours before they occur.', color: 'text-red-400 bg-red-500/10' },
    { icon: Lightbulb, title: 'Optimization Triggers', desc: 'Suggests automated actions, fallbacks, and triggers for every bottleneck.', color: 'text-amber-400 bg-amber-500/10' },
    { icon: TrendingUp, title: 'Throughput Forecasting', desc: 'Predicts workload scaling needs based on request + concurrency patterns.', color: 'text-emerald-400 bg-emerald-500/10' },
    { icon: RefreshCw, title: 'Self-Optimizing Agent', desc: 'AI refines execution strategies continuously with every automated run.', color: 'text-blue-400 bg-blue-500/10' },
  ]

  return (
    <section id="ai" className={`section-padding relative overflow-hidden ${isDark ? 'bg-[#000000]' : 'bg-[#f4f7fd]'}`}>
      <NoiseLayer />
      <BackgroundGrid variant="dotted" opacity={isDark ? 0.04 : 0.02} size={60} />
      <AmbientGlow color={isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.02)'} size="40rem" top="50%" left="80%" delay={3} />
      <div className="container-fluid relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
              <span className={`text-sm font-semibold uppercase tracking-widest text-[10px] ${isDark ? 'text-white/60' : 'text-black/60'}`}>Neural AI Engine</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-black mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Synapse AI Thinks{' '}
              <span className="text-gradient">Like Your Best Engineer</span>
            </h2>
            <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Our neural AI engine continuously analyzes thousands of data points 
              from your enterprise pipelines — process speed, node throughput, resource billing, 
              queue saturation — and surfaces the insights that matter most.
            </p>

            <div className="space-y-4">
              {items.map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex items-start gap-4 p-4 rounded-xl glass-card`}
                >
                  <div className={`p-2.5 rounded-xl ${color} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Neural network canvas */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`relative rounded-3xl overflow-hidden border ${isDark ? 'border-white/10 bg-[#000000]' : 'border-gray-100 bg-white shadow-xl'}`}
            style={{ height: 400 }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%' }}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className={`glass-card px-3 py-2 text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Operational · AI Engine
              </div>
              <div className={`glass-card px-3 py-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Analyzing 1,248 active pipelines
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AIVisualization
