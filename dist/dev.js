"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }




var _chunkTARFW24Ujs = require('./chunk-TARFW24U.js');


var _chunkAY7BB6AJjs = require('./chunk-AY7BB6AJ.js');

// src/node/dev.ts
var _vite = require('vite');

// src/node/plugin-island/indexHtml.ts
var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
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
              src: `/@fs/${_chunkTARFW24Ujs.CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await _fsextra2.default.readFile(_chunkTARFW24Ujs.DEFAULT_HTML_PATH, "utf-8");
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
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);

// src/node/plugin-routes/RouteService.ts
var _fastglob = require('fast-glob'); var _fastglob2 = _interopRequireDefault(_fastglob);

var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var RouteService = class {
  #scanDir;
  #routeData = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  async init() {
    const files = _fastglob2.default.sync(["**/*.{js.jsx,ts,tsx,md,mdx}"], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ["**/node_modules/**", "**/build/**", "config.ts"]
    }).sort();
    files.forEach((file) => {
      const fileRelativePath = _vite.normalizePath.call(void 0, 
        _path2.default.relative(this.#scanDir, file)
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
  const config = await _chunkAY7BB6AJjs.resolveConfig.call(void 0, root, "serve", "development");
  console.log({ config });
  return _vite.createServer.call(void 0, {
    root: _chunkTARFW24Ujs.PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      _pluginreact2.default.call(void 0, ),
      _chunkTARFW24Ujs.pluginConfig.call(void 0, config, restart),
      pluginRoutes({ root: config.root })
    ],
    server: {
      fs: {
        allow: [_chunkTARFW24Ujs.PACKAGE_ROOT]
      }
    }
  });
}


exports.createDevServer = createDevServer;
