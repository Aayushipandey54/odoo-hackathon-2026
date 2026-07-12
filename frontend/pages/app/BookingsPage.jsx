import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { CalendarClock, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function BookingsPage() {
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '1:00']

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Resource Booking</h1>
        <p className="text-neutral-400 text-sm">Schedule shared resources and meeting rooms</p>
      </div>

      <Card className="bg-[#111111] border-white/10 max-w-3xl">
        <CardHeader className="border-b border-white/10 pb-4 pt-5 px-6">
          <div className="flex flex-col gap-1.5 w-full md:w-1/2">
            <label className="text-sm font-medium text-neutral-300">Resource & Date</label>
            <select className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-white/30 font-medium">
              <option>Conference Room B2 – Tue, 7 Jul</option>
            </select>
          </div>
        </CardHeader>
        
        <CardBody className="px-6 py-8">
          
          {/* Timeline View */}
          <div className="relative border-l-2 border-white/10 ml-16 pb-8 space-y-12">
            
            {timeSlots.map((time) => (
              <div key={time} className="relative">
                {/* Time Label */}
                <div className="absolute -left-16 top-0 w-12 text-right text-xs font-semibold text-neutral-400 -mt-1.5">
                  {time}
                </div>
                
                {/* Tick mark */}
                <div className="absolute -left-[9px] top-0 w-4 h-0.5 bg-white/20" />
                
                {/* Slot Content */}
                {time === '9:00' && (
                  <div className="absolute top-2 left-6 right-0 bg-[#0066FF]/20 border border-[#0066FF]/30 text-[#0066FF] rounded-lg p-3 text-sm h-[4.5rem]">
                    <span className="font-semibold">Booked</span> – Procurement Team – 9 to 10
                  </div>
                )}

                {time === '10:00' && (
                  <div className="absolute top-[-1rem] left-6 right-0 bg-red-500/10 border-2 border-dashed border-red-500/30 text-red-500 rounded-lg p-3 text-sm h-[4.5rem] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Requested 9:30 to 10:30 – <strong>conflict</strong> – slot is unavailable</span>
                  </div>
                )}

                {/* Empty dotted guide line for other slots */}
                <div className="border-t border-dashed border-white/5 ml-6 mt-1.5 w-full" />
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <Button variant="primary" className="w-full sm:w-auto">
              <CalendarClock className="w-4 h-4 mr-2" /> Book a Slot
            </Button>
          </div>

        </CardBody>
      </Card>
    </div>
  )
}
