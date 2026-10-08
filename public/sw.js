/* Ora service worker — hand-written, no libraries.
 *
 * Strategy
 *  - Install: precache the offline page and the Rosary (page HTML plus the
 *    JS/CSS it references), so the Rosary works fully offline after one visit.
 *  - Static assets (/_next/static, icons, fonts): cache-first.
 *  - Page navigations: network-first, falling back to cache, then /offline.
 *  - Everything else (Supabase, /api, /auth, non-GET): left to the network.
 */
const VERSION = "v1";
const STATIC_CACHE = `ora-static-${VERSION}`;
const PAGE_CACHE = `ora-pages-${VERSION}`;
const PRECACHE_PAGES = ["/offline", "/rosary", "/"];

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

async function precache() {
  const pages = await caches.open(PAGE_CACHE);
  const statics = await caches.open(STATIC_CACHE);
  const assets = new Set();

  await Promise.all(
    PRECACHE_PAGES.map(async (path) => {
      try {
        const res = await fetch(path, { credentials: "same-origin" });
        if (!res.ok) return;
        const html = await res.clone().text();
        await pages.put(path, res);
        for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(m[1]);
      } catch {
        /* offline during install: the runtime caches will fill in later */
      }
    }),
  );

  await Promise.all(
    [...assets, "/icons/icon-192.png", "/icons/icon-512.png"].map(async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) await statics.put(url, res);
      } catch {
        /* ignore */
      }
    }),
  );
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([STATIC_CACHE, PAGE_CACHE]);
      for (const key of await caches.keys()) {
        if (key.startsWith("ora-") && !keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const res = await fetch(request);
    if (res.ok && res.type === "basic") cache.put(request, res.clone());
    return res;
  } catch {
    return (
      (await cache.match(request)) ||
      (await cache.match(new URL(request.url).pathname)) ||
      (await cache.match("/offline")) ||
      Response.error()
    );
  }
}
