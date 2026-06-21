import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleResize = () => setIsMobile(window.innerWidth < 768)

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)

          const sections = ['home', 'about', 'resume', 'portfolio', 'contact']
          for (const sectionId of sections) {
            const section = document.getElementById(sectionId)
            if (!section) continue
            const rect = section.getBoundingClientRect()
            if (rect.top <= 140 && rect.bottom >= 140) {
              setActiveSection(sectionId)
              break
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    handleResize()
    handleScroll()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const navbarPlayed = sessionStorage.getItem('navbarPlayed')
    if (navbarPlayed) {
      setShowNavbar(true)
      return
    }

    const timer = setTimeout(() => {
      setShowNavbar(true)
      sessionStorage.setItem('navbarPlayed', 'true')
    }, 3800)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const smoothScrollTo = (e, targetId) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (!target) return

    const navbarOffset = 3
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarOffset
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    const duration = 1200

    let startTime = null
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = easeInOutCubic(progress)
      window.scrollTo({ top: startPosition + distance * ease })
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }
    requestAnimationFrame(animation)
    setOpen(false)
  }

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Journey', id: 'resume' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: showNavbar ? 1 : 0, y: showNavbar ? 0 : -40 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: isMobile ? 12 : 20,
        left: isMobile ? 16 : 60,
        right: isMobile ? 16 : 60,
        zIndex: 50,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '9px 16px' : '10px 30px',
          width: '100%',
          borderRadius: 999,
          backgroundColor: scrolled ? 'rgba(13,13,13,0.85)' : 'rgba(13,13,13,0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
        }}
      >
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: isMobile ? 13 : 15,
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}
        >
          realmrhak.dev
        </span>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 40 }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
                  style={{
                    position: 'relative',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 14,
                    fontWeight: 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                    cursor: 'pointer',
                    paddingBottom: 4,
                    transition: '0.25s ease',
                  }}
                >
                  {item.label}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: 1,
                      background: 'white',
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </a>
              )
            })}
          </div>
        )}

        {isMobile && (
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <span style={{ width: 22, height: 2, background: 'white', borderRadius: 2 }} />
            <span style={{ width: 22, height: 2, background: 'white', borderRadius: 2 }} />
            <span style={{ width: 22, height: 2, background: 'white', borderRadius: 2 }} />
          </div>
        )}
      </div>

      {isMobile && open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: 8,
            borderRadius: 16,
            background: 'rgba(13,13,13,0.92)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(16px)',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '4px 0',
                }}
              >
                {item.label}
              </a>
            )
          })}
        </motion.div>
      )}
    </motion.nav>
  )
}
