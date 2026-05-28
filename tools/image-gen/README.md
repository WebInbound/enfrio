# image-gen — batch generation of site images

Two ways to use this for the Enfrio site (or any future site). Pick one based on what you've got.

---

## Path A — Manual, with ChatGPT Plus (no API key, no setup)

1. Open `prompts.md` in the repo root.
2. For each entry, copy the prompt block into ChatGPT (with GPT-4o image generation enabled).
3. For 🖼️ image-to-image entries, **also attach the original image** from `public/assets/images/site/<filename>` so the model knows the composition.
4. Download the result and save it back into `public/assets/images/site/` with the **same filename** as in the prompt block. No code changes needed.
5. Commit + push.

This works fine, just slower (≈2 min per image, ~75 min total). Counts against the ChatGPT Plus monthly limits, no extra cost.

---

## Path B — Automatic, with an OpenAI API key (~$4 total, 15-20 min)

Prereqs:
- Node 18+ installed
- An OpenAI API key from <https://platform.openai.com/api-keys> (separate from ChatGPT Plus — different billing)
- A few dollars of credit on the OpenAI account: <https://platform.openai.com/settings/organization/billing>

Setup (one-time per machine):

1. Copy `.env.example` to `.env` in this folder (`tools/image-gen/.env`).
2. Paste your key inside:
   ```
   OPENAI_API_KEY="sk-..."
   ```
3. The `.env` is gitignored, it stays local.

Run from the repo root:

```bash
node tools/image-gen/generate.mjs --manifest ./images.json --project-root .
```

What it does:
- Reads `images.json` (the manifest with all 38 image specs)
- For each entry, calls OpenAI gpt-image-1 (text-to-image or image edits depending on `mode`)
- Saves the result to `public/assets/images/site/<filename>`
- Writes a sidecar `<filename>.prompt.txt` so you remember what prompt produced each image (gitignored)

The script is idempotent: existing files are skipped. To re-roll a single image:

```bash
node tools/image-gen/generate.mjs --manifest ./images.json --project-root . \
  --only "hero-main.jpg" --force
```

Other useful flags:
- `--dry-run` — show plan + total cost, no API calls
- `--quality high|medium|low|auto` — override quality globally
- `--only file1.jpg,file2.jpg` — only these filenames

## Cost (May 2025)

| Size | low | medium | high |
|---|---|---|---|
| 1024×1024 | $0.011 | $0.042 | $0.167 |
| 1024×1536 | $0.016 | $0.063 | $0.250 |
| 1536×1024 | $0.016 | $0.063 | $0.250 |

The current `images.json` is sized for ~$4 total (9 hero shots at `high`, 29 secondary at `medium`).

## How the manifest works

See `manifest.schema.json` for the full reference. Key fields:

- `filename` — output file, saved at `outputDir/<filename>`
- `mode` — `"t2i"` (text-to-image) or `"i2i"` (image edit, refines the source)
- `sourcePath` — required when `mode=i2i`. Path to existing image relative to project root.
- `size` — `1024x1024`, `1024x1536`, `1536x1024`, or `auto`
- `quality` — `low` | `medium` | `high` | `auto`
- `background: "transparent"` + `format: "png"` for transparent PNGs (used by `mtower-render.png`)
- `prompt` — the actual creative prompt. The `globalStyle` from the top of the manifest is prepended automatically.

To add a new image, append an entry to the `images` array. To re-run only the new ones, pass `--only newfile.jpg`.

## Adapting for the next site

This whole `tools/image-gen/` folder is project-agnostic. To use it on a different site:
1. Copy `tools/image-gen/` to the new project.
2. Create a new `images.json` at the new project's root.
3. Same setup, same commands. No code change.

A user-level Claude Code skill version is also installed at `~/.claude/skills/image-gen/` (Christopher's machine) — that one is triggered automatically by Claude Code when you ask "genera le immagini del sito".
