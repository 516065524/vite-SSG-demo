"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/node/constants/index.ts
var _path = require('path');
var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var RUNTIME_PATH = _path.join.call(void 0, PACKAGE_ROOT, "src", "runtime");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, RUNTIME_PATH, "client-entry.tsx");
var SERVER_ENTRY_PATH = _path.join.call(void 0, RUNTIME_PATH, "ssr-entry.tsx");
var DEFAULT_HTML_PATH = _path.join.call(void 0, PACKAGE_ROOT, "template.html");






exports.PACKAGE_ROOT = PACKAGE_ROOT; exports.CLIENT_ENTRY_PATH = CLIENT_ENTRY_PATH; exports.SERVER_ENTRY_PATH = SERVER_ENTRY_PATH; exports.DEFAULT_HTML_PATH = DEFAULT_HTML_PATH;
