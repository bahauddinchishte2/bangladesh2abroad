import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    react()
  ],
  site: 'https://bangladesh2abroad.com',
  vite: {
    ssr: {
      noExternal: ['@giscus/react', 'fuse.js']
    },
    build: {
      // Reduce memory usage during build
      minify: 'esbuild',
      // Split chunks into smaller pieces
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // Further optimize chunk splitting
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Group larger dependencies separately
              if (id.includes('react')) {
                return 'react-vendor';
              }
              if (id.includes('fuse.js') || id.includes('@giscus')) {
                return 'search-vendor';
              }
              if (id.includes('date-fns')) {
                return 'date-vendor';
              }
              return 'vendor';
            }
          }
        }
      }
    },
    server: {
      // Reduce memory usage in dev server too
      fs: {
        strict: true,
      }
    }
  },
  // Optimize output
  compressHTML: true,
  build: {
    format: 'file',
    assets: 'assets'
  },
  // Prevent memory issues with MDX content
  markdown: {
    remarkPlugins: [],
    rehypePlugins: []
  }
});