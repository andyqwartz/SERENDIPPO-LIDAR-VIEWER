/* SERENDIPPO-LIDAR-VIEWER — Couches tuiles */
var LV = window.LV || {};
LV.PANE_LEFT = 'leftPane';
LV.PANE_RIGHT = 'rightPane';
LV.PANE_OVERLAYS = 'overlaysPane';

// Helper WMTS IGN
function ignWMTS(layer, tms, format, opts) {
  return L.tileLayer('https://data.geopf.fr/wmts?LAYER=' + layer + '&STYLE=normal&TILEMATRIXSET=' + tms + '&FORMAT=image/' + format + '&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', opts || {});
}

LV.createLayer = function(key) {
  switch (key) {
    case 'lidar':
      return ignWMTS('IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW', 'PM', 'png', {
        maxZoom: 19, attribution: 'IGN-F — LiDAR HD MNT'
      });
    case 'arcgis':
      return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, attribution: 'Esri, Maxar, Earthstar'
      });
    case 'satellite':
      return L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '© Google' });
    case 'hybrid':
      return L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 20, attribution: '© Google' });
    case 'ortho':
      return L.tileLayer('https://data.geopf.fr/wmts?LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
        maxZoom: 19, attribution: '© IGN-F'
      });
    case 'mns':
      return ignWMTS('IGNF_LIDAR-HD_MNS_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW', 'PM_0_18', 'png', {
        maxZoom: 18, attribution: 'IGN-F — LiDAR HD MNS (sursol)'
      });
    case 'planign':
      return ignWMTS('GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', 'PM_0_19', 'png', {
        maxZoom: 19, attribution: '© IGN — Plan IGN V2'
      });
    case 'bduni':
      return ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1', 'PM_0_18', 'png', {
        maxZoom: 18, attribution: '© IGN — Plan IGN J+1'
      });
    case 'cassini':
      return ignWMTS('BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI', 'PM_6_14', 'png', {
        maxZoom: 14, attribution: 'BNF/IGN — Cassini (XVIIIe)'
      });
    case 'etatmajor':
      return ignWMTS('GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40', 'PM', 'jpeg', {
        maxZoom: 16, attribution: 'IGN — Etat-Major (XIXe)'
      });
    case 'scan50':
      return ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN50.1950', 'PM_3_15', 'jpeg', {
        maxZoom: 15, attribution: 'IGN — SCAN50 1950'
      });
    case 'ortho1950':
      return ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS.1950-1965', 'PM', 'jpeg', {
        maxZoom: 18, attribution: 'IGN — Ortho 1950-1965'
      });
    case 'ortho1965':
      return ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS.1965-1980', 'PM', 'jpeg', {
        maxZoom: 18, attribution: 'IGN — Ortho 1965-1980'
      });
    case 'hrortho':
      return ignWMTS('HR.ORTHOIMAGERY.ORTHOPHOTOS', 'PM_6_19', 'jpeg', {
        maxZoom: 19, attribution: '© IGN — Ortho HR'
      });
    case 'osm':
      return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
    case 'scan25':
      return ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR', 'PM', 'jpeg', { maxZoom: 19, attribution: '© IGN-F' });
    case 'superposed':
      return L.layerGroup([
        L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20 }),
        ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1', 'PM_0_18', 'png', { maxZoom: 18, opacity: 0.5, attribution: '© Google / IGN — Plan J+1' })
      ]);
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

LV.SELECTABLE_LAYERS = [
  'lidar', 'arcgis', 'satellite', 'hybrid', 'ortho', 'mns', 'planign', 'bduni',
  'cassini', 'etatmajor', 'scan50', 'ortho1950', 'ortho1965', 'hrortho',
  'superposed', 'osm', 'scan25'
];

LV.LAYER_NAMES = {
  lidar: 'LiDAR HD MNT (IGN)',
  arcgis: 'ArcGIS World Imagery',
  satellite: 'Google Satellite',
  hybrid: 'Google Satellite + Labels',
  ortho: 'Ortho HR (IGN)',
  mns: 'MNS LiDAR HD (sursol)',
  planign: 'Plan IGN V2',
  bduni: 'Plan IGN J+1',
  cassini: 'Cassini (XVIIIe)',
  etatmajor: 'Etat-Major (XIXe)',
  scan50: 'SCAN50 1950',
  ortho1950: 'Ortho 1950-1965',
  ortho1965: 'Ortho 1965-1980',
  hrortho: 'Ortho HR (IGN)',
  superposed: 'Google + IGN (superpose)',
  osm: 'OpenStreetMap',
  scan25: 'Scan 25 (IGN)'
};
