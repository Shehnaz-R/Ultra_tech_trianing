/**
 * UltraTech Training Portal - Local Static Server
 * Runs with agy-node.cmd server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';

  const filePath = path.join(BASE_DIR, reqUrl);

  // Security check: ensure path is within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routes if file not found
      const indexPath = path.join(BASE_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

// Auto-compile React source if build.js and src exist
try {
  if (fs.existsSync(path.join(BASE_DIR, 'src')) && fs.existsSync(path.join(BASE_DIR, 'build.js'))) {
    const { build } = require('./build.js');
    build();
  }
} catch (e) {
  console.warn('[Server] Auto-build skipped:', e.message);
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
    console.error(`👉 Run on another port: $env:PORT=3001; agy-node.cmd server.js`);
    console.error(`👉 Or close the existing server process using: Stop-Process -Name Antigravity\n`);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` UltraTech Training Portal Server Live:`);
  console.log(` http://localhost:${PORT}`);
  console.log(` Base Directory: ${BASE_DIR}`);
  console.log(`=======================================================`);
});
