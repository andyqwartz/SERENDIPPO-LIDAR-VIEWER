/* SERENDIPPO-LIDAR-VIEWER — Registre d'outils toolbar */

/**
 * Registre déclaratif des outils de la toolbar.
 * Chaque entrée : { label, on(btn) }
 */
LV.TOOLS = {
  'btn-night': {
    label: 'Night mode',
    on: function(btn) {
      document.body.classList.toggle('night');
      btn.style.background = document.body.classList.contains('night') ? 'rgba(0,0,0,.2)' : '';
    }
  },
  'btn-geoloc': {
    label: 'My location',
    on: function() {
      LV.map.locate({ setView: true, maxZoom: 16 });
    }
  },
  'btn-bookmarks': {
    label: 'Saved places',
    on: function(btn) {
      LV.Bookmarks.togglePanel();
    }
  },
  'btn-reset': {
    label: 'Reset view',
    on: function() {
      var v = LV.CONFIG.defaultView;
      LV.map.setView([v.lat, v.lng], v.zoom);
    }
  },
  'btn-export': {
    label: 'Export PNG',
    on: function() {
      var done = function() { LV.Screenshot.capture(); };
      if (LV.Screenshot._html2canvasLoaded) { done(); return; }
      LV.Screenshot.init();
      var t = setInterval(function() {
        if (LV.Screenshot._html2canvasLoaded) { clearInterval(t); done(); }
      }, 120);
    }
  },
  'btn-info': {
    label: 'About & data',
    on: function() {
      LV.UI.togglePanel('infoPanel', 'btn-info');
    }
  },
  'btn-overlays': {
    label: 'Overlay layers',
    on: function() {
      LV.OVERLAYS.togglePanel();
    }
  },
  'btn-marker': {
    label: 'Place a marker',
    on: function(btn) {
      if (btn.classList.contains('pinned')) {
        btn.classList.remove('pinned');
        LV.map.off('click', LV.TOOLS._markerHandler);
        LV.TOOLS._markerHandler = null;
        return;
      }
      LV.TOOLS._markerHandler = function(e) {
        var name = prompt('Name this place:', '');
        if (name === null) {
          btn.classList.remove('pinned');
          LV.map.off('click', LV.TOOLS._markerHandler);
          LV.TOOLS._markerHandler = null;
          return;
        }
        if (!name.trim()) name = 'Marker';
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