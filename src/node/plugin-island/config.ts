import { relative, join } from "path";
import { Plugin, ViteDevServer } from "vite";
import { SiteConfig } from "../../shared/types/index";
import { PACKAGE_ROOT } from "../constants/index";

const SITE_DATA_ID = "island:site-data";

export function pluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  let server: ViteDevServer | null = null;
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
            "@runtime": join(PACKAGE_ROOT, "src", "runtime", "index.ts")
          }
        }
      };
    },
    configureServer(s) {
      server = s;
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
      }
      // 重启 Dev Server
      // 方案讨论：
      // 1.插件内重启Vite的 dev server
      // 没有作用，并没有进行Island框架配置的重新读取
      //   await server.restart();
      // 2. 手动调用dev.ts中的createServer
      await restart();
    }
  };
}
