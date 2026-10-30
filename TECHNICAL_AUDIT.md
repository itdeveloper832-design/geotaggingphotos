# GeoTaggingPhotos.com — Technical Audit

**Audit date:** 2026-08-21  
**Source type:** Static HTML/CSS/JavaScript/PWA project  
**Validation basis:** Source inspection, live page extraction, local static-server rendering, JavaScript syntax checks, JSON validation, XML validation, dependency audit, and deterministic internal-link crawler.

## Architecture

The project is a static website with HTML files for public routes, shared header/footer fragments, a shared `components.js` loader, `styles.css`, page-specific scripts, a service worker, a PWA install helper, and browser-side EXIF/image-processing libraries. There is no application server or declared build pipeline in `package.json`; the available package script is a placeholder test command. The production validation therefore uses static-site checks rather than pretending that a missing build script passed.

The tool pages are appropriately client-side because file selection, image decoding, EXIF inspection, metadata writing, mapping, and downloads occur in the browser. Search-critical headings, explanatory copy, navigation, canonical tags, and internal links are present in the HTML source rather than being generated only after an image is uploaded.

## Validation results

| Test | Result | Notes |
|---|---:|---|
| Public HTML inventory | PASS | 28 public/source HTML files were evaluated after excluding dependency examples and Git data. Shared fragments and offline fallback are identified separately in `PAGE_INVENTORY.md`. |
| JavaScript syntax | PASS | `node --check` passed for the root JavaScript files, including the repaired bulk workflow. |
| JSON validation | PASS | JSON files, including manifest and Vercel configuration, parse successfully. |
| Sitemap XML | PASS | `sitemap.xml` parses as valid XML. |
| Internal link crawl | PASS | Final public-only crawler reports zero broken internal links. |
| Localhost/development URL scan | PASS | Zero localhost and `127.0.0.1` links were found in the public HTML scan. |
| Placeholder scan | PASS | No John Doe, example email, Lorem ipsum, or common development placeholder hits were found in the public scan. |
| JSON-LD parsing | PASS | Zero JSON-LD parsing errors were reported. |
| Static server route checks | PASS | Key HTML, XML, robots, manifest, and PWA files returned HTTP 200 through a local static server. |
| Declared production build | NOT AVAILABLE | No `build` script is declared in `package.json`; static validation was used instead. |
| Dependency audit | PASS | `npm audit --omit=dev` reported zero production vulnerabilities for the package manifest. |

## Crawlability and indexability

`robots.txt` allows crawling and references the production sitemap. The sitemap now contains canonical clean URLs for the homepage, core tools, blog hub, two substantive guides, trust pages, and retained country resources. The offline fallback and legacy duplicate guide files are not in the sitemap. Root guide aliases carry `noindex, follow` and are redirected by `_redirects`, `vercel.json`, and Apache rules to canonical blog URLs.

Internal links were rewritten from direct `.html` references to clean routes to avoid unnecessary redirect hops. Canonical tags point at production URLs. There are no detected localhost URLs, development URLs, or broken internal links in the final public-only crawl.

One architectural caveat remains: the actual deployment platform must honor the supplied redirect/rewrite configuration. The clean route behavior should be rechecked after deployment because a plain static file server cannot simulate Netlify, Vercel, Cloudflare Pages, or Apache rewrite semantics automatically.

## Metadata and structured data

Core tool pages use unique titles, descriptions, canonical URLs, and a single primary H1. The implementation adds WebApplication structured data to the add-geotag, bulk, EXIF, and location-finder tools and keeps schema claims limited to visible functionality. The JSON-LD parser reports zero errors. No review, rating, award, or fake-price schema was introduced.

The blog guide architecture now has separate canonical pages for “add GPS coordinates” and “without losing EXIF metadata.” The old root files remain only as redirect/noindex compatibility aliases. The page inventory documents why the seven country resources require editorial review before any further regional expansion.

## Rendering and Core Web Vitals considerations

The previous blank bulk viewport was caused by malformed page structure and disconnected controls. The style block is closed correctly, IDs align with the script, the page has a real empty queue, and the local smoke test shows the uploader and processing panel immediately in the viewport.

Microsoft Clarity and external promotional badge images were removed because they were not necessary for product functionality and increased privacy/performance disclosure complexity. Required third-party resources remain for Leaflet/maps, EXIF/ZIP libraries, fonts, and an article image. The remaining external resource hosts identified by the crawler are `cdn.jsdelivr.net`, `cdnjs.cloudflare.com`, `lh3.googleusercontent.com`, and `unpkg.com`. A future hardening pass could vendor and integrity-pin these resources.

The tool-first layout keeps the interactive control close to the top of the page. Buttons, upload areas, table cells, and status content use existing responsive utility classes. Real-user measurement is still required after deployment because Core Web Vitals depend on the production CDN, map tiles, cache headers, font timing, and device mix.

## PWA and offline behavior

The manifest and service worker are present. The service worker explicitly avoids caching non-GET requests, `blob:` URLs, and `data:` URLs, which reduces the risk of intentionally caching user-selected file content. Navigation uses network-first behavior with a cached offline fallback. Map tiles and geocoding are network-dependent and should not be advertised as fully offline. The pre-application checklist marks physical install, update, uninstall, and offline-reload testing as platform-dependent follow-up work.

## Security and uploaded-file handling

The audit found no public API keys, private tokens, or obvious secret values in the source. The bulk queue caps selection at 500 images, filters by common image MIME/extension patterns, validates latitude and longitude ranges, escapes filenames before inserting them into the dynamic queue table, and generates safe output names without user-controlled path segments. Each file is processed inside a try/catch so malformed input is skipped rather than terminating the complete batch.

The existing EXIF parser and single-photo processing implementation were preserved. The repaired bulk workflow converts output to JPEG when constructing the ZIP, which is disclosed in the visible copy. The browser still needs enough memory for large batches; the interface cap prevents unbounded selection but does not guarantee that every device can process 500 high-resolution images.

## Accessibility and user experience

The repaired bulk page includes a readable empty state, named actions, visible coordinate inputs, and a queue table. The add-geotag page retains explicit labels and clear action names, and now provides breadcrumb context and next-step links. The contact form uses labeled inputs with autocomplete attributes and a status region.

A full automated axe/WAVE pass and physical screen-reader testing were not available in the sandbox. The source-level review found no requirement for unnecessary ARIA or hidden SEO copy. The remaining recommended test matrix is Android Chrome, iPhone Safari, desktop Chrome, Edge, and Firefox, with keyboard-only navigation and a narrow viewport.

## Remaining technical actions

The project should add an actual repeatable production build or CI validation command if the deployment platform supports one. After deployment, verify all clean routes, 301 responses, sitemap URLs, service-worker update behavior, map attribution, email delivery, and real-user performance. Consider self-hosting or SRI-pinning stable external libraries, especially if the tool becomes a higher-volume product.

## References

[1] [Google Search Central — Introduction to robots.txt][1]  
[2] [Google Search Central — Build and submit a sitemap][2]  
[3] [MDN — Offline and background operation for progressive web apps][3]  
[4] [MDN — Content Security Policy][4]
