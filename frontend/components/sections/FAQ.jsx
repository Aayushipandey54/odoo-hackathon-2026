import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { NoiseLayer, BackgroundGrid, AmbientGlow } from '../PremiumBackgrounds'

const faqData = [
  {
    question: "What is AssetFlow?",
    answer: "AssetFlow is an AI-powered enterprise orchestration platform designed to connect operations, pipelines, and knowledge workflows through intelligent system coordination."
  },
  {
    question: "Is AssetFlow just a workflow scheduler?",
    answer: "No. AssetFlow is not designed to run tasks alone. It is designed to orchestrate complex operations, databases, and AI agents across enterprise platforms."
  },
  {
    question: "Who is AssetFlow designed for?",
    answer: "AssetFlow is designed for CTOs, product managers, platform engineers, and modern teams exploring scalable, connected approaches to business automation."
  },
  {
    question: "What problem is AssetFlow trying to solve?",
    answer: "Most platforms organize dashboards or static scripts. AssetFlow is built to coordinate operations and decision intelligence itself."
  },
  {
    question: "How is AssetFlow different from other workflow tools?",
    answer: "Instead of acting as a destination for task scheduling, AssetFlow functions as an infrastructure layer that supports how enterprise environments connect, adapt, and scale over time."
  },
  {
    question: "Why do modern operations need platform intelligence?",
    answer: "As operations expand beyond static scripts and servers, they require systems that support continuity, coordination, and intelligent pathing across applications. AssetFlow is designed to support that transition."
  },
  {
    question: "When will AssetFlow be available?",
    answer: "Access to AssetFlow is opening in stages. Early teams are invited to join our developer preview to receive updates and early entry opportunities."
  },
  {
    question: "How can I get early access to AssetFlow?",
    answer: "You can join the AssetFlow early access waitlist to receive updates as the platform becomes available in stages."
  }
]

const FAQItem = ({ question, answer, isOpen, onClick, color }) => {
  const { isDark } = useTheme()

  return (
    <div 
      className={`rounded-2xl transition-all duration-500 overflow-hidden ${
        isDark ? 'bg-white/[0.05] border border-white/[0.12]' : 'bg-white border border-gray-200 shadow-sm'
      } ${isOpen ? (isDark ? `border-${color}-500/50 bg-${color}-500/[0.08] shadow-[0_0_30px_-10px_rgba(var(--gray-rgb),0.2)]` : `border-${color}-500/30 bg-${color}-50/50 shadow-md`) : (isDark ? 'hover:border-white/20' : 'hover:border-gray-300')}`}
    >
      <button
        onClick={onClick}
        className="w-full text-left flex justify-between items-center p-6 group focus:outline-none"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm md:text-base font-bold tracking-tight transition-all duration-300 ${
            isOpen ? (isDark ? `text-${color}-400` : `text-${color}-600`) : (isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900')
          }`}
        >
          {question}
        </span>
        <motion.span 
          animate={{ rotate: isOpen ? 135 : 0 }}
          className={`text-2xl font-light transition-colors ${isOpen ? (isDark ? `text-${color}-400` : `text-${color}-600`) : (isDark ? 'text-white/20' : 'text-black/20')}`}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-6 pb-6">
              <p 
                className={`text-sm md:text-base leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const { isDark } = useTheme()

  return (
    <section id="faq" className={`py-24 md:py-32 lg:py-48 relative overflow-hidden transition-colors duration-1000 ${isDark ? 'bg-[#030307]' : 'bg-[#eef2ff]'}`}>
      <NoiseLayer />
      <BackgroundGrid variant="dotted" opacity={isDark ? 0.04 : 0.02} size={80} />
      <AmbientGlow color={isDark ? 'rgba(99, 102, 241, 0.04)' : 'rgba(99, 102, 241, 0.015)'} size="45rem" top="25%" left="90%" delay={1} />
      <AmbientGlow color={isDark ? 'rgba(139, 92, 246, 0.03)' : 'rgba(139, 92, 246, 0.01)'} size="45rem" top="75%" left="10%" delay={4} />

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center md:text-left"
        >
          <motion.h2 
            className={`text-6xl md:text-8xl font-black mb-4 tracking-tighter ${isDark ? 'neon-text' : 'text-gray-900'}`}
          >
            FAQ.
          </motion.h2>
          <p className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Your questions, answered with clarity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {faqData.map((item, index) => {
            const colors = ['gray', 'gray', 'gray', 'gray', 'gray', 'gray']
            const color = colors[index % colors.length]
            return (
              <FAQItem
                key={index}
                color={color}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
