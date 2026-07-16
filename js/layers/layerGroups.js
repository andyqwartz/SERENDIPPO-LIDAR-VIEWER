/* SERENDIPPO-LIDAR-VIEWER — Groupes de couches (pour les menus) */

/**
 * Groupes de couches affichés dans les menus déroulants.
 * Chaque groupe a un label et une liste de clés.
 * @type {Array<{label: string, keys: string[]}>}
 */
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

/**
 * Liste plate de toutes les clés sélectionnables.
 * @type {string[]}
 */
LV.SELECTABLE_LAYERS = LV.LAYER_GROUPS.reduce(function(acc, g) {
  return acc.concat(g.keys);
}, []);