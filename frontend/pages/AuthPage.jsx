import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, UserPlus, User } from 'lucide-react'
import { useAuth } from '../store/AuthContext'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { cn } from '../utils/cn'

const AuthPage = () => {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect to the page they tried to visit, or dashboard
  const from = location.state?.from?.pathname || '/app/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (mode === 'signup') {
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields")
        return
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        return
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }
      
      setIsSubmitting(true)
      const result = await signup(email, password, name)
      setIsSubmitting(false)
      
      if (result.success) {
        toast.success(result.message)
        // Automatically login after successful signup
        setIsSubmitting(true)
        const loginResult = await login(email, password)
        if (loginResult.success) {
          navigate(from, { replace: true })
        } else {
          setMode('login')
          setIsSubmitting(false)
        }
      } else {
        toast.error(result.message)
      }
    } else {
      // Login flow
      if (!email || !password) {
        toast.error("Please enter both email and password")
        return
      }

      setIsSubmitting(true)
      const result = await login(email, password)
      setIsSubmitting(false)
      
      if (result.success) {
        toast.success("Welcome back to AssetFlow!")
        navigate(from, { replace: true })
      } else {
        toast.error(result.message || "Invalid credentials")
      }
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      
      {/* Background Visual Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-500/5 blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <Card className="w-full max-w-md mx-4 p-8 relative z-10 bg-card backdrop-blur-3xl shadow-2xl border border-border rounded-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shadow-lg">
              {mode === 'login' ? <LogIn className="w-6 h-6 text-foreground" /> : <UserPlus className="w-6 h-6 text-foreground" />}
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2 transition-all">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {mode === 'login' 
              ? 'Sign in to access your AssetFlow workspace' 
              : 'Join AssetFlow and manage your assets smartly'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Full Name Field (Signup only) */}
            {mode === 'signup' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-foreground ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="pl-10 w-full bg-surface border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-foreground"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 w-full bg-surface border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-foreground"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 pr-10 w-full bg-surface border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Password strength indicator for signup */}
              {mode === 'signup' && password.length > 0 && (
                <div className="mt-2 flex gap-1 h-1 w-full rounded-full overflow-hidden animate-in fade-in">
                  <div className={cn("h-full flex-1", password.length > 0 ? "bg-red-500" : "bg-border-strong")} />
                  <div className={cn("h-full flex-1", password.length > 5 ? "bg-yellow-500" : "bg-border-strong")} />
                  <div className={cn("h-full flex-1", password.length > 8 ? "bg-green-500" : "bg-border-strong")} />
                </div>
              )}
            </div>

            {/* Confirm Password Field (Signup only) */}
            {mode === 'signup' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-foreground ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="pl-10 w-full bg-surface border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 text-foreground"
                  />
                </div>
              </div>
            )}

            {/* Terms & Conditions (Signup only) */}
            {mode === 'signup' && (
              <div className="flex items-center mt-4 animate-in fade-in">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-border bg-surface text-blue-600 focus:ring-blue-500 focus:ring-offset-background cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground cursor-pointer select-none">
                  I agree to the <span className="text-blue-500">Terms & Conditions</span>
                </label>
              </div>
            )}

            {/* Remember Me (Login only) */}
            {mode === 'login' && (
              <div className="flex items-center mt-4">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border bg-surface text-blue-600 focus:ring-blue-500 focus:ring-offset-background cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full relative group overflow-hidden shadow-button"
          >
            <span className={cn(
              "flex items-center justify-center transition-transform duration-300",
              isSubmitting ? "translate-y-[-150%]" : "translate-y-0"
            )}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className={cn(
              "absolute inset-0 flex items-center justify-center transition-transform duration-300",
              isSubmitting ? "translate-y-0" : "translate-y-[150%]"
            )}>
              <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
            </span>
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={toggleMode}
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>

      </Card>
    </div>
  )
}

export default AuthPage
