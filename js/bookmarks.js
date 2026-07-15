/* SERENDIPPO-LIDAR-VIEWER — Bookmarks (mémoire locale) */
var LV = window.LV || {};

LV.Bookmarks = {
  STORAGE_KEY: 'lidar_viewer_bookmarks',
  list: [],
  editing: null
};

// ── Charger depuis localStorage ──
LV.Bookmarks.load = function() {
  var defaults = JSON.parse(JSON.stringify(LV.CONFIG.bookmarks));
  var raw = localStorage.getItem(LV.Bookmarks.STORAGE_KEY);
  if (raw) {
    try {
      LV.Bookmarks.list = JSON.parse(raw);
      defaults.forEach(function(def) {
        if (!LV.Bookmarks.list.some(function(b) { return b.id === def.id; })) {
          LV.Bookmarks.list.push(def);
        }
      });
      LV.Bookmarks.save();
    } catch(e) {
      LV.Bookmarks.list = defaults;
    }
  } else {
    LV.Bookmarks.list = defaults;
    LV.Bookmarks.save();
  }
};

// ── Sauvegarder ──
LV.Bookmarks.save = function() {
  localStorage.setItem(LV.Bookmarks.STORAGE_KEY, JSON.stringify(LV.Bookmarks.list));
};

// ── Ajouter un lieu (position actuelle) ──
LV.Bookmarks.add = function() {
  var c = LV.map.getCenter();
  var z = LV.map.getZoom();
  var name = prompt('Nom du lieu :', '');
  if (name === null) return;
  if (!name.trim()) name = 'Marqueur';
  LV.Bookmarks.list.push({
    id: 'loc_' + Date.now(),
    name: name,
    lat: c.lat,
    lng: c.lng,
    zoom: z,
    notes: ''
  });
  LV.Bookmarks.save();
  LV.Bookmarks.render();
};

// ── Supprimer ──
LV.Bookmarks.remove = function(id) {
  LV.Bookmarks.list = LV.Bookmarks.list.filter(function(b) { return b.id !== id; });
  LV.Bookmarks.save();
  LV.Bookmarks.render();
};

// ── Aller à ──
LV.Bookmarks.goTo = function(id) {
  var b = LV.Bookmarks.list.find(function(x) { return x.id === id; });
  if (b) LV.map.flyTo([b.lat, b.lng], b.zoom || 15, { duration: 1 });
};

// ── Éditer notes ──
LV.Bookmarks.editNotes = function(id) {
  var b = LV.Bookmarks.list.find(function(x) { return x.id === id; });
  if (!b) return;
  var row = document.querySelector('[data-id="' + id + '"]');
  if (!row) return;
  var notesEl = row.querySelector('.bm-notes');
  var inputEl = row.querySelector('.bm-notes-input');
  if (!notesEl || !inputEl) return;

  if (LV.Bookmarks.editing === id) {
    // Sauvegarder
    b.notes = inputEl.value;
    notesEl.textContent = b.notes || '—';
    notesEl.style.display = '';
    inputEl.style.display = 'none';
    LV.Bookmarks.editing = null;
    LV.Bookmarks.save();
  } else {
    // Passer en mode édition
    inputEl.value = b.notes || '';
    notesEl.style.display = 'none';
    inputEl.style.display = '';
    inputEl.focus();
    LV.Bookmarks.editing = id;
  }
};

// ── Éditer nom ──
LV.Bookmarks.editName = function(id) {
  var b = LV.Bookmarks.list.find(function(x) { return x.id === id; });
  if (!b) return;
  var newName = prompt('Renommer :', b.name);
  if (newName && newName.trim()) {
    b.name = newName.trim();
    LV.Bookmarks.save();
    LV.Bookmarks.render();
  }
};

// ── Rendre la liste ──
LV.Bookmarks.render = function() {
  var container = document.getElementById('bookmarksList');
  if (!container) return;
  container.innerHTML = '';
  LV.Bookmarks.list.forEach(function(b) {
    var div = document.createElement('div');
    div.className = 'bm-item';
    div.setAttribute('data-id', b.id);
    div.innerHTML =
      '<div class="bm-header">' +
        '<span class="bm-name" title="Éditer le nom">' + LV.Bookmarks.esc(b.name) + '</span>' +
        '<span class="bm-coords">' + b.lat.toFixed(4) + ', ' + b.lng.toFixed(4) + '</span>' +
        '<span class="bm-actions">' +
          '<button class="bm-go" title="Aller a">Go</button>' +
          '<button class="bm-editname" title="Renommer">Ren</button>' +
          '<button class="bm-editnotes" title="Editer note">Note</button>' +
          '<button class="bm-del" title="Supprimer">Del</button>' +
        '</span>' +
      '</div>' +
      '<div class="bm-body">' +
        '<span class="bm-notes">' + LV.Bookmarks.esc(b.notes || '—') + '</span>' +
        '<textarea class="bm-notes-input" style="display:none;width:100%;rows:2">' + LV.Bookmarks.esc(b.notes || '') + '</textarea>' +
      '</div>';

    // Bind actions
    div.querySelector('.bm-go').onclick = function() { LV.Bookmarks.goTo(b.id); };
    div.querySelector('.bm-del').onclick = function() { LV.Bookmarks.remove(b.id); };
    div.querySelector('.bm-editname').onclick = function() { LV.Bookmarks.editName(b.id); };
    div.querySelector('.bm-editnotes').onclick = function() { LV.Bookmarks.editNotes(b.id); };

    container.appendChild(div);
  });
};

// ── Helper escape HTML ──
LV.Bookmarks.esc = function(s) {
  var d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
};

// ── Toggle panel ──
LV.Bookmarks.togglePanel = function() {
  LV.UI.togglePanel('bookmarksPanel', 'btn-bookmarks', function() {
    LV.Bookmarks.load();
    LV.Bookmarks.render();
  });
};