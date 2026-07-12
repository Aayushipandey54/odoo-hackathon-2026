/**
 * Asset Status Badge
 * Displays asset status with appropriate styling
 */
export default function AssetStatusBadge({ status, condition }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/20'
      case 'ALLOCATED':
        return 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20'
      case 'MAINTENANCE':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'RESERVED':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'RETIRED':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'DISPOSED':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'NEW':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'GOOD':
        return 'bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/20'
      case 'FAIR':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'DAMAGED':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
        {status}
      </span>
      {condition && (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getConditionColor(condition)}`}>
          {condition}
        </span>
      )}
    </div>
  )
}
