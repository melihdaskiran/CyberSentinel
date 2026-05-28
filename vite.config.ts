import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/shodan': {
        target: 'https://api.shodan.io',
        changeOrigin: true,
        rewrite: (path) => {
          const cleanPath = path.replace(/^\/api\/shodan/, '');
          const separator = cleanPath.includes('?') ? '&' : '?';
          return `${cleanPath}${separator}key=mjAJg92EXFMzhmA2JgnUf3qDBQPrVHLK`;
        }
      }
    }
  }
})
