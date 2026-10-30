# 📍 GeoTaggingPhotos.com — Privacy-First Client-Side Photo Geotagging SaaS Platform

[![Website](https://img.shields.io/badge/Website-geotaggingphotos.com-2563eb?style=flat-square)](https://geotaggingphotos.com)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline%20Capable-emerald?style=flat-square)](manifest.json)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-blueviolet?style=flat-square)](privacy-policy.html)
[![License](https://img.shields.io/badge/License-ISC-gray?style=flat-square)](package.json)

**GeoTaggingPhotos** is a modern, ultra-fast, privacy-first web application for viewing, adding, editing, and stripping GPS coordinates and EXIF metadata from photographs. 

Every single image operation is executed **100% inside the user's browser using client-side JavaScript canvas and binary EXIF parsers** — no photos are ever uploaded to any external server or cloud backend.

---

## 📑 Table of Contents

- [Core Principles & Value Proposition](#-core-principles--value-proposition)
- [Key Features & Tools](#-key-features--tools)
- [Directory & File Structure](#-directory--file-structure)
- [Technical Architecture & Technology Stack](#-technical-architecture--technology-stack)
- [EXIF & Geotagging Engine Details](#-exif--geotagging-engine-details)
- [PWA & Offline Architecture](#-pwa--offline-architecture)
- [Routing, Clean URLs & Hosting Setup](#-routing-clean-urls--hosting-setup)
- [SEO & Structured Data (JSON-LD)](#-seo--structured-data-json-ld)
- [Developer & Agent Workflow Guide](#-developer--agent-workflow-guide)
- [License & Credits](#-license--credits)

---

## 🔒 Core Principles & Value Proposition

1. **100% Client-Side Privacy**: Photos never leave the client device. Metadata parsing, coordinate injection, and binary reconstruction occur directly in browser memory.
2. **Zero Quality Degradation**: Re-injects EXIF tags directly into JPEG segments or preserves original dimensions.
3. **No Account / No Paywalls Required**: Core geotagging, bulk tagging, and EXIF extraction are immediately accessible to all users.
4. **Progressive Web App (PWA)**: Works as a standalone desktop or mobile app, with full offline geotagging support via Service Workers.
5. **Universal Routing & SEO**: Production-ready configurations for Vercel, Netlify, Cloudflare Pages, and Apache/cPanel.

---

## 🛠 Key Features & Tools

| Tool / Page | Route | Description |
| :--- | :--- | :--- |
| **Home Page** | `/` (`index.html`) | SaaS landing page, feature highlights, live interactive geotagging quick tool, testimonials, and FAQs. |
| **Add Geotag** | `/add-geotag` | Full-featured single photo geotag editor with interactive Leaflet map, address geocoding search, coordinate inputs, altitude, heading, title, description, and tags. |
| **Bulk Geotagging** | `/bulk-geotagging` | Multi-image batch processing. Tag dozens of photos simultaneously with uniform or individual GPS coordinates and download individual files or a packaged ZIP archive. |
| **EXIF Viewer** | `/exif-viewer` | Detailed metadata inspector showing camera make, model, lens, exposure, shutter speed, ISO, focal length, GPS location, and full raw EXIF tags. |
| **Location Finder** | `/image-location-finder` | Upload any photo to extract embedded GPS coordinates, visualize the exact spot on an interactive map, and retrieve the reverse-geocoded street address. |
| **Regional Hubs** | `/photo-geotagging-usa`<br>`/photo-geotagging-uk`<br>`/photo-geotagging-australia`<br>`/photo-geotagging-canada`<br>`/photo-geotagging-germany`<br>`/photo-geotagging-india`<br>`/photo-geotagging-pakistan` | Dedicated localized SEO landing pages for real estate, local SEO, survey teams, and commercial photographers in specific countries. |
| **Knowledge Base & Blog** | `/blog`<br>`/blog/how-to-add-gps-coordinates-to-photos`<br>`/blog/how-to-add-location-to-a-photo` | In-depth technical guides and tutorials on EXIF standards, camera GPS geotagging, Google Business profile local SEO benefits, and troubleshooting. |

---

## 📂 Directory & File Structure

```text
stitch_geotaggingphotos_saas_platform/
├── .htaccess                 # Apache / cPanel clean URL rewrite & redirect rules
├── _redirects                # Netlify / Cloudflare Pages 301 redirects & clean URLs
├── vercel.json               # Vercel cleanUrls, redirects, and rewrites config
├── robots.txt                # Search engine crawler permissions & sitemap reference
├── sitemap.xml               # Complete XML sitemap for search engines
├── manifest.json             # PWA Web App Manifest (standalone display, icons, theme)
├── package.json              # Project dependencies (TailwindCSS CLI)
├── tailwind.config.js        # Custom Tailwind design tokens & font configs
├── input.css                 # Source Tailwind directives and custom CSS utilities
├── styles.css                # Compiled Tailwind & custom stylesheet
│
├── header.html               # Shared navigation header component (auto-loaded)
├── footer.html               # Shared footer component with badges & links (auto-loaded)
├── components.js             # Client component loader for header & footer + active link styling
│
├── exif-parser.js            # Client-side EXIF binary reader (extracts GPS, Camera, Lens, ISO)
├── geotag-exif.js            # Client-side EXIF GPS & metadata builder & binary injector
├── pwa.js                    # PWA controller (install banners, prompts, offline status pills)
├── sw.js                     # Service Worker for offline asset caching & fallback routing
│
├── index.html                # Main SaaS Landing Page
├── add-geotag.html           # Single photo geotagging tool
├── bulk-geotagging.html      # Batch multi-photo geotagging tool
├── exif-viewer.html          # In-depth EXIF inspection tool
├── image-location-finder.html# Photo map locator tool
├── about-us.html             # Company & project story
├── contact-us.html           # Contact form & support channels
├── faq.html                  # Frequently asked questions & help center
├── privacy-policy.html       # GDPR & CCPA compliant privacy statement
├── terms-of-service.html     # SaaS terms and usage guidelines
├── cookie-policy.html        # Transparent cookie disclosure
├── offline.html              # PWA offline fallback UI
│
├── photo-geotagging-usa.html       # Regional landing page: USA
├── photo-geotagging-uk.html        # Regional landing page: United Kingdom
├── photo-geotagging-australia.html # Regional landing page: Australia
├── photo-geotagging-canada.html    # Regional landing page: Canada
├── photo-geotagging-germany.html   # Regional landing page: Germany
├── photo-geotagging-india.html     # Regional landing page: India
├── photo-geotagging-pakistan.html  # Regional landing page: Pakistan
│
├── blog.html                 # Main blog directory index
├── blog/
│   ├── how-to-add-gps-coordinates-to-photos.html  # Detailed GPS coordinate guide
│   └── how-to-add-location-to-a-photo.html         # Beginner's location tagging tutorial
└── assets / icons / images:
    ├── geotaggingphotos.png  # Main Brand Logo
    ├── favicon.ico / .png    # Browser Favicon
    ├── apple-touch-icon.png  # iOS Home Screen icon
    ├── icon-192.png          # PWA standard icon (192x192)
    ├── icon-512.png          # PWA high-res icon (512x512)
    └── icon-maskable-512.png # PWA maskable adaptive icon (512x512)
```

---

## ⚡ Technical Architecture & Technology Stack

### Frontend & Core Engine
- **HTML5 & Vanilla JavaScript (ES6+)**: Zero framework bloat. Instant Time to Interactive (TTI), maximum compatibility, and no bundle build step needed for runtime.
- **TailwindCSS & Custom Design System**: Responsive, accessible design using glassmorphism, modern typography (`Plus Jakarta Sans` & `Outfit`), and smooth micro-interactions.
- **Leaflet.js (v1.9.4)**: Interactive OpenStreetMap tile renderer with custom draggable markers, reverse geocoding pin drops, and map controls.
- **OpenStreetMap Nominatim API**: Real-time forward & reverse geocoding without requiring paid API keys.
- **JSZip & FileSaver.js**: Client-side zip bundling for bulk downloads.

### EXIF & Metadata Libraries
- **`exif-js` / `exif-parser.js`**: Reads binary EXIF IFD0, ExifIFD, and GPS IFD data directly from `ArrayBuffer` / `Blob` sources.
- **`piexifjs` / `geotag-exif.js`**: Synthesizes and injects complete binary EXIF tags (GPSVersionID, Latitude, Longitude, Altitude, Direction/Heading, ImageDescription, XPTitle, XPKeywords, Artist, Copyright) into JPEG payloads before canvas export or direct binary injection.

---

## 🧩 EXIF & Geotagging Engine Details

### 1. Latitude & Longitude Rational Conversion
EXIF standards store coordinates as degrees/minutes/seconds rational tuples `[[deg, 1], [min, 1], [sec*10000, 10000]]` along with reference characters (`N`/`S`, `E`/`W`).
The custom helper in `geotag-exif.js` ensures accurate mathematical conversion:

```javascript
function convertDegToExifRational(deg) {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.round((minutesNotTruncated - minutes) * 60 * 10000);
    return [[degrees, 1], [minutes, 1], [seconds, 10000]];
}
```

### 2. Windows XP Metadata & IPTC Compatibility
To ensure tags, titles, and descriptions appear in Windows File Properties, macOS Finder, and Google Photos, metadata is encoded into UCS-2 byte arrays for `XPTitle`, `XPKeywords`, `XPSubject`, and `XPAuthor`.

---

## 📱 PWA & Offline Architecture

- **Service Worker (`sw.js`)**: Employs a Cache-First strategy for static assets (CSS, JS, fonts, logos) and a Network-First strategy for HTML navigation, falling back to `offline.html` when disconnected.
- **Dynamic Header & Footer Integration (`components.js`)**: All pages load universal navigation and footers via standard HTML placeholder injection:
  ```html
  <div id="header-placeholder"></div>
  <!-- Page Content -->
  <div id="footer-placeholder"></div>
  <script src="/components.js"></script>
  ```
  If dynamic `fetch()` fails (e.g., local `file://` protocol or edge restrictions), fallback markup is rendered automatically.
- **PWA Prompt Management (`pwa.js`)**:
  - Global `window.triggerPwaInstall()` function connected to header, footer, and mobile buttons.
  - Floating corner notification with 7-day dismissal cooldown stored in `localStorage`.
  - Step-by-step installation instructions modal for iOS Safari users.
  - Live network status pill (`Online` / `Offline — Local processing available`).

---

## 🌐 Routing, Clean URLs & Hosting Setup

The website uses modern clean URLs (e.g. `/add-geotag` instead of `/add-geotag.html` and `/blog/how-to-add-gps-coordinates-to-photos` instead of root/flat duplicate files).

### Configuration Files Overview:

1. **`vercel.json`**:
   - `cleanUrls: true`, `trailingSlash: false`.
   - Permanent 301 redirects from legacy root URLs to canonical `/blog/*` structure.
   - Dynamic rewrites for blog subpaths.
2. **`_redirects` (Netlify / Cloudflare Pages)**:
   - 301 redirects for legacy routes.
   - Clean URL rewrites mapping extensionless routes to `.html` files.
3. **`.htaccess` (Apache / cPanel)**:
   - `RewriteEngine On` with automatic HTTPS enforcement.
   - Removal of `.html` extension from URLs.
   - 301 redirects for legacy URLs to maintain search ranking link equity.

---

## 🔍 SEO & Structured Data (JSON-LD)

Every page includes customized schema metadata:
- **`SoftwareApplication` / `WebApplication`**: Marks the tools with application categories, operating systems, pricing specifications (Free), and feature lists.
- **`Article` & `BlogPosting`**: Detailed schema on all blog articles with author, datePublished, dateModified, and publisher data.
- **`FAQPage`**: Accordion FAQs equipped with JSON-LD for rich snippet search results.
- **`BreadcrumbList`**: Full hierarchical navigation schemas on all child and regional pages.
- **Canonical URLs & OpenGraph**: Canonical link tags, Open Graph meta (`og:title`, `og:image`, `og:url`), and Twitter Cards on every page.

---

## 👨‍💻 Developer & Agent Workflow Guide

### For Human Developers & AI Agents:

#### 1. Running Locally
Because `components.js` uses `fetch()` to load `/header.html` and `/footer.html`, run the site via a local HTTP server rather than opening raw `file://` paths:

```bash
# Option A: Using Python
python -m http.server 8080

# Option B: Using Node.js npx serve
npx serve .

# Option C: Using VS Code / IDE Live Server
# Click "Go Live" on port 5500
```

#### 2. Modifying Tailwind Styles
Tailwind is configured via `package.json` and `tailwind.config.js`. To rebuild the stylesheet after making class changes:

```bash
# Watch mode for active development
npx tailwindcss -i ./input.css -o ./styles.css --watch

# Production minified build
npx tailwindcss -i ./input.css -o ./styles.css --minify
```

#### 3. Rules for Adding New Pages
When creating a new tool, regional hub, or blog post:
1. **Include Header & Footer Placeholders**:
   ```html
   <div id="header-placeholder"></div>
   ...
   <div id="footer-placeholder"></div>
   <script src="/components.js"></script>
   <script src="/pwa.js"></script>
   ```
2. **Set Canonical Tag & Schema**: Always define `<link rel="canonical" href="https://geotaggingphotos.com/your-slug" />` (use the clean slug without `.html`).
3. **Update Navigation & Sitemap**: Add the new page link to `sitemap.xml`, `header.html`, `footer.html`, and `components.js` fallback templates.
4. **Preserve Client-Side Execution**: Never introduce server upload endpoints for user images. All EXIF manipulation must remain in `exif-parser.js` or `geotag-exif.js`.

---

## 📜 License & Credits

- **License**: ISC License
- **Map Data**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Geocoding**: OpenStreetMap Nominatim Service
- **EXIF Core**: [piexifjs](https://github.com/hMatoba/piexifjs) & [exif-js](https://github.com/exif-js/exif-js)
- **Repository**: [github.com/newaladdress-ship-it/geotageditor](https://github.com/newaladdress-ship-it/geotageditor)
