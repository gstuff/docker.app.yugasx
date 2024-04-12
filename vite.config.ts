import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import dotenv from 'dotenv';
// Load environment variables from .env file
//dotenv.config();

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 8080,
    strictPort: true,
    host: true,
//    origin: "/",
  }
})
