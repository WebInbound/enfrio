"""
Background removal for the new M Tower render.

Pipeline:
  1. Try birefnet-general / isnet-general-use first (best alpha matting
     on industrial product-style renders — clean edges, transparent
     interior gaps through the structural mesh).
  2. Fall back to the default u2net if the better models can't be
     fetched. u2net is bundled with rembg's base install.
  3. Trim the resulting transparent canvas down to the unit's bounding
     box + a small breathing margin, so layouts don't have to fight a
     huge empty halo of fully-transparent pixels.

Outputs:
  - public/assets/images/site/mtower-render.png  (overwrites the canonical)
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "assets" / "images" / "site" / "mtower-new-source.jpg"
DST = ROOT / "public" / "assets" / "images" / "site" / "mtower-render.png"

# Model priority. The first that succeeds wins. If isnet/birefnet model
# files aren't cached, rembg auto-downloads them on demand — falls back
# to u2net if the download fails offline.
MODEL_CANDIDATES = ("isnet-general-use", "u2net")


def remove_bg(source: Path) -> Image.Image:
    img = Image.open(source).convert("RGBA")
    last_err: Exception | None = None
    for model in MODEL_CANDIDATES:
        try:
            print(f"[bg-remove] trying model={model}...", file=sys.stderr)
            session = new_session(model)
            out = remove(img, session=session, alpha_matting=False, post_process_mask=True)
            print(f"[bg-remove] model={model} OK", file=sys.stderr)
            return out
        except Exception as e:  # noqa: BLE001
            print(f"[bg-remove] model={model} failed: {e}", file=sys.stderr)
            last_err = e
            continue
    raise RuntimeError(f"All models failed; last error: {last_err}")


def crop_to_subject(im: Image.Image, padding: int = 16) -> Image.Image:
    """Crop transparent margins down to the alpha bounding box (+ padding)."""
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    alpha = im.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(im.width, right + padding)
    bottom = min(im.height, bottom + padding)
    return im.crop((left, top, right, bottom))


def main() -> int:
    if not SRC.exists():
        print(f"[bg-remove] source not found: {SRC}", file=sys.stderr)
        return 1

    cleaned = remove_bg(SRC)
    print(f"[bg-remove] result size before crop: {cleaned.size}", file=sys.stderr)

    cropped = crop_to_subject(cleaned, padding=20)
    print(f"[bg-remove] result size after crop:  {cropped.size}", file=sys.stderr)

    DST.parent.mkdir(parents=True, exist_ok=True)
    cropped.save(DST, format="PNG", optimize=True)
    print(f"[bg-remove] wrote {DST}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
