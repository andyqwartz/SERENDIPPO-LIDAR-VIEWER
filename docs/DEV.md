# SERENDIPPO LiDAR Viewer — Developer Guide

Engineering deep-dive: architecture, adding a provider, URL sync, overlays, tests.

## Architecture

Single-page static app. One global namespace `LV`, no framework, no build step.

```
index.html            # shell + script load order
css/style.css         # dark theme, responsive, bottom dock (mobile)
js/
├── namespace.js        # var LV = window.LV || {}  (loaded first)
├── config.js           # LV.CONFIG — defaultView, left/right keys, sbsMin/Max, bookmarks
├── constants.js        # LV.WMTS, LV.IMG, LV.URL, LV.ATTR (frozen)
├── layers.js           # pane name constants (left/right/overlays)
├── layers/
│   ├── layerHelpers.js     # LV.ignWMTS, gmWMTS, wms3857, LV.arcgisExport
│   ├── providerRegistry.js # optional key registry
│   ├── providerFactory.js  # LV.createLayer dispatch
│   ├── layerCache.js       # LV.getSideLayer / setLayerPane (+ per-side cache)
│   ├── layerLabels.js      # LV.LAYER_NAMES (key → display name)
│   └── layerGroups.js      # LV.LAYER_GROUPS (optgroups for the dropdowns)
├── providers/
│   ├── france.js       # LV.PROV_FR (production)
│   ├── europe.js       # LV.PROV_EU (9 countries, direct public WMS/WMTS)
│   └── dev.js          # LV.PROV_DEV (Spain, Italy — experimental)
├── ui/                 # panels.js, toolRegistry.js, layerSelects.js, trackManager.js
├── parsers/gpxParser.js
├── map.js sbs.js search.js bookmarks.js overlays.js measure.js urlSync.js screenshot.js
└── app.js               # bootstrap (LV.init)
```

**Script order matters** (see `index.html`): namespace → config → constants → layers → helpers → registry → labels → groups → cache → **providers** → factory → map → … → urlSync → app.

**Init flow:** `DOMContentLoaded → LV.init() → initMap → SBS.init → Search.init → Bookmarks.load → TOOLS.init → OVERLAYS.init → TrackManager.init → URLSync.init → Screenshot.init → initPanels`.

## Provider dispatch

`LV.createLayer(key)` resolves a layer in this order:

```
1. LV.ProviderRegistry.create(key)
2. LV.PROV_FR[key]        (France)
3. LV.PROV_DEV[key]       (Spain / Italy)
4. LV.PROV_EU[key]        (Europe)
5. built-in switch        (arcgis, satellite, hybrid, osm)
```

Adding a layer requires touching **4 files** so it appears everywhere (factory + dropdown + cached by key):

1. `js/layers/layerGroups.js` — put the key in a group (optgroup).
2. `js/layers/layerLabels.js` — give it a `LV.LAYER_NAMES` label (must be unique — duplicate labels render as confusing duplicates in the dropdown).
3. `js/providers/<x>.js` — add the factory function.
4. `js/layers/providerFactory.js` — only if you add a **new provider object** (e.g. `LV.PROV_EU`).

The dropdowns (`js/ui/layerSelects.js`) are built automatically from `LV.LAYER_GROUPS` + `LV.LAYER_NAMES`, and layers are cached per-side via `LV.getSideLayer`, so no extra wiring is needed.

## Adding a provider (real example — the Europe layer)

Each provider is a function returning a Leaflet layer. See `js/providers/europe.js`:

```js
LV.PROV_EU = {
  // WMTS (REST): swisstopo swissALTI3D hillshade
  ch: function () {
    return L.tileLayer(LV.URL.EU_CH, {
      maxZoom: 19, detectRetina: true, attribution: LV.ATTR.EU_CH
    });
  },
  // WMS 1.3.0 (3857): Environment Agency LiDAR DTM
  gb_en: function () {
    return wms3857(LV.URL.EU_GB, 'Lidar_Composite_Hillshade_DTM_1m', {
      maxZoom: 19, maxNativeZoom: 17, detectRetina: true, attribution: LV.ATTR.EU_GB
    });
  },
  // ArcGIS ImageServer export (rendering rule): Kartverket Høydedata
  no: function () {
    return LV.arcgisExport(LV.URL.EU_NO, {
      maxZoom: 20, maxNativeZoom: 18, exportTransparent: false,
      renderingRule: '{"rasterFunction":"skyggerelieff"}',
      attribution: LV.ATTR.EU_NO
    });
  }
};
```

### Layer helpers (`js/layers/layerHelpers.js`)

| Helper | Signature | When to use |
|---|---|---|
| `LV.ignWMTS(layer, tms, fmt, opts)` | IGN Géoplateforme WMTS | French IGN layers |
| `gmWMTS(base, layer, style, fmt, opts)` | GoogleMapsCompatible WMTS | IDEe / CNIG (Spain) |
| `wms3857(url, layers, opts)` | WMS 1.3.0 in EPSG:3857 | European WMS services |
| `LV.arcgisExport(url, opts)` | ArcGIS ImageServer `exportImage` tiles | Norway (Kartverket) and similar ImageServers |

`wms3857` defaults to `transparent: true`; override with `{ transparent: false }` for opaque services (e.g. Luxembourg, Sweden).

## Constants (`js/constants.js`)

- `LV.WMTS` — TileMatrixSet names: `PM`, `PM_0_18`, `PM_0_19`, `PM_3_15`, `PM_6_14`, `PM_6_19`, `GMC`.
- `LV.IMG` — `PNG` / `JPEG`.
- `LV.URL` — full endpoint URLs; every new service gets a constant here.
- `LV.ATTR` — attribution strings; each layer carries one.

