/* Ora service worker — hand-written, no libraries.
 *
 * Strategy
 *  - Install: precache the offline page and the Rosary (page HTML plus the
 *    JS/CSS it references), so the Rosary works fully offline after one visit.
 *    Install fails if /offline or /rosary can't be stored, so it is retried.
 *  - Static assets (/_next/static, icons, fonts): cache-first. The previous release's static cache
 *    is kept one release, so a tab still open on the old build can load its old chunks.
 *  - Page navigations: network-first, falling back to cache, then /offline. With a cached copy
 *    on hand, a slow network gives up after NAV_TIMEOUT_MS instead of hanging the page.
 *  - Sign-out: the page asks us to drop cached signed-in pages (see clearPrivatePages).
 *  - Everything else (Supabase, /api, /auth, non-GET): left to the network.
 */
const VERSION = "v5";
const STATIC_CACHE = `ora-static-${VERSION}`;
const PAGE_CACHE = `ora-pages-${VERSION}`;
const PRECACHE_PAGES = ["/offline", "/rosary", "/"];
// Without these the offline promise is broken, so failing to store them fails the install.
const REQUIRED_PAGES = ["/offline", "/rosary"];
const NAV_TIMEOUT_MS = 4000;
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
        if (!res.ok) throw new Error(`${path} returned ${res.status}`);
        const html = await res.clone().text();
        await pages.put(path, res);
        for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(m[1]);
      } catch (error) {
        if (REQUIRED_PAGES.includes(path)) throw error;
        /* the home page is a nicety: the runtime caches will fill it in later */
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
      const keys = await caches.keys();
      // keys() lists caches in creation order, so the last older static cache is the previous release.
      const olderStatic = keys.filter((k) => k.startsWith("ora-static-") && k !== STATIC_CACHE);
      const keep = new Set([STATIC_CACHE, PAGE_CACHE, olderStatic[olderStatic.length - 1]]);
      for (const key of keys) {
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
  const key = pageCacheKey(new URL(path, self.location.origin));
  if (!key) return;
  try {
    const res = await fetch(path, { credentials: "same-origin" });
    // A redirect (e.g. signed out -> /login) must never be stored under the original URL.
    if (res.ok && !res.redirected && res.type === "basic") {
      await (await caches.open(PAGE_CACHE)).put(key, res);
    }
  } catch {
    /* offline: nothing to refresh */
  }
}

function isPrivatePath(path) {
  return PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

// Where a page is stored, or null to skip it. Signed-in pages are keyed by path alone and a query
// (a library search, say) is never stored, so one person's searches don't pile up in the cache.
function pageCacheKey(url) {
  if (!isPrivatePath(url.pathname)) return url.href;
  return url.search ? null : url.pathname;
}

async function clearPrivatePages() {
  const cache = await caches.open(PAGE_CACHE);
  for (const request of await cache.keys()) {
    if (isPrivatePath(new URL(request.url).pathname)) await cache.delete(request);
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(event));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/brand/") ||
    /\.(?:woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(event));
  }
});

async function cacheFirst(event) {
  const { request } = event;
  // Searches every cache, so the previous release's chunks are still found after an update.
  const hit = await caches.match(request);
  if (hit) return hit;
  try {
    const res = await fetch(request);
    if (res.ok && res.type === "basic") {
      const cache = await caches.open(STATIC_CACHE);
      event.waitUntil(cache.put(request, res.clone()).catch(() => {}));
    }
    return res;
  } catch {
    return Response.error();
  }
}

async function networkFirstPage(event) {
  const { request } = event;
  const url = new URL(request.url);
  const cache = await caches.open(PAGE_CACHE);
  const cached = (await cache.match(request)) || (await cache.match(url.pathname));

  let write = Promise.resolve();
  const network = fetch(request).then((res) => {
    const key = pageCacheKey(url);
    if (key && res.ok && !res.redirected && res.type === "basic") {
      write = cache.put(key, res.clone()).catch(() => {});
    }
    return res;
  });
  // Keep the fetch and its cache write alive even when a cached copy answered first.
  event.waitUntil(network.then(() => write, () => {}));

  if (!cached) {
    try {
      return await network;
    } catch {
      return (await cache.match("/offline")) || Response.error();
    }
  }
  // A cached copy exists, so a slow connection ("lie-fi") shouldn't hold the page up.
  const timeout = new Promise((resolve) => setTimeout(resolve, NAV_TIMEOUT_MS, null));
  try {
    return (await Promise.race([network, timeout])) || cached;
  } catch {
    return cached;
  }
}
