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
- Reverse-scrolling three-column product gallery on desktop, with each product shown once.

## Reverse-scroll product gallery

The collection follows the [reverse-scroll reference](https://scroll-driven-animations.style/demos/reverse-scroll/css/): its middle column follows document scrolling while the two outer columns travel in the opposite direction. `dist/reverse-gallery.js` groups the seven existing interactive cards into three columns and measures their unequal heights. A single GSAP ScrollTrigger animates both outer columns with a short 0.3-second scrub. The range extends from the collection entering the viewport until it leaves, so direction changes at the endpoints happen outside the visible collection instead of snapping inside it. Only the outer columns receive transform layer hints. It does not change prices, product actions, page scrolling, or the separate FRIDGE / BREW stories.

Smaller screens, short windows, reduced-motion preferences, missing animation libraries, and filtered subsets retain the regular product grid. Entering the gallery with the Tab key restores the static grid for the rest of the visit so focused controls remain easy to reach. Catalog replacement rebuilds the layout; font/layout notifications only remeasure existing columns. Unchanged measurements do not request a ScrollTrigger refresh. Scroll anchoring is disabled inside the moving gallery to prevent browser position corrections. Animated desktop cards load their small catalog photos eagerly with asynchronous decoding: reverse transforms can otherwise delay native lazy loading until an image is already visible. Mobile retains lazy loading. There are no duplicated products, custom scroll handlers, or added dependencies.

## Scroll stories — complete integration

The working files are `dist/index.html`, `dist/style.css`, `dist/app.js`, `dist/motion.js`, `dist/reverse-gallery.css`, and `dist/reverse-gallery.js`, plus the three JavaScript libraries under `dist/vendor/` and the two `*-cutout-v2.png` images under `dist/assets/`. Copy the complete `dist/` directory to preserve all relative paths; no install or build is needed.

`motion.js` owns animations only. Shop state, translations, theme, currency and checkout remain in `app.js`. The scripts are deferred in dependency order: catalog → GSAP → ScrollTrigger → MotionPathPlugin → app → motion. All three GSAP 3.15.0 libraries are self-hosted with their original license headers; see `dist/vendor/THIRD-PARTY-NOTICES.txt`.

Shopping controls are visible from the beginning and never animated: each story has a permanent product price, an Explore button, and a direct Collection link. FRIDGE appears above the product collection and BREW below it. Desktop stories use 340svh and a 0.65-second scrub. Only the final cutout-to-room handoff has been extended: its reveal uses three times the previous scroll distance with linear easing, and the cutout fades out three times more gradually. The longer 150-unit timeline preserves the earlier product movement pace. The maximum product zoom remains 1.4× with small rotations. The full appliance is visible immediately; image-slice assembly and chapter indicators are disabled. FRIDGE retains its detail/room reveal and BREW its restrained curved MotionPath. The photographic layers are not 3D models. See `ASSETS.md` for image provenance and the original image-tool prompts.

`gsap.matchMedia()` reverts animations when breakpoints or the reduced-motion preference change. Mobile uses ordinary document flow with a small image movement, no sticky stage, and no staged text or controls. Reduced-motion and short landscape windows show static products with accessible purchase controls. If a motion dependency fails to load, the static storefront still works. There is no custom scroll loop or scroll hijacking. Language/font refreshes are debounced and wait for scrolling to stop. Image dimensions are explicit and do not trigger refreshes while decoding.

To tune the experience:

- Scene length: `.cinema-ready .cinema-film` in `style.css`.
- Zoom, rotation, easing and scrub: the scene timeline in `motion.js`.
- Scene copy: the bilingual strings in `app.js`.
- Product photography / prices: `catalog.js`; cinematic cutouts are referenced by the two sections in `index.html`.

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
`dist/reverse-gallery.css` / `dist/reverse-gallery.js` — progressive reverse-scroll collection enhancement.

Fonts load from Google Fonts with system fallbacks. The animation libraries are bundled locally; the store remains usable if motion enhancement is unavailable. No API keys are required.
