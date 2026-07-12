import api from './api'

export const organizationService = {
  // Departments
  getDepartments: async (params) => {
    const response = await api.get('/departments', { params })
    return response.data?.data || response.data || []
  },
  createDepartment: async (data) => {
    return api.post('/departments', data)
  },
  
  // Locations
  getLocations: async (params) => {
    const response = await api.get('/locations', { params })
    return response.data?.data || response.data || []
  },
  createLocation: async (data) => {
    return api.post('/locations', data)
  },

  // Categories
  getCategories: async (params) => {
    const response = await api.get('/categories', { params })
    return response.data?.data || response.data || []
  },
  createCategory: async (data) => {
    return api.post('/categories', data)
  },

  // Employees
  getEmployees: async (params) => {
    const response = await api.get('/employees', { params })
    return response.data?.data || response.data || []
  },
  createEmployee: async (data) => {
    return api.post('/employees', data)
  },

  // Organization Settings
  getSettings: async () => {
    return api.get('/organization')
  },
  updateSettings: async (data) => {
    return api.put('/organization', data)
  }
}

export default organizationService
