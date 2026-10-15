import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Agar URL mein '/uploads' ya '/api' aaye, toh use seedha backend (5000) par bhej do
      '/uploads': 'http://localhost:5000',
      '/api': 'http://localhost:5000'
    }
  }
});