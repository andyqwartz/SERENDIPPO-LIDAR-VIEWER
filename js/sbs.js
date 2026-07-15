/* SERENDIPPO-LIDAR-VIEWER — Side-by-Side slider custom (CSS clip) + verrouillage */
var LV = window.LV || {};

LV.SBS = {
  pct: 50,
  locked: true,
  handle: null,
  divider: null,
  dragging: false,
  dragMoved: false
};

// ── Initialisation ──
LV.SBS.init = function() {
  LV.SBS.handle = document.getElementById('sbs-handle');
  LV.SBS.divider = document.getElementById('sbs-divider');
  LV.SBS.applyLock();
  LV.SBS.updateClip();
  LV.map.on('move zoom resize viewreset', LV.SBS.updateClip);
  LV.SBS.bindDragAndToggle();
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

// ── Drag + Tap unifié (evite le conflit click/drag) ──
LV.SBS.bindDragAndToggle = function() {
  var h = LV.SBS.handle;

  function getXY(e) {
    return e.touches
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };
  }

  function onStart(e) {
    if (LV.SBS.locked) return;
    LV.SBS.dragging = true;
    LV.SBS.dragMoved = false;
    LV.map.dragging.disable();
    e.preventDefault();
  }

  function onMove(e) {
    if (!LV.SBS.dragging) return;
    LV.SBS.dragMoved = true;
    var r = LV.map.getContainer().getBoundingClientRect();
    var xy = getXY(e);
    var pct = ((xy.x - r.left) / r.width) * 100;
    LV.SBS.setPct(pct);
  }

  function onEnd() {
    if (!LV.SBS.dragging) return;
    LV.SBS.dragging = false;
    LV.SBS.dragMoved = false;
    if (!LV.SBS.locked) LV.map.dragging.disable();
  }

  // Click = toggle (toujours, pas bloque par le drag)
  h.addEventListener('click', function() {
    LV.SBS.toggle();
  });

  h.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  h.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
};