# SERENDIPPO LiDAR Viewer

**Side-by-side LiDAR, satellite, orthophotos and historical maps across Europe.** No build step, no API key, no backend — a single static page that runs anywhere.

> [**Open the app**](https://andyqwartz.github.io/SERENDIPPO-LIDAR-VIEWER) · [Developer guide →](docs/DEV.md)

---

## Why

SERENDIPPO is an independent relief viewer for Europe. It lets you compare high-resolution **LiDAR / DTM hillshade** against satellite imagery side by side, revealing structures that are invisible from the air — archaeological sites, fortifications, sedimentary forms, terrain anomalies. Data is served directly from official public **WMS / WMTS** endpoints of each country's national mapping agency. Everything runs client-side: no account, no API key, no server.

## Features

- **Split view** — independent left/right layers with a draggable CSS-clip slider (mobile + desktop)
- **Per-side opacity blend** — each half stacks its own source on top of the other (active over, other underneath); two horizontal sliders (bottom of each half on desktop, above the dock on mobile) fade the active layer to reveal the other source beneath
- **34 base layers** across Europe + **4 transparent overlays**
- **Relief everywhere** — LiDAR, DTM/DEM and hillshade from 9 European countries via official feeds
- **Historical cartography** — Cassini (XVIIIe), État-Major (XIXe), SCAN50 1950, orthophotos 1950–1980
- **Geocoding** — French communes (api-adresse) + IGN geocoding, with client-side cache
- **Bookmarks** — locations saved to localStorage (97 curated spots included)
- **GPX tracks** — drag & drop, auto fly-to, per-track controls
- **Measure, annotation** — distance, markers
- **Screen export** — PNG screenshot
- **Shareable URL** — the whole view (layers, slider, center, zoom, overlays) is encoded in the hash — no database
- **Night mode, fullscreen, geolocation**
- Fully **responsive** — desktop toolbar + mobile bottom dock

## Coverage

| Region | Layers | Status |
|---|---|---|
| **France** | LiDAR HD MNT, MNS, Ortho, Ortho HR 20 cm, Plan IGN V2 / J+1, Scan 25, Google+IGN overlay | Production |
| **Historique (FR)** | Cassini, État-Major, SCAN50 1950, Ortho 1950–1965, Ortho 1965–1980 | Production |
| **Europe** | Flandre (DHMV II), Wallonie (MNT), Suisse (swissALTI3D), Angleterre (EA LiDAR), Tchéquie (ČÚZK DMR 5G), Slovaquie (ZBGIS), Luxembourg, Suède (Lantmäteriet), Norvège (Kartverket) | Direct public WMS/WMTS |
| **Espagne** | LiDAR PNOA, MDT, Ortho PNOA, MTN50, MTN25 | Dev |
| **Italie** | TINITALY, LiDAR PCN WMS, IGM 1:25 000 | Dev |
| **Global** | Google Satellite (±labels), ArcGIS World Imagery, OpenStreetMap | Production |

**Overlays:** hydrography · cadastre · contour lines · IGN plan J+1.

## Quick start

Open the page directly — no install:

```
open index.html
```

Or serve locally for a clean origin:

```
python3 -m http.server 8000
# → http://localhost:8000
```

## Stack

| Tech | Use |
|---|---|
| [Leaflet](https://leafletjs.com/) 1.9 | Map, WMTS, WMS, ImageServer |
| Vanilla JS (ES5) | Zero dependencies, modular |
| Custom CSS | Dark theme, responsive |
| [api-adresse](https://adresse.data.gouv.fr) + IGN | Geocoding |
| localStorage | Bookmarks |

## Structure

```
index.html            # single-page shell
css/style.css         # dark theme + responsive layout
js/
  providers/          # france.js (prod) · europe.js (EU) · dev.js (ES/IT)
  layers/             # helpers, registry, factory, cache, labels, groups
  ui/                 # panels, toolRegistry, layerSelects, trackManager
  parsers/            # gpxParser
  map.js sbs.js search.js bookmarks.js overlays.js measure.js urlSync.js ...
```

## License

**Code:** use freely. **Data:** © their respective national providers (see attributions in-app and `docs/DEV.md`).

---

Built with ❤ and Leaflet. For the engineering details — adding a provider, the URL-sync format, overlays, tests — see **[docs/DEV.md](docs/DEV.md)**.
