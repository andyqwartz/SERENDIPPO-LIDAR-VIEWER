/* SERENDIPPO-LIDAR-VIEWER — Mesure deux points + distance relative à l'échelle */
var LV = window.LV || {};

LV.Measure = {
  active: false,
  points: [],      // [{latlng, marker}]
  line: null,
  label: null,
  markers: []
};

// ── Activer/Désactiver ──
LV.Measure.toggle = function() {
  if (LV.Measure.active) {
    LV.Measure.deactivate();
  } else {
    LV.Measure.activate();
  }
};

LV.Measure.activate = function() {
  LV.Measure.active = true;
  LV.Measure.points = [];
  LV.Measure.clear();
  LV.map.getContainer().style.cursor = 'crosshair';
  LV.Measure.listener = function(e) {
    LV.Measure.addPoint(e.latlng);
  };
  LV.map.on('click', LV.Measure.listener);
};

LV.Measure.deactivate = function() {
  LV.Measure.active = false;
  LV.Measure.clear();
  LV.map.getContainer().style.cursor = '';
  if (LV.Measure.listener) {
    LV.map.off('click', LV.Measure.listener);
    LV.Measure.listener = null;
  }
  document.getElementById('btn-measure').classList.remove('pinned');
};

// ── Ajouter un point ──
LV.Measure.addPoint = function(latlng) {
  if (LV.Measure.points.length >= 2) {
    // Reset après 2 points
    LV.Measure.clearPoints();
  }

  var marker = L.circleMarker(latlng, {
    radius: 6,
    color: '#ff4444',
    fillColor: '#ff6666',
    fillOpacity: 0.9,
    weight: 2
  }).addTo(LV.map);

  marker.bindPopup('Point ' + (LV.Measure.points.length + 1) + ': ' +
    latlng.lat.toFixed(5) + ', ' + latlng.lng.toFixed(5));

  LV.Measure.points.push({ latlng: latlng, marker: marker });
  LV.Measure.markers.push(marker);

  if (LV.Measure.points.length === 2) {
    LV.Measure.drawLine();
    LV.Measure.showDistance();
  }
};

// ── Tracer la ligne ──
LV.Measure.drawLine = function() {
  var p1 = LV.Measure.points[0].latlng;
  var p2 = LV.Measure.points[1].latlng;
  LV.Measure.line = L.polyline([p1, p2], {
    color: '#ff4444',
    weight: 2,
    dashArray: '6, 4',
    opacity: 0.9
  }).addTo(LV.map);
};

// ── Afficher la distance ──
LV.Measure.showDistance = function() {
  var p1 = LV.Measure.points[0].latlng;
  var p2 = LV.Measure.points[1].latlng;

  // Distance Haversine (Leaflet built-in)
  var distM = LV.map.distance(p1, p2);

  var distStr, unit;
  if (distM < 1) {
    distStr = (distM * 100).toFixed(0);
    unit = 'cm';
  } else if (distM < 1000) {
    distStr = distM.toFixed(1);
    unit = 'm';
  } else {
    distStr = (distM / 1000).toFixed(2);
    unit = 'km';
  }

  // Échelle relative : distance en pixels entre les 2 points
  var p1px = LV.map.latLngToContainerPoint(p1);
  var p2px = LV.map.latLngToContainerPoint(p2);
  var pxDist = Math.sqrt(Math.pow(p2px.x - p1px.x, 2) + Math.pow(p2px.y - p1px.y, 2));

  // Position du label au milieu de la ligne
  var mid = L.latLng(
    (p1.lat + p2.lat) / 2,
    (p1.lng + p2.lng) / 2
  );

  var labelContent = '<strong>' + distStr + ' ' + unit + '</strong><br>' +
    '<small>Zoom: ' + LV.map.getZoom() + ' | ' + Math.round(pxDist) + 'px</small>';

  L.marker(mid, {
    icon: L.divIcon({
      className: 'measure-label',
      html: labelContent,
      iconSize: [120, 40],
      iconAnchor: [60, 20]
    })
  }).addTo(LV.map).bindPopup(
    'Distance : ' + distStr + ' ' + unit + '<br>' +
    'Zoom actuel : ' + LV.map.getZoom() + '<br>' +
    'Pixels à l\'écran : ' + Math.round(pxDist) + 'px'
  );

  // Afficher brièvement un tooltip pour la prochaine action
  var tip = document.getElementById('measureTip');
  if (tip) {
    tip.textContent = distStr + ' ' + unit + ' | Double-clic pour mesurer à nouveau';
    tip.style.display = 'block';
    setTimeout(function() { tip.style.display = 'none'; }, 4000);
  }
};

// ── Nettoyage ──
LV.Measure.clearPoints = function() {
  if (LV.Measure.line) {
    LV.map.removeLayer(LV.Measure.line);
    LV.Measure.line = null;
  }
  LV.Measure.markers.forEach(function(m) { LV.map.removeLayer(m); });
  LV.Measure.markers = [];
  LV.Measure.points = [];
};

LV.Measure.clear = function() {
  LV.Measure.clearPoints();
  // Supprime aussi les labels
  LV.map.eachLayer(function(l) {
    if (l instanceof L.Marker && l.options && l.options.icon && l.options.icon.options && l.options.icon.options.className === 'measure-label') {
      LV.map.removeLayer(l);
    }
  });
};

// ── Bouton toolbar : enregistrement via le registre centralisé ──
LV.TOOLS.register('btn-measure', {
  label: 'Mesurer (2 points)',
  on: function(btn) {
    if (LV.Measure.active) {
      LV.Measure.deactivate();
      btn.classList.remove('pinned');
    } else {
      LV.Measure.activate();
      btn.classList.add('pinned');
    }
  }
});