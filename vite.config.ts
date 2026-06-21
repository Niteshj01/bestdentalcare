import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import https from 'https';

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

export default defineConfig(() => {
  return {
    base: "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      configureServer(server) {
        server.middlewares.use('/api/resolve-image', async (req, res) => {
          try {
            const html = await fetchHtml('https://ibb.co/4wp9kHPj');
            
            // Extract raw og:image URL from the ImgBB HTML structure
            const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                                 html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
            
            let foundUrl = ogImageMatch ? ogImageMatch[1] : null;

            if (!foundUrl) {
              const broadMatch = html.match(/(https:\/\/i\.ibb\.co\/[a-zA-Z0-9]+\/[^"'\t >\)\s]+)/i);
              if (broadMatch) {
                foundUrl = broadMatch[1];
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ url: foundUrl ? foundUrl.replace(/&amp;/g, '&') : null }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      }
    },
  };
});
