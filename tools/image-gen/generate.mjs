#!/usr/bin/env node
/**
 * image-gen — batch image generator using OpenAI gpt-image-1.
 *
 * Usage:
 *   node generate.mjs --manifest <path/to/images.json> [--project-root <dir>]
 *                     [--only file1.jpg,file2.jpg] [--force] [--dry-run]
 *                     [--quality low|medium|high|auto]
 *
 * Reads ~/.claude/skills/image-gen/.env for OPENAI_API_KEY.
 *
 * Supports text-to-image and image-to-image (edits) on gpt-image-1.
 * Writes a sidecar <filename>.prompt.txt next to each output for traceability.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve, basename, extname } from "node:path";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";

// ────────────────────────────────────────────────────────────────────────────
// .env loader (minimal, no deps)
// ────────────────────────────────────────────────────────────────────────────
async function loadEnv(envPath) {
  try {
    const content = await readFile(envPath, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
      if (!m) continue;
      let value = m[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = value;
    }
  } catch {
    /* no .env, that's OK if env is set elsewhere */
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Args + env
// ────────────────────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    manifest: { type: "string", short: "m" },
    "output-dir": { type: "string", short: "o" },
    "project-root": { type: "string", short: "p" },
    only: { type: "string" },
    force: { type: "boolean", short: "f", default: false },
    "dry-run": { type: "boolean", default: false },
    quality: { type: "string" },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (args.help) {
  console.log(
    `image-gen — batch image generator (OpenAI gpt-image-1)

Required:
  --manifest <path>      Path to images.json

Optional:
  --project-root <dir>   Root for resolving relative paths (default: cwd)
  --output-dir <dir>     Override manifest.outputDir
  --only a.jpg,b.jpg     Generate only these filenames
  --force                Overwrite existing files (default: skip)
  --dry-run              Print plan + cost, do not call the API
  --quality lvl          Override quality globally (low|medium|high|auto)
  --help                 This help

Env:
  OPENAI_API_KEY — read from ~/.claude/skills/image-gen/.env or process env
`
  );
  process.exit(0);
}

const skillDir = dirname(fileURLToPath(import.meta.url));
await loadEnv(join(skillDir, ".env"));

const apiKey = process.env.OPENAI_API_KEY;

if (!args.manifest) {
  console.error("❌ Missing --manifest <path/to/images.json>");
  process.exit(1);
}

if (!apiKey && !args["dry-run"]) {
  console.error(
    "❌ OPENAI_API_KEY not set. Add it to " +
      join(skillDir, ".env") +
      ' as:\n   OPENAI_API_KEY="sk-..."'
  );
  process.exit(1);
}

const projectRoot = args["project-root"]
  ? resolve(args["project-root"])
  : process.cwd();

const manifestPath = resolve(args.manifest);
let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch (e) {
  console.error(`❌ Failed to read manifest ${manifestPath}: ${e.message}`);
  process.exit(1);
}

const outputDir = args["output-dir"]
  ? resolve(args["output-dir"])
  : resolve(projectRoot, manifest.outputDir || ".");

await mkdir(outputDir, { recursive: true });

const onlyFilter = args.only
  ? new Set(args.only.split(",").map((s) => s.trim()))
  : null;
const defaults = manifest.defaults || {};
const globalStyle = (manifest.globalStyle || "").trim();

// ────────────────────────────────────────────────────────────────────────────
// Cost estimate
// ────────────────────────────────────────────────────────────────────────────
// Source: OpenAI gpt-image-1 pricing (output tokens, May 2025)
// Approximate $ per image at each size+quality combination.
const COST_TABLE = {
  "1024x1024": { low: 0.011, medium: 0.042, high: 0.167, auto: 0.084 },
  "1024x1536": { low: 0.016, medium: 0.063, high: 0.25, auto: 0.125 },
  "1536x1024": { low: 0.016, medium: 0.063, high: 0.25, auto: 0.125 },
  auto: { low: 0.015, medium: 0.06, high: 0.22, auto: 0.11 },
};

function estimateCost(size, quality) {
  const s = COST_TABLE[size] || COST_TABLE.auto;
  return s[quality] ?? s.high;
}

const queue = [];
for (const item of manifest.images || []) {
  if (onlyFilter && !onlyFilter.has(item.filename)) continue;
  queue.push(item);
}

if (queue.length === 0) {
  console.log("Nothing to do. (Empty manifest or filter matched nothing.)");
  process.exit(0);
}

