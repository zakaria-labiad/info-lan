const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function isAllowedMediaUpload(file: { type: string; size: number }) {
  return allowedImageTypes.has(file.type) && file.size > 0 && file.size <= 8 * 1024 * 1024;
}
