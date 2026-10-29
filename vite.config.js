import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

const backendDirectory = fileURLToPath(new URL('./backend', import.meta.url))

export default defineConfig(({ mode }) => {
  const { PORT: backendPort = '3001' } = loadEnv(mode, backendDirectory, 'PORT')
  const backendTarget = `http://localhost:${process.env.PORT || backendPort}`

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/login': backendTarget,
        '/logout': backendTarget,
        '/profile': backendTarget,
        '/register': backendTarget
      }
    }
  }
})