let totalCost = 0;
for (const item of queue) {
  const size = item.size || defaults.size || "1536x1024";
  const quality = args.quality || item.quality || defaults.quality || "high";
  totalCost += estimateCost(size, quality);
}

console.log(`\n📋 ${queue.length} image(s) queued`);
console.log(`💵 Estimated total cost: ~$${totalCost.toFixed(2)}`);
if (args["dry-run"]) {
  console.log("\n— DRY RUN —");
  for (const item of queue) {
    const size = item.size || defaults.size || "1536x1024";
    const quality = args.quality || item.quality || defaults.quality || "high";
    console.log(
      `  • ${item.filename}  [${item.mode || "t2i"}, ${size}, q=${quality}]  ~$${estimateCost(size, quality).toFixed(3)}`
    );
  }
  process.exit(0);
}

// ────────────────────────────────────────────────────────────────────────────
// MIME helper
// ────────────────────────────────────────────────────────────────────────────
function mimeFromExt(p) {
  const e = extname(p).toLowerCase();
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  return "image/jpeg";
}

function formatFromFilename(filename, explicit) {
  if (explicit) return explicit;
  const e = extname(filename).toLowerCase();
  if (e === ".png") return "png";
  if (e === ".webp") return "webp";
  return "jpeg";
}

// ────────────────────────────────────────────────────────────────────────────
// Main loop
// ────────────────────────────────────────────────────────────────────────────
const results = { ok: [], skipped: [], failed: [] };

for (const item of queue) {
  const outPath = join(outputDir, item.filename);

  if (!args.force && existsSync(outPath)) {
    console.log(`⏭️  ${item.filename} exists — skipping (use --force)`);
    results.skipped.push(item.filename);
    continue;
  }

  const mode = item.mode || "t2i";
  const size = item.size || defaults.size || "1536x1024";
  const quality = args.quality || item.quality || defaults.quality || "high";
  const model = item.model || defaults.model || "gpt-image-1";
  const outputFormat = formatFromFilename(item.filename, item.format);

  const fullPrompt = [globalStyle, item.prompt].filter(Boolean).join("\n\n");

  console.log(
    `\n🎨 ${item.filename}  [${mode}, ${size}, q=${quality}, fmt=${outputFormat}]`
  );

  try {
    let response;

    if (mode === "i2i") {
      // image-to-image via /v1/images/edits
      if (!item.sourcePath) {
        throw new Error("mode=i2i but no sourcePath provided");
      }
      const sourcePath = resolve(projectRoot, item.sourcePath);
      if (!existsSync(sourcePath)) {
        throw new Error(`Source image not found: ${sourcePath}`);
      }
      const sourceBuffer = await readFile(sourcePath);
      const sourceName = basename(sourcePath);
      const sourceMime = mimeFromExt(sourcePath);

      const form = new FormData();
      form.append("model", model);
      form.append("prompt", fullPrompt);
      form.append("size", size);
      form.append("quality", quality);
      form.append("n", "1");
      if (outputFormat) form.append("output_format", outputFormat);
      if (item.background) form.append("background", item.background);

      form.append(
        "image",
        new Blob([sourceBuffer], { type: sourceMime }),
        sourceName
      );

      response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
    } else {
      // text-to-image via /v1/images/generations
      const body = {
        model,
        prompt: fullPrompt,
        size,
        quality,
        n: 1,
      };
      if (outputFormat) body.output_format = outputFormat;
      if (item.background) body.background = item.background;

      response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 400)}`);
    }

    const data = await response.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error(
        `No b64_json in response: ${JSON.stringify(data).slice(0, 400)}`
      );
    }

    const buf = Buffer.from(b64, "base64");
    await writeFile(outPath, buf);
    await writeFile(outPath + ".prompt.txt", fullPrompt, "utf8");

    const sizeKB = (buf.length / 1024).toFixed(1);
    console.log(`  ✅ saved → ${outPath} (${sizeKB} KB)`);
    results.ok.push(item.filename);
  } catch (e) {
    console.error(`  ❌ ${e.message}`);
    results.failed.push({ filename: item.filename, error: e.message });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Summary
// ────────────────────────────────────────────────────────────────────────────
console.log(`\n📊 Summary:`);
console.log(`  ✅ ${results.ok.length} generated`);
console.log(`  ⏭️  ${results.skipped.length} skipped`);
console.log(`  ❌ ${results.failed.length} failed`);

if (results.failed.length) {
  console.log("\nFailures:");
  for (const f of results.failed) {
    console.log(`  • ${f.filename}: ${f.error}`);
  }
  process.exit(1);
}
