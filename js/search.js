/* SERENDIPPO-LIDAR-VIEWER — Recherche geographique améliorée */

/**
 * Module de recherche geographique.
 * Utilise api-adresse.data.gouv.fr + IGN Geocodage (dédoublonné, cache).
 */
LV.Search = {
  input: null,
  results: null,
  debounceId: null,
  debounceMs: 30,
  _cache: {}
};

/** Initialisation */
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
      LV.Search._search(q);
    }, LV.Search.debounceMs);
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-wrap')) LV.Search.hide();
  });
};

/** Teste si la chaine est des coordonnees */
LV.Search.isCoords = function(q) {
  return /^-?\d+\.?\d*\s*[,;:\s]\s*-?\d+\.?\d*$/.test(q);
};

/** Cache les résultats */
LV.Search.hide = function() {
  if (LV.Search.results) LV.Search.results.style.display = 'none';
};

/** Recherche principale avec 2 sources */
LV.Search.do = LV.Search._onInput;

/** Debounce handler */
LV.Search._onInput = function() {
  var q = LV.Search.input.value.trim();
  if (q.length < 2) return;
  
  if (LV.Search.isCoords(q)) {
    LV.Search._goToCoords(q);
    return;
  }
  LV.Search._search(q);
};

/** Recherche avec cache et sources multiples */
LV.Search._search = function(q) {
  var self = this;
  var cacheKey = q.toLowerCase();
  
  if (this._cache[cacheKey]) {
    this._results = this._cache[cacheKey];
    this._render();
    return;
  }

  // Deux APIs fonctionnelles
  var urlAdresse = 'https://api-adresse.data.gouv.fr/search/?q=' + encodeURIComponent(q) + '&limit=6';
  var urlIGN = 'https://data.geopf.fr/geocodage/search?q=' + encodeURIComponent(q) + '&limit=6';

  Promise.allSettled([
    fetch(urlAdresse).then(function(r) { return r.json(); }),
    fetch(urlIGN).then(function(r) { return r.json(); })
  ]).then(function(settled) {
    var results = [];

    // Résultats api-adresse
    var adVal = settled[0].value;
    if (settled[0].status === 'fulfilled' && adVal && adVal.features) {
      adVal.features.forEach(function(f) {
        results.push({
          label: f.properties.label || '',
          type: f.properties.type || 'lieu',
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
          score: f.properties.score || 0.5,
          badge: 'AD'
        });
      });
    }

    // Résultats IGN Geocodage (dédoublonnés)
    var ignVal = settled[1].value;
    if (settled[1].status === 'fulfilled' && ignVal && ignVal.features) {
      ignVal.features.forEach(function(f) {
        var lat = f.geometry.coordinates[1];
        var lon = f.geometry.coordinates[0];
        var dup = results.some(function(r) {
          return Math.abs(r.lat - lat) < 0.002 && Math.abs(r.lon - lon) < 0.002;
        });
        if (!dup) {
          results.push({
            label: f.properties.label || f.properties.name || '',
            type: f.properties.type || 'lieu',
            lat: lat,
            lon: lon,
            score: f.properties.score || 0.5,
            badge: 'IGN'
          });
        }
      });
    }

    // Tri par score décroissant, AD favorisé
    results.sort(function(a, b) {
      var sa = a.score + (a.badge === 'AD' ? 0.2 : 0);
      var sb = b.score + (b.badge === 'AD' ? 0.2 : 0);
      return sb - sa;
    });

    self._results = results.slice(0, 12);
    self._cache[cacheKey] = self._results;
    self._render();
  }).catch(function(err) {
    console.warn('[Search]', err);
    LV.Search.results.innerHTML = '<div class="no-result">Network error, try again</div>';
    LV.Search.results.style.display = 'block';
  });
};

/** Rendu dropdown - compatible CSS existant */
LV.Search._render = function() {
  var self = this;
  this.results.innerHTML = '';

  if (!this._results.length) {
    this.results.innerHTML = '<div class="no-result">No results found</div>';
    this.results.style.display = 'block';
    return;
  }

  this._results.forEach(function(r) {
    var item = document.createElement('div');
    item.innerHTML = '<strong>' + r.label + '</strong> <span class="city">' + r.badge + '</span>';
    item.onclick = function() { self._goTo(r); };
    self.results.appendChild(item);
  });

  this.results.style.display = 'block';
};

/** Navigation vers résultat */
LV.Search._goTo = function(r) {
  LV.map.flyTo([r.lat, r.lon], 15, { duration: 1.1 });
  LV.Search.input.value = r.label;
  LV.Search.hide();
};

/** Coordonnées directes */
LV.Search._goToCoords = function(q) {
  var coordMatch = q.match(/^(-?\d+\.?\d*)\s*[,;:\s]\s*(-?\d+\.?\d*)$/);
  var lat = parseFloat(coordMatch[1]);
  var lng = parseFloat(coordMatch[2]);
  if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    LV.map.setView([lat, lng], 16);
    L.marker([lat, lng]).addTo(LV.map)
      .bindPopup('Position: ' + lat.toFixed(5) + ', ' + lng.toFixed(5))
      .openPopup();
    LV.Search.hide();
    LV.Search.input.value = lat.toFixed(5) + ', ' + lng.toFixed(5);
  }
};