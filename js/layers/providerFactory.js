/* SERENDIPPO-LIDAR-VIEWER — Factory de couches Leaflet */

/**
 * Point d'entrée unique pour créer une couche.
 * Délègue au ProviderRegistry puis aux registres PROV_FR / PROV_DEV / globaux.
 * @param {string} key - Identifiant de couche
 * @returns {L.TileLayer|L.LayerGroup|null}
 */
LV.createLayer = function(key) {
  // ProviderRegistry (si utilisé)
  var fromReg = LV.ProviderRegistry.create(key);
  if (fromReg) return fromReg;

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