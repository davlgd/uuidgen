export const PORT = Number(Bun.env.PORT) || 8080;

export const SITE = {
  url: Bun.env.SITE_URL?.trim() || `http://localhost:${PORT}`,
  title: "UUID & ID Generator",
  description: "Generate UUID v4, UUID v7, ULID and Nano ID instantly. One-click copy — no tracking, no dependencies.",
  author: "davlgd",
} as const;

export const CONTENT_TYPES = {
  html: "text/html; charset=utf-8",
  json: "application/json; charset=utf-8",
  yaml: "text/yaml; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  text: "text/plain; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
} as const;

export const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "no-referrer",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-site",
};

export const CACHE_DYNAMIC = "no-store";
export const CACHE_STATIC = "public, max-age=3600";
