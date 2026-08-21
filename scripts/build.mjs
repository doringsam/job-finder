import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const executable = resolve(
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vinext.cmd" : "vinext",
);

const exitCode = await new Promise((resolveExit, reject) => {
  const child = spawn(executable, ["build"], {
    env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
    shell: process.platform === "win32",
    stdio: "inherit",
  });
  child.once("error", reject);
  child.once("exit", (code) => resolveExit(code ?? 1));
});

if (exitCode !== 0) process.exit(exitCode);

const workerUrl = pathToFileURL(resolve("dist", "server", "index.js"));
workerUrl.searchParams.set("static", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Static rendering failed with HTTP ${response.status}`);
await writeFile(resolve("dist", "client", "index.html"), await response.text(), "utf8");
