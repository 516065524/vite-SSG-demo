import {
  CLIENT_ENTRY_PATH,
  DEFAULT_HTML_PATH,
  PACKAGE_ROOT,
  pluginConfig
} from "./chunk-XGGYMCXG.mjs";
import {
  resolveConfig
} from "./chunk-26HVH7DZ.mjs";

// src/node/dev.ts
import { createServer } from "vite";

// src/node/plugin-island/indexHtml.ts
import fs from "fs-extra";
function pluginIndexHtml() {
  return {
    name: "island:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await fs.readFile(DEFAULT_HTML_PATH, "utf-8");
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/dev.ts
import pluginReact from "@vitejs/plugin-react";

// src/node/plugin-routes/RouteService.ts
import fastGlob from "fast-glob";
import { normalizePath } from "vite";
import path from "path";
var RouteService = class {
  #scanDir;
  #routeData = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  async init() {
    const files = fastGlob.sync(["**/*.{js.jsx,ts,tsx,md,mdx}"], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ["**/node_modules/**", "**/build/**", "config.ts"]
    }).sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, file)
      );
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        routePath,
        absolutePath: file
      });
    });
  }
  getRouteMeta() {
    return this.#routeData;
  }
  normalizeRoutePath(rawPath) {
    const routePath = rawPath.replace(/\.(.*)?$/, "").replace(/index$/, "");
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }
  generateRoutesCode() {
    return `
      import React form 'react';
      import loadable form '@loadable/component';
      ${this.#routeData.map((route, index) => {
      return `const Route${index} = loadable(() => import('${route.absolutePath}'))`;
    }).join("\n")}
      export const routes = [
        ${this.#routeData.map((route, index) => {
      return `{path: '${route.routePath}', element: React.createElement(Route${index})}`;
    }).join(",\n")}
      ]
    `;
  }
};

// src/node/plugin-routes/index.ts
var CONVENTIONAL_ROUTE_ID = "island:routes";
function pluginRoutes(options) {
  const routeService = new RouteService(options.root);
  return {
    name: "island:routes",
    async configResolved() {
      await routeService.init();
    },
    resolveId(id) {
      return "\0" + id;
    },
    load(id) {
      if (id === "\0" + CONVENTIONAL_ROUTE_ID) {
        return `export const routes = []`;
      }
    }
  };
}

// src/node/dev.ts
async function createDevServer(root, restart) {
  const config = await resolveConfig(root, "serve", "development");
  console.log({ config });
  return createServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restart),
      pluginRoutes({ root: config.root })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
export {
  createDevServer
};
