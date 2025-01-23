import { serve } from "bun";

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Generate CSS if it's requested but doesn't exist
    if (url.pathname === "/dist/output.css") {
      await Bun.build({
        entrypoints: ['./src/index.css'],
        outdir: './dist',
        plugins: [
          {
            name: 'tailwind',
            setup(build) {
              build.onLoad({ filter: /\.css$/ }, async () => {
                const { stdout } = await Bun.spawn(['bunx', 'tailwindcss', '-i', './src/index.css', '-o', './dist/output.css']);
                return { contents: await new Response(stdout).text() };
              });
            },
          },
        ],
      });
    }

    // Handle TypeScript/React files
    if (url.pathname.endsWith('.tsx') || url.pathname.endsWith('.ts')) {
      const file = await Bun.file(url.pathname.slice(1)).text();
      const result = await Bun.build({
        entrypoints: [url.pathname.slice(1)],
        format: 'esm',
      });
      return new Response(result.outputs[0], {
        headers: { 'Content-Type': 'application/javascript' },
      });
    }

    // Serve static files
    if (url.pathname.startsWith("/dist/")) {
      return new Response(Bun.file(url.pathname.slice(1)));
    }

    // Default to serving index.html
    return new Response(Bun.file("index.html"));
  },
});

console.log("Server running at http://localhost:3000"); 