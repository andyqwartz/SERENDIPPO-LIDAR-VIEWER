/* SERENDIPPO-LIDAR-VIEWER — Overlays transparents (au-dessus des deux panes) */
var LV = window.LV || {};

LV.OVERLAYS = {};

LV.OVERLAY_DEFS = {
  hydro:   { name: 'Reseau hydro',      layer: null, active: false },
  cadastre:{ name: 'Cadastre',          layer: null, active: false },
  contour: { name: 'Courbes niveau',    layer: null, active: false },
  limites: { name: 'Limites admin',     layer: null, active: false },
  forets:  { name: 'Forets publiques',  layer: null, active: false },
  ignj1:   { name: 'Plan IGN J+1',      layer: null, active: false },
  alti:    { name: 'Altimetrie',        layer: null, active: false },
};

LV.OVERLAYS.init = function() {
  Object.keys(LV.OVERLAY_DEFS).forEach(function(id) {
    var def = LV.OVERLAY_DEFS[id];
    var layer = null;
    switch (id) {
      case 'hydro':
        layer = LV.ignWMTS('HYDROGRAPHY.HYDROGRAPHY', LV.WMTS.PM, LV.IMG.PNG, { maxZoom: 19, opacity: 0.55, attribution: 'IGN — Hydrographie' }); break;
      case 'cadastre':
        layer = LV.ignWMTS('CADASTRALPARCELS.PARCELLAIRE_EXPRESS', LV.WMTS.PM, LV.IMG.PNG, { maxZoom: 19, opacity: 0.5, attribution: 'IGN — Cadastre' }); break;
      case 'contour':
        layer = LV.ignWMTS('ELEVATION.CONTOUR.LINE', LV.WMTS.PM, LV.IMG.PNG, { maxZoom: 19, opacity: 0.65, attribution: 'IGN — Courbes niveau' }); break;
      case 'limites':
        layer = LV.ignWMTS('ADMINEXPRESS-COG-CARTO-PE.LATEST', LV.WMTS.PM, LV.IMG.PNG, { maxZoom: 19, opacity: 0.45, attribution: 'IGN — Limites admin' }); break;
      case 'forets':
        layer = LV.ignWMTS('FORETS.PUBLIQUES', LV.WMTS.PM, LV.IMG.PNG, { maxZoom: 19, opacity: 0.4, attribution: 'ONF — Forets' }); break;
      case 'ignj1':
        layer = LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1', LV.WMTS.PM_0_18, LV.IMG.PNG, { maxZoom: 18, opacity: 0.5, attribution: 'IGN — Plan J+1' }); break;
      case 'alti':
        layer = LV.ignWMTS('ELEVATION.ELEVATIONGRIDCOVERAGE', LV.WMTS.PM, LV.IMG.PNG, { maxZoom: 19, opacity: 0.5, attribution: 'IGN — Altimetrie' }); break;
    }
    if (layer) {
      layer.options.pane = LV.PANE_OVERLAYS;
      def.layer = layer;
    }
  });
};

LV.OVERLAYS.toggle = function(id) {
  var def = LV.OVERLAY_DEFS[id];
  if (!def || !def.layer) return;
  if (def.active) { LV.map.removeLayer(def.layer); def.active = false; }
  else { LV.map.addLayer(def.layer); def.active = true; }
  LV.OVERLAYS.updateUI();
};

LV.OVERLAYS.updateUI = function() {
  var panel = document.getElementById('overlaysPanel');
  if (!panel) return;
  var list = panel.querySelector('.overlays-list');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(LV.OVERLAY_DEFS).forEach(function(id) {
    var def = LV.OVERLAY_DEFS[id];
    var item = document.createElement('label');
    item.className = 'overlay-item';
    item.innerHTML = '<input type="checkbox" ' + (def.active ? 'checked' : '') + ' data-id="' + id + '"> <span>' + def.name + '</span>';
    item.querySelector('input').onchange = function() { LV.OVERLAYS.toggle(id); };
    list.appendChild(item);
  });
};

LV.OVERLAYS.togglePanel = function() {
  LV.UI.togglePanel('overlaysPanel', 'btn-overlays', function() {
    LV.OVERLAYS.updateUI();
  });
};