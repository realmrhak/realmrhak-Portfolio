// Tiny wrapper around sessionStorage that won't crash in private-mode Safari
// or sandboxed iframes where storage access is blocked.
function safeGet(key) {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // ignore — intro will simply replay next time, which is acceptable
  }
}

function safeRemove(key) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export const hasPlayedIntro = () => safeGet('introPlayed') === 'true'

export const setIntroPlayed = () => safeSet('introPlayed', 'true')

export const resetIntro = () => safeRemove('introPlayed')
