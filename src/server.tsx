import React from 'react';
import { serve } from "bun";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

const server = serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // Handle static files
    if (url.pathname.includes('.')) {
      try {
        const file = Bun.file(url.pathname.slice(1)); // Remove leading slash
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
        <script src="/src/index.tsx" type="module"></script>
    </body>
    </html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`Server running at http://localhost:${server.port}`); 