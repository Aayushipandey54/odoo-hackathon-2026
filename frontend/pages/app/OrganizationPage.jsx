import { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Plus, Users, Building, MapPin } from 'lucide-react'
import { cn } from '../../utils/cn'
import organizationService from '../../services/organization'
import Loader from '../../components/ui/Loader'
import toast from 'react-hot-toast'

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('departments')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    departments: [],
    locations: [],
    employees: []
  })

  const tabs = [
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'employees', label: 'Employee Directory', icon: Users },
  ]

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'departments') {
        const res = await organizationService.getDepartments()
        setData(prev => ({ ...prev, departments: res.data }))
      } else if (activeTab === 'locations') {
        const res = await organizationService.getLocations()
        setData(prev => ({ ...prev, locations: res.data }))
      } else if (activeTab === 'employees') {
        const res = await organizationService.getEmployees()
        setData(prev => ({ ...prev, employees: res.data }))
      }
    } catch (err) {
      toast.error('Failed to load organization data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Organization Setup</h1>
          <p className="text-muted-foreground text-sm">Manage departments, locations, and personnel</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => toast.success('Add new form opened!')}>
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
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
                  ? "bg-muted text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
        {isLoading ? (
          <div className="flex items-center justify-center h-64"><Loader /></div>
        ) : activeTab === 'departments' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.departments.map(dept => (
              <Card key={dept.id} className="bg-card hover:border-border-strong transition-colors">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
                      <Building className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Status: {dept.status}</p>
                </CardBody>
              </Card>
            ))}
            {data.departments.length === 0 && (
              <p className="text-muted-foreground">No departments found.</p>
            )}
          </div>
        ) : activeTab === 'locations' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.locations.map(loc => (
              <Card key={loc.id} className="bg-card hover:border-border-strong transition-colors">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00F5FF]/20 flex items-center justify-center text-[#00F5FF]">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{loc.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{loc.address || 'No address provided'}</p>
                </CardBody>
              </Card>
            ))}
            {data.locations.length === 0 && (
              <p className="text-muted-foreground">No locations found.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.employees.map(emp => (
              <Card key={emp.id} className="bg-card hover:border-border-strong transition-colors">
                <CardBody className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#BF5FFF]/20 flex items-center justify-center text-[#BF5FFF]">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{emp.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">Dept: {emp.department?.name}</p>
                </CardBody>
              </Card>
            ))}
            {data.employees.length === 0 && (
              <p className="text-muted-foreground">No employees found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
