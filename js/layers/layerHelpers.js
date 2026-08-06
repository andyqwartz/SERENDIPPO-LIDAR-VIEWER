/* SERENDIPPO-LIDAR-VIEWER — Helpers de création de couches */

/**
 * WMTS IGN (Geoplateforme, PM / EPSG:2154 tiles)
 * @param {string} layer - WMTS layer name
 * @param {string} tms - TileMatrixSet (e.g. 'PM', 'PM_0_18')
 * @param {string} format - Image format ('png' or 'jpeg')
 * @param {Object} [opts] - Additional Leaflet tileLayer options
 * @returns {L.TileLayer}
 */
LV.ignWMTS = function(layer, tms, format, opts) {
  return L.tileLayer(LV.URL.IGN_WMTS + '?LAYER=' + layer + '&STYLE=normal&TILEMATRIXSET=' + tms + '&FORMAT=image/' + format + '&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', opts || {});
};

/**
 * WMTS GoogleMapsCompatible (IDEe, IGN-CNIG Espagne…)
 * @param {string} base - Base URL
 * @param {string} layer - WMTS layer name
 * @param {string} [style='default'] - WMTS style
 * @param {string} format - Image format
 * @param {Object} [opts] - Additional Leaflet options
 * @returns {L.TileLayer}
 */
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

/**
 * WMS 1.3.0 tuilé en Web Mercator
 * @param {string} url - WMS service URL
 * @param {string} layers - Comma-separated layer names
 * @param {Object} [opts] - Additional Leaflet WMS options
 * @returns {L.TileLayer.WMS}
 */
function wms3857(url, layers, opts) {
  return L.tileLayer.wms(url, L.extend({
    layers: layers,
    format: 'image/' + LV.IMG.PNG,
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG3857
  }, opts || {}));
}

/** Demi-circonference en Web-Mercator (EPSG:3857), utilisée pour découper les tuiles. */
var LV_HALF_WM = 20037508.342789244;

/**
 * Couche Leaflet pour un ImageServer ArcGIS via exportImage (tuiles 256px).
 * Calcule le bbox web-mercator de chaque tuile et l'appelle directement.
 * @param {string} exportUrl - URL du service exportImage
 * @param {Object} [opts] - {maxZoom, maxNativeZoom, exportFormat, exportTransparent, renderingRule}
 * @returns {L.TileLayer}
 */
LV.arcgisExport = function(exportUrl, opts) {
  opts = opts || {};
  var format = opts.exportFormat || 'png';
  var transparent = opts.exportTransparent === undefined ? true : opts.exportTransparent;
  var renderingRule = opts.renderingRule;
  var TileLayer = L.TileLayer.extend({
    getTileUrl: function(coords) {
      var t = (2 * LV_HALF_WM) / Math.pow(2, coords.z);
      var minx = -LV_HALF_WM + coords.x * t;
      var maxx = -LV_HALF_WM + (coords.x + 1) * t;
      var maxy =  LV_HALF_WM - coords.y * t;
      var miny =  LV_HALF_WM - (coords.y + 1) * t;
      var url = exportUrl + (exportUrl.indexOf('?') < 0 ? '?' : '&') +
        'bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy +
        '&bboxSR=3857&imageSR=3857&size=256,256&format=' + format +
        '&transparent=' + (transparent ? 'true' : 'false') + '&f=image';
      if (renderingRule) url += '&renderingRule=' + encodeURIComponent(renderingRule);
      return url;
    }
  });
  return new TileLayer('', opts);
};