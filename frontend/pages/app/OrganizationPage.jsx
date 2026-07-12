import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Plus, Users, Building, MapPin } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('departments')

  const tabs = [
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'employees', label: 'Employee Directory', icon: Users },
  ]

  const departments = [
    { id: 1, name: 'Engineering', head: 'Priya Shah', members: 42, assets: 156 },
    { id: 2, name: 'IT Support', head: 'Arjun Nair', members: 12, assets: 48 },
    { id: 3, name: 'Procurement', head: 'Sarah Jones', members: 8, assets: 15 },
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Organization Setup</h1>
          <p className="text-neutral-400 text-sm">Manage departments, locations, and personnel</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => (
              <Card key={dept.id} className="bg-[#111111] hover:border-white/20 transition-colors">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
                      <Building className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{dept.name}</h3>
                  <p className="text-sm text-neutral-400 mb-4">Head: {dept.head}</p>
                  
                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Members</p>
                      <p className="font-semibold text-white">{dept.members}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Assets</p>
                      <p className="font-semibold text-white">{dept.assets}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {activeTab !== 'departments' && (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-dashed border-white/10 rounded-xl bg-white/5">
            <p>Content for {activeTab} will go here.</p>
          </div>
        )}
      </div>

    </div>
  )
}
