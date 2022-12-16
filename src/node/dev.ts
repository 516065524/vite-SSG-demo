import { createServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import { pluginConfig } from "./plugin-island/config";
import pluginReact from "@vitejs/plugin-react";
import { PACKAGE_ROOT } from "./constants";
import { resolveConfig } from "./config";
import { pluginRoutes } from "./plugin-routes";

export async function createDevServer(
  root: string,
  restart: () => Promise<void>
) {
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
