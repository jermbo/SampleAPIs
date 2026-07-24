import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Must come before the React plugin so it can transform route files.
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
})
