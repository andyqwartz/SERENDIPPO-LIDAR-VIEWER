/* SERENDIPPO-LIDAR-VIEWER — Cache de couches */

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

/** Couches actuellement empilées (top/bottom) dans chaque pane. */
LV._stack = null;

/**
 * Rassemble l'empilement des deux sources dans chaque pane.
 * Chaque pane contient deux couches : la source active de ce côté AU-DESSUS,
 * et la source de l'autre côté EN DESSOUS.
 * Assemblage via getSideLayer(side, key) : le cache fournit déjà une instance
 * par (côté, clé), donc les 4 couches nécessaires existent sans duplication.
 */
LV.rebuildStack = function() {
  var map = LV.map;
  if (!map) return;
  var LKEY = LV.leftKey, RKEY = LV.rightKey;
  var LP = LV.PANE_LEFT, RP = LV.PANE_RIGHT;

  // retire les couches empilées précédemment
  if (LV._stack) {
    LV._stack.forEach(function(l) { if (l && map.hasLayer(l)) map.removeLayer(l); });
  }
  LV._stack = [];

  function attach(layer, pane, isTop) {
    if (!layer) return;
    LV.setLayerPane(layer, pane);
    if (isTop) { if (layer.setZIndex) layer.setZIndex(30); }
    else       { if (layer.setZIndex) layer.setZIndex(10); }
    if (!map.hasLayer(layer)) layer.addTo(map);
    if (isTop && layer.bringToFront) layer.bringToFront();
    else if (!isTop && layer.bringToBack) layer.bringToBack();
    LV._stack.push(layer);
  }

  // pane gauche : gauche (active) top, droite bottom
  attach(LV.getSideLayer('left', RKEY), LP, false);
  attach(LV.getSideLayer('left', LKEY), LP, true);
  // pane droit : droite (active) top, gauche bottom
  attach(LV.getSideLayer('right', LKEY), RP, false);
  attach(LV.getSideLayer('right', RKEY), RP, true);

  // réapplique les opacités courantes + re-clippe
  if (LV.SBS) {
    if (LV.SBS.applyToCurrent) LV.SBS.applyToCurrent();
    LV.SBS.updateClip();
  }
};