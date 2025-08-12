import fs from "node:fs";

import express from "express";
import pretty from "pretty";
import { createServer as createViteServer, ViteDevServer } from "vite";

const PORT = 5173;
const isDev = process.env.NODE_ENV === "development";

async function createServer() {
  const start = Date.now();
  const app = express();
  let vite: ViteDevServer | undefined;

  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
    // app.use("/", express.static("./dist/client"));
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use("/", sirv("./dist/client", { extensions: [] }));
  }

  app.use("*all", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;
      let render: (url: string) => Promise<string>;

      if (isDev && vite) {
        template = fs.readFileSync("./index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
      } else {
        template = fs.readFileSync("./dist/client/index.html", "utf-8");
        render = (await import("./dist/server/entry-server.js")).render;
      }

      const appHtml = await render(url);

      const html = template.replace("<!--ssr-outlet-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(pretty(html));
    } catch (e) {
      if (vite) {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  app.listen(PORT, () => {
    const elapsed = Date.now() - start;

    console.log(`\n  VYNN v0.0.0  ready in ${elapsed} ms\n`);
    console.log(`  ➜  Local:   \x1b[36mhttp://localhost:${PORT}/\x1b[0m`);
    console.log(`  ➜  Network: use --host to expose`);
    console.log(`  ➜  press h + enter to show help\n`);
  });
}

createServer();
