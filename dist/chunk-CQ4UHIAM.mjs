import {
  __dirname
} from "./chunk-6ZEXCGKN.mjs";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var RUNTIME_PATH = join(PACKAGE_ROOT, "src", "runtime");
var CLIENT_ENTRY_PATH = join(RUNTIME_PATH, "client-entry.tsx");
var SERVER_ENTRY_PATH = join(RUNTIME_PATH, "ssr-entry.tsx");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "template.html");

export {
  PACKAGE_ROOT,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  DEFAULT_HTML_PATH
};
