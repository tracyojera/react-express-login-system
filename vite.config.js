import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3001',
      '/logout': 'http://localhost:3001',
      '/profile': 'http://localhost:3001',
      '/register': 'http://localhost:3001'
    }
  }
})
