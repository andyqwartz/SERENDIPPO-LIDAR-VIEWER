# Tech Context : SERENDIPPO LiDAR Viewer

**Technologies:**
- Leaflet 1.9.4 (CDN)
- Leaflet Fullscreen 2.4.0 (CDN)
- IGN Géoplateforme WMTS (France)
- IDEe / CNIG WMTS (Spain)
- PCN / INGV WMS (Italy)
- Google Maps satellite tiles (unofficial)
- Esri World Imagery
- OpenStreetMap
- api-adresse.data.gouv.fr (geocoding)

**Setup:**
- No build step
- Static files served from GitHub Pages
- Open `index.html` directly in browser (file:// works)
- Just a web server needed for the geocoding API calls

**Constraints:**
- No backend, no database
- No npm/node dependencies
- Must work offline for tile display (cached tiles)
- Mobile responsive (media queries at 768px, 400px)

**Dependencies:**
- Leaflet (CDN)
- Leaflet Fullscreen (CDN)
- Google Fonts (Inter)

**File structure:**
```
index.html          Entry point
css/style.css       UI
favicon.ico         Tab icon
js/
  app.js            Bootstrap
  config.js         Defaults & bookmarks
  layers.js         Tile providers, factory, cache, labels, groups
  map.js            Map init, hash, controls
  sbs.js            Split slider
  search.js         Geocoding
  bookmarks.js      Saved places (localStorage)
  overlays.js       Transparent layers
  tools.js          Toolbar, UI, panel positioning
  measure.js        Distance tool
```