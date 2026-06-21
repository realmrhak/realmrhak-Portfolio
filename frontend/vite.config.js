import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
    // Proxy /api to backend during local dev so the frontend can hit /api
    // without hardcoding localhost:5000 anywhere.
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Split large 3D deps into their own chunk so the initial bundle stays small
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three') || id.includes('meshline')) {
              return 'vendor-three'
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-motion'
            }
            if (
              id.includes('react-router') ||
              /[\\/]react[\\/]/.test(id) ||
              /[\\/]react-dom[\\/]/.test(id)
            ) {
              return 'vendor-react'
            }
            if (id.includes('sweetalert2')) {
              return 'vendor-swal'
            }
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('micromark') || id.includes('mdast') || id.includes('hast') || id.includes('unist')) {
              return 'vendor-markdown'
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
