import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '8f6b-2a09-bac1-7a80-10-00-247-76.ngrok-free.app',
    ],
    proxy: {
      // Proxy API requests to hide the actual backend port
      '/api': {
        target: 'https://localhost:7040',
        changeOrigin: true,
        secure: false, // For development with self-signed certificates
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('API Proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending API Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received API Response:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Proxy SignalR hub
      '/reminderHub': {
        target: 'https://localhost:7040',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying for SignalR
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('SignalR Proxy error', err);
          });
          proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
            console.log('SignalR WebSocket proxy request');
          });
        },
      }
    }
  },
})
