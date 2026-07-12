import { memo } from 'react'

/**
 * Avatar component with initials fallback.
 * Renders a gradient avatar circle with the user's initials.
 */

const GRADIENTS = [
  'from-violet-500/20 to-purple-600/20',
  'from-blue-500/20 to-cyan-600/20',
  'from-emerald-500/20 to-teal-600/20',
  'from-amber-500/20 to-orange-600/20',
  'from-rose-500/20 to-pink-600/20',
  'from-indigo-500/20 to-blue-600/20',
]

const GRADIENTS_LIGHT = [
  'from-violet-100 to-purple-100',
  'from-blue-100 to-cyan-100',
  'from-emerald-100 to-teal-100',
  'from-amber-100 to-orange-100',
  'from-rose-100 to-pink-100',
  'from-indigo-100 to-blue-100',
]

const TEXT_COLORS = [
  'text-violet-400',
  'text-blue-400',
  'text-emerald-400',
  'text-amber-400',
  'text-rose-400',
  'text-indigo-400',
]

const TEXT_COLORS_LIGHT = [
  'text-violet-600',
  'text-blue-600',
  'text-emerald-600',
  'text-amber-600',
  'text-rose-600',
  'text-indigo-600',
]

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function hashName(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

const Avatar = memo(function Avatar({ name, isDark, size = 40 }) {
  const idx = hashName(name) % GRADIENTS.length
  const gradient = isDark ? GRADIENTS[idx] : GRADIENTS_LIGHT[idx]
  const textColor = isDark ? TEXT_COLORS[idx] : TEXT_COLORS_LIGHT[idx]
  const initials = getInitials(name)

  return (
    <div
      className={`flex-shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center border ${
        isDark ? 'border-white/10' : 'border-black/5'
      }`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className={`text-xs font-bold tracking-tight select-none ${textColor}`}
        style={{ fontSize: size * 0.32 }}
      >
        {initials}
      </span>
    </div>
  )
})

export default Avatar
