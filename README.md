# BZQ Camp — React storefront

Polish-language storefront prototype for campervan conversions and replacement parts.

## Start locally

Requires Node.js 18+ and npm.

```sh
npm ci
npm run dev
```

Use `npm run build` for the production output in `dist/`, and `npm run preview` to serve that output locally.

## Structure

- `src/App.jsx` assembles the homepage, project gallery, shop and storefront dialogs.
- `src/components/HeroGallery.jsx` provides the three-image carousel with timed and manual navigation.
- `src/components/BrandCarousel.jsx` shows a looping strip of premium camper manufacturers.
- `src/components/VehicleSearch.jsx` filters the catalog by make and model.
- `src/components/Panel.jsx` provides accessible dialogs and the cart drawer.
- `src/catalog.js` contains the demo project, product and compatibility data.
- `src/styles.css` defines the visual system and responsive layout.
- `public/media/` contains the supplied logo and illustrative imagery.

The product catalog, prices and compatibility are examples. The project gallery uses generated concept visuals. The cart persists in the browser. Accounts, order submission and payments require a backend. Connect the catalog module and cart UI to the eventual Node API when the production data and endpoints are available.

## Electrical configurator

Open `/konfigurator.html` through the hero, navigation, or homepage card. The seven-step calculator in `src/configurator/main.js` preserves the supplied configurator's options and estimates. The confirmation button generates a branded PDF in the browser, including the contact form, selected equipment, suggested components, cables, and warnings. Contact fields are included in the download and are not submitted to a server. Pricing and technical verification take place separately.

The storefront and configurator share a sticky header and footer. The cable step shows a generated camper side elevation with schematic routing markers and a separate trailer outline.
