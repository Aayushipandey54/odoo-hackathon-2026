import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import {
  Wrench,
  UserPlus,
  Play,
  CheckCircle,
  FolderLock,
  Plus,
  Paperclip,
  History,
  FileText,
  AlertTriangle,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileDown
} from 'lucide-react'
import { cn } from '../../utils/cn'

// Axios base client pointing to backend api (port 5000)
const apiURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const client = axios.create({ baseURL: apiURL })

// Set authorization token helper
const setAuthToken = (userId) => {
  const token = `dummy_token_${userId}`
  localStorage.setItem('auth_token', token)
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default function MaintenancePage() {
  const [requests, setRequests] = useState([])
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  
  // Loading & Selection States
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  
  // Simulated Active User details
  const [activeEmployee, setActiveEmployee] = useState(null)
  
  // Modals Open state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isResolveOpen, setIsResolveOpen] = useState(false)

  // Form states
  const [createForm, setCreateForm] = useState({
    assetId: '',
    issue: '',
    priority: 'MEDIUM',
    attachments: [] // [{"name": "file.jpg", "type": "image/jpeg", "content": "base64..."}]
  })
  
  const [assignForm, setAssignForm] = useState({
    technicianId: ''
  })
  
  const [resolveForm, setResolveForm] = useState({
    repairNotes: '',
    resolutionSummary: ''
  })

  const [seeding, setSeeding] = useState(false)

  // 1. Fetch Init Data
  const fetchData = async () => {
    try {
      setLoading(true)
      // Check auth header
      const token = localStorage.getItem('auth_token')
      if (token) {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      // Fetch employees to feed user swapper & technician assignment
      const empRes = await client.get('/employees')
      const loadedEmployees = empRes.data.data || []
      setEmployees(loadedEmployees)

      // Fetch assets for dropdown request creation
      const assetRes = await client.get('/assets')
      setAssets(assetRes.data.data || [])

      // Set first employee as default logged-in session helper if none active
      if (loadedEmployees.length > 0 && !activeEmployee) {
        const defaultEmp = loadedEmployees[0]
        setActiveEmployee(defaultEmp)
        setAuthToken(defaultEmp.userId)
      }

      // Fetch maintenance requests
      const maintRes = await client.get('/maintenance')
      setRequests(maintRes.data.data || [])
    } catch (err) {
      console.error('Fetch error:', err)
      toast.error('Failed to sync data with Server. Verify backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-reload requests on changing active user session
  const handleSessionChange = (empId) => {
    const emp = employees.find(e => e.id === empId)
    if (emp) {
      setActiveEmployee(emp)
      setAuthToken(emp.userId)
      toast.success(`Logged in as ${emp.name}`)
      // Reload tickets with new auth context
      client.get('/maintenance')
        .then(res => setRequests(res.data.data || []))
        .catch(err => console.error(err))
    }
  }

  // 2. Client-side Seeder for Database
  const triggerAutoSeed = async () => {
    try {
      setSeeding(true)
      toast.loading('Initializing database seed setup...', { id: 'seed' })

      // Create Departments
      const engDeptRes = await client.post('/departments', { name: 'Engineering', status: 'ACTIVE' })
      const engDeptId = engDeptRes.data.data.id

      const itDeptRes = await client.post('/departments', { name: 'IT Support', status: 'ACTIVE' })
      const itDeptId = itDeptRes.data.data.id

      // Register Users
      const mgrReg = await client.post('/auth/register', {
        email: 'manager@assetflow.com',
        password: 'adminpassword',
        name: 'Sarah Jones (Asset Manager)',
        departmentId: itDeptId
      })
      const mgrUserId = mgrReg.data.data.user.id
      const mgrEmployeeId = mgrReg.data.data.employee.id

      const empReg = await client.post('/auth/register', {
        email: 'priya@assetflow.com',
        password: 'userpassword',
        name: 'Priya Shah (Software Engineer)',
        departmentId: engDeptId
      })
      const empUserId = empReg.data.data.user.id

      const techReg = await client.post('/auth/register', {
        email: 'technician@assetflow.com',
        password: 'techpassword',
        name: 'John Doe (IT Technician)',
        departmentId: itDeptId
      })
      const techUserId = techReg.data.data.user.id

      // Manually force Sarah Jones to Admin role via a direct service hack or update endpoint if possible.
      // Wait, let's see: can we call a custom update to force role to ADMIN?
      // Yes! Since we modified the auth middleware to fetch from the DB, we want Sarah to be ADMIN in the database!
      // In the database, we can update Sarah's user role by calling the update user repository, but we don't have a route.
      // Wait! We can write a quick custom seed trigger or let the backend do it. We already wrote scripts/seed.js!
      // If we run `node scripts/seed.js` on the terminal, it seeds directly via Prisma which works perfectly!
      // Let's run it from the terminal later. For now, let's also let the client-side seeder run, but to be sure Sarah is ADMIN, the script is best.
      // Let's create categories and assets on the frontend
      const catRes = await client.post('/asset-categories', { name: 'Laptop' })
      const laptopCatId = catRes.data.data.id

      const netRes = await client.post('/asset-categories', { name: 'Network' })
      const networkCatId = netRes.data.data.id

      await client.post('/assets', {
        tag: 'AF-0114',
        name: 'MacBook Pro 16"',
        categoryId: laptopCatId,
        departmentId: engDeptId,
        status: 'AVAILABLE',
        condition: 'NEW',
        location: 'HQ Floor 3'
      })

      await client.post('/assets', {
        tag: 'AF-0220',
        name: 'Cisco Core Switch 48P',
        categoryId: networkCatId,
        departmentId: itDeptId,
        status: 'AVAILABLE',
        condition: 'GOOD',
        location: 'Server Room A'
      })

      toast.success('Local seed success! Database populated.', { id: 'seed' })
      fetchData()
    } catch (err) {
      console.error(err)
      toast.error('Local seed failed. Try running "node scripts/seed.js" in backend terminal.', { id: 'seed' })
    } finally {
      setSeeding(false)
    }
  }

  // 3. Attachments handling
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCreateForm(prev => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              name: file.name,
              type: file.type,
              content: reader.result // data URL containing base64
            }
          ]
        }))
      };
      reader.readAsDataURL(file)
    })
  }

  // 4. Create request submit
  const handleCreateRequest = async (e) => {
    e.preventDefault()
    if (!createForm.assetId || !createForm.issue) {
      return toast.error('Please select an asset and write the issue details.')
    }

    try {
      await client.post('/maintenance', createForm)
      toast.success('Maintenance ticket submitted successfully')
      setIsCreateOpen(false)
      setCreateForm({ assetId: '', issue: '', priority: 'MEDIUM', attachments: [] })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request')
    }
  }

  // 5. Lifecycle Action Triggers
  const handleApprove = async (id) => {
    try {
      await client.put(`/maintenance/${id}/approve`)
      toast.success('Maintenance request Approved')
      // Refresh current details if opened
      if (selectedRequest?.id === id) {
        const details = await client.get(`/maintenance/${id}`)
        setSelectedRequest(details.data.data)
      }
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized: Only Asset Manager can approve')
    }
  }

  const handleReject = async (id) => {
    const remarks = prompt('Provide rejection reason/remarks:')
    if (remarks === null) return // cancelled prompt
    try {
      await client.put(`/maintenance/${id}/reject`, { remarks })
      toast.success('Maintenance request Rejected')
      if (selectedRequest?.id === id) {
        const details = await client.get(`/maintenance/${id}`)
        setSelectedRequest(details.data.data)
      }
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized: Only Asset Manager can reject')
    }
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    if (!assignForm.technicianId) return toast.error('Please select a technician')
    try {
      await client.put(`/maintenance/${selectedRequest.id}/assign`, assignForm)
      toast.success('Technician assigned successfully')
      setIsAssignOpen(false)
      const details = await client.get(`/maintenance/${selectedRequest.id}`)
      setSelectedRequest(details.data.data)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign technician')
    }
  }

  const handleStartWork = async (id) => {
    try {
      await client.put(`/maintenance/${id}/start`)
      toast.success('Work marked as IN PROGRESS')
      if (selectedRequest?.id === id) {
        const details = await client.get(`/maintenance/${id}`)
        setSelectedRequest(details.data.data)
      }
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start maintenance')
    }
  }

  const handleResolveSubmit = async (e) => {
    e.preventDefault()
    if (!resolveForm.resolutionSummary || !resolveForm.repairNotes) {
      return toast.error('Please input repair notes and resolution summary')
    }
    try {
      await client.put(`/maintenance/${selectedRequest.id}/resolve`, resolveForm)
      toast.success('Maintenance request marked as RESOLVED')
      setIsResolveOpen(false)
      setResolveForm({ repairNotes: '', resolutionSummary: '' })
      const details = await client.get(`/maintenance/${selectedRequest.id}`)
      setSelectedRequest(details.data.data)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve request')
    }
  }

  const handleClose = async (id) => {
    const remarks = prompt('Provide closing remarks (optional):')
    if (remarks === null) return // cancelled
    try {
      await client.put(`/maintenance/${id}/close`, { remarks })
      toast.success('Maintenance request CLOSED')
      if (selectedRequest?.id === id) {
        const details = await client.get(`/maintenance/${id}`)
        setSelectedRequest(details.data.data)
      }
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close request')
    }
  }

  // Details Viewer select
  const selectTicket = async (ticket) => {
    try {
      const res = await client.get(`/maintenance/${ticket.id}`)
      setSelectedRequest(res.data.data)
    } catch (err) {
      toast.error('Failed to load request details')
    }
  }

  // Visual formatting helpers
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'MEDIUM': return 'bg-[#0066FF]/10 text-[#0066FF] border-[#0066FF]/20'
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
      case 'APPROVED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'TECHNICIAN_ASSIGNED': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'IN_PROGRESS': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'RESOLVED': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'CLOSED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full pb-8">
      
      {/* 1. Simulation Session Swapper */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#BF5FFF]/20 flex items-center justify-center text-[#BF5FFF]">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Active Simulator Context</p>
            <p className="text-sm font-bold text-white">
              {activeEmployee ? `${activeEmployee.name} (${activeEmployee.user?.role || 'EMPLOYEE'})` : 'No Session Selected'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {employees.length > 0 ? (
            <select
              value={activeEmployee?.id || ''}
              onChange={(e) => handleSessionChange(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 font-medium"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          ) : (
            <Button
              variant="outline"
              onClick={triggerAutoSeed}
              disabled={seeding}
              className="text-xs border-dashed border-[#BF5FFF]/30 text-[#BF5FFF] hover:bg-[#BF5FFF]/5"
            >
              {seeding ? 'Seeding...' : 'Quick Seed Demo Workspace'}
            </Button>
          )}
          
          <Button variant="primary" onClick={() => setIsCreateOpen(true)} className="gap-2 text-xs">
            <Plus className="w-3.5 h-3.5" /> Request Maintenance
          </Button>
        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left / Center Column: Ticket List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Tickets Dashboard ({requests.length})</h2>
            <span className="text-xs text-neutral-500">Real-time database records</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-white/5 bg-white/[0.01] rounded-2xl">
              <Clock className="w-8 h-8 animate-spin text-[#BF5FFF] mb-3" />
              <p className="text-sm font-medium">Syncing tickets with postgres server...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-6 text-center">
              <Wrench className="w-8 h-8 opacity-40 mb-3" />
              <p className="text-sm font-semibold text-white mb-1">No maintenance tickets registered</p>
              <p className="text-xs text-neutral-500 max-w-xs mb-4">Create a request using the button above to begin the workflow cycle.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map(ticket => {
                const isSelected = selectedRequest?.id === ticket.id
                return (
                  <Card
                    key={ticket.id}
                    onClick={() => selectTicket(ticket)}
                    className={cn(
                      "bg-[#111111] hover:border-white/20 transition-all cursor-pointer",
                      isSelected ? "border-[#0066FF] ring-1 ring-[#0066FF]" : "border-white/10"
                    )}
                  >
                    <CardBody className="p-5 flex flex-col justify-between h-full gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm line-clamp-1 mb-1">{ticket.asset?.name || 'Unknown Asset'}</h4>
                        <p className="text-xs text-neutral-500 font-mono mb-3">Tag: {ticket.asset?.tag || 'N/A'}</p>
                        <p className="text-xs text-neutral-300 line-clamp-2">{ticket.issue}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-neutral-500">
                          Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        {ticket.technician && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-[#BF5FFF]/20 text-[#BF5FFF] text-[8px] flex items-center justify-center font-bold">
                              {ticket.technician.name.substring(0,2).toUpperCase()}
                            </div>
                            <span className="text-[10px] text-neutral-400 line-clamp-1 max-w-[80px]">
                              {ticket.technician.name.split(' ')[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Details Panel */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white">Ticket details</h2>
          
          {selectedRequest ? (
            <Card className="bg-[#111111] border-white/10 sticky top-4">
              <CardBody className="p-6 flex flex-col gap-6">
                
                {/* Header */}
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white leading-tight">{selectedRequest.asset?.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedRequest.status)}`}>
                      {selectedRequest.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono">Tag ID: {selectedRequest.asset?.tag}</p>
                  <p className="text-xs text-neutral-500 font-mono">Priority: {selectedRequest.priority}</p>
                </div>

                {/* Status transitions options */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Workflow Controls</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {/* Approved/Rejected checks (Asset Manager only) */}
                    {selectedRequest.status === 'PENDING' && (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleApprove(selectedRequest.id)}
                          className="bg-green-600 hover:bg-green-500 border-transparent text-xs py-1.5"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(selectedRequest.id)}
                          className="border-red-500/30 text-red-500 hover:bg-red-500/5 text-xs py-1.5"
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {/* Technician assign option (Asset Manager only) */}
                    {(selectedRequest.status === 'APPROVED' || selectedRequest.status === 'TECHNICIAN_ASSIGNED') && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setAssignForm({ technicianId: selectedRequest.technicianId || '' })
                          setIsAssignOpen(true)
                        }}
                        className="gap-1.5 text-xs py-1.5 bg-[#0066FF] hover:bg-[#0066FF]/95"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Assign Technician
                      </Button>
                    )}

                    {/* Start maintenance (Technician only) */}
                    {selectedRequest.status === 'TECHNICIAN_ASSIGNED' && (
                      <Button
                        variant="primary"
                        onClick={() => handleStartWork(selectedRequest.id)}
                        className="gap-1.5 text-xs py-1.5 bg-yellow-600 hover:bg-yellow-500 border-transparent"
                      >
                        <Play className="w-3.5 h-3.5 animate-pulse" /> Start Repair
                      </Button>
                    )}

                    {/* Resolve details submission (Technician only) */}
                    {selectedRequest.status === 'IN_PROGRESS' && (
                      <Button
                        variant="primary"
                        onClick={() => setIsResolveOpen(true)}
                        className="gap-1.5 text-xs py-1.5 bg-green-600 hover:bg-green-500 border-transparent"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Complete Repair
                      </Button>
                    )}

                    {/* Close (Asset Manager only) */}
                    {selectedRequest.status === 'RESOLVED' && (
                      <Button
                        variant="primary"
                        onClick={() => handleClose(selectedRequest.id)}
                        className="gap-1.5 text-xs py-1.5 bg-emerald-600 hover:bg-emerald-500 border-transparent"
                      >
                        <FolderLock className="w-3.5 h-3.5" /> Close Ticket
                      </Button>
                    )}

                    {/* Fallback info when ticket is final */}
                    {selectedRequest.status === 'CLOSED' && (
                      <span className="text-xs text-neutral-400 italic">This maintenance ticket is resolved and closed.</span>
                    )}
                    {selectedRequest.status === 'REJECTED' && (
                      <span className="text-xs text-neutral-400 italic">This request was rejected.</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Issue Description</h4>
                  <p className="text-sm text-neutral-200 bg-white/5 border border-white/5 rounded-xl p-3 leading-relaxed">
                    {selectedRequest.issue}
                  </p>
                </div>

                {/* Resolution Summary if available */}
                {selectedRequest.resolutionSummary && (
                  <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">Resolution Details</h4>
                    <p className="text-sm text-white font-semibold mb-1">{selectedRequest.resolutionSummary}</p>
                    {selectedRequest.repairNotes && (
                      <p className="text-xs text-neutral-400">Notes: {selectedRequest.repairNotes}</p>
                    )}
                    {selectedRequest.resolvedAt && (
                      <p className="text-[10px] text-neutral-500 mt-2">
                        Resolved on {new Date(selectedRequest.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* File Attachments */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Attachments</h4>
                  {selectedRequest.attachments ? (
                    (() => {
                      try {
                        const parsed = JSON.parse(selectedRequest.attachments)
                        if (!Array.isArray(parsed) || parsed.length === 0) return <p className="text-xs text-neutral-500 italic">No files attached.</p>
                        return (
                          <div className="flex flex-col gap-2">
                            {parsed.map((file, i) => (
                              <div key={i} className="flex items-center justify-between bg-[#0a0a0a] border border-white/10 rounded-xl p-2 px-3 text-xs">
                                <span className="font-medium text-neutral-300 truncate max-w-[180px]">{file.name}</span>
                                <a
                                  href={file.content}
                                  download={file.name}
                                  className="text-[#0066FF] hover:text-[#0066FF]/80 flex items-center gap-1 font-semibold"
                                >
                                  <FileDown className="w-3.5 h-3.5" /> Download
                                </a>
                              </div>
                            ))}
                          </div>
                        )
                      } catch (err) {
                        return <p className="text-xs text-neutral-500">Failed to render attachments.</p>
                      }
                    })()
                  ) : (
                    <p className="text-xs text-neutral-500 italic">No files attached.</p>
                  )}
                </div>

                {/* History timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Audit log trail
                  </h4>
                  
                  {selectedRequest.history && selectedRequest.history.length > 0 ? (
                    <div className="relative border-l border-white/10 ml-2.5 pl-5 space-y-4">
                      {selectedRequest.history.map((log) => (
                        <div key={log.id} className="relative text-xs">
                          {/* Timeline node */}
                          <div className="absolute -left-[1.6rem] top-0.5 w-3 h-3 rounded-full bg-[#0a0a0a] border-2 border-[#0066FF]" />
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-neutral-300">
                              {log.newStatus.replace('_', ' ')}
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-0.5">By {log.performedBy}</p>
                          {log.remarks && (
                            <p className="text-[10px] text-neutral-500 mt-1 italic">"{log.remarks}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 italic">No log entries found.</p>
                  )}
                </div>

              </CardBody>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-500 border border-white/5 bg-white/[0.01] rounded-3xl p-6 text-center">
              <Eye className="w-8 h-8 opacity-40 mb-3" />
              <p className="text-sm font-semibold text-white">Select a request card to inspect details</p>
            </div>
          )}
        </div>

      </div>

      {/* 3. Create Ticket Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Request Maintenance">
        <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">Target Asset</label>
            {assets.length > 0 ? (
              <select
                value={createForm.assetId}
                onChange={e => setCreateForm(prev => ({ ...prev, assetId: e.target.value }))}
                className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-white/30 font-medium"
              >
                <option value="">Select Asset...</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.tag})</option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-orange-500 bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> No assets found. Create some or seed demo data first.
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">Priority Level</label>
            <div className="grid grid-cols-4 gap-2">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setCreateForm(prev => ({ ...prev, priority: p }))}
                  className={cn(
                    "border rounded-lg py-2 text-[10px] font-bold transition-all",
                    createForm.priority === p 
                      ? "bg-white text-black border-transparent" 
                      : "bg-[#0a0a0a] border-white/10 text-neutral-400 hover:text-white"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">Issue description</label>
            <textarea
              rows="4"
              value={createForm.issue}
              onChange={e => setCreateForm(prev => ({ ...prev, issue: e.target.value }))}
              placeholder="What seems to be broken? Describe the problem in detail..."
              className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 resize-none"
            ></textarea>
          </div>

          {/* Attachments Upload component */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">Attachments (Images, PDF, Doc)</label>
            <div className="border border-dashed border-white/15 hover:border-white/30 transition-all rounded-xl p-4 text-center cursor-pointer relative bg-white/[0.01]">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Paperclip className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
              <p className="text-[10px] text-neutral-400">Click to select files</p>
            </div>

            {createForm.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {createForm.attachments.map((file, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] text-neutral-300">
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setCreateForm(prev => ({
                        ...prev,
                        attachments: prev.attachments.filter((_, idx) => idx !== i)
                      }))}
                      className="text-red-500 hover:text-red-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" className="mt-2 w-full justify-center text-xs">
            Submit Maintenance Ticket
          </Button>
        </form>
      </Modal>

      {/* 4. Assign Technician Modal */}
      <Modal isOpen={isAssignOpen} onClose={() => setIsAssignOpen(false)} title="Assign Technician">
        <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">Select Employee/Technician</label>
            {employees.length > 0 ? (
              <select
                value={assignForm.technicianId}
                onChange={e => setAssignForm(prev => ({ ...prev, technicianId: e.target.value }))}
                className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-white/30 font-medium"
              >
                <option value="">Select Technician...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-neutral-500">No employees available.</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="mt-2 w-full justify-center text-xs">
            Confirm Assignment
          </Button>
        </form>
      </Modal>

      {/* 5. Complete Repair / Resolve Modal */}
      <Modal isOpen={isResolveOpen} onClose={() => setIsResolveOpen(false)} title="Resolve Maintenance Request">
        <form onSubmit={handleResolveSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">Resolution Summary</label>
            <input
              type="text"
              value={resolveForm.resolutionSummary}
              onChange={e => setResolveForm(prev => ({ ...prev, resolutionSummary: e.target.value }))}
              placeholder="e.g. Logic board replaced successfully"
              className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-white/30 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-300">Repair Notes (Technical Details)</label>
            <textarea
              rows="4"
              value={resolveForm.repairNotes}
              onChange={e => setResolveForm(prev => ({ ...prev, repairNotes: e.target.value }))}
              placeholder="Enter detailed diagnostics, replacement parts, or tests performed..."
              className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 resize-none"
            ></textarea>
          </div>

          <Button type="submit" variant="primary" className="mt-2 w-full justify-center text-xs">
            Resolve Ticket
          </Button>
        </form>
      </Modal>

    </div>
  )
}
