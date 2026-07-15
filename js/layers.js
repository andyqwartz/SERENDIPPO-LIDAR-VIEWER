/* SERENDIPPO-LIDAR-VIEWER — Couches tuiles */
var LV = window.LV || {};
LV.PANE_LEFT = 'leftPane';
LV.PANE_RIGHT = 'rightPane';
LV.PANE_OVERLAYS = 'overlaysPane';

// Helper WMTS IGN (Geoplateforme, PM / EPSG:2154 tiles)
function ignWMTS(layer, tms, format, opts) {
  return L.tileLayer('https://data.geopf.fr/wmts?LAYER=' + layer + '&STYLE=normal&TILEMATRIXSET=' + tms + '&FORMAT=image/' + format + '&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', opts || {});
}

// WMTS GoogleMapsCompatible (IDEe, IGN-CNIG Espagne…)
function gmWMTS(base, layer, style, format, opts) {
  var q = base + (base.indexOf('?') >= 0 ? '&' : '?') +
    'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0' +
    '&LAYER=' + encodeURIComponent(layer) +
    '&STYLE=' + encodeURIComponent(style || 'default') +
    '&FORMAT=' + encodeURIComponent('image/' + format) +
    '&TILEMATRIXSET=GoogleMapsCompatible' +
    '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}';
  return L.tileLayer(q, opts || {});
}

// WMS 1.3.0 tuilé en Web Mercator
function wms3857(url, layers, opts) {
  return L.tileLayer.wms(url, L.extend({
    layers: layers,
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG3857
  }, opts || {}));
}

// Export dynamique ArcGIS MapServer (LiDAR régional Italie)
function arcgisExport(serviceUrl, layerId, opts) {
  return L.tileLayer('', L.extend({}, opts, {
    getTileUrl: function(coords) {
      var tileSize = this.getTileSize();
      var nwPoint = coords.scaleBy(tileSize);
      var sePoint = nwPoint.add(tileSize);
      var nw = this._map.unproject(nwPoint, coords.z);
      var se = this._map.unproject(sePoint, coords.z);
      var crs = this._map.options.crs;
      var sw = crs.project(L.latLng(se.lat, nw.lng));
      var ne = crs.project(L.latLng(nw.lat, se.lng));
      return serviceUrl + '/export?f=image&format=png&transparent=true' +
        '&size=' + tileSize.x + ',' + tileSize.y +
        '&bbox=' + sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y +
        '&bboxSR=3857&imageSR=3857&layers=show:' + layerId;
    }
  }));
}

var PCN_LIDAR = 'https://www.pcn.minambiente.it/arcgis/rest/services/dtm';

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
    // ── Espagne (IDEe / IGN-CNIG) ──
    case 'lidar_es':
      return gmWMTS('https://wmts-mapa-lidar.idee.es/lidar', 'EL.GridCoverageDSM', 'default', 'png', {
        maxZoom: 17, attribution: '© CNIG/IDEe — LiDAR PNOA (MDS 2,5 m)'
      });
    case 'mdt_es':
      return gmWMTS('https://servicios.idee.es/wmts/mdt', 'Relieve', 'default', 'jpeg', {
        maxZoom: 17, attribution: '© CNIG/IDEe — MDT Espagne'
      });
    case 'es_ortho':
      return gmWMTS('https://www.ign.es/wmts/pnoa-ma', 'OI.OrthoimageCoverage', 'default', 'jpeg', {
        maxZoom: 19, attribution: '© CNIG — PNOA ortho'
      });
    case 'es_mtn50':
      return gmWMTS('https://www.ign.es/wmts/primera-edicion-mtn', 'mtn50-edicion1', 'default', 'jpeg', {
        maxZoom: 15, attribution: '© CNIG — MTN50 1re éd. (1875–1968)'
      });
    case 'es_mtn25':
      return gmWMTS('https://www.ign.es/wmts/primera-edicion-mtn', 'mtn25-edicion1', 'default', 'jpeg', {
        maxZoom: 16, attribution: '© CNIG — MTN25 1re éd. (1975–2003)'
      });
    // ── Italie (TINITALY / PCN / IGM) ──
    case 'mdt_it':
      return wms3857('https://tinitaly.pi.ingv.it/TINItaly_1_1/wms', 'tinitaly_hshd', {
        maxZoom: 15, attribution: '© INGV — TINITALY MNT 10 m (hillshade)'
      });
    case 'lidar_it':
      return L.layerGroup([
        arcgisExport(PCN_LIDAR + '/LiDAR_Piemonte/MapServer', 9, { maxZoom: 18, attribution: '© PCN — LiDAR Piémont' }),
        arcgisExport(PCN_LIDAR + '/LiDAR_Lombardia/MapServer', 9, { maxZoom: 18, attribution: '© PCN — LiDAR Lombardie' }),
        arcgisExport(PCN_LIDAR + '/LiDAR_Veneto/MapServer', 9, { maxZoom: 18, attribution: '© PCN — LiDAR Vénétie' }),
        arcgisExport(PCN_LIDAR + '/LiDAR_Emilia_Romagna/MapServer', 9, { maxZoom: 18, attribution: '© PCN — LiDAR Émilie-Romagne' }),
        arcgisExport(PCN_LIDAR + '/LiDAR_Toscana/MapServer', 9, { maxZoom: 18, attribution: '© PCN — LiDAR Toscane' }),
        arcgisExport(PCN_LIDAR + '/LiDAR_Lazio/MapServer', 9, { maxZoom: 18, attribution: '© PCN — LiDAR Latium' })
      ]);
    case 'it_igm25':
      return wms3857('https://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_25000.map', 'CB.IGM25000.32,CB.IGM25000.33', {
        maxZoom: 16, transparent: false, attribution: '© IGM / MASE — Carte 1:25 000'
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
  lidar_it: 'LiDAR PCN (Italie nord/centre)',
  it_igm25: 'IGM 1:25 000 (Italie)',
  satellite: 'Google Satellite',
  hybrid: 'Google Satellite + Labels',
  arcgis: 'ArcGIS World Imagery',
  osm: 'OpenStreetMap'
};
