import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, 
      },
      manifest: {
        name: 'Ticklr',
        short_name: 'Ticklr',
        description: 'Ticklr is a tickler file app',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone', 
        icons: [
          {
            src: '/ticklrLogo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/ticklrLogo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
