import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db';
import { app } from './server/app';

const PORT = 3000;

// ----------------------------------------------------
// SERVER INITIALIZATION & VITE MIDDLEWARE
// ----------------------------------------------------
async function startServer() {
  // Connect to MongoDB Atlas Adkings database
  await connectDB();

  // Explicit static file serving for public directory (ensures social bots always get 200 OK + correct MIME)
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (/\.(jpg|jpeg)$/i.test(filePath)) {
        res.setHeader('Content-Type', 'image/jpeg');
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800');
    }
  }));

  // Dynamic OpenGraph SSR for social crawlers (Telegram, WhatsApp, Twitter, Facebook, etc.)
  app.use((req, res, next) => {
    const isBot = /TelegramBot|Twitterbot|facebookexternalhit|WhatsApp|LinkedInBot|Discordbot|Slackbot|SkypeUriPreview/i.test(req.get('user-agent') || '');
    if (isBot && !req.path.startsWith('/api') && !/\.[a-zA-Z0-9]+$/.test(req.path)) {
      const host = req.get('host') || 'localhost:3000';
      const proto = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      const origin = `${proto}://${host}`;

      try {
        const indexPath = path.join(process.cwd(), 'index.html');
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, 'utf-8');
          html = html
            .replaceAll('https://advkings.vercel.app', origin)
            .replaceAll('https://adkings.vercel.app', origin)
            .replaceAll('http://localhost:3000', origin);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600');
          return res.send(html);
        }
      } catch (e) {
        console.warn('Bot SSR fallback to next:', e);
      }
    }
    next();
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const host = req.get('host') || 'localhost:3000';
      const proto = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      const origin = `${proto}://${host}`;
      try {
        const indexPath = path.join(distPath, 'index.html');
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = html
          .replaceAll('https://advkings.vercel.app', origin)
          .replaceAll('https://adkings.vercel.app', origin)
          .replaceAll('http://localhost:3000', origin);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600');
        res.send(html);
      } catch {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AdKings Serverless/API Engine running on http://0.0.0.0:${PORT}`);
    console.log(`📡 API Catalog live at http://0.0.0.0:${PORT}/api`);
  });
}

startServer();

export default app;
