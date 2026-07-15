/* SERENDIPPO-LIDAR-VIEWER — Outils de la toolbar (extensible) */
var LV = window.LV || {};

LV.UI = {
  MOBILE_MQ: '(max-width: 768px)',

  isMobile: function() {
    return window.matchMedia(LV.UI.MOBILE_MQ).matches;
  },

  isVisible: function(el) {
    return el && window.getComputedStyle(el).display !== 'none';
  },

  positionPanel: function(panel, btn) {
    if (!panel) return;
    panel.style.transform = 'none';
    if (LV.UI.isMobile()) {
      panel.style.left = '8px';
      panel.style.right = '8px';
      panel.style.top = 'auto';
      panel.style.width = 'auto';
      panel.style.maxWidth = 'none';
      return;
    }
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var pw = panel.offsetWidth;
    var ph = panel.offsetHeight;
    var gap = 10;
    var left = rect.left - pw - gap;
    var top = rect.top + rect.height / 2 - ph / 2;
    if (left < 12) left = 12;
    top = Math.max(12, Math.min(top, window.innerHeight - ph - 12));
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.right = 'auto';
  },

  togglePanel: function(panelId, btnId, onOpen) {
    var panel = document.getElementById(panelId);
    var btn = document.getElementById(btnId);
    if (!panel || !btn) return;
    var open = !LV.UI.isVisible(panel);
    panel.style.display = open ? 'block' : 'none';
    btn.classList.toggle('active', open);
    if (open) {
      if (onOpen) onOpen();
      LV.UI.positionPanel(panel, btn);
    }
  },

  closePanel: function(panelId, btnId) {
    var panel = document.getElementById(panelId);
    var btn = document.getElementById(btnId);
    if (!panel || !LV.UI.isVisible(panel)) return;
    panel.style.display = 'none';
    if (btn) btn.classList.remove('active');
  },

  repositionOpenPanels: function() {
    [
      ['overlaysPanel', 'btn-overlays'],
      ['bookmarksPanel', 'btn-bookmarks']
    ].forEach(function(p) {
      var panel = document.getElementById(p[0]);
      var btn = document.getElementById(p[1]);
      if (panel && btn && LV.UI.isVisible(panel)) {
        LV.UI.positionPanel(panel, btn);
      }
    });
  }
};

// Registre d'outils — ajoutez ici pour créer un nouvel outil
LV.TOOLS = {
  'btn-night': {
    label: 'Mode nuit',
    on: function(btn) {
      document.body.classList.toggle('night');
      btn.style.background = document.body.classList.contains('night') ? 'rgba(0,0,0,.2)' : '';
    }
  },

  'btn-sbs': {
    label: 'Comparer les couches',
    on: function(btn) {
      LV.SBS.toggle();
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
      var f = function(e) {
        var m = L.marker(e.latlng).addTo(LV.map)
          .bindPopup('Position: ' + LV.formatCoord(e.latlng))
          .openPopup();
        LV.map.once('click', f);
        // Proposer de nommer et ajouter aux bookmarks
        var name = prompt('Nommer ce lieu :', 'Marqueur');
        if (name && name.trim()) {
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
        }
      };
      LV.map.once('click', f);
      btn.classList.add('pinned');
    }
  }
};

// ── Initialisation de tous les outils ──
LV.TOOLS.init = function() {
  Object.keys(LV.TOOLS).forEach(function(id) {
    var btn = document.getElementById(id);
    var tool = LV.TOOLS[id];
    if (btn) {
      btn.onclick = function() { tool.on(btn); };
      btn.title = tool.label || '';
    }
  });

  // GPS marker
  LV.map.on('locationfound', function(e) {
    if (LV.gpsMkr) LV.map.removeLayer(LV.gpsMkr);
    LV.gpsMkr = L.circleMarker(e.latlng, {
      radius: 8,
      fillColor: '#58a6ff',
      color: '#fff',
      weight: 2,
      fillOpacity: 0.8
    }).addTo(LV.map).bindPopup('Vous êtes ici').openPopup();
  });

  // Selecteurs de couches gauche / droite
  LV.TOOLS.initLayerSelects();

  window.addEventListener('resize', function() {
    LV.UI.repositionOpenPanels();
    if (LV.map) LV.map.invalidateSize();
  });
  window.matchMedia(LV.UI.MOBILE_MQ).addEventListener('change', function() {
    LV.UI.repositionOpenPanels();
    if (LV.map) LV.map.invalidateSize();
  });
};

// ── Selecteurs de couches ──
LV.TOOLS.initLayerSelects = function() {
  var keys = LV.SELECTABLE_LAYERS;
  var names = LV.LAYER_NAMES;
  [
    { id: 'leftLayerSelect', key: 'leftKey', onChange: LV.TOOLS.switchLeftLayer },
    { id: 'rightLayerSelect', key: 'rightKey', onChange: LV.TOOLS.switchRightLayer }
  ].forEach(function(cfg) {
    var sel = document.getElementById(cfg.id);
    if (!sel) return;
    sel.innerHTML = '';
    keys.forEach(function(key) {
      var opt = document.createElement('option');
      opt.value = key;
      opt.textContent = names[key] || key;
      sel.appendChild(opt);
    });
    sel.value = LV[cfg.key];
    sel.onchange = cfg.onChange;
  });
};

LV.TOOLS.switchLayer = function(side) {
  var isLeft = side === 'left';
  var keyProp = isLeft ? 'leftKey' : 'rightKey';
  var selId = isLeft ? 'leftLayerSelect' : 'rightLayerSelect';
  var pane = isLeft ? LV.PANE_LEFT : LV.PANE_RIGHT;
  var map = LV.map;
  var oldKey = LV[keyProp];
  var newKey = document.getElementById(selId).value;
  if (oldKey === newKey) return;

  map.removeLayer(LV.getSideLayer(side, oldKey));
  LV[keyProp] = newKey;

  var layer = LV.getSideLayer(side, newKey);
  LV.setLayerPane(layer, pane);
  layer.addTo(map);
  LV.SBS.updateClip();
};

LV.TOOLS.switchLeftLayer = function() { LV.TOOLS.switchLayer('left'); };
LV.TOOLS.switchRightLayer = function() { LV.TOOLS.switchLayer('right'); };

// ── Ajouter un nouvel outil (API publique pour extension future) ──
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