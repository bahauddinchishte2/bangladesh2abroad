import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

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
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
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
      fs: {
        strict: true,
      },
      host: true,
      hmr: {
        overlay: true
      }
    }
  },
  compressHTML: true,
  build: {
    format: 'file',
    assets: 'assets',
    inlineStylesheets: 'never'
  },
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
    gfm: false
  }
});