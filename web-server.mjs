import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.WEB_PORT ?? process.env.PORT ?? 3000);
const DIST_DIR = path.resolve(process.cwd(), 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function safeResolveFromDist(urlPathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPathname);
  } catch {
    return null;
  }
  const cleaned = decoded.replace(/\0/g, '');
  const rel = cleaned.replace(/^\/+/, '');
  const abs = path.resolve(DIST_DIR, rel);
  if (!abs.startsWith(DIST_DIR + path.sep) && abs !== DIST_DIR) return null;
  return abs;
}

function sendFile(req, res, absPath) {
  const ext = path.extname(absPath).toLowerCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(absPath).pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Method Not Allowed');
      return;
    }

    // Não expor a API por aqui; Traefik deve rotear /api e /uploads para o backend.
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/uploads')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Not Found');
      return;
    }

    // Arquivo direto
    const candidate = safeResolveFromDist(url.pathname);
    if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      sendFile(req, res, candidate);
      return;
    }

    // / -> index.html
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      sendFile(req, res, indexPath);
      return;
    }

    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('dist/index.html not found');
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[web] listening on http://localhost:${PORT}`);
});
