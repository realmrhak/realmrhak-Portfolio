import { motion } from 'framer-motion'
import ContactForm from './ContactForm.jsx'
import CommentsSection from './CommentsSection.jsx'

const smoothEase = [0.22, 1, 0.36, 1]

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="w-full max-w-[1500px] mx-auto 
      px-4 sm:px-6 md:px-10 lg:px-20
      pt-16 sm:pt-20 lg:pt-28 
      pb-20 sm:pb-24 lg:pb-36 
      text-white"
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: smoothEase }}
        viewport={{ once: false, amount: 0.3 }}
        className="text-center mb-10 sm:mb-12 lg:mb-16"
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          viewport={{ once: false }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4"
        >
          Contact Me
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          viewport={{ once: false }}
          className="text-white/60 text-xs sm:text-sm md:text-base max-w-xl sm:max-w-2xl mx-auto leading-relaxed"
        >
          Have something in mind? Send a message and let's connect.
        </motion.p>
      </motion.div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 sm:gap-8 md:gap-10 lg:gap-12">
        <div className="w-full">
          <ContactForm />
        </div>
        <div className="w-full">
          <CommentsSection />
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-16 sm:mt-20 text-center text-[11px] sm:text-xs text-white/35">
        © {new Date().getFullYear()} Haroon Ameer Khan — All rights reserved.
      </div>
    </section>
  )
}
