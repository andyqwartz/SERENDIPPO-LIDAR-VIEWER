/* SERENDIPPO-LIDAR-VIEWER — Side-by-Side slider custom (CSS clip) + verrouillage */
var LV = window.LV || {};

LV.SBS = {
  pct: 50,
  locked: true,
  handle: null,
  divider: null,
  dragging: false
};

// ── Initialisation ──
LV.SBS.init = function() {
  LV.SBS.handle = document.getElementById('sbs-handle');
  LV.SBS.divider = document.getElementById('sbs-divider');
  LV.SBS.applyLock();
  LV.SBS.updateClip();
  LV.map.on('move zoom resize viewreset', LV.SBS.updateClip);
  LV.SBS.bindDrag();
};

// ── CSS clip update ──
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

LV.SBS.setPct = function(p) {
  LV.SBS.pct = Math.min(LV.CONFIG.sbsMax, Math.max(LV.CONFIG.sbsMin, p));
  LV.SBS.updateClip();
};

LV.SBS.toggle = function() {
  LV.SBS.locked = !LV.SBS.locked;
  LV.SBS.applyLock();
};

LV.SBS.applyLock = function() {
  var h = LV.SBS.handle;
  if (!h) return;
  if (LV.SBS.locked) {
    // Verrouillé : drag libre, handle non interactif
    LV.map.dragging.enable();
    LV.map.scrollWheelZoom.enable();
    h.style.pointerEvents = 'none';
    h.style.cursor = 'default';
    h.classList.remove('active');
    LV.SBS.setSbsBtnState(false);
  } else {
    // Déverrouillé : drag désactivé, handle interactif
    LV.map.dragging.disable();
    LV.map.scrollWheelZoom.disable();
    h.style.pointerEvents = 'all';
    h.style.cursor = 'ew-resize';
    h.classList.add('active');
    LV.SBS.setSbsBtnState(true);
  }
};

LV.SBS.setSbsBtnState = function(unlocked) {
  var btn = document.getElementById('btn-sbs');
  if (!btn) return;
  btn.classList.toggle('active', unlocked);
  btn.style.transform = unlocked ? 'rotate(90deg)' : '';
  btn.title = unlocked ? 'Verrouiller la comparaison' : 'Comparer les couches';
};

// ── Drag du handle (mouse + touch) ──
LV.SBS.bindDrag = function() {
  var h = LV.SBS.handle;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onStart(e) {
    if (LV.SBS.locked) return;
    LV.SBS.dragging = true;
    LV.map.dragging.disable();
    e.preventDefault();
  }

  function onMove(e) {
    if (!LV.SBS.dragging) return;
    var r = LV.map.getContainer().getBoundingClientRect();
    var pct = ((getClientX(e) - r.left) / r.width) * 100;
    LV.SBS.setPct(pct);
  }

  function onEnd() {
    if (LV.SBS.dragging) {
      LV.SBS.dragging = false;
      if (!LV.SBS.locked) LV.map.dragging.disable();
    }
  }

  h.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  h.addEventListener('touchstart', onStart);
  window.addEventListener('touchmove', onMove);
  window.addEventListener('touchend', onEnd);
};