import api from './api'

export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password })
  },
  register: async (email, password, name) => {
    return api.post('/auth/register', { email, password, name })
  },
  refresh: async (refreshToken) => {
    return api.post('/auth/refresh', { refreshToken })
  },
  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
}

export default authService
