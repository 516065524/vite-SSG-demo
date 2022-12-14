import { Plugin } from "vite";
import { RouteService } from "./RouteService";

export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
}

interface PluginOptions {
  root: string;
}

export const CONVENTIONAL_ROUTE_ID = "island:routes";

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);
  return {
    name: "island:routes",
    async configResolved() {
      await routeService.init();
    },
    resolveId(id: string) {
      return "\0" + id;
    },
    load(id: string) {
      if (id === "\0" + CONVENTIONAL_ROUTE_ID) {
        return `export const routes = []`;
      }
    }
  };
}
