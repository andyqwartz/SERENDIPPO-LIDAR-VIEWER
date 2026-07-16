# SERENDIPPO LiDAR Viewer

**Side-by-side LiDAR, satellite, orthophotos et cartes historiques dans le navigateur.** Pas de build, pas de clé API, 24 couches.

→ [Ouvrir l'application](https://andyqwartz.github.io/SERENDIPPO-LIDAR-VIEWER)

## En un coup d'œil

- **Split view** — couches gauche/droite indépendantes, slider CSS clip
- **France** (production) — LiDAR HD IGN, ortho, plans, Cassini, État-Major, SCAN50, orthos 1950-1965-1980
- **Espagne / Italie** (dev) — PNOA LiDAR, MDT, MTN, TINITALY, PCN WMS, IGM
- **Overlays** — hydrographie, cadastre, courbes de niveau, limites admin, forêts
- **Outils** — recherche géographique, bookmarks, mesure, mode nuit, fullscreen, géolocalisation

## Stack

| Technologie | Usage |
|---|---|
| [Leaflet](https://leafletjs.com/) 1.9 | Carte, WMTS, WMS |
| Vanilla JS | ~1500 lignes, zéro dépendance |
| CSS custom | Thème dark, responsive mobile/desktop |
| [api-adresse](https://adresse.data.gouv.fr/) | Géocoding communes France |
| localStorage | Bookmarks persistants |

## Architecture

```
js/
├── namespace.js        # LV — unique point d'entrée
├── config.js           # LV.CONFIG — vue par défaut, bookmarks
├── constants.js        # LV.WMTS, LV.URL, LV.ATTR (frozen)
├── layers/             # helpers, registry, factory, cache, labels, groups
├── providers/          # france.js (prod) + dev.js (ES/IT)
├── ui/                 # panels, toolRegistry, layerSelects
├── map.js, sbs.js, search.js, bookmarks.js, overlays.js, measure.js
└── app.js              # bootstrap
```

**Init flow** : `DOMContentLoaded → LV.init() → map → SBS → search → bookmarks → tools → overlays`

**Provider dispatch** : `LV.createLayer(key) → PROV_FR[key]() | PROV_DEV[key]() | switch global`

## Tests

Ouvre `tests/test.html` dans un navigateur. 30+ tests de régression vanilla JS — namespace, carte, providers, cache, SBS, bookmarks, overlays, UI.

## Provider status

| Pays | Statut | Note |
|---|---|---|
| France | **Production** | Toutes les couches stables |
| Espagne | Dev | PNOA LiDAR, MDT — partiellement fonctionnel |
| Italie | Dev | TINITALY, PCN WMS — souvent instable |

## Données

IGN Géoplateforme, IDEe/CNIG, TINITALY/INGV, Geoportale PCN, Google, Esri, OSM.

## Licence

Données © leurs fournisseurs respectifs. Code : utilisation libre.