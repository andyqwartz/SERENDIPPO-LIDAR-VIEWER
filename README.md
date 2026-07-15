# SERENDIPPO LiDAR Viewer

Compare **IGN LiDAR HD** with satellite imagery, orthophotos and historical maps — side by side, in the browser.

No build step. No API key. Static files only.

## Features

- Split view (slider) — independent left & right layers
- 17 backgrounds: LiDAR MNT/MNS, Google, IGN ortho, Plan IGN, Cassini, SCAN…
- Transparent overlays: cadastre, hydro, contours, forests…
- Search with autocomplete (communes + coordinates)
- Bookmarks, measure tool, night mode, fullscreen

## Data sources

| Source | Use |
|--------|-----|
| [IGN Géoplateforme](https://geoservices.ign.fr/) | LiDAR HD, ortho, plans, cadastre |
| Google Maps tiles | Satellite / hybrid |
| Esri | World Imagery |
| OpenStreetMap | OSM basemap |
| [api-adresse](https://adresse.data.gouv.fr/) | Geocoding |

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
