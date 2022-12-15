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
async function createDevServer(root, restart) {
  const config = await _chunkAY7BB6AJjs.resolveConfig.call(void 0, root, "serve", "development");
  console.log({ config });
  return _vite.createServer.call(void 0, {
    root: _chunkTARFW24Ujs.PACKAGE_ROOT,
    plugins: [pluginIndexHtml(), _pluginreact2.default.call(void 0, ), _chunkTARFW24Ujs.pluginConfig.call(void 0, config, restart)],
    server: {
      fs: {
        allow: [_chunkTARFW24Ujs.PACKAGE_ROOT]
      }
    }
  });
}


exports.createDevServer = createDevServer;
