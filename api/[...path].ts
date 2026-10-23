import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/app.js';

function normalizeUrl(reqUrl: string | undefined, query: any, headers: any): string {
  let url = reqUrl || '/api';
  if (headers && headers['x-forwarded-url']) {
    try {
      const p = new URL(String(headers['x-forwarded-url']));
      return p.pathname + p.search;
    } catch {}
  }
  const [pathname, searchStr] = url.split('?');
  if ((pathname === '/api' || pathname === '/api/' || pathname === '') && query && query.path) {
    const subpath = Array.isArray(query.path) ? query.path.join('/') : String(query.path);
    const sp = new URLSearchParams(searchStr || '');
    sp.delete('path');
    const remaining = sp.toString();
    return '/api/' + subpath + (remaining ? '?' + remaining : '');
  }
  if (!pathname.startsWith('/api')) {
    return '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname) + (searchStr ? '?' + searchStr : '');
  }
  return url;
}

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  req.url = normalizeUrl(req.url, req.query, req.headers);

  return new Promise<void>((resolve) => {
    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    res.on('finish', finish);
    res.on('close', finish);
    res.on('error', finish);

    try {
      (app as any)(req, res, (err: any) => {
        if (err && !res.headersSent) {
          console.error('Express error in Vercel function:', err);
          res.status(500).json({ success: false, error: err?.message || 'Server error' });
        }
        finish();
      });
    } catch (err: any) {
      console.error('Synchronous Express error in Vercel function:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: err?.message || 'Server error' });
      }
      finish();
    }
  });
}