Keep `LV.URL` / `LV.ATTR` / `LV.CONFIG` under `Object.freeze` — no mutation at runtime.

## URL sync (`js/urlSync.js`)

Full state is encoded in the URL hash, so a view is shareable and bookmarked without a database.

```
#l=<leftKey>&r=<rightKey>&s=<sbsPct>&y=<lat>&x=<lng>&z=<zoom>&v=<ov1,ov2>
```

- Updated on `moveend`, `zoomend`, layer switch, overlay toggle, slider change.
- **Slider throttle:** while dragging the SBS handle, `setPct` fires on every `mousemove`. URL writes are coalesced via `LV.URLSync.throttledUpdate()` (max one hash write per 120 ms, with a trailing flush) so the UI never lags — the final position is always saved.
- Legacy format `#lat,lng,zoom` is still restored on load.
- `restore()` replays the state: view → left/right layers → slider → overlays.

## Overlays (`js/overlays.js`)

Transparent layers drawn in the `overlaysPane` above both pans.

```js
LV.OVERLAY_DEFS = {
  hydro:   { name: 'Reseau hydro',     layer: null, active: false },
  cadastre:{ name: 'Cadastre',         layer: null, active: false },
  contour: { name: 'Courbes niveau',   layer: null, active: false },
  ignj1:   { name: 'Plan IGN J+1',     layer: null, active: false }
};
```

Each overlay is an IGN WMTS (hydro, cadastre, contour, BDUni.J1). To add one: create the layer in `OVERLAYS.init`, set `layer.options.pane = LV.PANE_OVERLAYS`, and it appears automatically in `OVERLAYS.updateUI()`. The active overlay list is also part of the URL hash (`v=`).

## Bookmarks & local storage

- Key: `lidar_viewer_bookmarks` (see `js/bookmarks.js`).
- Defaults come from `LV.CONFIG.bookmarks` (known/curated spots) and are merged with the user's saved list on `load()`.
- Each bookmark: `{ id, name, lat, lng, zoom, notes }`.

## GPX tracks (`js/ui/trackManager.js` + `js/parsers/gpxParser.js`)

- Drag & drop `.gpx` onto the page, or via the bookmarks panel "Tracks" tab.
- Minimal `DOMParser`-based parser (no external lib) — reads `trkpt`, `trkseg`, `wpt`, `ele`, `time`.
- Renders `L.polyline` + `L.circleMarker`, auto `flyToBounds`.
- The "＋ Ajouter" button adapts to the active tab (bookmark vs GPX).

## Screenshot export (`js/screenshot.js`)

- No toolbar button (by design). Call `LV.Screenshot.capture()` from the console.
- Temporarily disables the SBS CSS clip, captures (native canvas, `html2canvas` CDN fallback for cross-origin tiles), restores, exports 2× PNG.

## Tests

The test suite is **local only** (`tests/` is gitignored — a green build is not a functional guarantee).

- Open `tests/test.html` through a local server (it loads Leaflet from a CDN):

```
python3 -m http.server 8000   # → http://localhost:8000/tests/test.html
```

- It asserts namespace, config, constants, map init, providers (FR/DEV/EU), `createLayer`, cache, layer groups/labels, SBS, bookmarks, overlays, UI tools, measure, panes.
- Quick syntax check on edited JS:

```
node --check js/providers/europe.js
```

## Mobile / responsive

- Breakpoints: `400px` (narrow phone), `768px` (phone), `768px` landscape.
- Bottom dock (`.bottom-bar`) on mobile; vertical toolbar on the right in landscape.
- Panels (bookmarks/overlays) render as bottom sheets above the dock.
- See the many hard-won CSS pitfalls in the repo's memory bank (`memory-bank/`, local-only).

## Provider status & known limitations

| Region | Status | Notes |
|---|---|---|
| France | Production | All layers stable |
| Europe (9) | Direct public WMS/WMTS | Some `maxNativeZoom` caps: England 17, Sweden 17, Czechia/Slovakia 18, Luxembourg 19, Norway 18 |
| Espagne | Dev | PNOA LiDAR / MDT partially working |
| Italie | Dev | PCN WMS often unreliable |

- **Allemagne & Pologne** — not included: no free, direct, public tile layer available; a national WMS would require a server-side proxy.
- Some IGN overlay services previously used (`alti`, `forets`, `limites`) were removed after upstream TileMatrixSet/API changes; the 4 current overlays are validated.

## Data sources / attribution

All relief data is served from official national WMS/WMTS feeds:

- **France** — IGN Géoplateforme `data.geopf.fr` (LiDAR HD, orthos, plans, history) · Licence Ouverte Etalab 2.0
- **Flandre** — Informatie Vlaanderen DHMV II (`geo.api.vlaanderen.be`)
- **Wallonie** — SPW MNT 2021–2022 hillshade (`geoservices.wallonie.be`)
- **Suisse** — swisstopo swissALTI3D (`wmts.geo.admin.ch`)
- **Angleterre** — Environment Agency LiDAR Composite DTM 1 m (`environment.data.gov.uk`) · OGL v3.0
- **Tchéquie** — ČÚZK DMR 5G (`ags.cuzk.gov.cz`)
- **Slovaquie** — ÚGKK SR ZBGIS DMR (`zbgisws.skgeodesy.sk`)
- **Luxembourg** — ACT geoportail.lu (`wms.geoportail.lu`)
- **Suède** — Lantmäteriet höjdmodell (`minkarta.lantmateriet.se`)
- **Norvège** — Kartverket Høydedata DTM (`hoydedata.no`) · CC BY 4.0
- **Espagne** — CNIG / IDEe (PNOA LiDAR, MDT, MTN)
- **Italie** — INGV TINITALY · Geoportale Nazionale PCN · IGM

See the in-app attributions for exact credit lines.
