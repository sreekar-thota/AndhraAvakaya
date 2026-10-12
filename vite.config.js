import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { handleApiRequest } from './server/apiHandler.js';

/**
 * Custom Vite plugin to handle /api requests during local development
 */
function stockApiPlugin() {
  return {
    name: 'andhra-avakaya-stock-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const handled = await handleApiRequest(req, res);
          if (!handled) {
            next();
          }
        } catch (err) {
          next(err);
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables (.env) and expose them to Node process
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, val] of Object.entries(env)) {
    process.env[key] = val;
  }

  return {
    plugins: [react(), stockApiPlugin()]
  };
});
