/**
 * Global Component Loader for Header and Footer
 * Renders header.html and footer.html dynamically into all pages using function loadHeader() and loadFooter().
 */

function loadHeader(targetId = "header-placeholder") {
    const target = document.getElementById(targetId);
    if (!target) return;

    fetch("/header.html")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch /header.html");
            return response.text();
        })
        .then(html => {
            target.innerHTML = html;
            highlightActiveNavLink();
        })
        .catch(err => {
            console.warn("Dynamic header fetch failed, using fallback component:", err);
            target.innerHTML = getHeaderFallbackHTML();
            highlightActiveNavLink();
        });
}

function loadFooter(targetId = "footer-placeholder") {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (target.children.length > 0) return;

    fetch("/footer.html")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch /footer.html");
            return response.text();
        })
        .then(html => {
            target.innerHTML = html;
        })
        .catch(err => {
            console.warn("Dynamic footer fetch failed, using fallback component:", err);
            target.innerHTML = getFooterFallbackHTML();
        });
}

function highlightActiveNavLink() {
    let rawPath = window.location.pathname.split("/").pop() || "";
    let currentSlug = rawPath.replace(/\.html$/, "");
    if (currentSlug === "" || currentSlug === "index") currentSlug = "home";

    const links = document.querySelectorAll("#navbar nav a, #mobile-menu a");
    links.forEach(link => {
        const href = link.getAttribute("href") || "";
        let hrefSlug = href.split("/").pop().replace(/\.html$/, "");
        if (href === "/" || hrefSlug === "" || hrefSlug === "index") hrefSlug = "home";

        if (hrefSlug === currentSlug) {
            link.classList.add("text-secondary", "font-bold");
        }
    });
}

function getHeaderFallbackHTML() {
    return `<header class="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-400 ease-out-expo" id="navbar">
<div class="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-3">
<div class="flex items-center gap-3">
<a class="font-display text-headline-lg-mobile text-primary tracking-tight scale-105 transition-transform duration-400 ease-out-expo hover:opacity-80 flex items-center gap-2.5 group" href="/" aria-label="GeoTaggingPhotos Homepage">
<img src="/geotaggingphotos.png" alt="GeoTaggingPhotos Logo" class="w-8 h-8 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105" />
<span>GeoTaggingPhotos</span>
</a>
<div class="network-status-pill hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
<span>Online</span>
</div>
</div>
<nav class="hidden md:flex items-center gap-6" aria-label="Main Navigation">
<a class="text-on-surface-variant hover:text-primary font-label-md text-label-md hover:bg-white/10 transition-colors duration-400 ease-out-expo px-3 py-2 rounded-lg" href="/">Home</a>
<div class="relative group">
<button class="text-on-surface-variant hover:text-primary font-label-md text-label-md hover:bg-white/10 transition-colors duration-400 ease-out-expo px-3 py-2 rounded-lg flex items-center gap-1" aria-haspopup="true" aria-expanded="false" aria-label="Tools menu">
<span>Tools</span>
<span class="material-symbols-outlined text-sm" aria-hidden="true">expand_more</span>
</button>
<div class="absolute left-0 top-full pt-2 hidden group-hover:block w-56">
<div class="glass-card rounded-xl p-2 shadow-xl border border-white/40 bg-surface/95 backdrop-blur-md space-y-1">
<a href="/add-geotag" class="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
<span class="material-symbols-outlined text-sm text-secondary" aria-hidden="true">add_location</span>
<span>Add Geotag</span>
</a>
<a href="/bulk-geotagging" class="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
<span class="material-symbols-outlined text-sm text-secondary" aria-hidden="true">photo_library</span>
<span>Bulk Geotagging</span>
</a>
<a href="/exif-viewer" class="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
<span class="material-symbols-outlined text-sm text-secondary" aria-hidden="true">info</span>
<span>EXIF Viewer</span>
</a>
<a href="/image-location-finder" class="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors">
<span class="material-symbols-outlined text-sm text-secondary" aria-hidden="true">search</span>
<span>Location Finder</span>
</a>
</div>
</div>
</div>
<a class="text-on-surface-variant hover:text-primary font-label-md text-label-md hover:bg-white/10 transition-colors duration-400 ease-out-expo px-3 py-2 rounded-lg" href="/blog">Blog</a>
<a class="text-on-surface-variant hover:text-primary font-label-md text-label-md hover:bg-white/10 transition-colors duration-400 ease-out-expo px-3 py-2 rounded-lg" href="/about-us">About Us</a>
<a class="text-on-surface-variant hover:text-primary font-label-md text-label-md hover:bg-white/10 transition-colors duration-400 ease-out-expo px-3 py-2 rounded-lg" href="/contact-us">Contact</a>
<a class="text-on-surface-variant hover:text-primary font-label-md text-label-md hover:bg-white/10 transition-colors duration-400 ease-out-expo px-3 py-2 rounded-lg" href="/faq">FAQ</a>
</nav>
<div class="hidden md:flex items-center gap-3">
<button id="header-install-btn" type="button" onclick="window.triggerPwaInstall()" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-label-md text-sm font-semibold transition-colors border border-secondary/20" aria-label="Install Application">
<span class="material-symbols-outlined text-[18px]">download</span>
<span>Install App</span>
</button>
<a href="/contact-us" class="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Support</a>
<a href="/add-geotag" class="gradient-btn font-label-md text-label-md px-4 py-2 rounded-lg text-white">Get Started</a>
</div>
<button class="md:hidden text-primary p-2" id="mobile-menu-btn" aria-label="Toggle Navigation Menu" aria-expanded="false" onclick="const m = document.getElementById('mobile-menu'); const isHidden = m.classList.toggle('hidden'); this.setAttribute('aria-expanded', !isHidden);">
<span class="material-symbols-outlined" aria-hidden="true">menu</span>
</button>
</div>
<div id="mobile-menu" class="hidden md:hidden bg-surface border-b border-outline-variant/30 px-6 py-4 space-y-3" aria-label="Mobile Navigation">
<a href="/" class="block text-on-surface hover:text-secondary font-medium py-1">Home</a>
<div class="space-y-1 pl-3 border-l-2 border-outline-variant/30">
<div class="text-xs font-bold uppercase text-on-surface-variant/70 tracking-wider">Tools</div>
<a href="/add-geotag" class="block text-sm text-on-surface hover:text-secondary py-1">Add Geotag</a>
<a href="/bulk-geotagging" class="block text-sm text-on-surface hover:text-secondary py-1">Bulk Geotagging</a>
<a href="/exif-viewer" class="block text-sm text-on-surface hover:text-secondary py-1">EXIF Viewer</a>
<a href="/image-location-finder" class="block text-sm text-on-surface hover:text-secondary py-1">Image Location Finder</a>
</div>
<div class="space-y-1 pl-3 border-l-2 border-outline-variant/30">
<div class="text-xs font-bold uppercase text-on-surface-variant/70 tracking-wider">Regional</div>
<a href="/photo-geotagging-usa" class="block text-sm text-on-surface hover:text-secondary py-1">USA Services</a>
<a href="/photo-geotagging-uk" class="block text-sm text-on-surface hover:text-secondary py-1">UK Services</a>
<a href="/photo-geotagging-australia" class="block text-sm text-on-surface hover:text-secondary py-1">Australia Services</a>
</div>
<a href="/blog" class="block text-on-surface hover:text-secondary font-medium py-1">Blog</a>
<a href="/about-us" class="block text-on-surface hover:text-secondary font-medium py-1">About Us</a>
<a href="/contact-us" class="block text-on-surface hover:text-secondary font-medium py-1">Contact Us</a>
<a href="/faq" class="block text-on-surface hover:text-secondary font-medium py-1">FAQ & Support</a>
<div class="pt-2 border-t border-outline-variant/30 space-y-2">
<button id="mobile-install-btn" type="button" onclick="window.triggerPwaInstall()" class="w-full text-center bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 font-label-md py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-base">download</span>
<span>Install App</span>
</button>
<a href="/add-geotag" class="block w-full text-center gradient-btn font-label-md py-2.5 rounded-lg text-white">Get Started Free</a>
</div>
</div>
</header>`;
}

