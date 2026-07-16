/* SERENDIPPO-LIDAR-VIEWER — Synchronisation complète de l'état dans l'URL */
var LV = window.LV || {};

/**
 * Encode l'état complet de l'application dans le hash de l'URL.
 * Format: #l=leftKey&r=rightKey&s=sbsPct&y=lat&x=lng&z=zoom&v=ov1,ov2
 * Ancien format supporté: #lat,lng,zoom
 */
LV.URLSync = {
  /** @type {string[]} Liste des clés à encoder */
  _keys: ['l', 'r', 's', 'y', 'x', 'z', 'v'],

  /**
   * Initialisation : lire le hash, appliquer l'état, binder les events.
   */
  init: function() {
    LV.URLSync.restore();
    LV.URLSync.bindEvents();
  },

  /**
   * Bind les events de mise à jour.
   */
  bindEvents: function() {
    // Remplacer l'ancien hash par le nouveau
    LV.map.on('moveend', function() {
      LV.URLSync.update();
    });
    LV.map.on('zoomend', function() {
      LV.URLSync.update();
    });

    // Surcharger SBS.setPct pour trigger update
    var origSetPct = LV.SBS.setPct;
    LV.SBS.setPct = function(p) {
      origSetPct(p);
      LV.URLSync.update();
    };

    // Surcharger OVERLAYS.toggle
    var origOvToggle = LV.OVERLAYS.toggle;
    LV.OVERLAYS.toggle = function(id) {
      origOvToggle(id);
      LV.URLSync.update();
    };

    // Surcharger switchLayer
    var origSwitch = LV.TOOLS.switchLayer;
    LV.TOOLS.switchLayer = function(side) {
      origSwitch(side);
      LV.URLSync.update();
    };
  },

  /**
   * Met à jour le hash avec l'état actuel.
   */
  update: function() {
    if (!LV.map) return;
    var c = LV.map.getCenter();
    var params = {
      l: LV.leftKey || '',
      r: LV.rightKey || '',
      s: LV.SBS ? LV.SBS.pct : 50,
      y: c.lat.toFixed(5),
      x: c.lng.toFixed(5),
      z: LV.map.getZoom(),
      v: LV.URLSync._getActiveOverlays()
    };
    var hash = LV.URLSync._encode(params);
    location.hash = hash;
  },

  /**
   * Restaure l'état depuis le hash.
   */
  restore: function() {
    var h = location.hash.replace('#', '');
    if (!h) return;

    // Ancien format: lat,lng,zoom
    var oldMatch = h.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+)$/);
    if (oldMatch) {
      var la = parseFloat(oldMatch[1]), lo = parseFloat(oldMatch[2]), z = parseInt(oldMatch[3]);
      if (!isNaN(la) && !isNaN(lo) && !isNaN(z)) {
        LV.map.setView([la, lo], z, { animate: false });
      }
      return;
    }

    // Nouveau format: key=value&...
    var params = LV.URLSync._decode(h);
    if (!params) return;

    if (params.y && params.x && params.z) {
      var lat = parseFloat(params.y), lng = parseFloat(params.x), zoom = parseInt(params.z);
      if (!isNaN(lat) && !isNaN(lng) && !isNaN(zoom)) {
        LV.map.setView([lat, lng], zoom, { animate: false });
      }
    }

    if (params.l && LV.createLayer(params.l)) {
      LV._switchSide('left', params.l);
    }
    if (params.r && LV.createLayer(params.r)) {
      LV._switchSide('right', params.r);
    }

    if (params.s && LV.SBS) {
      LV.SBS.setPct(parseFloat(params.s));
    }

    if (params.v) {
      var ovs = params.v.split(',');
      ovs.forEach(function(id) {
        if (LV.OVERLAY_DEFS[id] && !LV.OVERLAY_DEFS[id].active) {
          LV.OVERLAYS.toggle(id);
        }
      });
    }
  },

  /**
   * Retourne la liste des overlays actifs séparés par des virgules.
   */
  _getActiveOverlays: function() {
    var active = [];
    Object.keys(LV.OVERLAY_DEFS || {}).forEach(function(id) {
      if (LV.OVERLAY_DEFS[id].active) active.push(id);
    });
    return active.join(',');
  },

  /**
   * Encode un objet en chaîne hash.
   */
  _encode: function(params) {
    var parts = [];
    this._keys.forEach(function(k) {
      var v = params[k];
      if (v === '' || v === undefined || v === null) return;
      parts.push(k + '=' + encodeURIComponent(v));
    });
    return parts.join('&');
  },

  /**
   * Décode une chaîne hash en objet.
   */
  _decode: function(str) {
    var obj = {};
    str.split('&').forEach(function(pair) {
      var eq = pair.indexOf('=');
      if (eq === -1) return;
      var k = pair.substring(0, eq);
      var v = decodeURIComponent(pair.substring(eq + 1));
      obj[k] = v;
    });
    return obj;
  }
};

/**
 * Helper interne pour changer une couche sans boucle infinie.
 * @param {string} side
 * @param {string} key
 */
LV._switchSide = function(side, key) {
  var isLeft = side === 'left';
  var keyProp = isLeft ? 'leftKey' : 'rightKey';
  var pane = isLeft ? LV.PANE_LEFT : LV.PANE_RIGHT;
  var map = LV.map;
  var oldKey = LV[keyProp];
  if (oldKey === key) return;

  map.removeLayer(LV.getSideLayer(side, oldKey));
  LV[keyProp] = key;

  var layer = LV.getSideLayer(side, key);
  LV.setLayerPane(layer, pane);
  layer.addTo(map);
  if (LV.SBS) LV.SBS.updateClip();

  // Mettre à jour le select
  var selId = isLeft ? 'leftLayerSelect' : 'rightLayerSelect';
  var sel = document.getElementById(selId);
  if (sel) sel.value = key;
};