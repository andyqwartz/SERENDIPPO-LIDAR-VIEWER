# SERENDIPPO LiDAR Viewer

**Side-by-side LiDAR, satellite, orthophotos and historical maps in the browser.** No build step, no API key, 33 layers across Europe.

→ [Open the app](https://andyqwartz.github.io/SERENDIPPO-LIDAR-VIEWER)

## Overview

- **Split view** — independent left/right layers, CSS clip slider
- **France** (production) — IGN LiDAR HD, ortho, plans, Cassini, État-Major, SCAN50, 1950-1965-1980 orthos
- **Europe** — DHMV II (Flanders), SPW MNT (Wallonia), swissALTI3D (Switzerland), Environment Agency LiDAR (England), ČÚZK DMR 5G (Czechia), ZBGIS (Slovakia), geoportail.lu (Luxembourg), Lantmäteriet (Sweden), Kartverket (Norway)
- **Spain / Italy** (dev) — PNOA LiDAR, MDT, MTN, TINITALY, PCN WMS, IGM
- **Overlays** — hydrography, cadastre, contour lines
- **Tools** — geocoding search, bookmarks, GPX tracks, distance measure, night mode, fullscreen, geolocation, screenshot export

## Stack

| Tech | Use |
|---|---|
| [Leaflet](https://leafletjs.com/) 1.9 | Map, WMTS, WMS |
| Vanilla JS | Zero dependencies, modular ES5 |
| Custom CSS | Dark theme, responsive layout |
| [api-adresse](https://adresse.data.gouv.fr/) + IGN | Geocoding with client cache |
| localStorage | Persistent bookmarks |

## Architecture

```
js/
├── namespace.js        # LV entry point
├── config.js           # LV.CONFIG — defaults, bookmarks
├── constants.js        # LV.WMTS, LV.URL, LV.ATTR (frozen)
├── layers/             # helpers, registry, factory, cache, labels, groups
├── providers/          # france.js (prod), dev.js (ES/IT), europe.js (EU)
├── ui/                 # panels, toolRegistry, layerSelects, trackManager
├── parsers/            # gpxParser
├── map.js, sbs.js, search.js, bookmarks.js, overlays.js, measure.js
└── app.js              # bootstrap
```

**Init**: `DOMContentLoaded → LV.init() → map → SBS → search → bookmarks → tools → overlays → URLSync → screenshot`

**Providers**: `LV.createLayer(key) → PROV_FR[key]() | PROV_DEV[key]() | PROV_EU[key]() | global switch`

**URL sync**: full state in the hash (`#l, r, s, y, x, z, v`). Slider position is throttled while dragging to keep the URL update smooth and lag-free.

## Provider status

| Country / region | Status | Notes |
|---|---|---|
| France | **Production** | All layers stable |
| Flanders, Wallonia, Switzerland, England, Czechia, Slovakia, Luxembourg, Sweden, Norway | **Europe** | Official public WMS/WMTS |
| Spain | Dev | PNOA LiDAR, MDT — partially working |
| Italy | Dev | TINITALY, PCN WMS — often unreliable |

## Data

IGN Géoplateforme, Informatie Vlaanderen, SPW Wallonie, swisstopo, Environment Agency, ČÚZK, ÚGKK SR, geoportail.lu, Lantmäteriet, Kartverket, IDEe/CNIG, TINITALY/INGV, Geoportale PCN, Google, Esri, OSM.

## License

Data © respective providers. Code: use freely.
