import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  User,
  Mail,
  MessageSquare,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import {
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaEnvelope,
} from 'react-icons/fa'
import Swal from 'sweetalert2'
import { messageApi } from '../../../api/index.js'

const smoothEase = [0.22, 1, 0.36, 1]

const fieldVariants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
}

const socialLinks = [
  {
    title: 'Instagram',
    user: '@real_mrhak_7',
    icon: FaInstagram,
    link: 'https://www.instagram.com/real_mrhak_7/',
  },
  {
    title: 'GitHub',
    user: '@realmrhak',
    icon: FaGithub,
    link: 'https://github.com/realmrhak',
  },
  {
    title: 'Email',
    user: 'realmrhak07@gmail.com',
    icon: FaEnvelope,
    link: 'mailto:realmrhak07@gmail.com',
  },
]

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic client-side validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Please fill in all fields',
        background: '#1a1a1a',
        color: '#fff',
      })
      return
    }

    // Simple email format check
    const emailOk = /^\S+@\S+\.\S+$/.test(email)
    if (!emailOk) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid email',
        background: '#1a1a1a',
        color: '#fff',
      })
      return
    }

    setSending(true)
    try {
      await messageApi.create({ name, email, message })
      Swal.fire({
        icon: 'success',
        title: 'Message sent!',
        text: 'Thanks for reaching out — I will get back to you soon.',
        background: '#1a1a1a',
        color: '#fff',
        timer: 2500,
        showConfirmButton: false,
      })
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to send',
        text: err.response?.data?.message || 'Please try again later.',
        background: '#1a1a1a',
        color: '#fff',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: smoothEase }}
      viewport={{ once: false, amount: 0.2 }}
      className="rounded-[24px] sm:rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 md:p-8 flex flex-col h-full"
    >
      {/* HEADER */}
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Get in Touch</h2>
        <p className="text-xs sm:text-sm text-white/50 mb-5 sm:mb-7">
          Feel free to reach out if you want to collaborate, discuss ideas, or
          simply say hello.
        </p>
      </motion.div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-sm outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        {/* EMAIL */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.16 }}
        >
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={120}
              required
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-sm outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        {/* MESSAGE */}
        <motion.div
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.22 }}
        >
          <div className="relative">
            <MessageSquare className="absolute left-4 top-5 text-white/40" size={16} />
            <textarea
              rows={5}
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              required
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-sm outline-none resize-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        {/* BUTTON */}
        <motion.button
          type="submit"
          disabled={sending}
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.28 }}
          whileHover={!sending ? { scale: 1.06, transition: { duration: 0.12 } } : undefined}
          whileTap={!sending ? { scale: 0.97 } : undefined}
          className="w-full rounded-2xl py-3 sm:py-4 bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-sm disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </motion.button>
      </form>

      {/* SOCIAL */}
      <div className="border-t border-white/10 pt-4 sm:pt-5 mt-5 sm:mt-6">
        <motion.p
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.34 }}
          className="text-xs sm:text-sm text-white/55 mb-3 sm:mb-4"
        >
          Connect With Me
        </motion.p>

        {/* LINKEDIN */}
        <motion.a
          href="https://linkedin.com/in/realmrhak"
          target="_blank"
          rel="noopener noreferrer"
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.36 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.12 } }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 mb-3 flex items-center justify-between"
        >
          <div className="absolute inset-0 bg-white/[0.04] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />

          <div className="relative z-10 flex items-center gap-3">
            <FaLinkedinIn size={14} />
            <div>
              <p className="text-xs sm:text-sm font-medium">LinkedIn</p>
              <p className="text-[10px] sm:text-xs text-white/35">@realmrhak</p>
            </div>
          </div>

          <div className="relative z-10 opacity-0 group-hover:opacity-100 transition">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <ArrowUpRight size={14} />
            </div>
          </div>
        </motion.a>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {socialLinks.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={fieldVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                transition={{ delay: 0.42 + i * 0.05 }}
                whileHover={{ scale: 1.06, transition: { duration: 0.12 } }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 flex items-center justify-between"
              >
                <div className="absolute inset-0 bg-white/[0.04] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />

                <div className="relative z-10 flex items-center gap-3">
                  <Icon size={14} />
                  <div>
                    <p className="text-xs sm:text-sm">{item.title}</p>
                    <p className="text-[10px] sm:text-[11px] text-white/35">{item.user}</p>
                  </div>
                </div>

                <div className="relative z-10 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
