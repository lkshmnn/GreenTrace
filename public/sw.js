const CACHE_NAME = 'greentrace-v1.0.0';
const STATIC_CACHE_NAME = 'greentrace-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'greentrace-dynamic-v1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Core CSS and JS will be added by Vite build process
];

// API endpoints that should be cached
const CACHEABLE_API_ROUTES = [
  '/api/challenges',
  '/api/achievements',
  '/api/leaderboard/universities',
  '/api/social/feed'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extensions and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleNavigationRequest(request));
  }
});

// Handle API requests with cache-first strategy for specific endpoints
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const isCacheable = CACHEABLE_API_ROUTES.some(route => 
    url.pathname.startsWith(route)
  );
  
  if (isCacheable) {
    try {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        // Return cached version and update in background
        fetchAndCache(request, cache);
        return cachedResponse;
      }
      
      // No cache, fetch from network
      return await fetchAndCache(request, cache);
    } catch (error) {
      console.error('Service Worker: API request failed', error);
      return new Response(
        JSON.stringify({ error: 'Offline - please try again when connected' }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } else {
    // Non-cacheable API requests go directly to network
    return fetch(request);
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return await fetchAndCache(request, cache);
  } catch (error) {
    console.error('Service Worker: Image request failed', error);
    // Return a placeholder SVG for failed image requests
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#6b7280">Image unavailable</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match('/index.html');
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>GreenTrace AI - Offline</title>
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #1f2937, #374151);
            color: white;
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
          .logo { 
            font-size: 48px; 
            margin-bottom: 20px;
          }
          .message {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .submessage {
            color: #9ca3af;
            margin-bottom: 30px;
          }
          .retry-btn {
            background: linear-gradient(135deg, #10b981, #06b6d4);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="logo">🌱</div>
        <div class="message">You're offline</div>
        <div class="submessage">GreenTrace AI will sync when you're back online</div>
        <button class="retry-btn" onclick="window.location.reload()">Retry</button>
      </body>
      </html>`,
      { 
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

// Helper function to fetch and cache
async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-activities') {
    event.waitUntil(syncOfflineActivities());
  } else if (event.tag === 'sync-social-posts') {
    event.waitUntil(syncOfflineSocialPosts());
  }
});

// Sync offline activities when back online
async function syncOfflineActivities() {
  try {
    const offlineActivities = await getOfflineData('activities');
    
    for (const activity of offlineActivities) {
      try {
        await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activity)
        });
        
        // Remove from offline storage after successful sync
        await removeOfflineData('activities', activity.id);
      } catch (error) {
        console.error('Failed to sync activity:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync offline social posts when back online
async function syncOfflineSocialPosts() {
  try {
    const offlinePosts = await getOfflineData('social-posts');
    
    for (const post of offlinePosts) {
      try {
        await fetch('/api/social/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        });
        
        await removeOfflineData('social-posts', post.id);
      } catch (error) {
        console.error('Failed to sync social post:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline data management
async function getOfflineData(type) {
  try {
    const cache = await caches.open('offline-data');
    const response = await cache.match(`/offline/${type}`);
    
    if (response) {
      return await response.json();
    }
    
    return [];
  } catch (error) {
    console.error('Error getting offline data:', error);
    return [];
  }
}

async function removeOfflineData(type, id) {
  try {
    const offlineData = await getOfflineData(type);
    const updatedData = offlineData.filter(item => item.id !== id);
    
    const cache = await caches.open('offline-data');
    await cache.put(
      `/offline/${type}`,
      new Response(JSON.stringify(updatedData), {
        headers: { 'Content-Type': 'application/json' }
      })
    );
  } catch (error) {
    console.error('Error removing offline data:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'You have a new sustainability update!',
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      tag: data.tag || 'general',
      renotify: true,
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [
        {
          action: 'view',
          title: 'View',
          icon: '/icon-action-view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icon-action-dismiss.png'
        }
      ],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'GreenTrace AI', options)
    );
  } catch (error) {
    console.error('Error showing push notification:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'dismiss') {
    return;
  }
  
  let url = '/';
  
  if (action === 'view' && data.url) {
    url = data.url;
  } else if (data.type === 'challenge') {
    url = '/?section=challenges';
  } else if (data.type === 'achievement') {
    url = '/?section=achievements';
  } else if (data.type === 'social') {
    url = '/?section=social';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
    case 'CACHE_URLS':
      event.waitUntil(cacheUrls(data.urls));
      break;
    default:
      console.log('Service Worker: Unknown message type', type);
  }
});

// Cache specific URLs on demand
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    await cache.addAll(urls);
    console.log('Service Worker: URLs cached successfully');
  } catch (error) {
    console.error('Service Worker: Failed to cache URLs', error);
  }
}

console.log('Service Worker: Script loaded');
