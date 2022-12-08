import path from "path";
import fse from "fs-extra";
import * as execa from "execa";

const exampleDir = path.resolve(__dirname, "../e2e/playground/basic");

const defaultOptions = {
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

const Root = path.resolve(__dirname, "..");

async function prepareE2E() {
  if (!fse.existsSync(path.resolve(__dirname, "../dist"))) {
    // pnpm build
    execa.commandSync("pnpm build", {
      cwd: Root,
      ...defaultOptions
    });
  }

  execa.commandSync("npx playwright install", {
    cwd: Root,
    ...defaultOptions
  });

  execa.commandSync("pnpm dev", {
    cwd: exampleDir,
    ...defaultOptions
  });
}

prepareE2E();
