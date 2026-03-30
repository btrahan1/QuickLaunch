const CACHE_NAME = 'quicklaunch-v1.1.3';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

// Install: Cache essential assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting(); // Force update
});

// Activate: Cleanup old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) return caches.delete(key);
            }));
        })
    );
});

// Fetch: Network-First Strategy for index.html (Ensures fresh updates)
self.addEventListener('fetch', (e) => {
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
        return;
    }
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
