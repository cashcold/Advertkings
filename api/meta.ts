import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// Pre-baked HTML template fallback in case filesystem read is unavailable in edge/serverless container
const FALLBACK_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AdKings VIP - Advertising Network &amp; HYIP Monitor</title>
    <meta name="title" content="AdKings VIP - Advertising Network &amp; HYIP Monitor" />
    <meta name="description" content="Verified HYIP paying monitor, VVIP betting tips, crypto loans &amp; live VIP signals." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{{ORIGIN}}/" />
    <meta property="og:site_name" content="AdKings VIP" />
    <meta property="og:title" content="AdKings VIP - Advertising Network &amp; HYIP Monitor" />
    <meta property="og:description" content="Verified HYIP paying monitor, VVIP betting tips, crypto loans &amp; live VIP signals." />
    <meta property="og:image" content="{{ORIGIN}}/og-banner.jpg" />
    <meta property="og:image:secure_url" content="{{ORIGIN}}/og-banner.jpg" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="AdKings VIP Luxury Gold Crown &amp; Crypto Network" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="{{ORIGIN}}/" />
    <meta name="twitter:title" content="AdKings VIP - Advertising Network &amp; HYIP Monitor" />
    <meta name="twitter:description" content="Verified HYIP paying monitor, VVIP betting tips, crypto loans &amp; live VIP signals." />
    <meta name="twitter:image" content="{{ORIGIN}}/og-banner.jpg" />
    <meta name="twitter:image:alt" content="AdKings VIP Luxury Gold Crown &amp; Crypto Network" />
    <link rel="image_src" href="{{ORIGIN}}/og-banner.jpg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Determine the exact protocol and host of the incoming request
  const forwardedHost = req.headers['x-forwarded-host'];
  const host = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.headers['host'] || 'advkings.vercel.app';

  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto || (host.includes('localhost') ? 'http' : 'https');

  const origin = `${proto}://${host}`;

  let html = '';

  // Attempt to read the compiled dist/index.html or root index.html
  try {
    const distPath = path.join(process.cwd(), 'dist', 'index.html');
    if (fs.existsSync(distPath)) {
      html = fs.readFileSync(distPath, 'utf-8');
    } else {
      const srcPath = path.join(process.cwd(), 'index.html');
      if (fs.existsSync(srcPath)) {
        html = fs.readFileSync(srcPath, 'utf-8');
      }
    }
  } catch (err) {
    console.warn('Could not read index.html from disk, using fallback template:', err);
  }

  if (!html) {
    html = FALLBACK_HTML;
  }

  // Dynamically replace any hardcoded URLs with the caller's live origin
  const dynamicHtml = html
    .replaceAll('https://advkings.vercel.app', origin)
    .replaceAll('https://adkings.vercel.app', origin)
    .replaceAll('http://localhost:3000', origin)
    .replaceAll('{{ORIGIN}}', origin);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Allow social bots and browsers to cache, but revalidate within 10 minutes
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(dynamicHtml);
}
