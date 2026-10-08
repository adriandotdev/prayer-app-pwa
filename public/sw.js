/* Ora service worker — hand-written, no libraries.
 *
 * Strategy
 *  - Install: precache the offline page and the Rosary (page HTML plus the
 *    JS/CSS it references), so the Rosary works fully offline after one visit.
 *  - Static assets (/_next/static, icons, fonts): cache-first.
 *  - Page navigations: network-first, falling back to cache, then /offline.
 *  - Sign-out: the page asks us to drop cached signed-in pages (see clearPrivatePages).
 *  - Everything else (Supabase, /api, /auth, non-GET): left to the network.
 */
const VERSION = "v4";
const STATIC_CACHE = `ora-static-${VERSION}`;
const PAGE_CACHE = `ora-pages-${VERSION}`;
const PRECACHE_PAGES = ["/offline", "/rosary", "/"];
// Signed-in areas: cached as they are visited, and dropped again on sign-out.
const PRIVATE_PREFIXES = ["/prayers", "/collections", "/intentions", "/profile"];

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
    [...assets, "/brand/icon-192.png", "/brand/icon-512.png"].map(async (url) => {
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

self.addEventListener("message", (event) => {
  if (event.data?.type === "clear-private-pages") event.waitUntil(clearPrivatePages());
  if (event.data?.type === "cache-page") event.waitUntil(cachePage(event.data.url));
});

// In-app link taps are client-side navigations the fetch handler never sees, so the page
// reports where it is and we store a fresh copy, making visited pages work offline.
async function cachePage(path) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return;
  try {
    const res = await fetch(path, { credentials: "same-origin" });
    // A redirect (e.g. signed out -> /login) must never be stored under the original URL.
    if (res.ok && !res.redirected && res.type === "basic") {
      await (await caches.open(PAGE_CACHE)).put(path, res);
    }
  } catch {
    /* offline: nothing to refresh */
  }
}

async function clearPrivatePages() {
  const cache = await caches.open(PAGE_CACHE);
  for (const request of await cache.keys()) {
    const path = new URL(request.url).pathname;
    if (PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) await cache.delete(request);
  }
}

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
    url.pathname.startsWith("/brand/") ||
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
    if (res.ok && !res.redirected && res.type === "basic") cache.put(request, res.clone());
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
