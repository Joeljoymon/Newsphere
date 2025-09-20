import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    VitePWA({
       registerType: "autoUpdate",
       workbox: {
         runtimeCaching: [
           {
           // Cache API calls to your backend
            urlPattern: /^http:\/\/localhost:5000\/api\/news/,
            handler: "NetworkFirst", // Try network first, else fallback to cache
            options: {
            cacheName: "news-cache",
            expiration: {
            maxEntries: 50, // only keep 50 news responses
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
        },
      },
    ],
  },
      manifest:{
         name: "Newssphere",
        short_name: "News",
        description: "Personalized News App built with React",
        theme_color: "#0ea5e9", // Tailwind sky-500
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        "icons": [
    {
      "src": "icons/News-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    {
      "src": "icons/News-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/News-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/News-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/News-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/News-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/News-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/News-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "icons/News-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/News-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
      },
    })
  ],
})
