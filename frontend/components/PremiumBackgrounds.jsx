import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

// NoiseLayer: 1% opacity high-frequency micro-texture for premium look
export const NoiseLayer = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none z-[99]"
      style={{
        opacity: 0.015,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

// BackgroundGrid: customizable grid/dotted pattern
export const BackgroundGrid = ({ variant = 'dotted', opacity = 0.04, size = 60 }) => {
  const { isDark } = useTheme()
  const color = isDark ? '255, 255, 255' : '99, 102, 241'
  
  const bgImage = variant === 'dotted'
    ? `radial-gradient(circle, rgba(${color}, ${opacity * 1.5}) 1px, transparent 1px)`
    : `linear-gradient(to right, rgba(${color}, ${opacity}) 1px, transparent 1px), linear-gradient(to bottom, rgba(${color}, ${opacity}) 1px, transparent 1px)`

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: bgImage,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  )
}

// AmbientGlow: blur blob
export const AmbientGlow = ({ color, size = '40rem', top = '10%', left = '10%', delay = 0 }) => {
  const { isDark } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  // Fallback to default glowing colors if color is not set based on mode
  const resolvedColor = color || (isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(99, 102, 241, 0.08)')

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : {
        scale: [1, 1.15, 1],
        x: [0, 20, 0],
        y: [0, -20, 0]
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      className="absolute rounded-full pointer-events-none blur-[130px] z-0"
      style={{
        backgroundColor: resolvedColor,
        width: size,
        height: size,
        top,
        left,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

// GradientOrb: mesh gradient
export const GradientOrb = ({ color1 = 'rgba(139, 92, 246, 0.08)', color2 = 'rgba(236, 72, 153, 0.06)', size = '30rem', top = '20%', left = '80%', delay = 2 }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : {
        scale: [1, 1.2, 1],
        x: [0, -40, 0],
        y: [0, 40, 0]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'easeInOut',
        delay
      }}
      className="absolute rounded-full pointer-events-none blur-[140px] z-0"
      style={{
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`,
        width: size,
        height: size,
        top,
        left,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

// FloatingParticles: slow canvas drift
export const FloatingParticles = ({ count = 20, maxOpacity = 0.05 }) => {
  const canvasRef = useRef(null)
  const { isDark } = useTheme()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * maxOpacity
    }))

    const colorStr = isDark ? '255, 255, 255' : '99, 102, 241'

    const draw = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${colorStr}, ${p.alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [count, maxOpacity, isDark])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
    />
  )
}
