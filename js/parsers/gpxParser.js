/* SERENDIPPO-LIDAR-VIEWER — Parser GPX minimal */
var LV = window.LV || {};

/**
 * Parse un fichier GPX en texte et retourne les données structurées.
 * @param {string} text - Contenu XML du fichier GPX
 * @returns {{ points: Array, tracks: Array, waypoints: Array, bounds: L.LatLngBounds|null }}
 */
LV.parseGPX = function(text) {
  var parser = new DOMParser();
  var xml = parser.parseFromString(text, 'text/xml');
  var doc = xml.documentElement;

  if (!doc || doc.nodeName !== 'gpx') {
    console.warn('[GPX] Invalid GPX file');
    return null;
  }

  var points = [];
  var tracks = [];
  var waypoints = [];
  var allLats = [];
  var allLngs = [];

  // Waypoints: <wpt lat="..." lon="...">
  var wpts = doc.querySelectorAll('wpt');
  wpts.forEach(function(w) {
    var lat = parseFloat(w.getAttribute('lat'));
    var lng = parseFloat(w.getAttribute('lon'));
    if (isNaN(lat) || isNaN(lng)) return;
    var name = w.querySelector('name');
    waypoints.push({ lat: lat, lng: lng, name: name ? name.textContent : '' });
    allLats.push(lat);
    allLngs.push(lng);
  });

  // Tracks: <trk> → <trkseg> → <trkpt>
  var trks = doc.querySelectorAll('trk');
  trks.forEach(function(trk) {
    var trackName = trk.querySelector('name');
    var name = trackName ? trackName.textContent : 'Track';
    var segs = trk.querySelectorAll('trkseg');
    segs.forEach(function(seg) {
      var trkpts = seg.querySelectorAll('trkpt');
      var segPoints = [];
      trkpts.forEach(function(pt) {
        var lat = parseFloat(pt.getAttribute('lat'));
        var lng = parseFloat(pt.getAttribute('lon'));
        if (isNaN(lat) || isNaN(lng)) return;
        var ele = pt.querySelector('ele');
        var time = pt.querySelector('time');
        segPoints.push({
          lat: lat,
          lng: lng,
          alt: ele ? parseFloat(ele.textContent) : null,
          time: time ? time.textContent : null
        });
        allLats.push(lat);
        allLngs.push(lng);
      });
      if (segPoints.length > 0) {
        var idx = points.length;
        points = points.concat(segPoints);
        tracks.push({ name: name, startIdx: idx, endIdx: idx + segPoints.length - 1 });
      }
    });
  });

  if (points.length === 0 && waypoints.length === 0) {
    console.warn('[GPX] No track points or waypoints found');
    return null;
  }

  var bounds = null;
  if (allLats.length > 0) {
    var minLat = Math.min.apply(null, allLats);
    var maxLat = Math.max.apply(null, allLats);
    var minLng = Math.min.apply(null, allLngs);
    var maxLng = Math.max.apply(null, allLngs);
    bounds = L.latLngBounds([minLat, minLng], [maxLat, maxLng]);
  }

  return { points: points, tracks: tracks, waypoints: waypoints, bounds: bounds };
};