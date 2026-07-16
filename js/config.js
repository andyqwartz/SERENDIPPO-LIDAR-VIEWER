/* SERENDIPPO-LIDAR-VIEWER — Configuration globale */

LV.CONFIG = Object.freeze({
  // Vue par defaut : Mont-Saint-Michel (baie, LiDAR spectaculaire)
  defaultView: { lat: 48.6360, lng: -1.5114, zoom: 14 },
  defaultRight: 'hybrid',
  leftKey: 'lidar',
  sbsMin: 2,
  sbsMax: 98,

  bookmarks: [
    // ── France - LiDAR démonstration (relief, structures) ──
    { id: 'msm',        name: 'Mont-Saint-Michel',        lat: 48.6360, lng: -1.5114, zoom: 14, notes: 'Baie et abbaye, contraste maree/topographie' },
    { id: 'metz',       name: 'Metz - Base aerienne',     lat: 49.1341, lng: 6.1239,  zoom: 16, notes: 'Base aerienne 128, nord-est Moselle' },
    { id: 'eiffel',     name: 'Tour Eiffel',              lat: 48.8584, lng: 2.2945,  zoom: 17, notes: 'Monument parisien, structure metallique' },
    { id: 'versailles', name: 'Chateau de Versailles',     lat: 48.8049, lng: 2.1204,  zoom: 16, notes: 'Parc et jardins a la francaise' },
    { id: 'chambord',   name: 'Chateau de Chambord',      lat: 47.6161, lng: 1.5169,  zoom: 16, notes: 'Foret de Sologne, architecture Renaissance' },
    { id: 'carcassonne',name: 'Cite de Carcassonne',      lat: 43.2060, lng: 2.3630,  zoom: 16, notes: 'Forteresse medievale' },
    { id: 'pontdugard', name: 'Pont du Gard',             lat: 43.9475, lng: 4.5350,  zoom: 16, notes: 'Aqueduc romain, vallee du Gardon' },
    { id: 'millau',     name: 'Viaduc de Millau',         lat: 44.0778, lng: 3.0228,  zoom: 15, notes: 'Ouvrage d art, canyon du Tarn' },
    { id: 'montblanc',  name: 'Mont Blanc',               lat: 45.8326, lng: 6.8652,  zoom: 13, notes: 'Toit de l Europe, relief alpin' },
    { id: 'gavarnie',   name: 'Cirque de Gavarnie',       lat: 42.7344, lng: -0.0096, zoom: 14, notes: 'Cirque glaciaire pyreneen' },
    { id: 'verdon',     name: 'Gorges du Verdon',         lat: 43.7372, lng: 6.3639,  zoom: 13, notes: 'Canyon profond, relief spectaculaire' },
    { id: 'etretat',    name: 'Falaises d Etretat',       lat: 49.7083, lng: 0.2042,  zoom: 15, notes: 'Arches et falaises de craie normandes' },
    { id: 'pilat',      name: 'Dune du Pilat',            lat: 44.5892, lng: -1.2133, zoom: 15, notes: 'Plus haute dune d Europe, foret et ocean' },
    { id: 'calanques',  name: 'Calanques de Marseille',   lat: 43.2108, lng: 5.4483,  zoom: 14, notes: 'Cretes calcaires et criques mediterraneennes' },
    { id: 'puydedome',  name: 'Puy de Dome',              lat: 45.7725, lng: 2.9648,  zoom: 14, notes: 'Volcan auvergnat, panorama sur la chaine' },
    { id: 'ventoux',    name: 'Mont Ventoux',             lat: 44.1741, lng: 5.2787,  zoom: 13, notes: 'Giant de Provence, relief karstique' },
    { id: 'salagou',    name: 'Lac du Salagou',           lat: 43.6542, lng: 3.3858,  zoom: 14, notes: 'Lac rouge, collines et terroirs languedociens' },
    { id: 'carnac',     name: 'Alignements de Carnac',    lat: 47.5958, lng: -3.0817, zoom: 15, notes: 'Megalithes neolithiques visibles en LiDAR' },
    { id: 'rennes',     name: 'Rennes-le-Chateau',        lat: 42.9276, lng: 2.2605,  zoom: 16, notes: 'Site mysterieux, pays cathare' },

    // ── France - Patrimoine, archeologie et paysages ──
    { id: 'oradour',        name: 'Oradour-sur-Glane',          lat: 45.9305, lng: 1.0338, zoom: 16, notes: 'Village martyr, ruines preservees' },
    { id: 'douaumont',      name: 'Fort de Douaumont',          lat: 49.2203, lng: 5.4346, zoom: 15, notes: 'Fort de la Premiere Guerre mondiale' },
    { id: 'vaux',           name: 'Fort de Vaux',               lat: 49.2136, lng: 5.4492, zoom: 16, notes: 'Fort de la Premiere Guerre mondiale' },
    { id: 'ossuaire',       name: 'Ossuaire de Douaumont',      lat: 49.2168, lng: 5.4165, zoom: 16, notes: 'Memorial de la Grande Guerre' },
    { id: 'bibracte',       name: 'Oppidum de Bibracte',        lat: 46.9239, lng: 4.0369, zoom: 14, notes: 'Oppidum gaulois, Mont Beuvray' },
    { id: 'beuvray',        name: 'Mont Beuvray',               lat: 46.9231, lng: 4.0363, zoom: 14, notes: 'Sommet du Morvan, site archeologique' },
    { id: 'montsegur',      name: 'Château de Montségur',       lat: 42.8715, lng: 1.8338, zoom: 16, notes: 'Château cathare sur un piton rocheux' },
    { id: 'nimes',          name: 'Arènes de Nîmes',            lat: 43.8366, lng: 4.3601, zoom: 17, notes: 'Amphitheatre romain' },
    { id: 'orange',         name: 'Théâtre antique d\'Orange',  lat: 44.1368, lng: 4.8083, zoom: 17, notes: 'Theatre romain, patrimoine UNESCO' },
    { id: 'enserune',       name: 'Oppidum d\'Ensérune',        lat: 43.2807, lng: 3.1227, zoom: 15, notes: 'Oppidum gaulois, vue sur l Etang de Thau' },
    { id: 'alesia',         name: 'Alesia',                     lat: 47.5366, lng: 4.4958, zoom: 14, notes: 'Site du siege d Alesia, vestiges gaulois' },
    { id: 'jumieges',       name: 'Abbaye de Jumièges',         lat: 49.4272, lng: 0.8202, zoom: 16, notes: 'Abbaye romane en ruine, boucle de Seine' },
    { id: 'arcetsenans',    name: 'Saline d\'Arc-et-Senans',    lat: 47.0326, lng: 5.7786, zoom: 16, notes: 'Saline royale, architecture industrielle' },
    { id: 'bruoux',         name: 'Mines de Bruoux',            lat: 43.8780, lng: 5.3966, zoom: 16, notes: 'anciennes mines d ocre, sentiers' },
    { id: 'wellington',     name: 'Carrière Wellington',        lat: 50.2877, lng: 2.7770, zoom: 17, notes: 'Carriere souterraine, Premiere Guerre' },
    { id: 'besancon',       name: 'Citadelle de Besançon',      lat: 47.2300, lng: 6.0325, zoom: 16, notes: 'Citadelle Vauban, boucle du Doubs' },
    { id: 'cluny',          name: 'Abbaye de Cluny',            lat: 46.4337, lng: 4.6594, zoom: 16, notes: 'Abbaye benedictine, plus grande eglise medievale' },
    { id: 'rocamadour',     name: 'Rocamadour',                 lat: 44.7998, lng: 1.6170, zoom: 16, notes: 'Cite suspendue, vallee de l Alzou' },
    { id: 'montpellierlv',  name: 'Chaos de Montpellier-le-Vieux', lat: 44.2008, lng: 3.2285, zoom: 14, notes: 'Chaos rocheux, dolomies du Causse Noir' },
    { id: 'gergovie',       name: 'Plateau de Gergovie',        lat: 45.7114, lng: 3.1380, zoom: 15, notes: 'Plateau de la bataille de Gergovie' },
    { id: 'rocheauxfees',   name: 'Dolmen de la Roche-aux-Fées', lat: 47.9368, lng: -1.3663, zoom: 16, notes: 'Dolmen neolithique, Ille-et-Vilaine' },
    { id: 'uxellodunum',    name: 'Oppidum d\'Uxellodunum',     lat: 44.6360, lng: 1.7828, zoom: 15, notes: 'Dernier oppidum gaulois, siege de Cesar' },
    { id: 'sainteodile',    name: 'Mont Sainte-Odile',          lat: 48.4334, lng: 7.4015, zoom: 15, notes: 'Monastere, mur paien, vue sur Alsace' },
    { id: 'padirac',        name: 'Gouffre de Padirac',         lat: 44.8465, lng: 1.7534, zoom: 16, notes: 'Gouffre et riviere souterraine, Quercy' },

    // ── Espagne ──
    { id: 'barcelona',  name: 'Barcelone - Sagrada Familia',  lat: 41.4036, lng: 2.1744,  zoom: 16, notes: 'LiDAR PNOA Espagne, MTN historique' },
    { id: 'madrid',     name: 'Madrid - Centro',              lat: 40.4168, lng: -3.7038, zoom: 15, notes: 'MDT et cartes anciennes IGN Espagne' },
    { id: 'granada',    name: 'Grenade - Alhambra',           lat: 37.1760, lng: -3.5886, zoom: 16, notes: 'Relief andalou, LiDAR IDEe' },

    // ── Italie ──
    { id: 'rome',       name: 'Rome - Colisee',               lat: 41.8902, lng: 12.4922, zoom: 16, notes: 'LiDAR PCN Latium, IGM 1:25 000' },
    { id: 'florence',   name: 'Florence - Duomo',             lat: 43.7731, lng: 11.2560, zoom: 16, notes: 'LiDAR PCN Toscane, TINITALY' },
    { id: 'venice',     name: 'Venise - Piazza San Marco',    lat: 45.4340, lng: 12.3380, zoom: 16, notes: 'LiDAR PCN Veneto, lagune' },
    { id: 'milan',      name: 'Milan - Duomo',                lat: 45.4642, lng: 9.1900,  zoom: 16, notes: 'LiDAR PCN Lombardie/Piemont' },
    { id: 'roma_lidar', name: 'Rome - Test LiDAR',            lat: 41.8979, lng: 12.4766, zoom: 15, notes: 'LiDAR PCN Latium 2m - DTM test' },
    { id: 'napoli',     name: 'Naples - Vesuve',              lat: 40.8264, lng: 14.3050, zoom: 14, notes: 'LiDAR Campanie - DTM 2m' },
    { id: 'etna',       name: 'Etna - Sicile',                lat: 37.7510, lng: 14.9934, zoom: 13, notes: 'LiDAR Sicile - relief volcanique' },
  ]
});