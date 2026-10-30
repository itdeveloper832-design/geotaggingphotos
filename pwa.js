/**
 * GeotaggingPhotos Progressive Web App (PWA) Central Controller
 * Handles Service Worker registration, beforeinstallprompt, install buttons (header, footer, mobile),
 * sidebar prompt notification with cooldown, iOS install workflow, and real-time offline status indicator.
 */

(function () {
    let deferredInstallPrompt = null;
    const DISMISS_COOLDOWN_DAYS = 7;

    // Detect execution mode
    function isStandalone() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches ||
            navigator.standalone === true ||
            document.referrer.includes('android-app://')
        );
    }

    function isIOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream;
    }

    // Initialize Service Worker
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then((reg) => {
                        console.log('[PWA] ServiceWorker registered with scope:', reg.scope);
                        reg.onupdatefound = () => {
                            const installingWorker = reg.installing;
                            if (installingWorker) {
                                installingWorker.onstatechange = () => {
                                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        console.log('[PWA] New content is available; please refresh.');
                                    }
                                };
                            }
                        };
                    })
                    .catch((err) => {
                        console.warn('[PWA] ServiceWorker registration failed:', err);
                    });
            });
        }
    }

    // Network Status Indicator Management
    function updateNetworkStatus() {
        const isOnline = navigator.onLine;
        const badges = document.querySelectorAll('.network-status-pill');

        badges.forEach(badge => {
            if (isOnline) {
                badge.className = 'network-status-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
                badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>Online</span>`;
            } else {
                badge.className = 'network-status-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
                badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span><span>Offline — Local processing available</span>`;
            }
        });
    }

    // Centralized PWA Trigger
    window.triggerPwaInstall = function () {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            deferredInstallPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('[PWA] User accepted installation prompt');
                    hideAllInstallPrompts();
                } else {
                    console.log('[PWA] User dismissed installation prompt');
                    setDismissCooldown();
                }
                deferredInstallPrompt = null;
            });
        } else if (isIOS()) {
            showIosInstallModal();
        } else {
            showBrowserInstallHelpModal();
        }
    };

    function hideAllInstallPrompts() {
        const headerBtns = document.querySelectorAll('#header-install-btn, #mobile-install-btn, #footer-install-btn');
        headerBtns.forEach(btn => {
            if (btn) btn.classList.add('hidden');
        });
        const sidebar = document.getElementById('pwa-install-sidebar');
        if (sidebar) sidebar.classList.add('hidden');
    }

    function showInstallButtons() {
        if (isStandalone()) {
            hideAllInstallPrompts();
            return;
        }
        const headerBtns = document.querySelectorAll('#header-install-btn, #mobile-install-btn, #footer-install-btn');
        headerBtns.forEach(btn => {
            if (btn) btn.classList.remove('hidden');
        });
    }

    function setDismissCooldown() {
        const expiry = Date.now() + (DISMISS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
        localStorage.setItem('pwa_dismissed_until', expiry.toString());
    }

    function isDismissed() {
        const until = localStorage.getItem('pwa_dismissed_until');
        if (!until) return false;
        return Date.now() < parseInt(until, 10);
    }

    // Sidebar Notification Component Injection (Guaranteed bottom-right floating position)
    function setupSidebarNotification() {
        if (isStandalone() || isDismissed()) return;

        // Create right-side notification element if missing
        if (!document.getElementById('pwa-install-sidebar')) {
            const sidebarHtml = `
            <div id="pwa-install-sidebar" style="position: fixed !important; bottom: 24px !important; right: 24px !important; left: auto !important; top: auto !important; z-index: 99999 !important; max-width: 360px !important; width: calc(100% - 32px) !important; margin: 0 !important; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important; transform: translateY(30px) !important; opacity: 0 !important; pointer-events: none !important;">
                <div class="glass-card bg-surface/95 dark:bg-surface-container-high/95 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-secondary/30 shadow-2xl space-y-3 relative overflow-hidden">
                    <div class="absolute -top-12 -right-12 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <img src="/geotaggingphotos.png" alt="GeoTaggingPhotos Logo" class="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-white/20" />
                            <div>
                                <h4 class="font-bold text-primary text-base leading-snug">Install App</h4>
                                <p class="text-xs text-on-surface-variant">Install GeotaggingPhotos for fast access &amp; offline photo processing.</p>
                            </div>
                        </div>
                        <button onclick="window.dismissSidebar()" class="text-on-surface-variant hover:text-primary p-1 rounded-lg transition-colors cursor-pointer shrink-0" aria-label="Close notification">
                            <span class="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                    <div class="flex items-center gap-2 pt-1">
                        <button onclick="window.triggerPwaInstall()" class="gradient-btn flex-1 py-2 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
                            <span class="material-symbols-outlined text-base">download</span>
                            Install App
                        </button>
                        <button onclick="window.dismissSidebar()" class="py-2 px-3 rounded-xl border border-outline-variant hover:bg-white/10 text-on-surface-variant font-medium text-xs transition-colors cursor-pointer">
                            Not now
                        </button>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', sidebarHtml);
        }

        // Display after brief delay
        setTimeout(() => {
            const sidebar = document.getElementById('pwa-install-sidebar');
            if (sidebar && !isStandalone() && !isDismissed()) {
                sidebar.style.setProperty('transform', 'translateY(0)', 'important');
                sidebar.style.setProperty('opacity', '1', 'important');
                sidebar.style.setProperty('pointer-events', 'auto', 'important');
            }
        }, 1500);
    }

    window.dismissSidebar = function () {
        const sidebar = document.getElementById('pwa-install-sidebar');
        if (sidebar) {
            sidebar.style.setProperty('transform', 'translateY(30px)', 'important');
            sidebar.style.setProperty('opacity', '0', 'important');
            sidebar.style.setProperty('pointer-events', 'none', 'important');
            setTimeout(() => {
                if (sidebar) sidebar.remove();
            }, 450);
        }
        setDismissCooldown();
    };

    // iOS Help Modal
    function showIosInstallModal() {
        const existing = document.getElementById('ios-pwa-modal');
        if (existing) existing.remove();

        const modalHtml = `
        <div id="ios-pwa-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div class="glass-card max-w-sm w-full bg-surface p-6 rounded-2xl border border-white/30 shadow-2xl space-y-4 text-center">
                <img src="/geotaggingphotos.png" alt="Logo" class="w-12 h-12 mx-auto rounded-xl shadow" />
                <h3 class="font-bold text-lg text-primary">Install GeotaggingPhotos on iOS</h3>
                <p class="text-sm text-on-surface-variant">To install this app on your iPhone or iPad:</p>
                <div class="bg-surface-container-lowest p-3 rounded-xl text-left text-xs space-y-2 border border-outline-variant/30 text-on-surface">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-secondary">1.</span>
                        <span>Tap the <strong>Share</strong> button in Safari's toolbar below (<span class="material-symbols-outlined text-sm align-middle">ios_share</span>).</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-secondary">2.</span>
                        <span>Scroll down and select <strong>Add to Home Screen</strong> (<span class="material-symbols-outlined text-sm align-middle">add_box</span>).</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-secondary">3.</span>
                        <span>Tap <strong>Add</strong> in the top right corner.</span>
                    </div>
                </div>
                <button onclick="document.getElementById('ios-pwa-modal').remove()" class="gradient-btn w-full py-2.5 rounded-xl text-white font-semibold text-sm">
                    Got it
                </button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // General Browser Help Modal (for desktop browsers when beforeinstallprompt hasn't fired yet)
    function showBrowserInstallHelpModal() {
        const existing = document.getElementById('browser-pwa-modal');
        if (existing) existing.remove();

        const modalHtml = `
        <div id="browser-pwa-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div class="glass-card max-w-sm w-full bg-surface p-6 rounded-2xl border border-white/30 shadow-2xl space-y-4 text-center">
                <img src="/geotaggingphotos.png" alt="Logo" class="w-12 h-12 mx-auto rounded-xl shadow" />
                <h3 class="font-bold text-lg text-primary">Install GeotaggingPhotos</h3>
                <p class="text-sm text-on-surface-variant">Install this app for fast access and offline photo geotagging:</p>
                <div class="bg-surface-container-lowest p-3 rounded-xl text-left text-xs space-y-2 border border-outline-variant/30 text-on-surface">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-secondary text-base">desktop_windows</span>
                        <span>Click the <strong>Install App</strong> icon in your browser address bar or settings menu.</span>
                    </div>
                </div>
                <button onclick="document.getElementById('browser-pwa-modal').remove()" class="gradient-btn w-full py-2.5 rounded-xl text-white font-semibold text-sm">
                    Understood
                </button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // Event Listeners
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        console.log('[PWA] beforeinstallprompt event captured');
        showInstallButtons();
        setupSidebarNotification();
    });

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] GeotaggingPhotos successfully installed');
        deferredInstallPrompt = null;
        localStorage.setItem('pwa_installed', 'true');
        hideAllInstallPrompts();

        // Toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl z-50 text-sm font-semibold flex items-center gap-2 animate-bounce';
        toast.innerHTML = `<span class="material-symbols-outlined">check_circle</span><span>GeotaggingPhotos installed!</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    });

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Initial setup on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        registerServiceWorker();
        updateNetworkStatus();

        if (isStandalone() || localStorage.getItem('pwa_installed') === 'true') {
            hideAllInstallPrompts();
        } else {
            showInstallButtons();
            // Show sidebar for desktop/iOS if prompt hasn't fired after 4 seconds
            setTimeout(() => {
                if (!isStandalone() && !isDismissed()) {
                    setupSidebarNotification();
                }
            }, 4000);
        }
    });

})();
