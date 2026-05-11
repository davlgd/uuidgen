import { GENERATORS_META, type GeneratorMeta } from "./generators.ts";
import { SITE } from "./config.ts";

function idCard({ label, type, description, placeholder }: GeneratorMeta): string {
  return `
    <section class="card" data-type="${type}">
      <div class="card-header">
        <h2>${label}</h2>
        <div class="card-actions">
          <button type="button" class="btn-icon" data-gen="${type}" aria-label="Regenerate ${label}" title="Regenerate">
            <svg class="icon-refresh" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
              <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v2h-2"/>
            </svg>
          </button>
          <button type="button" class="btn-icon" data-copy="${type}" aria-label="Copy ${label} value" title="Copy">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="5" y="5" width="9" height="9" rx="1.5"/>
              <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/>
            </svg>
          </button>
        </div>
      </div>
      <code id="${type}" class="value" aria-live="polite" aria-busy="true">${placeholder}</code>
      <p class="desc">${description}</p>
    </section>`;
}

function detailBlock({ label, detail }: GeneratorMeta): string {
  return `<div class="def"><dt>${label}</dt><dd>${detail}</dd></div>`;
}

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": SITE.title,
  "url": SITE.url,
  "description": SITE.description,
  "author": { "@type": "Person", "name": SITE.author },
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "featureList": GENERATORS_META.map((g) => `${g.label} generation`),
});

export function html(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0e1014" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#fbfaf6" media="(prefers-color-scheme: light)">
<meta name="description" content="${SITE.description}">
<meta name="author" content="${SITE.author}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE.url}">
<meta property="og:title" content="${SITE.title}">
<meta property="og:description" content="${SITE.description}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${SITE.title}">
<meta name="twitter:description" content="${SITE.description}">
<link rel="canonical" href="${SITE.url}">
<link rel="stylesheet" href="/styles.css">
<title>${SITE.title} — UUID v4, v7, ULID, Nano ID</title>
<script type="application/ld+json">${JSON_LD}</script>
</head>
<body>
  <main>
    <header>
      <h1>${SITE.title}</h1>
      <p class="subtitle">Server-side unique identifiers using cryptographic randomness. One click to copy.</p>
    </header>
    <div class="grid">
      ${GENERATORS_META.map(idCard).join("")}
      <button type="button" class="btn-all" id="gen-all">Regenerate All</button>
    </div>
    <details class="about">
      <summary>About these formats</summary>
      <dl>${GENERATORS_META.map(detailBlock).join("")}</dl>
    </details>
  </main>
  <footer>
    <p class="cross-link">Do you know <a href="https://uuid_altenc.cleverapps.io/" target="_blank" rel="noopener">alt uuid encoding methods</a>?</p>
    <p class="api-hint">No data is stored or logged, also available through CLI:</p>
    <pre><code id="curl-hint">curl -H "Accept: application/json" ${SITE.url}/
curl -H "Accept: text/yaml" ${SITE.url}/</code></pre>
    <p class="credit">Written with <span class="heart" aria-hidden="true">♥</span> by <a href="https://www.davlgd.fr" target="_blank" rel="noopener">davlgd</a>. It's <a href="https://github.com/davlgd/uuidgen" target="_blank" rel="noopener">open source</a> software.</p>
  </footer>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
  <script src="/client.js" defer></script>
</body>
</html>`;
}
