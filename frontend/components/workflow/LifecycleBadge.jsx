/**
 * LifecycleBadge Component
 * Visual status badge for asset lifecycle states
 */

import { Badge } from '../ui/Badge'

const stateConfig = {
  AVAILABLE: {
    label: 'Available',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: '✓'
  },
  ALLOCATED: {
    label: 'Allocated',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: '👤'
  },
  RESERVED: {
    label: 'Reserved',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: '🔒'
  },
  UNDER_MAINTENANCE: {
    label: 'Under Maintenance',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: '🔧'
  },
  LOST: {
    label: 'Lost',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: '❌'
  },
  RETIRED: {
    label: 'Retired',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: '📦'
  },
  DISPOSED: {
    label: 'Disposed',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: '🗑️'
  }
}

export default function LifecycleBadge({ state, showIcon = true, size = 'md' }) {
  const config = stateConfig[state] || stateConfig.AVAILABLE

  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }[size]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        border rounded-full
        font-medium
        transition-colors
        ${sizeClass}
        ${config.className}
      `}
    >
      {showIcon && <span className="text-base">{config.icon}</span>}
      {config.label}
    </span>
  )
}
