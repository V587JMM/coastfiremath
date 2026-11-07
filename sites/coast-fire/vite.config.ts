import { fileURLToPath } from 'node:url';
import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { publicationIssues } from './src/lib/publication';

export default defineConfig(({ command, mode }) => {
  // A misconfigured production build must not replace the indexable live site.
  if (command === 'build' && process.env.WORKERS_CI === '1' && process.env.WORKERS_CI_BRANCH === 'main') {
    const env = loadEnv(mode, process.cwd());
    const issues = publicationIssues(
      env.VITE_PUBLIC_SITE_URL || '',
      env.VITE_CONTACT_EMAIL || '',
      env.VITE_OPERATOR_NAME || '',
    );
    if (issues.length) throw new Error(`Not ready for public launch:\n${issues.join('\n')}`);
  }

  return {
    resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { host: '127.0.0.1', port: 5030, strictPort: true },
    preview: { host: '127.0.0.1', port: 5030, strictPort: true },
    plugins: [cloudflare({ viteEnvironment: { name: 'ssr' } }), tanstackStart(), viteReact()],
  };
});
