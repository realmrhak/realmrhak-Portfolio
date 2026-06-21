import { useEffect, useState, useCallback } from 'react'
import { commentApi, resolveMediaUrl } from '../api/index.js'

export default function useComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInitialComments()
  }, [])

  const fetchInitialComments = async () => {
    try {
      const { data } = await commentApi.list()
      setComments(data || [])
    } catch (err) {
      console.error('[useComments] fetch failed', err)
    }
  }

  const addComment = async ({ name, comment, image }) => {
    if (!name.trim() || !comment.trim()) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('comment', comment)
      if (image) formData.append('image', image)

      const { data: created } = await commentApi.create(formData)
      // Normalise image URL to absolute
      const normalised = { ...created, image_url: resolveMediaUrl(created.image_url) }
      setComments((prev) => [normalised, ...prev])
    } catch (err) {
      console.error('[useComments] create failed', err)
    } finally {
      setLoading(false)
    }
  }

  const likeComment = useCallback(async (id) => {
    const liked = localStorage.getItem(`liked-${id}`)
    if (liked) return

    try {
      const { data } = await commentApi.like(id)
      localStorage.setItem(`liked-${id}`, 'true')
      setComments((prev) =>
        prev.map((item) => (item._id === id ? { ...item, likes: data.likes } : item))
      )
    } catch (err) {
      console.error('[useComments] like failed', err)
    }
  }, [])

  return { comments, loading, addComment, likeComment }
}
