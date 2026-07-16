# System Patterns : SERENDIPPO LiDAR Viewer

**Architecture:**
- Single-page static application
- Global namespace `window.LV` shared across modules
- Module-based files loaded via `<script>` tags in order
- Bootstrap: `app.js` → `LV.init()` calls each module in sequence

**Key technical decisions:**
- Leaflet pure JS (no wrapper library)
- WMTS via URL template, WMS via `L.tileLayer.wms`
- SBS via CSS clip on two Leaflet panes
- Layer cache: `LV._sideCache` (simple object, keyed by side + layer key)
- Toolbar: declarative registry `LV.TOOLS` with `on()` handlers
- Bookmarks: localStorage JSON serialization
- No build tools, no npm, no TypeScript

**Design patterns:**
- Module pattern: each file extends `window.LV` with its own namespace (`LV.SBS`, `LV.Search`, etc.)
- Registry pattern: `LV.TOOLS` for toolbar buttons, `LV.OVERLAY_DEFS` for overlays
- Factory pattern: `LV.createLayer(key)` returns a Leaflet layer
- Cache pattern: `LV.getSideLayer(side, key)` with caching in `LV._sideCache`

**Current layout (to refactor):**
- `layers.js` — mixed concerns: helpers, factory, cache, labels, groups, URLs
- `tools.js` — mixed: UI helpers, panel positioning, tool registry, layer selectors
- `overlays.js` — duplicates `ignWMTS` helper from `layers.js`
- No private scope — all on `window.LV`