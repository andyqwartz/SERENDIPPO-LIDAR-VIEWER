/* SERENDIPPO-LIDAR-VIEWER — Couches tuiles */
var LV = window.LV || {};
LV.PANE_LEFT = 'leftPane';
LV.PANE_RIGHT = 'rightPane';
LV.PANE_OVERLAYS = 'overlaysPane';

// Helper WMTS IGN (Geoplateforme, PM / EPSG:2154 tiles)
LV.ignWMTS = function(layer, tms, format, opts) {
  return L.tileLayer(LV.URL.IGN_WMTS + '?LAYER=' + layer + '&STYLE=normal&TILEMATRIXSET=' + tms + '&FORMAT=image/' + format + '&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', opts || {});
};

// WMTS GoogleMapsCompatible (IDEe, IGN-CNIG Espagne…)
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

// WMS 1.3.0 tuilé en Web Mercator
function wms3857(url, layers, opts) {
  return L.tileLayer.wms(url, L.extend({
    layers: layers,
    format: 'image/' + LV.IMG.PNG,
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG3857
  }, opts || {}));
}

LV.createLayer = function(key) {
  switch (key) {
    case 'lidar':
      return LV.ignWMTS('IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW', LV.WMTS.PM, LV.IMG.PNG, {
        maxZoom: 19, attribution: LV.ATTR.IGN_LIDAR
      });
    case 'arcgis':
      return L.tileLayer(LV.URL.ARCGIS, {
        maxZoom: 19, attribution: LV.ATTR.ESRI
      });
    case 'satellite':
      return L.tileLayer(LV.URL.GOOGLE_S, { maxZoom: 20, attribution: LV.ATTR.GOOGLE });
    case 'hybrid':
      return L.tileLayer(LV.URL.GOOGLE_Y, { maxZoom: 20, attribution: LV.ATTR.GOOGLE });
    case 'ortho':
      return LV.ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS', LV.WMTS.PM, LV.IMG.JPEG, {
        maxZoom: 19, attribution: LV.ATTR.IGN
      });
    case 'mns':
      return LV.ignWMTS('IGNF_LIDAR-HD_MNS_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW', LV.WMTS.PM_0_18, LV.IMG.PNG, {
        maxZoom: 18, attribution: LV.ATTR.IGN_MNS
      });
    case 'planign':
      return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', LV.WMTS.PM_0_19, LV.IMG.PNG, {
        maxZoom: 19, attribution: LV.ATTR.IGN_PLAN
      });
    case 'bduni':
      return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1', LV.WMTS.PM_0_18, LV.IMG.PNG, {
        maxZoom: 18, attribution: LV.ATTR.IGN_J1
      });
    case 'cassini':
      return LV.ignWMTS('BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI', LV.WMTS.PM_6_14, LV.IMG.PNG, {
        maxZoom: 14, attribution: LV.ATTR.IGN_CASSINI
      });
    case 'etatmajor':
      return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40', LV.WMTS.PM, LV.IMG.JPEG, {
        maxZoom: 16, attribution: LV.ATTR.IGN_EM
      });
    case 'scan50':
      return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN50.1950', LV.WMTS.PM_3_15, LV.IMG.JPEG, {
        maxZoom: 15, attribution: LV.ATTR.IGN_SCAN50
      });
    case 'ortho1950':
      return LV.ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS.1950-1965', LV.WMTS.PM, LV.IMG.JPEG, {
        maxZoom: 18, attribution: LV.ATTR.IGN_ORTHO50
      });
    case 'ortho1965':
      return LV.ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS.1965-1980', LV.WMTS.PM, LV.IMG.JPEG, {
        maxZoom: 18, attribution: LV.ATTR.IGN_ORTHO65
      });
    case 'hrortho':
      return LV.ignWMTS('HR.ORTHOIMAGERY.ORTHOPHOTOS', LV.WMTS.PM_6_19, LV.IMG.JPEG, {
        maxZoom: 19, attribution: LV.ATTR.IGN_HR
      });
    case 'osm':
      return L.tileLayer(LV.URL.OSM, { maxZoom: 19, attribution: LV.ATTR.OSM });
    case 'scan25':
      return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR', LV.WMTS.PM, LV.IMG.JPEG, { maxZoom: 19, attribution: LV.ATTR.IGN_SCAN25 });
    case 'superposed':
      return L.layerGroup([
        L.tileLayer(LV.URL.GOOGLE_S, { maxZoom: 20 }),
        LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1', LV.WMTS.PM_0_18, LV.IMG.PNG, { maxZoom: 18, opacity: 0.5, attribution: '© Google / IGN — Plan J+1' })
      ]);
    // ── Espagne (IDEe / IGN-CNIG) ──
    case 'lidar_es':
      return gmWMTS(LV.URL.ES_LIDAR, 'EL.GridCoverageDSM', 'default', 'png', {
        maxZoom: 17, attribution: LV.ATTR.ES_LIDAR
      });
    case 'mdt_es':
      return gmWMTS(LV.URL.ES_MDT, 'Relieve', 'default', 'jpeg', {
        maxZoom: 17, attribution: LV.ATTR.ES_MDT
      });
    case 'es_ortho':
      return gmWMTS(LV.URL.ES_PNOA, 'OI.OrthoimageCoverage', 'default', 'jpeg', {
        maxZoom: 19, attribution: LV.ATTR.ES_ORTHO
      });
    case 'es_mtn50':
      return gmWMTS(LV.URL.ES_MTN, 'mtn50-edicion1', 'default', 'jpeg', {
        maxZoom: 15, attribution: LV.ATTR.ES_MTN50
      });
    case 'es_mtn25':
      return gmWMTS(LV.URL.ES_MTN, 'mtn25-edicion1', 'default', 'jpeg', {
        maxZoom: 16, attribution: LV.ATTR.ES_MTN25
      });
    // ── Italie (TINITALY / PCN / IGM) ──
    case 'mdt_it':
      return wms3857(LV.URL.IT_TINITALY, 'tinitaly_hshd', {
        maxZoom: 15, attribution: LV.ATTR.IT_MDT
      });
    case 'lidar_it':
      return L.layerGroup([
        wms3857(LV.URL.IT_PCN + 'LIDAR_PIEMONTE.map', 'EL.LIDAR.PIEMONTE.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Piémont' }),
        wms3857(LV.URL.IT_PCN + 'LIDAR_LOMBARDIA.map', 'EL.LIDAR.LOMBARDIA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Lombardie' }),
        wms3857(LV.URL.IT_PCN + 'LIDAR_VENETO.map', 'EL.LIDAR.VENETO.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Vénétie' }),
        wms3857(LV.URL.IT_PCN + 'LIDAR_TOSCANA.map', 'EL.LIDAR.TOSCANA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Toscane' }),
        wms3857(LV.URL.IT_PCN + 'LIDAR_LAZIO.map', 'EL.LIDAR.LAZIO.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Latium' }),
        wms3857(LV.URL.IT_PCN + 'LIDAR_SICILIA.map', 'EL.LIDAR.SICILIA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Sicile' }),
        wms3857(LV.URL.IT_PCN + 'LIDAR_SARDEGNA.map', 'EL.LIDAR.SARDEGNA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Sardaigne' }),
      ]);
    case 'it_igm25':
      return wms3857(LV.URL.IT_IGM, 'CB.IGM25000.32,CB.IGM25000.33', {
        maxZoom: 16, transparent: false, attribution: LV.ATTR.IT_IGM
      });
    default:
      return null;
  }
};

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
