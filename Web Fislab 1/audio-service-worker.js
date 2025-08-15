// Audio Service Worker for FISLAB Website
// This service worker manages continuous audio playback across page navigation

const CACHE_NAME = 'fislab-audio-v1';
const AUDIO_CACHE_NAME = 'fislab-audio-cache-v1';

// Audio state management
let audioState = {
    isPlaying: false,
    currentTime: 0,
    volume: 0.7,
    timestamp: Date.now()
};

// Install event - cache audio file
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(AUDIO_CACHE_NAME).then((cache) => {
            return cache.add('Lagu/The Land of Her Serenity - Yu-Peng Chen.mp3');
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Message handling for audio state synchronization
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'AUDIO_STATE_UPDATE') {
        // Update service worker's audio state
        audioState = {
            ...audioState,
            ...event.data,
            timestamp: Date.now()
        };
        
        // Broadcast to all clients
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                if (client.id !== event.source.id) {
                    client.postMessage({
                        type: 'AUDIO_STATE_SYNC',
                        ...audioState
                    });
                }
            });
        });
    }
    
    if (event.data && event.data.type === 'GET_AUDIO_STATE') {
        // Return current audio state to requesting client
        event.ports[0].postMessage(audioState);
    }
});

// Fetch event - serve cached audio
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('The Land of Her Serenity - Yu-Peng Chen.mp3')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Handle client connections
self.addEventListener('clientconnect', (event) => {
    // Send current audio state to newly connected client
    event.client.postMessage({
        type: 'AUDIO_STATE_SYNC',
        ...audioState
    });
});

// Periodic state cleanup
setInterval(() => {
    const now = Date.now();
    if (now - audioState.timestamp > 300000) { // 5 minutes
        // Reset state if too old
        audioState = {
            isPlaying: false,
            currentTime: 0,
            volume: 0.7,
            timestamp: now
        };
    }
}, 60000); // Check every minute
