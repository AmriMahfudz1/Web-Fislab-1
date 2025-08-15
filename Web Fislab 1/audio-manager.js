// Advanced Audio Manager for FISLAB Website
// Provides continuous audio playback across page navigation with service worker support

class AudioManager {
    constructor() {
        this.audio = null;
        this.controlBtn = null;
        this.speakerOnIcon = null;
        this.speakerOffIcon = null;
        this.isPlaying = false;
        this.serviceWorker = null;
        this.isServiceWorkerSupported = 'serviceWorker' in navigator;
        this.audioContext = null;
        this.audioSource = null;
        this.audioBuffer = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        await this.registerServiceWorker();
        this.createAudioElement();
        this.createControlButton();
        this.setupEventListeners();
        this.setupServiceWorkerCommunication();
        this.loadAudioState();
        this.setupPageTransitionHandling();
        this.setupVisibilityHandling();
    }

    async registerServiceWorker() {
        if (!this.isServiceWorkerSupported) {
            console.log('Service Worker not supported');
            return;
        }

        try {
            this.serviceWorker = await navigator.serviceWorker.register('./audio-service-worker.js');
            console.log('Audio Service Worker registered successfully');
            
            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;
            
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }

    createAudioElement() {
        // Create audio element if it doesn't exist
        if (!document.getElementById('background-audio')) {
            this.audio = document.createElement('audio');
            this.audio.id = 'background-audio';
            this.audio.loop = true;
            this.audio.preload = 'auto';
            this.audio.crossOrigin = 'anonymous';
            
            const source = document.createElement('source');
            source.src = 'Lagu/The Land of Her Serenity - Yu-Peng Chen.mp3';
            source.type = 'audio/mpeg';
            
            this.audio.appendChild(source);
            document.body.appendChild(this.audio);
        } else {
            this.audio = document.getElementById('background-audio');
        }

        // Set initial volume
        this.audio.volume = 0.7;
    }

    createControlButton() {
        // Create control button if it doesn't exist
        if (!document.getElementById('audio-control')) {
            this.controlBtn = document.createElement('button');
            this.controlBtn.id = 'audio-control';
            this.controlBtn.className = 'audio-control';
            this.controlBtn.setAttribute('aria-label', 'Toggle audio');
            
            this.controlBtn.innerHTML = `
                <svg class="icon speaker-on" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.74 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <svg class="icon speaker-off" viewBox="0 0 24 24" aria-hidden="true" style="display: none;">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 5L9.27 7.73 12 10.46V5z"/>
                </svg>
            `;
            
            document.body.appendChild(this.controlBtn);
        } else {
            this.controlBtn = document.getElementById('audio-control');
        }

        // Get icon references
        this.speakerOnIcon = this.controlBtn.querySelector('.speaker-on');
        this.speakerOffIcon = this.controlBtn.querySelector('.speaker-off');
    }

    setupEventListeners() {
        this.controlBtn.addEventListener('click', () => {
            this.toggle();
        });

        // Handle audio events
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateButtonState();
            this.saveAudioState();
        });

        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateButtonState();
            this.saveAudioState();
        });

        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateButtonState();
            this.saveAudioState();
        });

        // Save current time periodically
        this.audio.addEventListener('timeupdate', () => {
            if (this.isPlaying) {
                localStorage.setItem('fislab-audio-time', this.audio.currentTime.toString());
            }
        });

        // Handle volume changes
        this.audio.addEventListener('volumechange', () => {
            localStorage.setItem('fislab-audio-volume', this.audio.volume.toString());
        });

        // Handle audio loading
        this.audio.addEventListener('canplaythrough', () => {
            this.isInitialized = true;
            this.restoreAudioState();
        });
    }

    setupServiceWorkerCommunication() {
        if (!this.isServiceWorkerSupported) return;

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'AUDIO_STATE_SYNC') {
                this.syncAudioState(event.data);
            }
        });

        // Request current audio state from service worker
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'GET_AUDIO_STATE'
            });
        }
    }

    syncAudioState(state) {
        // Sync audio state from service worker
        if (state.currentTime !== undefined) {
            this.audio.currentTime = state.currentTime;
        }
        
        if (state.volume !== undefined) {
            this.audio.volume = state.volume;
        }
        
        if (state.isPlaying !== undefined && state.isPlaying !== this.isPlaying) {
            if (state.isPlaying) {
                this.play();
            } else {
                this.pause();
            }
        }
    }

    setupPageTransitionHandling() {
        // Intercept navigation clicks to save audio state
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#')) {
                // Navigation link clicked, save audio state
                this.saveAudioState();
                
                // Add a small delay to ensure state is saved before navigation
                setTimeout(() => {
                    // Allow navigation to proceed
                }, 100);
            }
        });

        // Handle form submissions
        document.addEventListener('submit', () => {
            this.saveAudioState();
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.saveAudioState();
        });
    }

    setupVisibilityHandling() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, save current state
                this.saveAudioState();
            } else {
                // Page is visible again, restore state if needed
                setTimeout(() => {
                    this.restoreAudioState();
                }, 100);
            }
        });

        // Handle beforeunload to save state
        window.addEventListener('beforeunload', () => {
            this.saveAudioState();
        });

        // Handle page focus/blur
        window.addEventListener('focus', () => {
            this.restoreAudioState();
        });

        window.addEventListener('blur', () => {
            this.saveAudioState();
        });
    }

    loadAudioState() {
        // Load audio state from localStorage
        const audioState = localStorage.getItem('fislab-audio');
        const savedTime = localStorage.getItem('fislab-audio-time');
        const savedVolume = localStorage.getItem('fislab-audio-volume');
        
        // Restore volume
        if (savedVolume) {
            this.audio.volume = parseFloat(savedVolume);
        }
        
        // Restore position
        if (savedTime) {
            this.audio.currentTime = parseFloat(savedTime);
        }
        
        // Restore play state
        if (audioState === 'playing') {
            // Delay play to ensure page is fully loaded and user interaction has occurred
            setTimeout(() => {
                this.play();
            }, 1000);
        }
    }

    saveAudioState() {
        // Save comprehensive audio state
        const audioState = {
            isPlaying: this.isPlaying,
            currentTime: this.audio.currentTime,
            volume: this.audio.volume,
            timestamp: Date.now()
        };
        
        localStorage.setItem('fislab-audio', this.isPlaying ? 'playing' : 'paused');
        localStorage.setItem('fislab-audio-time', this.audio.currentTime.toString());
        localStorage.setItem('fislab-audio-volume', this.audio.volume.toString());
        localStorage.setItem('fislab-audio-state', JSON.stringify(audioState));
        
        // Send state to service worker
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'AUDIO_STATE_UPDATE',
                ...audioState
            });
        }
    }

    restoreAudioState() {
        const savedState = localStorage.getItem('fislab-audio-state');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                const timeDiff = Date.now() - state.timestamp;
                
                // Only restore if the state is recent (within 5 minutes)
                if (timeDiff < 300000) {
                    this.audio.currentTime = state.currentTime;
                    this.audio.volume = state.volume;
                    
                    // Restore play state if it was playing
                    if (state.isPlaying && !this.isPlaying && this.isInitialized) {
                        this.play();
                    }
                }
            } catch (e) {
                console.log('Error restoring audio state:', e);
            }
        }
    }

    play() {
        if (!this.isInitialized) {
            // Wait for audio to be ready
            this.audio.addEventListener('canplaythrough', () => {
                this.play();
            }, { once: true });
            return;
        }

        // Store current time before playing
        const currentTime = this.audio.currentTime;
        
        this.audio.play().catch(e => {
            console.log('Audio play failed:', e);
            // If autoplay fails, don't update state
            return;
        });
        
        this.isPlaying = true;
        this.updateButtonState();
        this.saveAudioState();
    }

    pause() {
        // Store current time when pausing
        localStorage.setItem('fislab-audio-time', this.audio.currentTime.toString());
        
        this.audio.pause();
        this.isPlaying = false;
        this.updateButtonState();
        this.saveAudioState();
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updateButtonState() {
        if (this.isPlaying) {
            this.controlBtn.classList.add('playing');
            this.speakerOnIcon.style.display = 'none';
            this.speakerOffIcon.style.display = 'block';
        } else {
            this.controlBtn.classList.remove('playing');
            this.speakerOnIcon.style.display = 'block';
            this.speakerOffIcon.style.display = 'none';
        }

    }

    // Public method to check if audio is playing
    getPlayingState() {
        return this.isPlaying;
    }

    // Public method to set volume
    setVolume(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
        this.saveAudioState();
    }

    // Public method to get current time
    getCurrentTime() {
        return this.audio.currentTime;
    }

    // Public method to seek to specific time
    seekTo(time) {
        this.audio.currentTime = time;
        this.saveAudioState();
    }

    // Public method to get audio duration
    getDuration() {
        return this.audio.duration;
    }

    // Public method to check if audio is ready
    isReady() {
        return this.isInitialized;
    }
}

