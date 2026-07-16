/* SERENDIPPO-LIDAR-VIEWER — Registry des providers */

/**
 * Registre central des providers.
 * Chaque entrée : { key, factory, country, category, label }
 */
LV.ProviderRegistry = {
  _entries: [],

  /**
   * Enregistrer un provider.
   * @param {string} key - Identifiant unique (ex: 'lidar')
   * @param {Function} factory - Fonction retournant une couche Leaflet
   * @param {Object} [meta] - Métadonnées optionnelles
   */
  register: function(key, factory, meta) {
    this._entries.push({
      key: key,
      factory: factory,
      country: (meta && meta.country) || '',
      category: (meta && meta.category) || '',
      label: (meta && meta.label) || key
    });
  },

  /**
   * Créer une couche par clé.
   * @param {string} key
   * @returns {L.TileLayer|null}
   */
  create: function(key) {
    for (var i = 0; i < this._entries.length; i++) {
      if (this._entries[i].key === key) {
        return this._entries[i].factory();
      }
    }
    return null;
  },

  /**
   * Liste toutes les clés enregistrées.
   * @returns {string[]}
   */
  keys: function() {
    return this._entries.map(function(e) { return e.key; });
  },

  /**
   * Liste les entrées, optionnellement filtrées.
   * @param {string} [country]
   * @returns {Array}
   */
  list: function(country) {
    if (!country) return this._entries;
    return this._entries.filter(function(e) { return e.country === country; });
  }
};