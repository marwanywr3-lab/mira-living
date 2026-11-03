# MIRA

متجر افتراضي فاخر للأجهزة المنزلية، بالعربية والإنجليزية. Built with semantic HTML, CSS and vanilla JavaScript; no installation or build required.

المتجر المباشر: [MIRA](https://mira.marwanbarbood.com/)

## GitHub Pages

The `Deploy MIRA to GitHub Pages` workflow publishes **the contents of `dist/`** at the site root. In Settings → Pages, set Source to **GitHub Actions**. Updates to `dist/` on `main` are deployed automatically; the workflow can also be run manually. Publishing the repository root as a Jekyll site displays this README instead of the storefront.

## Preview

Serve `dist/` with any static web server. For example, from this directory:

```
node preview.mjs
```

Open http://127.0.0.1:53182. For static hosting, publish the contents of `dist/`.

## Features

- Seven official products, with the supplied exact USD and SAR prices.
- English / Arabic localization, LTR / RTL layout and persistent preferences.
- Category filters, product detail modal and ivory / graphite image variants.
- Persistent bag with quantities and removal.
- Format-only virtual card validation, always-approved mock authorization and downloadable printable HTML receipt.
- Responsive layout, keyboard-accessible native dialogs, focus indicators and reduced-motion support.
- Supplied product imagery and scroll reveals with a sticky product story.
- GSAP logo entrance and separate MIRA FRIDGE / MIRA BREW scroll stories.
- Light/dark appearance with a saved preference and automatic system default.

## Scroll stories — complete integration

The working files are `dist/index.html`, `dist/style.css`, `dist/app.js`, and `dist/motion.js`, plus both JavaScript files under `dist/vendor/`. Copy the complete `dist/` directory to preserve all relative paths; no install or build is needed.

`motion.js` owns animations only. Shop state, translations, theme, currency and checkout remain in `app.js`. The scripts are deferred in dependency order: catalog → GSAP → ScrollTrigger → app → motion. GSAP and ScrollTrigger 3.15.0 are self-hosted, with their original license headers; see `dist/vendor/THIRD-PARTY-NOTICES.txt`.

Desktop stories use native CSS sticky stages and scrubbed image scale / rotation. Three visible editorial notes follow progress. Mobile and short windows use a natural document flow with gentle image movement and fully readable notes. The existing flat photography is animated as an image; it is not a 3D product model.

`gsap.matchMedia()` reverts animations when breakpoints or the reduced-motion preference change. Reduced motion shows the full content without sticky scenes or movement. If the libraries fail to load, the static storefront still works. Only transforms and opacity animate during scrolling; no continuous custom scroll loop or scroll hijacking is used. Refreshes after language, font and image changes are debounced.

To tune the experience:

- Scene length: `.film-desktop-motion .product-film` in `style.css`.
- Zoom, rotation, easing and scrub: the scene timeline in `motion.js`.
- Scene copy: the bilingual strings in `app.js`.
- Product photography / prices: `catalog.js`.

The appearance button follows the system theme until a visitor chooses a light/dark preference. This preference is stored with the language and currency settings. Printing a receipt keeps its original white paper design.

## Product photography

Update `image` and `darkImage` in `dist/catalog.js` with local paths or external high-resolution URLs. All seven products have designated image slots. Images are illustrative, supplied by the user. Product descriptions are creative concept copy rather than technical specifications.

## Virtual checkout

This is a fictional brand and demonstration. No real transaction occurs. Use fictional data only. Any non-empty cardholder name, 16 digits (no Luhn check), an MM/YY expiry with month 01–12, and a 3-digit CVC are accepted. Expiry is checked for format only. Arabic and Persian digits are supported. Card details are never persisted, logged, or transmitted; fields are cleared before authorization. Only the bag, language and currency preferences use local storage. Receipts contain product/order information, not card data. There is no order database or fulfillment service.

## Project structure

`dist/index.html` — semantic sections and dialogs.
`dist/style.css` — visual system, responsiveness and animation.
`dist/catalog.js` — editable catalog and image URLs.
`dist/app.js` — translations, state, appearance and interactions.
`dist/motion.js` — logo entrance and responsive scroll timelines.

Fonts load from Google Fonts with system fallbacks. The animation libraries are bundled locally; the store remains usable if motion enhancement is unavailable. No API keys are required.
