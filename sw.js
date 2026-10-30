/**
 * GeotaggingPhotos Progressive Web App - Service Worker
 * Version: geotaggingphotos-v2
 * Features: Offline app shell, Cache-First static assets, Network-First navigation with Offline Fallback, Privacy Safe (No user photos cached).
 */

const CACHE_NAME = 'geotaggingphotos-v2';

// Essential App Shell & Static Assets to Precache
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/add-geotag.html',
    '/bulk-geotagging.html',
    '/exif-viewer.html',
    '/image-location-finder.html',
    '/offline.html',
    '/styles.css',
    '/components.js',
    '/exif-parser.js',
    '/geotag-exif.js',
    '/pwa.js',
    '/manifest.json',
    '/geotaggingphotos.png',
    '/favicon.png',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-maskable-512.png',
    '/map-icon.svg',
    // External processing & UI CDN dependencies for offline fallback
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdn.jsdelivr.net/npm/piexifjs@1.0.6/piexif.min.js',
    'https://cdn.jsdelivr.net/npm/exif-js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap'
];

// Install Event - Precache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching app shell and core assets');
                return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                    console.warn('[SW] Precache partial warning:', err);
                    // Continue installation even if an optional external resource fails
                    return Promise.allSettled(
                        PRECACHE_ASSETS.map(url => cache.add(url).catch(e => console.warn(`[SW] Failed precaching ${url}:`, e)))
                    );
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Handle offline requests and caching strategy
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Never cache non-GET requests, blob URLs, data URLs, or user-uploaded photos
    if (request.method !== 'GET' || url.protocol === 'blob:' || url.protocol === 'data:') {
        return;
    }

    // Bypass known analytics and advertising requests
    if (url.hostname.includes('google-analytics.com') ||
        url.hostname.includes('googlesyndication.com') ||
        url.hostname.includes('doubleclick.net')) {
        return;
    }

    // 1. Navigation Requests (HTML pages): Network First, Fallback to Cache, then /offline.html
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Try exact match from cache first
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;
                        // Handle Vercel rewrite URLs (e.g., /add-geotag -> /add-geotag.html)
                        let htmlFallback = request.url;
                        if (!htmlFallback.endsWith('.html')) {
                            htmlFallback = htmlFallback.split('?')[0] + '.html';
                        }
                        return caches.match(htmlFallback).then((fallbackResponse) => {
                            return fallbackResponse || caches.match('/offline.html');
                        });
                    });
                })
        );
        return;
    }

    // 2. Static Assets (CSS, JS, Fonts, Images, Wasm, Workers): Cache First, Network Fallback
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version & update cache in background (Stale-While-Revalidate)
                fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, networkResponse);
                        });
                    }
                }).catch(() => { /* Offline; ignore background update failure */ });
                return cachedResponse;
            }

            // Not in cache; fetch from network and cache
            return fetch(request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });
                return networkResponse;
            });
        })
    );
});

// Handle SW Messages (e.g. SKIP_WAITING)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
