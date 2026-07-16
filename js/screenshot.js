/* SERENDIPPO-LIDAR-VIEWER — Capture d'écran */
var LV = window.LV || {};

/**
 * Capture la carte (les deux panes SBS) en image PNG.
 * Utilise html2canvas chargé depuis CDN.
 * Fallback : capture Leaflet native si CORS ne bloque pas.
 */
LV.Screenshot = {
  /** @type {boolean} */
  _html2canvasLoaded: false,

  /** Charge html2canvas depuis CDN si nécessaire */
  init: function() {
    if (typeof html2canvas !== 'undefined') {
      LV.Screenshot._html2canvasLoaded = true;
      return;
    }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = function() { LV.Screenshot._html2canvasLoaded = true; };
    s.onerror = function() { console.warn('[Screenshot] Failed to load html2canvas'); };
    document.head.appendChild(s);
  },

  /** Déclenche la capture et le téléchargement */
  capture: function() {
    var container = LV.map.getContainer();
    if (!container) return;

    var tryNative = function() {
      try {
        var canvas = container.querySelector('canvas');
        if (canvas) {
          canvas.toBlob(function(blob) {
            if (blob) {
              LV.Screenshot._download(blob);
              return;
            }
            LV.Screenshot._fallback(container);
          });
          return true;
        }
      } catch(e) {}
      return false;
    };

    if (!tryNative()) {
      LV.Screenshot._fallback(container);
    }
  },

  /** Fallback html2canvas */
  _fallback: function(container) {
    if (!LV.Screenshot._html2canvasLoaded) {
      console.warn('[Screenshot] html2canvas not loaded yet');
      return;
    }
    html2canvas(container, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#111',
      scale: 2 // haute résolution
    }).then(function(canvas) {
      canvas.toBlob(function(blob) {
        LV.Screenshot._download(blob);
      });
    }).catch(function(err) {
      console.warn('[Screenshot] html2canvas failed:', err);
    });
  },

  /** Télécharge un blob */
  _download: function(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'serendippo-lidar.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
};