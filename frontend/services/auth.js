import api from './api'

export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password })
  },
  register: async (email, password, name) => {
    return api.post('/auth/register', { email, password, name })
  },
  logout: () => {
    localStorage.removeItem('auth_token')
  },
  getCurrentUser: async () => {
    return api.get('/auth/me')
  }
}

export default authService
