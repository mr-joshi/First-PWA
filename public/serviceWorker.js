const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

const self = this;
let isOnline = true;
let offlineQueue = [];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request)
                        .then((networkResponse) => {
                            const clonedResponse = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, clonedResponse);
                                });
                            return networkResponse;
                        })
                        .catch(() => {
                            return caches.match('offline.html');
                        });
                })
        );
    } else if (event.request.method === 'POST') {
        event.respondWith(
            fetch(event.request.clone())
                .then((response) => {
                    return response;
                })
                .catch(() => {
                    if (isOnline) {
                        offlineQueue.push(event.request.clone());
                    }
                    return new Response('Offline request queued.');
                })
        );
    }
});

self.addEventListener('online', (event) => {
    isOnline = true;
    event.waitUntil(
        sendOfflineRequests()
    );
});

self.addEventListener('offline', (event) => {
    isOnline = false;
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});

function sendOfflineRequests() {
    if (offlineQueue.length === 0) {
        return Promise.resolve();
    }

    const requests = offlineQueue.map((request) => {
        return fetch(request.clone())
            .then(() => {
                const index = offlineQueue.indexOf(request);
                if (index !== -1) {
                    offlineQueue.splice(index, 1);
                }
            });
    });

    return Promise.all(requests);
}