function getFooterFallbackHTML() {
    return `<footer class="bg-surface-container-lowest border-t border-outline-variant/30 w-full py-12 px-margin-mobile md:px-margin-desktop mt-auto">
<div class="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
<div class="col-span-2 lg:col-span-2 flex flex-col gap-4">
<a href="/" class="font-display text-headline-lg-mobile text-primary hover:opacity-80 transition-opacity flex items-center gap-2.5 group" aria-label="GeoTaggingPhotos Homepage">
<img src="/geotaggingphotos.png" alt="GeoTaggingPhotos Logo" class="w-8 h-8 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105" />
<span>GeoTaggingPhotos</span>
</a>
<p class="font-body-md text-body-md text-on-surface-variant opacity-80">
                    Professional metadata management tools for modern workflows.
                </p>

<p class="text-xs text-on-surface-variant mt-2">Independent browser tools for photo GPS and metadata workflows.</p>
<p class="font-body-md text-body-md text-on-surface-variant text-sm mt-3">
                    © 2026 GeoTaggingPhotos. All rights reserved.
                </p>
</div>
<div class="col-span-1 lg:col-span-1 flex flex-col gap-3">
<h4 class="font-label-md text-label-md text-primary font-bold">Tools</h4>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/add-geotag">Add Geotag</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/bulk-geotagging">Bulk Geotagging</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/exif-viewer">EXIF Viewer</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/image-location-finder">Location Finder</a>
<button id="footer-install-btn" type="button" onclick="window.triggerPwaInstall()" class="font-body-md text-body-md text-secondary hover:underline font-semibold flex items-center gap-1 mt-1 text-left">
<span class="material-symbols-outlined text-sm">download</span>
<span>Install GeotaggingPhotos</span>
</button>
</div>
<div class="col-span-1 lg:col-span-1 flex flex-col gap-3">
<h4 class="font-label-md text-label-md text-primary font-bold">Company</h4>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/about-us">About Us</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/blog">Blog</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/contact-us">Contact Us</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/faq">FAQ &amp; Help</a>
</div>
<div class="col-span-1 lg:col-span-1 flex flex-col gap-3">
<h4 class="font-label-md text-label-md text-primary font-bold">Regional</h4>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/photo-geotagging-usa">USA Services</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/photo-geotagging-uk">UK Services</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/photo-geotagging-australia">Australia Services</a>
</div>
<div class="col-span-1 lg:col-span-1 flex flex-col gap-3">
<h4 class="font-label-md text-label-md text-primary font-bold">Legal</h4>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/privacy-policy">Privacy Policy</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/terms-of-service">Terms of Service</a>
<a class="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors" href="/cookie-policy">Cookie Policy</a>
</div>
</div>
</footer>`;
}

// Auto-execute header and footer loading
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        loadHeader();
        loadFooter();
    });
} else {
    loadHeader();
    loadFooter();
}
