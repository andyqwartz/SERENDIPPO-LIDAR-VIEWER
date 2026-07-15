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
| [DTM Europe (Autriche)](https://data.opendataportal.at/dataset/dtm-europe) | MNT homogène EU (téléchargement) |
| [Virtual Terrain Project EU](https://vterrain.org/Locations/eu/) | Index LiDAR européen |
| Google Maps tiles | Satellite / hybrid |
| Esri | World Imagery |
| OpenStreetMap | OSM basemap |
| [api-adresse](https://adresse.data.gouv.fr/) | Geocoding (France) |

## Structure

```
index.html          Entry point
css/style.css       UI
js/
  config.js         Defaults & bookmarks
  layers.js         Tile layers
  map.js            Map init
  sbs.js            Split slider
  search.js         Geocoding
  bookmarks.js      Saved places
  overlays.js       Transparent layers
  tools.js          Toolbar
  measure.js        Distance tool
  app.js            Bootstrap
```

## License

Data © respective providers (IGN, Google, Esri, OSM). Code: use freely.
