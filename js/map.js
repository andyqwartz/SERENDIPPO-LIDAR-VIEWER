/* SERENDIPPO-LIDAR-VIEWER — Initialisation de la carte */

/**
 * Crée la carte Leaflet, configure les panes SBS,
 * ajoute les couches initiales, le scale control et le hash routing.
 * @returns {L.Map}
 */
LV.initMap = function() {
  var cfg = LV.CONFIG;
  var map = LV.map = L.map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: { position: 'topleft' }
  }).setView([cfg.defaultView.lat, cfg.defaultView.lng], cfg.defaultView.zoom);

  // Pane gauche et droite pour la comparaison SBS
  map.createPane(LV.PANE_LEFT);
  map.getPane(LV.PANE_LEFT).style.zIndex = 300;
  map.createPane(LV.PANE_RIGHT);
  map.getPane(LV.PANE_RIGHT).style.zIndex = 300;
  map.createPane(LV.PANE_OVERLAYS);
  map.getPane(LV.PANE_OVERLAYS).style.zIndex = 400;
  map.getPane(LV.PANE_OVERLAYS).style.pointerEvents = 'none';

  LV.leftKey = cfg.leftKey;
  LV.rightKey = cfg.defaultRight;

  var lLayer = LV.getSideLayer('left', LV.leftKey);
  LV.setLayerPane(lLayer, LV.PANE_LEFT);
  lLayer.addTo(map);

  var rLayer = LV.getSideLayer('right', LV.rightKey);
  LV.setLayerPane(rLayer, LV.PANE_RIGHT);
  rLayer.addTo(map);

  // Info coordonnees
  map.on('mousemove', function(e) {
    document.getElementById('coordDisplay').textContent = LV.formatCoord(e.latlng);
  });
  map.on('zoomend', function() {
    document.getElementById('zoomDisplay').textContent = map.getZoom();
  });

  // Echelle (integree dans la barre inferieure)
  L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map);
  LV.mountScaleControl();

  // Zoom initial dans le status
  document.getElementById('zoomDisplay').textContent = map.getZoom();

  // Hash URL
  LV.initHash();

  return map;
};

/**
 * Formate des coordonnees en "lat, lng" avec 5 decimales.
 * @param {L.LatLng} latlng
 * @returns {string}
 */
LV.formatCoord = function(latlng) {
  return latlng.lat.toFixed(5) + ', ' + latlng.lng.toFixed(5);
};

/**
 * Initialise le hash URL (#lat,lng,zoom) et le met a jour au deplacement.
 */
LV.initHash = function() {
  var h = location.hash.replace('#', '').split(',');
  if (h.length === 3) {
    var la = parseFloat(h[0]), lo = parseFloat(h[1]), z = parseInt(h[2]);
    if (!isNaN(la) && !isNaN(lo) && !isNaN(z))
      LV.map.setView([la, lo], z);
  }
  LV.map.on('moveend', function() {
    var c = LV.map.getCenter();
    location.hash = c.lat.toFixed(4) + ',' + c.lng.toFixed(4) + ',' + LV.map.getZoom();
  });
};

/**
 * Deplace le scale control Leaflet dans le slot de la barre de statut.
 */
LV.mountScaleControl = function() {
  var scale = document.querySelector('.leaflet-control-scale');
  var slot = document.getElementById('scaleSlot');
  if (!scale || !slot) return;
  scale.style.position = 'static';
  scale.style.margin = '0';
  slot.appendChild(scale);
};