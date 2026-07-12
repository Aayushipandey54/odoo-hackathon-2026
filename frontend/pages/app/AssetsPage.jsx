import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Search, Filter, Package, MoreVertical, Plus } from 'lucide-react'

export default function AssetsPage() {
  const assets = [
    { id: 'AF-0114', name: 'MacBook Pro 16"', category: 'Laptop', assignee: 'Priya Singh', status: 'Allocated' },
    { id: 'AF-0062', name: 'Sony VPL-PHZ60', category: 'Projector', assignee: 'Meeting Room B2', status: 'Available' },
    { id: 'AF-0341', name: 'Herman Miller Aeron', category: 'Furniture', assignee: 'Arjun Nair', status: 'Allocated' },
    { id: 'AF-0099', name: 'Dell UltraSharp 27', category: 'Monitor', assignee: '-', status: 'Maintenance' },
    { id: 'AF-0410', name: 'Cisco Meraki MR46', category: 'Network', assignee: 'IT Dept', status: 'Available' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/20'
      case 'Allocated': return 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20'
      case 'Maintenance': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Asset Directory</h1>
          <p className="text-neutral-400 text-sm">Manage all company assets and equipment</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-[#111111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors w-64"
            />
          </div>
          <Button variant="outline" className="gap-2 border-white/10 text-white">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="flex-1 bg-[#111111] border-white/10 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Asset ID & Name</th>
                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Assignee/Location</th>
                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{asset.name}</p>
                        <p className="text-xs text-neutral-500">{asset.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-neutral-300">{asset.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-neutral-300">{asset.assignee}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-neutral-500 hover:text-white transition-colors p-2">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
