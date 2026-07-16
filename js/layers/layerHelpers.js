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