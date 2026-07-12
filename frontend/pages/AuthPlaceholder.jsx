import { useTheme } from '../hooks/useTheme'

const AuthPlaceholder = () => {
  const { isDark } = useTheme()
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h1 className="text-2xl font-serif italic mb-2">Authentication Node</h1>
      <p className="text-sm opacity-50 max-w-sm mb-8">
        Synapse is currently running in a frontend-only demonstration environment.
        Authentication, database integration, and protected route systems are not included in this build.
      </p>
      <a
        href="/"
        className={`px-6 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-widest transition-all ${
          isDark 
            ? 'border-white text-white hover:bg-white hover:text-black' 
            : 'border-black text-black hover:bg-black hover:text-white'
        }`}
      >
        Return to Landing Page
      </a>
    </div>
  )
}

export default AuthPlaceholder
