import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue2 from '@vitejs/plugin-vue2'
import { createHtmlPlugin as Html } from 'vite-plugin-html'
import { viteExternalsPlugin as Externals } from 'vite-plugin-externals'
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
    Externals({
      vue: 'Vue',
      vuetify: 'Vuetify',
    }, { disableInServe: true }),
    Html({
      minify: true,
      entry: 'src/main.js',
      inject: {
        data: {
          cdnCss: [
            'https://lib.baomitu.com/normalize/8.0.1/normalize.min.css',
            'https://lib.baomitu.com/vuetify/2.6.14/vuetify.min.css',
            'https://fonts.loli.net/css?family=Roboto:100,300,400,500,700,900',
          ],
          cdnJs: [
            'https://lib.baomitu.com/vue/2.6.14/vue.min.js',
            'https://lib.baomitu.com/vuetify/2.6.14/vuetify.min.js',
          ],
        },
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', '192.png', '256.png', '512.png'],
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'PixivLxns',
        short_name: 'PixivLxns',
        theme_color: '#BA68C8',
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
        // navigateFallbackDenylist: [],
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
