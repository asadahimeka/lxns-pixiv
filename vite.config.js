import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue2 from '@vitejs/plugin-vue2'
import { createHtmlPlugin as Html } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  plugins: [
    Vue2(),
    Html({
      minify: true,
      entry: 'src/main.js',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', '192.png', '256.png', '512.png'],
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'PixivLxns',
        short_name: 'PixivLxns',
        theme_color: '#1565c0',
        icons: [
          {
            src: '192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /.*\.css/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'css-cache', cacheableResponse: { statuses: [200] } },
          },
          {
            urlPattern: /.*\.js/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'js-cache', cacheableResponse: { statuses: [200] } },
          },
          {
            urlPattern: /.*\.(png|gif|jpg|jpeg|svg)/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              cacheableResponse: { statuses: [200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 31536000 },
            },
          },
        ],
      },
    }),
  ],
})
