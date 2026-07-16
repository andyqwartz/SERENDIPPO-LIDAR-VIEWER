# Active Context : SERENDIPPO LiDAR Viewer

**Current Focus:**
Global refactoring & architecture optimization (conservative — no behavior changes).

**Recent Changes:**
- SBS handle: unified drag/tap, fixed mobile double-toggle
- Favicon + apple-touch-icon added
- Italian LiDAR WMS: 16 regions → 7 stable regions (Ombrie removed, 500 error)
- European DTM reference removed (no tile service available)
- favicon.ico added to project root

**Next Steps:**
1. Remove dead code (`arcgisExport`, `PCN_LIDAR` constant)
2. Deduplicate `ignWMTS` helper (currently in both `layers.js` and `overlays.js`)
3. Isolate Italian/Spain dev providers from production (France)
4. Extract constants (WMTS matrix sets, attribution strings, URLs)
5. Separate `layers.js` into: provider registry + factory + labels + groups
6. Add minimal test suite (regression protection)
7. Update README architecture docs

**Active Decisions:**
- France = production provider only
- Spain + Italy = development providers (isolated, not deleted)
- No npm, no build tools, no TypeScript
- Minimal test suite, not over-engineered