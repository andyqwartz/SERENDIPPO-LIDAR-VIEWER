# Product Context : SERENDIPPO LiDAR Viewer

**Why this project?**
Compare LiDAR HD terrain data with other cartographic sources interactively in the browser. Purpose: archaeological prospection, terrain analysis, landscape reading.

**Problems solved:**
- Side-by-side comparison of LiDAR with satellite, ortho, plans, historical maps
- No local GIS software required
- No API keys or registration
- Works on desktop and mobile

**How it works:**
- Vertical split slider clips two Leaflet map panes
- Left pane usually LiDAR, right pane satellite/ortho/plan
- Transparent overlays (cadastre, hydro, contours) on top of both
- Search by commune name or coordinates (France API)
- Bookmarks saved to localStorage
- Measure tool: 2-point distance with pixel scale

**Goals:**
- Fast, reliable comparison viewer
- Extensible to new countries
- Fully static (no backend)