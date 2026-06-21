import { useEffect, useState } from 'react'
import { projectApi, certificateApi, techApi } from '../api/index.js'

export default function usePortfolio() {
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])
  const [techStacks, setTechStacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    // Restore from sessionStorage for instant render
    try {
      const cachedProjects = sessionStorage.getItem('portfolioProjects')
      const cachedCertificates = sessionStorage.getItem('portfolioCertificates')
      const cachedTechStacks = sessionStorage.getItem('portfolioTechStacks')

      if (cachedProjects) setProjects(JSON.parse(cachedProjects))
      if (cachedCertificates) setCertificates(JSON.parse(cachedCertificates))
      if (cachedTechStacks) setTechStacks(JSON.parse(cachedTechStacks))
    } catch {
      // ignore cache parse errors
    }

    try {
      const [p, c, t] = await Promise.all([
        projectApi.list(),
        certificateApi.list(),
        techApi.list(),
      ])

      setProjects(p.data || [])
      setCertificates(c.data || [])
      setTechStacks(t.data || [])

      sessionStorage.setItem('portfolioProjects', JSON.stringify(p.data || []))
      sessionStorage.setItem('portfolioCertificates', JSON.stringify(c.data || []))
      sessionStorage.setItem('portfolioTechStacks', JSON.stringify(t.data || []))
    } catch (err) {
      console.error('[usePortfolio] fetch failed', err)
    } finally {
      setLoading(false)
    }
  }

  return { projects, certificates, techStacks, loading }
}
