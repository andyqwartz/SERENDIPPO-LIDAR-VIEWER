/* SERENDIPPO-LIDAR-VIEWER — Couches tuiles (dispatch + helpers) */
var LV = window.LV || {};
LV.PANE_LEFT = 'leftPane';
LV.PANE_RIGHT = 'rightPane';
LV.PANE_OVERLAYS = 'overlaysPane';

// ── Helpers de création ──

/** WMTS IGN (Geoplateforme, PM / EPSG:2154 tiles) */
LV.ignWMTS = function(layer, tms, format, opts) {
  return L.tileLayer(LV.URL.IGN_WMTS + '?LAYER=' + layer + '&STYLE=normal&TILEMATRIXSET=' + tms + '&FORMAT=image/' + format + '&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', opts || {});
};

/** WMTS GoogleMapsCompatible (IDEe, IGN-CNIG Espagne…) */
function gmWMTS(base, layer, style, format, opts) {
  var q = base + (base.indexOf('?') >= 0 ? '&' : '?') +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
    '&LAYER=' + encodeURIComponent(layer) +
    '&STYLE=' + encodeURIComponent(style || 'default') +
    '&FORMAT=' + encodeURIComponent('image/' + format) +
    '&TILEMATRIXSET=' + LV.WMTS.GMC +
    '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
  return L.tileLayer(q, opts || {});
}

/** WMS 1.3.0 tuilé en Web Mercator */
function wms3857(url, layers, opts) {
  return L.tileLayer.wms(url, L.extend({
    layers: layers,
    format: 'image/' + LV.IMG.PNG,
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG3857
  }, opts || {}));
}

// ── Dispatch vers les registres de providers ──

LV.createLayer = function(key) {
  // France (production)
  if (LV.PROV_FR && LV.PROV_FR[key]) return LV.PROV_FR[key]();
  // Dev (Espagne, Italie)
  if (LV.PROV_DEV && LV.PROV_DEV[key]) return LV.PROV_DEV[key]();
  // Global (built-in)
  switch (key) {
    case 'arcgis':
      return L.tileLayer(LV.URL.ARCGIS, { maxZoom: 19, attribution: LV.ATTR.ESRI });
    case 'satellite':
      return L.tileLayer(LV.URL.GOOGLE_S, { maxZoom: 20, attribution: LV.ATTR.GOOGLE });
    case 'hybrid':
      return L.tileLayer(LV.URL.GOOGLE_Y, { maxZoom: 20, attribution: LV.ATTR.GOOGLE });
    case 'osm':
      return L.tileLayer(LV.URL.OSM, { maxZoom: 19, attribution: LV.ATTR.OSM });
    default:
      return null;
  }
};

// ── Cache ──

LV._sideCache = { left: {}, right: {} };

LV.getSideLayer = function(side, key) {
  if (!LV._sideCache[side][key]) {
    LV._sideCache[side][key] = LV.createLayer(key);
  }
  return LV._sideCache[side][key];
};

LV.setLayerPane = function(layer, pane) {
  if (!layer) return;
  if (layer.eachLayer) {
    layer.eachLayer(function(l) { l.options.pane = pane; });
  } else {
    layer.options.pane = pane;
  }
};

// ── Groupes et labels ──

LV.LAYER_GROUPS = [
  {
    label: 'France',
    keys: ['lidar', 'mns', 'ortho', 'hrortho', 'planign', 'bduni', 'cassini', 'etatmajor',
      'scan50', 'ortho1950', 'ortho1965', 'scan25', 'superposed']
  },
  {
    label: 'Espagne',
    keys: ['lidar_es', 'mdt_es', 'es_ortho', 'es_mtn50', 'es_mtn25']
  },
  {
    label: 'Italie',
    keys: ['lidar_it', 'mdt_it', 'it_igm25']
  },
  {
    label: 'Global',
    keys: ['satellite', 'hybrid', 'arcgis', 'osm']
  }
];

LV.SELECTABLE_LAYERS = LV.LAYER_GROUPS.reduce(function(acc, g) {
  return acc.concat(g.keys);
}, []);

LV.LAYER_NAMES = {
  lidar: 'LiDAR HD MNT (IGN)',
  mns: 'MNS LiDAR HD (sursol)',
  ortho: 'Ortho HR (IGN)',
  hrortho: 'Ortho HR (IGN)',
  planign: 'Plan IGN V2',
  bduni: 'Plan IGN J+1',
  cassini: 'Cassini (XVIIIe)',
  etatmajor: 'Etat-Major (XIXe)',
  scan50: 'SCAN50 1950',
  ortho1950: 'Ortho 1950-1965',
  ortho1965: 'Ortho 1965-1980',
  scan25: 'Scan 25 (IGN)',
  superposed: 'Google + IGN (superpose)',
  lidar_es: 'LiDAR PNOA (Espagne)',
  mdt_es: 'MDT relief (Espagne)',
  es_ortho: 'Ortho PNOA (Espagne)',
  es_mtn50: 'MTN50 1re ed. (Espagne)',
  es_mtn25: 'MTN25 1re ed. (Espagne)',
  mdt_it: 'MNT TINITALY 10 m (Italie)',
  lidar_it: 'LiDAR PCN WMS 2m (Italie)',
  it_igm25: 'IGM 1:25 000 (Italie)',
  satellite: 'Google Satellite',
  hybrid: 'Google Satellite + Labels',
  arcgis: 'ArcGIS World Imagery',
  osm: 'OpenStreetMap'
};