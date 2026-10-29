/**
 * Myth Rx: Busting Health Hoaxes
 * Lightweight, Zero-Dependency Dual-Stack Local Static HTTP Server
 * Supports IPv4 and IPv6 (localhost / 127.0.0.1 / [::1])
 * Provides clean HTTP 302 redirects for /admin and clean routes.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function resolveFilePath(reqUrl) {
  const parsed = new URL(reqUrl, 'http://localhost');
  let pathname = decodeURIComponent(parsed.pathname || '/');

  // Strip trailing slash unless root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // 1. Root index shortcut
  if (pathname === '/' || pathname === '') {
    return path.join(ROOT, 'index.html');
  }

  // Prevent path traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let fullPath = path.join(ROOT, safePath);

  // 2. Exact file match
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const idx = path.join(fullPath, 'index.html');
      if (fs.existsSync(idx)) return idx;
    } else {
      return fullPath;
    }
  }

  // 3. Clean URLs: Try appending .html
  if (!path.extname(fullPath)) {
    const htmlPath = fullPath + '.html';
    if (fs.existsSync(htmlPath)) {
      return htmlPath;
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  const parsed = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(parsed.pathname || '/');
  const search = parsed.search || '';

  // 1. HTTP 302 Redirects for Admin Desk aliases
  const adminAliases = ['/admin', '/admin/', '/admin-desk', '/admin-desk/', '/admindesk', '/admin.html'];
  if (adminAliases.includes(pathname)) {
    res.writeHead(302, { 'Location': '/admin/index.html' + search });
    res.end();
    return;
  }

  // 2. HTTP 302 Redirects for other admin sections
  if (pathname === '/articles' || pathname === '/articles/') {
    res.writeHead(302, { 'Location': '/admin/articles.html' + search });
    res.end();
    return;
  }
  if (pathname === '/submissions' || pathname === '/submissions/') {
    res.writeHead(302, { 'Location': '/admin/submissions.html' + search });
    res.end();
    return;
  }
  if (['/new-investigation', '/editor', '/publish'].includes(pathname)) {
    res.writeHead(302, { 'Location': '/admin/new-investigation.html' + search });
    res.end();
    return;
  }

  // 3. Resolve static file
  const resolved = resolveFilePath(req.url);

  if (!resolved) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>404 Not Found — Myth Rx</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F8F5EF;font-family:sans-serif;text-align:center;padding:2rem;">
        <div style="background:#FFF;padding:2.5rem;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.06);max-width:480px;border-top:4px solid #00A896;">
          <h1 style="color:#17212B;font-size:1.8rem;margin-bottom:0.5rem;">404 — Page Not Found</h1>
          <p style="color:#65717D;margin-bottom:1.5rem;">The requested URL could not be located on the Myth Rx server.</p>
          <a href="/" style="display:inline-block;background:#00A896;color:#FFF;padding:0.6rem 1.25rem;border-radius:6px;text-decoration:none;font-weight:600;">Return to Homepage</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  const ext = path.extname(resolved).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Internal Server Error: ${err.message}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(data)
    });

    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(data);
    }
  });
});

// Dual-stack listening (IPv4 + IPv6 localhost supported)
server.listen(PORT, () => {
  const addr = server.address();
  console.log(`[Myth Rx] Server successfully running at:`);
  console.log(`  - Local:      http://localhost:${PORT}`);
  console.log(`  - IPv4:       http://127.0.0.1:${PORT}`);
  console.log(`  - Admin Desk: http://localhost:${PORT}/admin/index.html`);
  console.log(`  - Bound to:   ${JSON.stringify(addr)}`);
});
