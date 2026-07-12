import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { ArrowRight, History } from 'lucide-react'

export default function AllocationsPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Allocation & Transfer</h1>
        <p className="text-neutral-400 text-sm">Assign assets or request transfers between employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Allocate Asset Form */}
        <Card className="bg-[#111111] border-white/10">
          <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6">
            <h2 className="text-lg font-semibold text-white">Allocate Asset</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-300">Select Asset</label>
              <select className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white/30">
                <option value="">Choose an available asset...</option>
                <option value="1">MacBook Pro 16" (AF-0114)</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-300">Assign To Employee</label>
              <select className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white/30">
                <option value="">Choose employee...</option>
                <option value="1">Priya Singh</option>
              </select>
            </div>

            {/* Simulated Double-Allocation Block Warning */}
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mt-2 hidden">
              Error: Asset already allocated to Priya Shah (Engineering). Direct re-allocation is blocked – submit a transfer request below.
            </div>

            <Button variant="primary" className="mt-2 w-full justify-center">
              Confirm Allocation
            </Button>
          </CardBody>
        </Card>

        {/* Transfer Request Form */}
        <Card className="bg-[#111111] border-white/10">
          <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6">
            <h2 className="text-lg font-semibold text-white">Transfer Request</h2>
          </CardHeader>
          <CardBody className="px-6 py-5 flex flex-col gap-4">
            
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">From</label>
                <select className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white/30">
                  <option value="1">Priya Shah</option>
                </select>
              </div>
              <div className="pt-6">
                <ArrowRight className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-300">To</label>
                <select className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white/30">
                  <option value="">Select Employee...</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-300">Reason</label>
              <textarea 
                rows="3" 
                placeholder="Why is this transfer needed?" 
                className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-white/30 resize-none"
              ></textarea>
            </div>

            <Button variant="outline" className="mt-2 w-full justify-center text-white border-white/20 hover:bg-white/5">
              Submit Request
            </Button>
          </CardBody>
        </Card>

        {/* Allocation History */}
        <div className="lg:col-span-2">
          <Card className="bg-[#111111] border-white/10">
            <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-neutral-400" />
                <h2 className="text-lg font-semibold text-white">Allocation History</h2>
              </div>
            </CardHeader>
            <CardBody className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-4 border-l-2 border-[#0066FF] pl-4 py-1">
                <p className="text-sm font-medium text-neutral-400 w-24 flex-shrink-0">Mar 22</p>
                <p className="text-sm text-white">Allocated to Priya Shah - Engineering</p>
              </div>
              <div className="flex items-center gap-4 border-l-2 border-neutral-600 pl-4 py-1 opacity-60">
                <p className="text-sm font-medium text-neutral-400 w-24 flex-shrink-0">Jan 04</p>
                <p className="text-sm text-white">Returned by Arjun Nair - condition: good</p>
              </div>
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  )
}
