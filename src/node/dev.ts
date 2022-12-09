import { createServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import { pluginConfig } from "./plugin-island/config";
import pluginReact from "@vitejs/plugin-react";
import { PACKAGE_ROOT } from "./constants";
import { resolveConfig } from "./config";

export async function createDevServer(
  root: string,
  restart: () => Promise<void>
) {
  const config = await resolveConfig(root, "serve", "development");
  console.log({ config });
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact(), pluginConfig(config, restart)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
