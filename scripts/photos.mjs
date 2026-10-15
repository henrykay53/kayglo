/**
 * Site photography pipeline.  Run with:  npm run photos
 *
 * Reads the untouched originals in /images and writes web-ready copies into
 * /public. Every published photo is:
 *
 *   • stripped of metadata — phone photos carry the GPS position of the
 *     customer's property, and the raw files in /public are downloadable;
 *   • rotated upright and capped at 1600px on the long edge — next/image
 *     still serves smaller sizes, this just stops 1.3MB originals shipping;
 *   • watermarked with a small Kayglo Citadel mark, bottom right.
 *
 * ONLY ADD PHOTOS KAYGLO OWNS. Never run a stock, supplier or customer-supplied
 * image through this unless you have the right to alter it.
 *
 * The originals are never modified, so this is safe to re-run. To add a photo:
 * put the original in /images, add a line to PHOTOS, run the script, then
 * reference the /public path from lib/site.ts.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** original (in /images) → published path (in /public) */
const PHOTOS = {
  "hero.JPG": "hero/01.jpg",
  "hero2.JPG": "hero/02.jpg",
  "hero3.JPG": "hero/03.jpg",
  "project1/E1837D83-EED3-4B2B-AEB3-7903F0D4169F.JPG": "projects/ikoyi-residence/01.jpg",
  "project1/2F656E63-016C-48AE-A358-83BB35ABAD32.JPG": "projects/ikoyi-residence/02.jpg",
  "project1/8F9024A7-F246-4835-9DBC-2864A2B58BB2.JPG": "projects/ikoyi-residence/03.jpg",
  "project2/C532EEFE-708C-4434-B943-0B46B65AAC0A.JPG": "projects/maitama-office/01.jpg",
  "project2/5010109E-CD1A-4198-ADC0-CC62E60651CF.JPG": "projects/maitama-office/02.jpg",
  "project2/28ECB9ED-2978-4541-BFBF-A1F9B3699E82.JPG": "projects/maitama-office/03.jpg",
  "project2/9DC0B3DB-A435-4BEC-926B-9F9D5397D767.JPG": "projects/maitama-office/04.jpg",
  "project3/16E4A611-113C-49FB-BFBD-44BB1920DC60.JPG": "projects/lekki-smart-home/01.jpg",
  "project3/50CFD736-C613-4279-9038-DFA9B35A2777.JPG": "projects/lekki-smart-home/02.jpg",
  "project 4/99D725DC-5CC2-4E43-B4BD-C5E9420ABA1F.JPG": "projects/surulere-residence/01.jpg",
  "project 4/57EB0CB7-0DB0-4A72-A39B-6E864965B7FC.JPG": "projects/surulere-residence/02.jpg",
};

const MAX_EDGE = 1600;
const BRAND = "KAYGLO CITADEL";

/**
 * The mark: the logo glyph and the name, in white with a soft shadow so it
 * reads on sky and on dark roofs alike. Sized to the photo, never dominant.
 *
 * It sits 10% up and 6% in from the bottom-right corner. Both are deliberate:
 * far enough in to clear the frames' rounded corners, and inside the band a
 * 5:4 card crops off a portrait photo — so there it leaves view cleanly
 * instead of being sliced in half.
 */
function watermark(width, height) {
  const unit = Math.round(Math.min(width, height) * 0.03); // glyph size
  const font = Math.round(unit * 0.52);
  const textWidth = Math.round(font * 0.9 * BRAND.length);
  const w = unit + Math.round(unit * 0.45) + textWidth;
  const h = unit;
  const left = width - Math.round(width * 0.06) - w;
  const top = height - Math.round(height * 0.1) - h;

  const c = unit / 2;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const r1 = c * 0.69;
    const r2 = c * 0.91;
    return `<line x1="${c + Math.cos(a) * r1}" y1="${c + Math.sin(a) * r1}" x2="${c + Math.cos(a) * r2}" y2="${c + Math.sin(a) * r2}" />`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><filter id="s" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="${unit * 0.12}" flood-color="#000" flood-opacity="0.55"/></filter></defs>
  <g filter="url(#s)" opacity="0.72" fill="none" stroke="#fff" stroke-width="${unit * 0.065}" stroke-linecap="round">
    <circle cx="${c}" cy="${c}" r="${c * 0.44}" />
    <circle cx="${c}" cy="${c}" r="${c * 0.15}" fill="#fff" stroke="none" />
    ${rays}
    <text x="${unit + unit * 0.45}" y="${c + font * 0.36}" fill="#fff" stroke="none"
      font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="600"
      font-size="${font}" letter-spacing="${font * 0.18}">${BRAND}</text>
  </g>
</svg>`;
  return { input: Buffer.from(svg), left, top };
}

let saved = 0;
for (const [src, dest] of Object.entries(PHOTOS)) {
  const from = path.join(root, "images", src);
  const to = path.join(root, "public", dest);

  // Upright first, so width/height below are the ones the visitor sees.
  const upright = await sharp(from)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });

  const { width, height } = upright.info;
  await mkdir(path.dirname(to), { recursive: true });
  const out = await sharp(upright.data)
    .composite([watermark(width, height)])
    // No .withMetadata() — EXIF, GPS and camera data are all dropped.
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(to);

  saved += out.size;
  console.log(`${dest.padEnd(40)} ${width}×${height}  ${Math.round(out.size / 1024)} KB`);
}
console.log(`\n${Object.keys(PHOTOS).length} photos, ${Math.round(saved / 1024)} KB total`);
