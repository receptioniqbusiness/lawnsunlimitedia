import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        services: 'services.html',
        pools: 'pools.html',
        gallery: 'gallery.html',
        about: 'about.html',
        contact: 'contact.html',
        meetTheFamily: 'meet-the-family.html'
      }
    }
  }
})
