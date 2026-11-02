# MIRA

متجر افتراضي فاخر للأجهزة المنزلية، بالعربية والإنجليزية. Built with semantic HTML, CSS and vanilla JavaScript; no installation or build required.

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

## Product photography

Update `image` and `darkImage` in `dist/catalog.js` with local paths or external high-resolution URLs. All seven products have designated image slots. Images are illustrative, supplied by the user. Product descriptions are creative concept copy rather than technical specifications.

## Virtual checkout

This is a fictional brand and demonstration. No real transaction occurs. Use fictional data only. Any non-empty cardholder name, 16 digits (no Luhn check), an MM/YY expiry with month 01–12, and a 3-digit CVC are accepted. Expiry is checked for format only. Arabic and Persian digits are supported. Card details are never persisted, logged, or transmitted; fields are cleared before authorization. Only the bag, language and currency preferences use local storage. Receipts contain product/order information, not card data. There is no order database or fulfillment service.

## Project structure

`dist/index.html` — semantic sections and dialogs.
`dist/style.css` — visual system, responsiveness and animation.
`dist/catalog.js` — editable catalog and image URLs.
`dist/app.js` — translations, state and interactions.

Fonts load from Google Fonts with system fallbacks. No runtime libraries or API keys are required.
