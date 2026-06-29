import { build } from "esbuild";
import { readFileSync, existsSync } from "fs";

function parseDotEnv(path = ".env") {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k) out[k] = v;
  }
  return out;
}

const env = parseDotEnv();
const gatewayUrl = env.GATEWAY_URL ?? process.env.GATEWAY_URL ?? "";

await build({
  entryPoints: ["src/preload.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node20",
  outfile: "dist/preload.cjs",
  external: ["electron"],
  define: {
    "process.env.GATEWAY_URL": JSON.stringify(gatewayUrl),
  },
});

