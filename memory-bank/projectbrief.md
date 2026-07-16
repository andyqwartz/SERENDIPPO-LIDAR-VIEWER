# Project Brief : SERENDIPPO LiDAR Viewer

**Author:** Andy
**Date:** 2026-07-15

**Objective:**
Browser-based side-by-side LiDAR viewer comparing IGN LiDAR HD with satellite, orthophotos, and historical maps. Static files only — no build step, no API key.

**Core Concept:**
Split-view (SBS slider) with independent left/right layers, transparent overlays, search, bookmarks, and measurement tools. Focus on France, with Spain and Italy as secondary providers.

**Scope:**
- Static HTML+JS+CSS (no frameworks, no build)
- Leaflet-based map with WMTS/WMS tile sources
- 30+ layer providers across 3 countries
- 4 overlay types (hydro, cadastre, contours, forests, admin limits, altimetry)
- No backend, no database, no authentication