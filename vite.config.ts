import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables from the current directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/shodan': {
          target: 'https://api.shodan.io',
          changeOrigin: true,
          rewrite: (path) => {
            const cleanPath = path.replace(/^\/api\/shodan/, '');
            const separator = cleanPath.includes('?') ? '&' : '?';
            const apiKey = env.VITE_SHODAN_API_KEY || '';
            return `${cleanPath}${separator}key=${apiKey}`;
          }
        }
      }
    }
  }
})
