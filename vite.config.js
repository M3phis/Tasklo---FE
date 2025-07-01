import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../Tasklo---BE/public',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_LOCAL': JSON.stringify(process.env.VITE_LOCAL),
  },
  server: {
    hmr: {
      overlay: {
        warnings: false,
      },
    },
  },
})
