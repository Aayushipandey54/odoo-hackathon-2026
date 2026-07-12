import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import PlatformCapabilities from '../components/sections/PlatformCapabilities'
import Statistics from '../components/sections/Statistics'
import ScrollStory from '../components/ScrollStory'
import Features from '../components/sections/Features'
import AIVisualization from '../components/AIVisualization'
import Testimonials from '../components/sections/Testimonials/index'
import Pricing from '../components/sections/Pricing'
import FAQ from '../components/sections/FAQ'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import AIChatbot from '../components/AIChatbot'

const HomePage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <PlatformCapabilities />
      <Statistics />
      <ScrollStory />
      <Features />
      <AIVisualization />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
    <Footer />
    <AIChatbot />
  </>
)

export default HomePage
