# Project Intelligence : SERENDIPPO LiDAR Viewer

**Patterns Identified:**
- `var LV = window.LV || {}` — global namespace pattern used in every module
- `LV.init()` bootstrap calls each module's init in sequence
- Layer creation via `switch/case` in `createLayer(key)`
- Toolbar buttons registered via `LV.TOOLS` object
- Overlays defined as `LV.OVERLAY_DEFS` object

**User Preferences:**
- Dark theme (#111 bg, #1a1a1a surface, #4a9eff accent)
- No emojis, technical minimalist design
- French labels, French UI
- Horizontal toolbar pill on mobile, vertical on desktop
- Preference for WMS over ArcGIS Export for Italian data

**Lessons Learned:**
- Italian WMS Umbria map returns 500 → verify before adding
- SBS drag + click conflict on mobile → use unified handler with dragMoved flag
- `click` event doesn't fire after `touchstart` + `preventDefault()` on mobile
- Touch events need `{ passive: false }` for `preventDefault()` to work
- LayerGroup with many WMS sub-layers causes N tile requests per tile → keep region count low

**Pitfalls to Avoid:**
- Never push without user validation
- Never return `null` from `createLayer()` — breaks layer selector
- Avoid 16+ simultaneous WMS layers → too many HTTP requests
- Don't use `e.preventDefault()` unconditionally in touch handlers (kills click events)
- Verify WMS capabilities before hardcoding layer names