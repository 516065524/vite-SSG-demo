import {
  __dirname
} from "./chunk-26HVH7DZ.mjs";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var RUNTIME_PATH = join(PACKAGE_ROOT, "src", "runtime");
var CLIENT_ENTRY_PATH = join(RUNTIME_PATH, "client-entry.tsx");
var SERVER_ENTRY_PATH = join(RUNTIME_PATH, "ssr-entry.tsx");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "template.html");

// src/node/plugin-island/config.ts
import { relative, join as join2 } from "path";
var SITE_DATA_ID = "island:site-data";
function pluginConfig(config, restart) {
  let server = null;
  return {
    name: "island:config",
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return "\0" + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    config() {
      return {
        resolve: {
          alias: {
            "@runtime": join2(PACKAGE_ROOT, "src", "runtime", "index.ts")
          }
        }
      };
    },
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath];
      const include = (id) => customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(
          `
${relative(config.root, ctx.file)} changed, restarting server...`
        );
      }
      await restart();
    }
  };
}

export {
  PACKAGE_ROOT,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  DEFAULT_HTML_PATH,
  pluginConfig
};
