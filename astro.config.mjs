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
      noExternal: ['@giscus/react', 'fuse.js', 'date-fns']
    },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'search-vendor': ['fuse.js', '@giscus/react'],
            'date-vendor': ['date-fns'],
            'vendor': []
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
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug', 'rehype-autolink-headings'],
    gfm: true,
    shikiConfig: {
      theme: 'github-light'
    }
  }
});