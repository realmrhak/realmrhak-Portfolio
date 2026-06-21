import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

/**
 * Renders markdown content safely.
 * - remark-gfm: GitHub-flavored markdown (tables, strikethrough, task lists)
 * - rehype-sanitize: strips any HTML tags/markdown that could cause XSS
 *
 * Usage: <MarkdownRenderer source={project.long_description} />
 *
 * NOTE: react-markdown v9 removed the `inline` prop on the `code` component.
 * We detect inline code by the presence of a `className` (language-xxx)
 * which is only set on fenced code blocks.
 */
export default function MarkdownRenderer({ source, className = '' }) {
  if (!source) return null

  return (
    <div
      className={`prose-custom ${className}`}
      style={{
        fontSize: 14,
        lineHeight: 1.75,
        color: '#cfcfcf',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, {
          allowedTags: [
            'p', 'br', 'hr',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'em', 'del', 's', 'mark',
            'ul', 'ol', 'li',
            'blockquote', 'code', 'pre',
            'a', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
          ],
          allowedAttributes: {
            a: ['href', 'title', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'width', 'height'],
            '*': ['class'],
          },
          allowedSchemes: ['http', 'https', 'mailto'],
        }]]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          p: ({ node, ...props }) => <p style={{ marginBottom: 12 }} {...props} />,
          h1: ({ node, ...props }) => (
            <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 18, marginBottom: 10, color: '#fff' }} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 style={{ fontSize: 19, fontWeight: 700, marginTop: 16, marginBottom: 8, color: '#fff' }} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 14, marginBottom: 6, color: '#fff' }} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul style={{ marginBottom: 12, paddingLeft: 20, listStyle: 'disc' }} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol style={{ marginBottom: 12, paddingLeft: 20, listStyle: 'decimal' }} {...props} />
          ),
          li: ({ node, ...props }) => <li style={{ marginBottom: 4 }} {...props} />,
          strong: ({ node, ...props }) => (
            <strong style={{ color: '#fff', fontWeight: 700 }} {...props} />
          ),
          em: ({ node, ...props }) => <em style={{ color: '#a8a8a8' }} {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                borderLeft: '3px solid #444',
                paddingLeft: 12,
                margin: '12px 0',
                color: '#999',
                fontStyle: 'italic',
              }}
              {...props}
            />
          ),
          // react-markdown v9: detect block code via className (language-xxx).
          // Inline code has no className and no newline in children.
          code: ({ node, className, children, ...props }) => {
            const isBlock = typeof className === 'string' && className.startsWith('language-')
            if (isBlock) {
              return (
                <pre
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #2a2a2a',
                    borderRadius: 8,
                    padding: 12,
                    overflowX: 'auto',
                    marginBottom: 12,
                  }}
                >
                  <code
                    className={className}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12,
                      color: '#e0e0e0',
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>
              )
            }
            return (
              <code
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: '#fff',
                }}
                {...props}
              >
                {children}
              </code>
            )
          },
          table: ({ node, ...props }) => (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: 12,
                fontSize: 13,
              }}
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              style={{
                border: '1px solid #2a2a2a',
                padding: '6px 10px',
                textAlign: 'left',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontWeight: 600,
              }}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              style={{
                border: '1px solid #2a2a2a',
                padding: '6px 10px',
              }}
              {...props}
            />
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
