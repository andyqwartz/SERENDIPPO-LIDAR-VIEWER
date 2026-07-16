/* SERENDIPPO-LIDAR-VIEWER — Barrel: charge tous les sous-modules UI */

/**
 * Initialisation de tous les outils.
 */
LV.TOOLS.init = function() {
  Object.keys(LV.TOOLS).forEach(function(id) {
    var btn = document.getElementById(id);
    var tool = LV.TOOLS[id];
    if (btn) {
      btn.onclick = function() { tool.on(btn); };
      btn.title = tool.label || '';
    }
  });

  // GPS marker
  LV.map.on('locationfound', function(e) {
    if (LV.gpsMkr) LV.map.removeLayer(LV.gpsMkr);
    LV.gpsMkr = L.circleMarker(e.latlng, {
      radius: 8,
      fillColor: '#58a6ff',
      color: '#fff',
      weight: 2,
      fillOpacity: 0.8
    }).addTo(LV.map).bindPopup('Vous êtes ici').openPopup();
  });

  // Selecteurs de couches gauche / droite
  LV.TOOLS.initLayerSelects();

  // Resize
  window.addEventListener('resize', function() {
    LV.UI.repositionOpenPanels();
    if (LV.map) LV.map.invalidateSize();
  });
  window.matchMedia(LV.UI.MOBILE_MQ).addEventListener('change', function() {
    LV.UI.repositionOpenPanels();
    if (LV.map) LV.map.invalidateSize();
  });
};