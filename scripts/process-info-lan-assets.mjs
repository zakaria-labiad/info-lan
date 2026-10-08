import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const root = process.cwd();
const input = path.join(root, ".codex-temp", "info-lan-assets");

const photos = [
  ["hero.jpg", "public/images/home/info-lan-hero.webp", 2400, 1350],
  ["equipment.jpg", "public/images/home/info-lan-equipment.webp", 1600, 1067],
  ["installation.jpg", "public/images/home/info-lan-installation.webp", 1600, 1067],
  ["maintenance.jpg", "public/images/home/info-lan-maintenance.webp", 1600, 1067],
  ["team.jpg", "public/images/about/info-lan-team.webp", 1200, 1500],
];

for (const [source, destination, width, height] of photos) {
  const output = path.join(root, destination);
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(path.join(input, source))
    .rotate()
    .resize(width, height, { fit: "cover", position: "attention" })
    .webp({ quality: 72, effort: 6 })
    .toFile(output);
}

const logoSource =
  "C:/Users/User/AppData/Local/Temp/codex-clipboard-a443f9a9-8dd4-4657-a12a-620d8d18f462.png";
const { data, info } = await sharp(logoSource)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const visited = new Uint8Array(info.width * info.height);
const queue = new Int32Array(info.width * info.height);
let head = 0;
let tail = 0;

function enqueue(pixel) {
  if (visited[pixel]) return;
  visited[pixel] = 1;
  queue[tail++] = pixel;
}

for (let x = 0; x < info.width; x += 1) {
  enqueue(x);
  enqueue((info.height - 1) * info.width + x);
}
for (let y = 0; y < info.height; y += 1) {
  enqueue(y * info.width);
  enqueue(y * info.width + info.width - 1);
}

while (head < tail) {
  const pixel = queue[head++];
  const offset = pixel * info.channels;
  const isConnectedBlack =
    data[offset] <= 45 && data[offset + 1] <= 45 && data[offset + 2] <= 45;

  if (!isConnectedBlack) continue;
  data[offset + 3] = 0;

  const x = pixel % info.width;
  const y = Math.floor(pixel / info.width);
  if (x > 0) enqueue(pixel - 1);
  if (x + 1 < info.width) enqueue(pixel + 1);
  if (y > 0) enqueue(pixel - info.width);
  if (y + 1 < info.height) enqueue(pixel + info.width);
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: info.channels,
  },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize({ width: 1400, withoutEnlargement: true })
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(root, "public/images/info-lan-logo.webp"));
