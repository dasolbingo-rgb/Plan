/* Study Planner 오프라인용: 인터넷이 되면 항상 최신 파일을 받고, 안 되면 마지막으로 받은 파일로 연다 */
const CACHE = "study-planner-v1";
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./"]).catch(() => {})));
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
      return res;
    }).catch(() =>
      caches.match(r, { ignoreSearch: true }).then(m => m || (r.mode === "navigate" ? caches.match("./") : undefined))
    )
  );
});
