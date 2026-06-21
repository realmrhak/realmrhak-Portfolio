import sanitizeHtml from 'sanitize-html'

/**
 * Strip all HTML tags from a string, allowing no tags.
 * Use on free-text fields coming from unauthenticated users.
 */
export function stripHtml(input) {
  if (typeof input !== 'string') return ''
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape',
  }).trim()
}

/**
 * Truncate a string to a maximum length.
 */
export function truncate(input, max) {
  if (typeof input !== 'string') return ''
  return input.length > max ? input.slice(0, max) : input
}
