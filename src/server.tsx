import React from 'react';
import { serve } from "bun";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

async function handler(req: Request) {
  const url = new URL(req.url);

  // Handle static files
  if (url.pathname.includes('.')) {
    try {
      const file = Bun.file(url.pathname.slice(1));
      return new Response(file);
    } catch (e) {
      return new Response('Not found', { status: 404 });
    }
  }

  // Handle React app routes
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React App</title>
      <link href="/dist/output.css" rel="stylesheet">
  </head>
  <body>
      <div id="root">${renderToString(
        <StaticRouter location={url.pathname}>
          <App />
        </StaticRouter>
      )}</div>
      <script src="/dist/index.js" type="module"></script>
  </body>
  </html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

// Only start the server when running locally with Bun
if (import.meta.main && process.env.NODE_ENV !== 'production') {
  const server = serve({
    port: 3000,
    fetch: handler
  });
  
  console.log(`Server running at http://localhost:${server.port}`);
}

export default handler; 