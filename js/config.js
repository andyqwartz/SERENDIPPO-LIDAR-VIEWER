/* SERENDIPPO-LIDAR-VIEWER — Configuration globale */
var LV = window.LV || {};

LV.CONFIG = {
  // Vue par defaut : Base aerienne 128 Metz-Frescaty (nord-est)
  defaultView: { lat: 49.13412, lng: 6.12389, zoom: 16 },
  defaultRight: 'hybrid',      // Google Hybrid = satellite + labels

  // Couche gauche (defaut LiDAR)
  leftKey: 'lidar',

  // Bookmarks initiaux — lieux emblematiques en France
  bookmarks: [
    { id: 'metz',         name: 'Metz - Nord-Est',              lat: 49.1341, lng: 6.1239,  zoom: 16, notes: 'Nord-est de Metz, secteur Moselle' },
    { id: 'eiffel',       name: 'Tour Eiffel',                  lat: 48.8584, lng: 2.2945,  zoom: 17, notes: 'Monument parisien, structure metallique' },
    { id: 'msm',          name: 'Mont-Saint-Michel',            lat: 48.6360, lng: -1.5114, zoom: 14, notes: 'Baie et abbaye, contraste maree/topographie' },
    { id: 'versailles',   name: 'Chateau de Versailles',        lat: 48.8049, lng: 2.1204,  zoom: 16, notes: 'Parc et jardins a la francaise' },
    { id: 'chambord',     name: 'Chateau de Chambord',           lat: 47.6161, lng: 1.5169,  zoom: 16, notes: 'Foret de Sologne, architecture Renaissance' },
    { id: 'carcassonne',  name: 'Cite de Carcassonne',          lat: 43.2063, lng: 2.3639,  zoom: 16, notes: 'Forteresse medievale' },
    { id: 'pontdugard',   name: 'Pont du Gard',                 lat: 43.9476, lng: 4.5350,  zoom: 16, notes: 'Aqueduc romain, vallee du Gardon' },
    { id: 'millau',       name: 'Viaduc de Millau',             lat: 44.0778, lng: 3.0228,  zoom: 15, notes: 'Ouvrage d art, canyon du Tarn' },
    { id: 'montblanc',    name: 'Mont Blanc',                   lat: 45.8326, lng: 6.8652,  zoom: 13, notes: 'Toit de l Europe, relief alpin' },
    { id: 'gavarnie',     name: 'Cirque de Gavarnie',           lat: 42.6939, lng: -0.0033, zoom: 14, notes: 'Cirque glaciaire pyreneen' },
    { id: 'verdon',       name: 'Gorges du Verdon',             lat: 43.7372, lng: 6.3639,  zoom: 13, notes: 'Canyon profond, relief spectaculaire' },
    { id: 'etretat',      name: 'Falaises d Etretat',           lat: 49.7083, lng: 0.2042,  zoom: 15, notes: 'Arches et falaises de craie normandes' },
    { id: 'pilat',        name: 'Dune du Pilat',                lat: 44.5892, lng: -1.2133, zoom: 15, notes: 'Plus haute dune d Europe, foret et ocean' },
    { id: 'calanques',    name: 'Calanques de Marseille',       lat: 43.2108, lng: 5.4483,  zoom: 14, notes: 'Cretes calcaires et criques mediterraneennes' },
    { id: 'puydedome',    name: 'Puy de Dome',                  lat: 45.7719, lng: 2.9645,  zoom: 14, notes: 'Volcan auvergnat, panorama sur la chaine' },
    { id: 'ventoux',      name: 'Mont Ventoux',                 lat: 44.1741, lng: 5.2787,  zoom: 13, notes: 'Giant de Provence, relief karstique' },
    { id: 'salagou',      name: 'Lac du Salagou',               lat: 43.6542, lng: 3.3858,  zoom: 14, notes: 'Lac rouge, collines et terroirs languedociens' },
    { id: 'carnac',       name: 'Alignements de Carnac',        lat: 47.5936, lng: -3.0826, zoom: 15, notes: 'Megalithes neolithiques visibles en LiDAR' },
    { id: 'rennes',       name: 'Rennes-le-Chateau',            lat: 42.9276, lng: 2.2605,  zoom: 16, notes: 'Site mysterieux, pays cathare' },
    { id: 'barcelona',    name: 'Barcelone - Sagrada Familia',  lat: 41.4036, lng: 2.1744,  zoom: 16, notes: 'LiDAR PNOA Espagne, MTN historique' },
    { id: 'madrid',       name: 'Madrid - Centro',              lat: 40.4168, lng: -3.7038, zoom: 15, notes: 'MDT et cartes anciennes IGN Espagne' },
    { id: 'granada',      name: 'Grenade - Alhambra',           lat: 37.1760, lng: -3.5886, zoom: 16, notes: 'Relief andalou, LiDAR IDEe' },
    { id: 'rome',         name: 'Rome - Colisee',               lat: 41.8902, lng: 12.4922, zoom: 16, notes: 'LiDAR PCN Latium, IGM 1:25 000' },
    { id: 'florence',     name: 'Florence - Duomo',             lat: 43.7731, lng: 11.2560, zoom: 16, notes: 'LiDAR PCN Toscane, TINITALY' },
    { id: 'venice',       name: 'Venise - Piazza San Marco',    lat: 45.4340, lng: 12.3380, zoom: 16, notes: 'LiDAR PCN Veneto, lagune' },
    { id: 'milan',        name: 'Milan - Duomo',                lat: 45.4642, lng: 9.1900,  zoom: 16, notes: 'LiDAR PCN Lombardie/Piemont' },
  ],

  // Limites SBS
  sbsMin: 2,
  sbsMax: 98,
};