/* SERENDIPPO-LIDAR-VIEWER — Registre d'outils toolbar */

/**
 * Registre déclaratif des outils de la toolbar.
 * Chaque entrée : { label, on(btn) }
 */
LV.TOOLS = {
  'btn-night': {
    label: 'Mode nuit',
    on: function(btn) {
      document.body.classList.toggle('night');
      btn.style.background = document.body.classList.contains('night') ? 'rgba(0,0,0,.2)' : '';
    }
  },
  'btn-geoloc': {
    label: 'Ma position',
    on: function() {
      LV.map.locate({ setView: true, maxZoom: 16 });
    }
  },
  'btn-bookmarks': {
    label: 'Lieux mémorisés',
    on: function(btn) {
      LV.Bookmarks.togglePanel();
    }
  },
  'btn-reset': {
    label: 'Reinitialiser la vue',
    on: function() {
      var v = LV.CONFIG.defaultView;
      LV.map.setView([v.lat, v.lng], v.zoom);
    }
  },
  'btn-overlays': {
    label: 'Calques superposables',
    on: function() {
      LV.OVERLAYS.togglePanel();
    }
  },
  'btn-marker': {
    label: 'Placer un marqueur',
    on: function(btn) {
      if (btn.classList.contains('pinned')) {
        btn.classList.remove('pinned');
        LV.map.off('click', LV.TOOLS._markerHandler);
        LV.TOOLS._markerHandler = null;
        return;
      }
      LV.TOOLS._markerHandler = function(e) {
        var name = prompt('Nommer ce lieu :', '');
        if (name === null) {
          btn.classList.remove('pinned');
          LV.map.off('click', LV.TOOLS._markerHandler);
          LV.TOOLS._markerHandler = null;
          return;
        }
        if (!name.trim()) name = 'Marqueur';
        var m = L.marker(e.latlng).addTo(LV.map)
          .bindPopup(name + '<br>' + LV.formatCoord(e.latlng))
          .openPopup();
        LV.Bookmarks.list.push({
          id: 'loc_' + Date.now(),
          name: name.trim(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          zoom: LV.map.getZoom(),
          notes: LV.formatCoord(e.latlng)
        });
        LV.Bookmarks.save();
        LV.Bookmarks.render();
        btn.classList.remove('pinned');
        LV.map.off('click', LV.TOOLS._markerHandler);
        LV.TOOLS._markerHandler = null;
      };
      LV.map.once('click', LV.TOOLS._markerHandler);
      btn.classList.add('pinned');
    }
  },
  'btn-screenshot': {
    label: 'Capture d\'écran',
    on: function() {
      LV.Screenshot.capture();
    }
  }
};

/**
 * Ajouter un nouvel outil après l'initialisation.
 * @param {string} id - ID du bouton DOM
 * @param {{label: string, on: Function}} tool
 */
LV.TOOLS.register = function(id, tool) {
  if (LV.TOOLS[id]) {
    console.warn('Tool already registered:', id);
    return;
  }
  LV.TOOLS[id] = tool;
  var btn = document.getElementById(id);
  if (btn) {
    btn.onclick = function() { tool.on(btn); };
    btn.title = tool.label || '';
  }
};