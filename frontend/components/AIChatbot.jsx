import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { X, Send, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

// Role-based quick questions
const roleQuickQuestions = {
  developers: [
    'How to deploy a workflow?',
    'API schema validation error?',
    'Mock sandbox setup?',
    'Show API builder docs',
  ],
  operations: [
    'Process latency bottleneck?',
    'SSO group policy setup?',
    'Slack webhook routing?',
    'Pending billing reminders',
  ],
  executives: [
    'Operational throughput metrics',
    'SSO governance compliance?',
    'Resource cost forecasting',
    'Quarterly efficiency report',
  ],
}

const AIChatbot = () => {
  const { isDark } = useTheme()
  const [role, setRole] = useState('developers') // Toggleable mock role for landing page demonstration
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello. I am the Synapse AI Assistant. How can I support your environment today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const quickQuestions = roleQuickQuestions[role] || roleQuickQuestions.developers

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset chatbot messages or greet again when role changes to match the perspective
  useEffect(() => {
    setMessages([
      { 
        role: 'ai', 
        text: `Hello. I am the Synapse AI Assistant. Operating under **${role.toUpperCase()}** parameters. How can I assist you?` 
      }
    ])
  }, [role])

  const sendMessageToAI = async (text) => {
    const q = text || input.trim()
    if (!q) return
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setInput('')
    setIsTyping(true)
    try {
      const { sendMessage } = await import('../services/aiService')
      const response = await sendMessage(q, messages, role, {})
      setMessages(prev => [...prev, { role: 'ai', text: response }])
    } catch (err) {
      console.error('AIChatbot communication failed:', err)
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection interrupted. Please verify connectivity.' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Premium Trigger Button */}
      <motion.button
        id="ai-chatbot-btn"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${ isDark ? 'bg-black border border-white/10 text-white hover:bg-neutral-900' 
            : 'bg-black border border-black/10 text-white'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={20} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={20} strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Subtle Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chatbot-panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className={`fixed bottom-24 sm:bottom-28 right-4 sm:right-8 z-[90] w-[calc(100vw-32px)] sm:w-[380px] rounded-[2rem] border overflow-hidden backdrop-blur-xl transition-all duration-300 flex flex-col shadow-2xl ${ isDark ? 'bg-black/95 border-white/[0.08]' : 'bg-white/95 border-gray-200'
            }`}
            style={{ height: '520px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Background Grid Texture */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px), 
                                  linear-gradient(to bottom, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />

            {/* Header */}
            <div className={`relative px-6 py-4 border-b flex-shrink-0 ${isDark ? 'border-white/[0.05]' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-serif italic ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Synapse <span className="not-italic font-sans font-bold text-xs uppercase tracking-widest opacity-40 ml-1">AI</span>
                  </h3>
                  {/* Role Selector Tabs */}
                  <div className="flex gap-1.5 mt-2">
                    {['developers', 'operations', 'executives'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-all duration-200 ${
                          role === r
                            ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                            : (isDark ? 'bg-white/5 text-white/40 hover:text-white/60' : 'bg-black/5 text-black/40 hover:text-black/60')
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5 border border-white/10 text-white/40' : 'bg-black/5 text-black/40'}`}>
                  <Sparkles size={18} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${ msg.role === 'user'
                        ? isDark ? 'bg-white/10 text-white' : 'bg-black text-white'
                        : isDark ? 'bg-white/[0.03] border border-white/[0.05] text-gray-300' : 'bg-gray-50 border border-gray-100 text-gray-700'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className={`react-markdown flex flex-col space-y-3
                        [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mt-4 [&>h1]:mb-1 ${isDark ? '[&>h1]:text-white' : '[&>h1]:text-black'}
                        [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mt-3 [&>h2]:mb-1 ${isDark ? '[&>h2]:text-white' : '[&>h2]:text-black'}
                        [&>h3]:text-base [&>h3]:font-bold [&>h3]:mt-2 [&>h3]:mb-1 ${isDark ? '[&>h3]:text-white' : '[&>h3]:text-black'}
                        [&>p]:leading-relaxed [&>p]:whitespace-pre-wrap
                        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1
                        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1
                        [&_strong]:font-bold ${isDark ? '[&_strong]:text-white' : '[&_strong]:text-black'}
                        [&_em]:italic
                        [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-[0.9em] [&>code]:font-mono ${isDark ? '[&>code]:bg-white/10 [&>code]:text-gray-200' : '[&>code]:bg-black/5 [&>code]:text-gray-800'}
                        [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-2 ${isDark ? '[&_pre]:bg-[#0d0d0d] [&_pre]:border [&_pre]:border-white/[0.05]' : '[&_pre]:bg-gray-800 [&_pre]:text-gray-100'}
                        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm
                        [&_blockquote]:border-l-4 ${isDark ? '[&_blockquote]:border-gray-600 [&_blockquote]:text-gray-400' : '[&_blockquote]:border-gray-300 [&_blockquote]:text-gray-500'} [&_blockquote]:pl-4 [&_blockquote]:italic
                      `}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]} 
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`px-5 py-4 rounded-2xl ${isDark ? 'bg-white/[0.03] border border-white/[0.05]' : 'bg-gray-50'}`}>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(d => (
                        <motion.div
                          key={d}
                          className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Actions & Input */}
            <div className={`relative p-6 pt-2 pb-6 border-t flex-shrink-0 ${isDark ? 'border-white/[0.05]' : 'border-gray-100'}`}>
              {/* Quick Prompt Grid */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessageToAI(q)}
                    className={`text-[9px] font-bold tracking-tight uppercase px-2.5 py-1 rounded border transition-all duration-300 ${ isDark ? 'bg-white/5 border-white/5 text-gray-400 hover:border-white/30 hover:text-white'
                        : 'bg-black/5 border-black/5 text-gray-500 hover:border-black/20 hover:text-black'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Precise Input Field */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessageToAI()}
                  placeholder="Engine query..."
                  className={`flex-1 text-xs px-4 py-3 rounded-xl outline-none transition-all duration-300 ${ isDark ? 'bg-white/[0.05] border border-white/[0.05] text-white placeholder-gray-600 focus:border-white/20'
                      : 'bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 focus:border-black/20'
                  }`}
                />
                <button
                  onClick={() => sendMessageToAI()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${ isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  <Send size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChatbot
