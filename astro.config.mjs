import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wuguangzhou.github.io',
  base: '/',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': '/src' },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
