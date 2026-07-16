/* SERENDIPPO-LIDAR-VIEWER — Track Manager */
var LV = window.LV || {};

LV.TrackManager = {
  tracks: [],
  colors: ['#ff4444', '#44aaff', '#44ff88', '#ffaa00', '#ff44ff', '#00dddd'],
  colorIdx: 0,

  /** Initialisation : bind tabs, drag-drop */
  init: function() {
    LV.TrackManager.bindTabs();
    LV.TrackManager.bindDrop();
  },

  // ── Onglets ──

  bindTabs: function() {
    var container = document.getElementById('bookmarksPanel');
    if (!container) return;
    container.addEventListener('click', function(e) {
      var tab = e.target.closest('.tab-btn');
      if (!tab) return;
      var tabName = tab.getAttribute('data-tab');
      if (!tabName) return;
      // Désactiver tous les tabs
      container.querySelectorAll('.tab-btn').forEach(function(t) { t.classList.remove('active'); });
      container.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      // Activer le tab cliqué
      tab.classList.add('active');
      var content = container.querySelector('.tab-content--' + tabName);
      if (content) content.classList.add('active');
    });
  },

  // ── Drag & Drop ──

  bindDrop: function() {
    var dropZone = document.body;

    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    dropZone.addEventListener('dragenter', function(e) {
      e.preventDefault();
      document.body.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function(e) {
      if (!e.relatedTarget || e.relatedTarget === document.body) {
        document.body.classList.remove('drag-over');
      }
    });

    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      document.body.classList.remove('drag-over');
      var files = e.dataTransfer.files;
      if (!files || files.length === 0) return;
      for (var i = 0; i < files.length; i++) {
        LV.TrackManager.loadFile(files[i]);
      }
    });
  },

  // ── Chargement fichier ──

  loadFile: function(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'gpx') {
      console.warn('[TrackManager] Unsupported format:', ext);
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = LV.parseGPX(e.target.result);
      if (!data) {
        console.warn('[TrackManager] Failed to parse:', file.name);
        return;
      }
      LV.TrackManager.addTrack(file.name, 'gpx', data);
    };
    reader.readAsText(file);
  },

  // ── Ajouter un track ──

  addTrack: function(name, type, data) {
    var id = 'track_' + Date.now();
    var color = LV.TrackManager.colors[LV.TrackManager.colorIdx % LV.TrackManager.colors.length];
    LV.TrackManager.colorIdx++;

    var layers = [];
    if (data.tracks && data.tracks.length > 0) {
      data.tracks.forEach(function(seg) {
        var pts = data.points.slice(seg.startIdx, seg.endIdx + 1).map(function(p) {
          return [p.lat, p.lng];
        });
        if (pts.length < 2) return;
        var poly = L.polyline(pts, {
          color: color,
          weight: 2.5,
          opacity: 0.85
        }).addTo(LV.map);
        layers.push(poly);
      });
    }

    // Waypoints
    if (data.waypoints && data.waypoints.length > 0) {
      data.waypoints.forEach(function(wp) {
        var m = L.circleMarker([wp.lat, wp.lng], {
          radius: 4,
          color: color,
          fillColor: color,
          fillOpacity: 0.8,
          weight: 1.5
        }).addTo(LV.map);
        if (wp.name) m.bindPopup(wp.name);
        layers.push(m);
      });
    }

    var track = {
      id: id,
      name: name,
      type: type,
      color: color,
      visible: true,
      layers: layers,
      bounds: data.bounds,
      data: data
    };

    LV.TrackManager.tracks.push(track);
    LV.TrackManager.render();

    // Auto-flyTo
    if (data.bounds && data.bounds.isValid()) {
      LV.map.flyToBounds(data.bounds, { padding: [40, 40], duration: 1.5 });
    }
  },

  // ── Supprimer un track ──

  remove: function(id) {
    var idx = -1;
    for (var i = 0; i < LV.TrackManager.tracks.length; i++) {
      if (LV.TrackManager.tracks[i].id === id) { idx = i; break; }
    }
    if (idx === -1) return;
    var track = LV.TrackManager.tracks[idx];
    track.layers.forEach(function(l) { LV.map.removeLayer(l); });
    LV.TrackManager.tracks.splice(idx, 1);
    LV.TrackManager.render();
  },

  // ── Basculer visibilité ──

  toggleVisibility: function(id) {
    var track = LV.TrackManager.tracks.find(function(t) { return t.id === id; });
    if (!track) return;
    track.visible = !track.visible;
    track.layers.forEach(function(l) {
      if (track.visible) { LV.map.addLayer(l); }
      else { LV.map.removeLayer(l); }
    });
    LV.TrackManager.render();
  },

  // ── Zoom sur track ──

  zoomTo: function(id) {
    var track = LV.TrackManager.tracks.find(function(t) { return t.id === id; });
    if (!track || !track.bounds || !track.bounds.isValid()) return;
    LV.map.flyToBounds(track.bounds, { padding: [40, 40], duration: 1 });
  },

  // ── Rendu ──

  render: function() {
    var container = document.getElementById('tracksList');
    if (!container) return;
    container.innerHTML = '';

    if (LV.TrackManager.tracks.length === 0) {
      container.innerHTML = '<div class="no-result">Glissez un fichier GPX ici</div>';
      return;
    }

    LV.TrackManager.tracks.forEach(function(t) {
      var div = document.createElement('div');
      div.className = 'track-item';
      div.setAttribute('data-id', t.id);
      div.innerHTML =
        '<span class="track-color" style="background:' + t.color + '"></span>' +
        '<span class="track-name">' + LV.Bookmarks.esc(t.name) + '</span>' +
        '<span class="track-actions">' +
          '<button class="track-vis" title="Visibilité">' + (t.visible ? 'V' : 'H') + '</button>' +
          '<button class="track-zoom" title="Zoom">Z</button>' +
          '<button class="track-del" title="Supprimer">Del</button>' +
        '</span>';
      div.querySelector('.track-vis').onclick = function() { LV.TrackManager.toggleVisibility(t.id); };
      div.querySelector('.track-zoom').onclick = function() { LV.TrackManager.zoomTo(t.id); };
      div.querySelector('.track-del').onclick = function() { LV.TrackManager.remove(t.id); };
      container.appendChild(div);
    });
  }
};