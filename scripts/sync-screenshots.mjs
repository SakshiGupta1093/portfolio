// Mirrors images from assets/screenshots/ into public/screenshots/ so Next.js can serve them.
// Runs automatically before `npm run dev` and `npm run build` (see "predev"/"prebuild"
// in package.json). public/screenshots/ is generated, so it is git-ignored.
//
// After dropping an image in assets/screenshots/, list it on the case study in
// src/data/content.ts:  screenshots: [{ src: "/screenshots/<file>", alt: "..." }]

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = join(root, "assets", "screenshots");
const dest = join(root, "public", "screenshots");
const IMAGE = /\.(png|jpe?g|webp|avif|gif)$/i;

// Start clean so images deleted from assets/ also disappear from public/.
rmSync(dest, { recursive: true, force: true });

const files = existsSync(src) ? readdirSync(src).filter((f) => IMAGE.test(f)) : [];
if (files.length === 0) {
  console.log("[screenshots] none in assets/screenshots (case studies will show the diagram only)");
} else {
  mkdirSync(dest, { recursive: true });
  for (const f of files) copyFileSync(join(src, f), join(dest, f));
  console.log(`[screenshots] copied ${files.length} image(s) to public/screenshots/`);
}
