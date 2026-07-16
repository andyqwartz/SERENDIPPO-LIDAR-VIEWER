/* SERENDIPPO-LIDAR-VIEWER — Cache de couches */
var LV = window.LV || {};

/**
 * Cache simple par côté (left/right).
 * Évite de recréer les mêmes couches Leaflet.
 */
LV._sideCache = { left: {}, right: {} };

/**
 * Récupère une couche depuis le cache, ou la crée si absente.
 * @param {string} side - 'left' ou 'right'
 * @param {string} key - Identifiant de couche
 * @returns {L.TileLayer|L.LayerGroup|null}
 */
LV.getSideLayer = function(side, key) {
  if (!LV._sideCache[side][key]) {
    LV._sideCache[side][key] = LV.createLayer(key);
  }
  return LV._sideCache[side][key];
};

/**
 * Affecte une couche à un pane Leaflet.
 * Supporte les LayerGroup (eachLayer) et les couches simples.
 * @param {L.TileLayer|L.LayerGroup} layer
 * @param {string} pane - Nom du pane
 */
LV.setLayerPane = function(layer, pane) {
  if (!layer) return;
  if (layer.eachLayer) {
    layer.eachLayer(function(l) { l.options.pane = pane; });
  } else {
    layer.options.pane = pane;
  }
};