import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  build: {
    // Target modern browsers for smaller, faster bundles
    target: 'es2020',
    // Increase warning limit slightly (some templates are intentionally larger)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Heavy PDF/DOCX exporters — only load on demand
          if (id.includes('html2canvas') || id.includes('jspdf')) return 'pdf-engine'
          if (id.includes('docx')) return 'docx-engine'

          // PDF.js — keep as its own chunk (large library)
          if (id.includes('pdfjs-dist')) return 'pdf-reader'

          // Animation libraries
          if (id.includes('framer-motion')) return 'motion'

          // Template chunks — split large template files
          if (id.includes('NewTemplates'))       return 'templates-new'
          if (id.includes('ProTemplates'))       return 'templates-pro'
          if (id.includes('templates/templates')) return 'templates-pro'

          // Supabase client — single chunk for caching
          if (id.includes('@supabase')) return 'supabase'
        },
      },
    },
  },

  server: {
    proxy: {
      '/api/openai': {
        target     : 'https://api.openai.com',
        changeOrigin: true,
        rewrite    : (p) => p.replace(/^\/api\/openai/, ''),
      },
    },
  },

  // Pre-bundle these for faster dev server startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      'zustand/middleware',
      'lucide-react',
      'clsx',
    ],
    // Exclude pdfjs-dist from pre-bundling — it ships with its own worker
    // that uses dynamic imports incompatible with Vite's pre-bundling step.
    exclude: ['pdfjs-dist'],
  },

  // Allow the PDF.js worker to be resolved from node_modules
  worker: {
    format: 'es',
  },
})
