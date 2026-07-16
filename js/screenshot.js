/* SERENDIPPO-LIDAR-VIEWER — Capture d'écran */
var LV = window.LV || {};

/**
 * Capture la carte complète (les deux panes SBS) en PNG.
 * Gère le CSS clip du SBS en le désactivant temporairement.
 */
LV.Screenshot = {
  _html2canvasLoaded: false,

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

  capture: function() {
    if (!LV.Screenshot._html2canvasLoaded) {
      console.warn('[Screenshot] html2canvas not loaded yet');
      return;
    }
    LV.Screenshot._doCapture();
  },

  _doCapture: function() {
    var leftPane = LV.map.getPane(LV.PANE_LEFT);
    var rightPane = LV.map.getPane(LV.PANE_RIGHT);
    var container = LV.map.getContainer();

    // Sauvegarder les clips SBS
    var leftClip = leftPane ? leftPane.style.clip : '';
    var rightClip = rightPane ? rightPane.style.clip : '';

    // Désactiver les clips pour capturer les deux panes
    if (leftPane) leftPane.style.clip = '';
    if (rightPane) rightPane.style.clip = '';

    // Attendre un frame pour le reflow
    requestAnimationFrame(function() {
      html2canvas(container, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#111',
        scale: 2,
        onclone: function(doc) {
          // Dans le clone, aussi désactiver les clips
          var cloneLeft = doc.querySelector('[class*="leaflet-pane"][style*="leftPane"]');
          var cloneRight = doc.querySelector('[class*="leaflet-pane"][style*="rightPane"]');
          // Ne pas toucher au clone, html2canvas gère déjà
        }
      }).then(function(canvas) {
        // Restaurer les clips
        if (leftPane) leftPane.style.clip = leftClip;
        if (rightPane) rightPane.style.clip = rightClip;
        // Télécharger
        canvas.toBlob(function(blob) {
          if (!blob) return;
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
        });
      }).catch(function(err) {
        // Restaurer même en cas d'erreur
        if (leftPane) leftPane.style.clip = leftClip;
        if (rightPane) rightPane.style.clip = rightClip;
        console.warn('[Screenshot] failed:', err);
      });
    });
  }
};