# SERENDIPPO LiDAR Viewer

Compare **IGN LiDAR HD** with satellite imagery, orthophotos and historical maps — side by side, in the browser. France, Spain and Italy.

No build step. No API key. Static files only.

## Features

- Split view (slider) — independent left & right layers
- 24 backgrounds: France (LiDAR, ortho, plans, Cassini…), Spain (PNOA LiDAR, MDT, MTN), Italy (TINITALY, PCN LiDAR, IGM)
- Transparent overlays: cadastre, hydro, contours, forests…
- Search with autocomplete (communes + coordinates)
- Bookmarks, measure tool, night mode, fullscreen

## Data sources

| Source | Use |
|--------|-----|
| [IGN Géoplateforme](https://geoservices.ign.fr/) | LiDAR HD, ortho, plans, cadastre (France) |
| [IDEe / CNIG](https://www.idee.es/) | LiDAR PNOA, MDT, ortho, MTN historique (Espagne) |
| [TINITALY / INGV](https://tinitaly.pi.ingv.it/) | MNT 10 m national (Italie) |
| [Geoportale PCN](http://www.pcn.minambiente.it/) | LiDAR régional, IGM 1:25 000 (Italie) |
| Google Maps tiles | Satellite / hybrid |
| Esri | World Imagery |
| OpenStreetMap | OSM basemap |
| [api-adresse](https://adresse.data.gouv.fr/) | Geocoding (France) |

## Architecture

### Files

```
index.html              Entry point + DOM + script loading order
css/style.css           Dark theme, responsive (mobile/desktop)
js/
  namespace.js          LV namespace — loaded first
  config.js             LV.CONFIG — defaults, bookmarks, SBS limits
  constants.js          LV.WMTS, LV.IMG, LV.URL, LV.ATTR (frozen)

  layers.js             Barrel — PANE constants only
  layers/
    layerHelpers.js     ignWMTS, gmWMTS, wms3857
    providerRegistry.js LV.ProviderRegistry — extensible registry
    providerFactory.js  LV.createLayer — dispatch to providers
    layerCache.js       LV._sideCache, getSideLayer, setLayerPane
    layerLabels.js      LV.LAYER_NAMES
    layerGroups.js      LV.LAYER_GROUPS, SELECTABLE_LAYERS

  providers/
    france.js           LV.PROV_FR — production providers (France)
    dev.js              LV.PROV_DEV — dev providers (Spain, Italy)

  map.js                LV.initMap, formatCoord, initHash, mountScaleControl
  sbs.js                LV.SBS — split slider
  search.js             LV.Search — geocoding
  bookmarks.js          LV.Bookmarks — localStorage
  overlays.js           LV.OVERLAYS — transparent overlays

  ui/
    panels.js           LV.UI — panel management, positioning
    toolRegistry.js     LV.TOOLS — tool definitions, registry
    layerSelects.js     Layer selector init + switchLayer
  tools.js              Barrel — TOOLS.init

  measure.js            LV.Measure — distance measurement
  app.js                LV.init — bootstrap sequence
```

### Provider System

```
LV.createLayer(key)
  → LV.PROV_FR[key]()    (France — production)
  → LV.PROV_DEV[key]()   (Spain, Italy — dev)
  → built-in switch       (satellite, hybrid, arcgis, osm)
```

Each provider is a function returning a Leaflet layer. The `ProviderRegistry` provides an extensible alternative.

### Initialization Flow

```
DOMContentLoaded → LV.init()
  → LV.initMap()            map + panes + layers + hash
  → LV.SBS.init()           slider + drag
  → LV.Search.init()        geocoding
  → LV.Bookmarks.load()     localStorage
  → LV.Bookmarks.render()   DOM
  → LV.TOOLS.init()         toolbar + layer selects
  → LV.OVERLAYS.init()      overlay layers
  → LV.initPanels()         panel close buttons + Escape
```

### Cache

```
LV._sideCache = { left: {}, right: {} }
LV.getSideLayer(side, key) → cache[side][key] ||= createLayer(key)
```

Simple object cache. No eviction needed for ~24 layers. Prevents duplicate Leaflet layer instances.

### Provider Status

| Provider | Status | Notes |
|----------|--------|-------|
| France | **Production** | All layers stable |
| Spain | Dev | PNOA LiDAR, MDT, MTN — partially working |
| Italy | Dev | TINITALY, PCN WMS, IGM — often unreliable |

## Development

### Testing

Open `tests/test.html` in a browser to run the regression test suite (30+ tests).

### Adding a Provider

1. Add factory function to the appropriate provider file
2. Add entry to `LAYER_NAMES` and `LAYER_GROUPS`
3. Or use `LV.ProviderRegistry.register(key, factory, meta)`

## License

Data © respective providers (IGN, Google, Esri, OSM). Code: use freely.