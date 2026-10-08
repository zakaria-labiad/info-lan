const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL?.trim();

  if (!configuredUrl) return new URL(FALLBACK_SITE_URL);

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return new URL(FALLBACK_SITE_URL);
    }

    return url;
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}
