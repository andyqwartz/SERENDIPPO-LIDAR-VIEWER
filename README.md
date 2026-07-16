# SERENDIPPO LiDAR Viewer

**Side-by-side LiDAR, satellite, orthophotos and historical maps in the browser.** No build step, no API key, 24 layers.

→ [Open the app](https://andyqwartz.github.io/SERENDIPPO-LIDAR-VIEWER)

## Overview

- **Split view** — independent left/right layers, CSS clip slider
- **France** (production) — IGN LiDAR HD, ortho, plans, Cassini, État-Major, SCAN50, 1950-1965-1980 orthos
- **Spain / Italy** (dev) — PNOA LiDAR, MDT, MTN, TINITALY, PCN WMS, IGM
- **Overlays** — hydrography, cadastre, contour lines, administrative limits, forests
- **Tools** — geocoding search, bookmarks, distance measure, night mode, fullscreen, geolocation

## Stack

| Tech | Use |
|---|---|
| [Leaflet](https://leafletjs.com/) 1.9 | Map, WMTS, WMS |
| Vanilla JS | ~1500 LOC, zero dependencies |
| Custom CSS | Dark theme, responsive layout |
| [api-adresse](https://adresse.data.gouv.fr/) | French commune geocoding |
| localStorage | Persistent bookmarks |

## Architecture

```
js/
├── namespace.js        # LV entry point
├── config.js           # LV.CONFIG — defaults, bookmarks
├── constants.js        # LV.WMTS, LV.URL, LV.ATTR (frozen)
├── layers/             # helpers, registry, factory, cache, labels, groups
├── providers/          # france.js (prod) + dev.js (ES/IT)
├── ui/                 # panels, toolRegistry, layerSelects
├── map.js, sbs.js, search.js, bookmarks.js, overlays.js, measure.js
└── app.js              # bootstrap
```

**Init**: `DOMContentLoaded → LV.init() → map → SBS → search → bookmarks → tools → overlays`

**Providers**: `LV.createLayer(key) → PROV_FR[key]() | PROV_DEV[key]() | global switch`

## Provider status

| Country | Status | Notes |
|---|---|---|
| France | **Production** | All layers stable |
| Spain | Dev | PNOA LiDAR, MDT — partially working |
| Italy | Dev | TINITALY, PCN WMS — often unreliable |

## Data

IGN Géoplateforme, IDEe/CNIG, TINITALY/INGV, Geoportale PCN, Google, Esri, OSM.

## License

Data © respective providers. Code: use freely.