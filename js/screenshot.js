/* SERENDIPPO-LIDAR-VIEWER — Capture d'écran */

var LV = window.LV || {};

/**
 * Capture la carte complète (les deux panes SBS) en PNG.
 * Méthode robuste : deux passes html2canvas (moitié gauche puis moitié droite,
 * l'autre pane caché), puis composite par moitié au % de split courant.
 * Masque les contrôles Leaflet (zoom + plein écran) pendant la capture.
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
    var container = LV.map.getContainer();
    var size = LV.map.getSize();

    // Masquer les contrôles Leaflet (zoom + fullscreen) pendant la capture
    var zoom = container.querySelector('.leaflet-control-zoom');
    var zoomDisplay = zoom ? zoom.style.display : '';
    if (zoom) zoom.style.display = 'none';

    var leftPane = LV.map.getPane(LV.PANE_LEFT);
    var rightPane = LV.map.getPane(LV.PANE_RIGHT);
    var leftDisplay = leftPane ? leftPane.style.display : '';
    var rightDisplay = rightPane ? rightPane.style.display : '';

    // Restaure tout (panes + zoom)
    function restore() {
      if (leftPane) leftPane.style.display = leftDisplay;
      if (rightPane) rightPane.style.display = rightDisplay;
      if (zoom) zoom.style.display = zoomDisplay;
    }

    var opts = {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#161b22',
      scale: 2,
      onclone: function(doc) {
        var z = doc.querySelector('.leaflet-control-zoom');
        if (z) z.style.display = 'none';
      }
    };

    function shot() { return html2canvas(container, opts); }

    // Passe 1 : moitié gauche (pane droit caché)
    if (rightPane) rightPane.style.display = 'none';
    shot().then(function(canvasLeft) {
      // Passe 2 : moitié droite (pane gauche caché)
      if (rightPane) rightPane.style.display = rightDisplay;
      if (leftPane) leftPane.style.display = 'none';
      return shot().then(function(canvasRight) {
        restore();

        // Composite : moitié gauche de gauche + moitié droite de droite
        var cw = canvasLeft.width, ch = canvasLeft.height;
        var split = Math.round(cw * Math.min(1, Math.max(0, (LV.SBS.pct || 50) / 100)));
        var out = document.createElement('canvas');
        out.width = cw;
        out.height = ch;
        var ctx = out.getContext('2d');
        ctx.fillStyle = '#161b22';
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(canvasLeft, 0, 0, split, ch, 0, 0, split, ch);
        ctx.drawImage(canvasRight, split, 0, cw - split, ch, split, 0, cw - split, ch);

        out.toBlob(function(blob) {
          if (!blob) return;
          var url = URL.createObjectURL(blob);
          var c = LV.map.getCenter();
          var a = document.createElement('a');
          a.href = url;
          a.download = 'OpenLiDAR_' + (LV.leftKey || 'left') + '_' + (LV.rightKey || 'right') +
            '_' + c.lat.toFixed(4) + '_' + c.lng.toFixed(4) + '.png';
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
        });
      });
    }).catch(function(err) {
      restore();
      console.warn('[Screenshot] failed:', err);
    });
  }
};
