import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/worldcup2026/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,xml,json}'],
        runtimeCaching: [{
          urlPattern: /^https?:\/\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'external-resources',
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            networkTimeoutSeconds: 5,
          },
        }],
      },
      manifest: {
        name: 'World Cup 2026 世界盃',
        short_name: 'WC2026',
        description: 'FIFA World Cup 2026 世界盃 – schedule, groups, standings, ViuTV free matches',
        theme_color: '#1a4b8c',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/worldcup2026/',
        icons: [
          { src: '/worldcup2026/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/worldcup2026/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
