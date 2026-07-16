# Progress : SERENDIPPO LiDAR Viewer

**What works:**
- Map init with split panes
- SBS slider (drag + toggle)
- 30+ layer providers (France, Spain, Italy)
- Transparent overlays (7 types)
- Search with autocomplete (France)
- Bookmarks (localStorage)
- Measure tool (2-point distance)
- Night mode, fullscreen
- Mobile responsive
- Layer selectors (left/right independent)

**What's left (refactoring):**
- [ ] Remove dead code (arcgisExport, PCN_LIDAR, unused constants)
- [ ] Deduplicate ignWMTS helper
- [ ] Isolate dev providers (Spain, Italy)
- [ ] Extract constants (matrix sets, attribution, URLs)
- [ ] Separate layers.js concerns
- [ ] Add regression tests
- [ ] Update README architecture

**Known issues:**
- SBS handle sometimes gets stuck on mobile (partial fix applied)
- Italian WMS Umbria returns 500 (removed)
- No error handling for failing tile sources
- All state on global `window.LV` — no encapsulation
- `layers.js` mixes factory, config, cache, labels, groups
- `ignWMTS` duplicated in `layers.js` and `overlays.js`