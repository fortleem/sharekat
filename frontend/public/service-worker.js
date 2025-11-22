// Service Worker for Sherketi PWA
const CACHE_NAME = 'sherketi-v1'
const OFFLINE_URL = '/offline.html'

// Files to cache on install
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard',
  '/projects',
  '/ai',
  '/investments',
  '/payments',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/notifications',
  '/offline.html',
  '/styles/globals.css',
  '/_next/static/css/app/layout.css',
  '/_next/static/css/app/page.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Pre-caching offline page')
        return cache.add(OFFLINE_URL)
      })
      .then(() => {
        console.log('Service Worker: Pre-caching app shell')
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(FILES_TO_CACHE)
        })
      })
      .then(() => {
        console.log('Service Worker: Skip waiting')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  const cacheAllowlist = [CACHE_NAME]
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
    .then(() => {
      console.log('Service Worker: Claiming clients')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve cached files when offline
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Ignore external requests
  if (new URL(event.request.url).origin !== location.origin) {
    return
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL)
        })
    )
    return
  }

  // Handle API requests with special offline handling
  if (event.request.url.includes('/api/') || event.request.url.includes('/payments/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // For payment-related requests, show offline payment page
          if (event.request.url.includes('/payments/')) {
            return caches.match('/offline-payment.html')
          }
          // For other API requests, return empty response
          return new Response(JSON.stringify({ offline: true }), {
            headers: { 'Content-Type': 'application/json' }
          })
        })
    )
    return
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Service Worker: Returning cached response for', event.request.url)
          return cachedResponse
        }

        console.log('Service Worker: Fetching from network for', event.request.url)
        return fetch(event.request.clone())
          .then((response) => {
            // Clone the response to cache it while returning the original
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone()
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache)
                  console.log('Service Worker: Caching new response for', event.request.url)
                })
            }
            return response
          })
          .catch((error) => {
            console.error('Service Worker: Network request failed', error)
            return new Response('Offline mode - some features may be limited', {
              status: 503,
              statusText: 'Service Unavailable'
            })
          })
      })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received')
  
  let title = 'Sherketi Notification'
  let options = {
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      timestamp: Date.now()
    }
  }

  if (event.data) {
    try {
      const data = event.data.json()
      title = data.title || title
      options = {
        ...options,
        body: data.body || options.body,
        icon: data.icon || options.icon,
        badge: data.badge || options.badge,
        data: {
          ...options.data,
          url: data.url || '/',
          type: data.type || 'general'
        }
      }
    } catch (error) {
      console.error('Service Worker: Error parsing push data', error)
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received')
  
  event.notification.close()
  
  let url = '/'
  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open app in new tab if not already open
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Background sync event for failed payments
self.addEventListener('sync', (event) => {
  if (event.tag === 'failed-payment') {
    console.log('Service Worker: Background sync for failed payment')
    
    event.waitUntil(
      // In a real implementation, this would retry the payment API call
      new Promise((resolve) => {
        setTimeout(() => {
          console.log('Service Worker: Payment sync completed')
          resolve()
        }, 2000)
      })
    )
  }
})

// Periodic cache cleanup
setInterval(() => {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      if (cacheName !== CACHE_NAME) {
        caches.delete(cacheName)
        console.log('Service Worker: Periodic cleanup - deleted cache', cacheName)
      }
    })
  })
}, 24 * 60 * 60 * 1000) // Run every 24 hours

console.log('Service Worker: Registered successfully')