// Initialize audio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS styles if they don't exist
    if (!document.getElementById('audio-control-styles')) {
        const style = document.createElement('style');
        style.id = 'audio-control-styles';
        style.textContent = `
            /* Audio Control Styles */
            .audio-control {
                position: fixed;
                top: 6px;
                right: 60px;
                z-index: 10000;
                background: transparent;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                border: transparent;
            }

            .audio-control:hover {
                transform: scale(1.1);
            }

            .audio-control.playing {
                background: transparent;
                border-color: #fff;
            }

            .audio-control svg {
                width: 24px;
                height: 24px;
                fill:rgb(0, 0, 0);
                transition: all 0.3s ease;
            }

            .audio-control.playing svg {
                fill:rgb(0, 0, 0);
            }

            .audio-control .speaker-off {
                display: none;
            }

            .audio-control.playing .speaker-off {
                display: block;
            }

            .audio-control.playing .speaker-on {
                display: none;
            }

            /* Dark mode audio control */
            body.dark .audio-control {
                background: transparent;
                border-color: transparent;
            }

            body.dark .audio-control svg {
                fill: #cfa330;
            }

            body.dark .audio-control.playing {
                background: transparent;
                border-color: transparent;
            }

            body.dark .audio-control.playing svg {
                fill: #cfa330;
            }

            /* Hide audio control during loading screen */
            #loading-screen.active ~ #audio-control {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Create and initialize audio manager
    window.fislabAudio = new AudioManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
