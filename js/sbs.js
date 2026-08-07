/* SERENDIPPO-LIDAR-VIEWER — Side-by-Side slider custom (CSS clip) + verrouillage */

/**
 * Module SBS : gestion du split slider.
 * Utilise le CSS clip sur les panes gauche/droite.
 * Supporte drag (souris) et tap (tactile) sans conflit.
 */
LV.SBS = {
  /** Position courante en pourcentage (0-100) */
  pct: 50,
  /** Si true, les deux cartes bougent ensemble */
  locked: true,
  handle: null,
  divider: null,
  dragging: false,
  dragMoved: false,
  touchToggled: false
};

/** Initialisation : references DOM, clip, ecouteurs */
LV.SBS.init = function() {
  LV.SBS.handle = document.getElementById('sbs-handle');
  LV.SBS.divider = document.getElementById('sbs-divider');
  LV.SBS.applyLock();
  LV.SBS.updateClip();
  LV.map.on('move zoom resize viewreset', LV.SBS.updateClip);
  LV.SBS.bindDragAndToggle();
  LV.SBS.bindOpacity();
};

/** Met a jour le clip CSS des deux panes et la position du handle. */
LV.SBS.updateClip = function() {
  var leftPane = LV.map.getPane(LV.PANE_LEFT);
  var rightPane = LV.map.getPane(LV.PANE_RIGHT);
  if (!leftPane || !rightPane) return;
  var size = LV.map.getSize();
  var nw = LV.map.containerPointToLayerPoint([0, 0]);
  var se = LV.map.containerPointToLayerPoint([size.x, size.y]);
  var cx = size.x * (LV.SBS.pct / 100);
  var clipX = nw.x + cx;
  leftPane.style.clip = 'rect(' + nw.y + 'px,' + clipX + 'px,' + se.y + 'px,' + nw.x + 'px)';
  rightPane.style.clip = 'rect(' + nw.y + 'px,' + se.x + 'px,' + se.y + 'px,' + clipX + 'px)';
  LV.SBS.handle.style.left = LV.SBS.pct + '%';
  LV.SBS.divider.style.left = LV.SBS.pct + '%';
};

/**
 * Fixe la position du slider.
 * @param {number} p - Pourcentage (0-100), clamped dans [sbsMin, sbsMax]
 */
LV.SBS.setPct = function(p) {
  LV.SBS.pct = Math.min(LV.CONFIG.sbsMax, Math.max(LV.CONFIG.sbsMin, p));
  LV.SBS.updateClip();
};

/** Bascule le verrouillage (synchro gauche/droite). */
LV.SBS.toggle = function() {
  LV.SBS.locked = !LV.SBS.locked;
  LV.SBS.applyLock();
};

/** Applique l'etat de verrouillage au handle et au drag de la carte. */
LV.SBS.applyLock = function() {
  var h = LV.SBS.handle;
  if (!h) return;
  if (LV.SBS.locked) {
    LV.map.dragging.enable();
    LV.map.scrollWheelZoom.enable();
    h.style.cursor = 'pointer';
    h.classList.remove('active');
    h.style.transform = 'translate(calc(-50% + 1px), -50%)';
  } else {
    LV.map.dragging.disable();
    LV.map.scrollWheelZoom.disable();
    h.style.cursor = 'ew-resize';
    h.classList.add('active');
    h.style.transform = 'translate(calc(-50% + 1px), -50%) rotate(90deg)';
  }
};

/**
 * Bind les evenements de drag (souris + tactile) et de click/toggle.
 * Utilise un flag touchToggled pour eviter le double-declenchement.
 */
LV.SBS.bindDragAndToggle = function() {
  var h = LV.SBS.handle;

  function onStart(e) {
    LV.SBS.dragging = true;
    LV.SBS.dragMoved = false;
    if (LV.SBS.locked) return;
    LV.map.dragging.disable();
    e.preventDefault();
  }

  function onMove(e) {
    if (!LV.SBS.dragging) return;
    LV.SBS.dragMoved = true;
    if (LV.SBS.locked) return;
    var r = LV.map.getContainer().getBoundingClientRect();
    var x = e.touches ? e.touches[0].clientX : e.clientX;
    var pct = ((x - r.left) / r.width) * 100;
    LV.SBS.setPct(pct);
  }

  function onEnd() {
    if (!LV.SBS.dragging) return;
    LV.SBS.dragging = false;
    LV.SBS.dragMoved = false;
    if (!LV.SBS.locked) LV.map.dragging.disable();
  }

  function onTouchEnd() {
    if (!LV.SBS.dragging) return;
    var moved = LV.SBS.dragMoved;
    LV.SBS.dragging = false;
    LV.SBS.dragMoved = false;
    if (!LV.SBS.locked) LV.map.dragging.disable();
    if (!moved) {
      LV.SBS.touchToggled = true;
      LV.SBS.toggle();
    }
  }

  h.addEventListener('click', function() {
    if (LV.SBS.touchToggled) {
      LV.SBS.touchToggled = false;
      return;
    }
    LV.SBS.toggle();
  });

  h.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  h.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd);
};

/* ════ SBS opacité par côté (drag vertical) ════ */

/** Opacité courante par côté (0-1). */
LV.SBS.opacity = { left: 1, right: 1 };

/**
 * Applique l'opacité à la couche active d'un côté.
 * @param {string} side - 'left' | 'right'
 * @param {number} v - 0..1
 */
LV.SBS.setOpacity = function(side, v) {
  v = Math.max(0, Math.min(1, v));
  LV.SBS.opacity[side] = v;
  var key = side === 'left' ? LV.leftKey : LV.rightKey;
  var layer = LV.getSideLayer(side, key);
  if (!layer) return;
  if (layer.eachLayer) {
    layer.eachLayer(function(l) { if (l.setOpacity) l.setOpacity(v); });
  } else if (layer.setOpacity) {
    layer.setOpacity(v);
  }
  var el = document.querySelector('.sbs-op[data-side="' + side + '"]');
  if (el) el.setAttribute('data-pct', Math.round(v * 100) + '%');
};

/** Bind le drag vertical des poignées d'opacité. */
LV.SBS.bindOpacity = function() {
  document.querySelectorAll('.sbs-op').forEach(function(h) {
    var side = h.getAttribute('data-side');
    var dragging = false;

    function apply(e) {
      var r = LV.map.getContainer().getBoundingClientRect();
      var y = e.touches ? e.touches[0].clientY : e.clientY;
      var pct = 1 - ((y - r.top) / r.height);   // haut = 1 (opaque), bas = 0
      LV.SBS.setOpacity(side, pct);
    }
    function start(e) { dragging = true; h.classList.add('dragging'); e.preventDefault(); apply(e); }
    function move(e) { if (!dragging) return; apply(e); }
    function end() { dragging = false; h.classList.remove('dragging'); }

    h.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    h.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  });
};
