import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize session from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('accessToken')

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (err) {
          console.error("Failed to parse stored user", err)
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      
      const { accessToken, refreshToken, user: userData } = response.data

      // Persist session
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser(userData)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Invalid credentials'
      }
    }
  }

  const signup = async (email, password, name) => {
    try {
      const response = await authService.register(email, password, name)
      // Usually after signup, we can automatically log them in, or prompt to login
      // Since backend register returns user & employee, but not tokens, we should log them in automatically
      // But for simplicity, we will just return success and let UI redirect to login or auto-login
      return { success: true, message: 'Account created successfully. Please log in.' }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Failed to create account'
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
