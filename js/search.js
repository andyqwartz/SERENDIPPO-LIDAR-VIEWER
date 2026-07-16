/* SERENDIPPO-LIDAR-VIEWER — Recherche géographique */

LV.Search = {
  input: null,
  results: null,
  btn: null,
  debounceId: null,
  debounceMs: 300
};

LV.Search.init = function() {
  LV.Search.input = document.getElementById('searchInput');
  LV.Search.results = document.getElementById('searchResults');
  LV.Search.btn = document.getElementById('searchBtn');

  LV.Search.btn.onclick = LV.Search.do;
  LV.Search.input.onkeydown = function(e) {
    if (e.key === 'Enter') LV.Search.do();
  };
  LV.Search.input.addEventListener('input', function() {
    var q = LV.Search.input.value.trim();
    clearTimeout(LV.Search.debounceId);
    if (q.length < 2 || LV.Search.isCoords(q)) {
      LV.Search.hide();
      return;
    }
    LV.Search.debounceId = setTimeout(function() {
      LV.Search.fetch(q);
    }, LV.Search.debounceMs);
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrap') && LV.Search.results) {
      LV.Search.hide();
    }
  });
};

LV.Search.isCoords = function(q) {
  return /^-?\d+\.?\d*\s*[,;:\s]\s*-?\d+\.?\d*$/.test(q);
};

LV.Search.hide = function() {
  if (LV.Search.results) LV.Search.results.style.display = 'none';
};

LV.Search.fetch = function(q) {
  var box = LV.Search.results;
  fetch('https://api-adresse.data.gouv.fr/search/?q=' + encodeURIComponent(q) + '&type=municipality&limit=5')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      LV.Search.render(data.features || []);
    })
    .catch(function(err) {
      console.warn('[Search]', err);
      box.innerHTML = '<div class="no-result">Erreur réseau</div>';
      box.style.display = 'block';
    });
};

LV.Search.render = function(feats) {
  var box = LV.Search.results;
  box.innerHTML = '';
  if (!feats.length) {
    box.innerHTML = '<div class="no-result">Aucun résultat</div>';
    box.style.display = 'block';
    return;
  }
  feats.forEach(function(f) {
    var p = f.properties || {}, g = f.geometry || {};
    var c = g.coordinates || [0, 0];
    var d = document.createElement('div');
    d.innerHTML = '<strong>' + (p.name || '') + '</strong> <span class="city">' + (p.city || p.context || '') + '</span>';
    d.onclick = function() {
      LV.map.flyTo([c[1], c[0]], 15, { duration: 1.1 });
      LV.Search.input.value = (p.name || '') + (p.city ? ', ' + p.city : '');
      LV.Search.hide();
    };
    box.appendChild(d);
  });
  box.style.display = 'block';
};

LV.Search.do = function() {
  var q = LV.Search.input.value.trim();
  if (!q) return;

  if (LV.Search.isCoords(q)) {
    var coordMatch = q.match(/^(-?\d+\.?\d*)\s*[,;:\s]\s*(-?\d+\.?\d*)$/);
    var lat = parseFloat(coordMatch[1]);
    var lng = parseFloat(coordMatch[2]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      LV.map.setView([lat, lng], 16);
      L.marker([lat, lng]).addTo(LV.map)
        .bindPopup('Position: ' + LV.formatCoord({lat: lat, lng: lng}))
        .openPopup();
      LV.Search.hide();
      LV.Search.input.value = lat.toFixed(5) + ', ' + lng.toFixed(5);
      return;
    }
  }

  LV.Search.fetch(q);
};
