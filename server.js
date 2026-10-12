/**
 * Andhra Avakaya - Production Node Server
 * 
 * Runs the API endpoints and serves the compiled frontend bundle (dist/).
 * Usage:
 *   npm run build
 *   node server.js
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleApiRequest } from './server/apiHandler.js';

// Load .env in Node 20+ if available
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (err) {
    // Ignore if .env is missing in container environments where env vars are injected
  }
}

const PORT = parseInt(process.env.PORT || '3001', 10);
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  // 1. Try handling as /api endpoint
  const handled = await handleApiRequest(req, res);
  if (handled) return;

  // 2. Serve static files from dist
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';

  let filePath = path.join(DIST_DIR, pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // If path is a directory or file doesn't exist, fallback to index.html (SPA routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('Frontend dist not found. Run "npm run build" first.');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  // Cache static assets with hash in dist/assets
  if (pathname.startsWith('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.setHeader('Cache-Control', 'no-cache');
  }

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n🍛 Andhra Avakaya Server running at http://localhost:${PORT}`);
  console.log(`   Admin Login: http://localhost:${PORT}/admin`);
  console.log(`   API Status:  http://localhost:${PORT}/api/stock\n`);
});
