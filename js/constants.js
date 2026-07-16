/* SERENDIPPO-LIDAR-VIEWER — Constantes partagées */

// ── WMTS matrix sets ──
LV.WMTS = Object.freeze({
  PM:       'PM',
  PM_0_18:  'PM_0_18',
  PM_0_19:  'PM_0_19',
  PM_3_15:  'PM_3_15',
  PM_6_14:  'PM_6_14',
  PM_6_19:  'PM_6_19',
  GMC:      'GoogleMapsCompatible'
});

// ── Formats d'image ──
LV.IMG = Object.freeze({
  PNG:  'png',
  JPEG: 'jpeg'
});

// ── URLs de base ──
LV.URL = Object.freeze({
  IGN_WMTS: 'https://data.geopf.fr/wmts',
  ARCGIS:   'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  GOOGLE_S: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  GOOGLE_Y: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
  OSM:      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ES_LIDAR: 'https://wmts-mapa-lidar.idee.es/lidar',
  ES_MDT:   'https://servicios.idee.es/wmts/mdt',
  ES_PNOA:  'https://www.ign.es/wmts/pnoa-ma',
  ES_MTN:   'https://www.ign.es/wmts/primera-edicion-mtn',
  IT_TINITALY: 'https://tinitaly.pi.ingv.it/TINItaly_1_1/wms',
  IT_PCN:   'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/servizi-LiDAR/',
  IT_IGM:   'https://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_25000.map'
});

// ── Attributions ──
LV.ATTR = Object.freeze({
  IGN:      '© IGN-F',
  IGN_HR:   '© IGN — Ortho HR',
  IGN_PLAN: '© IGN — Plan IGN V2',
  IGN_J1:   '© IGN — Plan IGN J+1',
  IGN_CASSINI: 'BNF/IGN — Cassini (XVIIIe)',
  IGN_EM:   'IGN — Etat-Major (XIXe)',
  IGN_SCAN50: 'IGN — SCAN50 1950',
  IGN_ORTHO50: 'IGN — Ortho 1950-1965',
  IGN_ORTHO65: 'IGN — Ortho 1965-1980',
  IGN_SCAN25: '© IGN-F',
  IGN_LIDAR: 'IGN-F — LiDAR HD MNT',
  IGN_MNS:  'IGN-F — LiDAR HD MNS (sursol)',
  GOOGLE:   '© Google',
  ESRI:     'Esri, Maxar, Earthstar',
  OSM:      '© OSM',
  ES_LIDAR: '© CNIG/IDEe — LiDAR PNOA (MDS 2,5 m)',
  ES_MDT:   '© CNIG/IDEe — MDT Espagne',
  ES_ORTHO: '© CNIG — PNOA ortho',
  ES_MTN50: '© CNIG — MTN50 1re éd. (1875–1968)',
  ES_MTN25: '© CNIG — MTN25 1re éd. (1975–2003)',
  IT_MDT:   '© INGV — TINITALY MNT 10 m (hillshade)',
  IT_LIDAR: '© PCN — LiDAR ',
  IT_IGM:   '© IGM / MASE — Carte 1:25 000'
});