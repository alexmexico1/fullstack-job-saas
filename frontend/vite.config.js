import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Check if the dependency originates from node_modules
          if (id.includes('node_modules')) {
            // Isolate recharts and d3 modules into their own separate file
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            // Put other standard core dependencies somewhere else
            return 'vendor-core';
          }
        },
      },
    },
  },
});