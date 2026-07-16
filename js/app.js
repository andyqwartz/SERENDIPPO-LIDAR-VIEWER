/* SERENDIPPO-LIDAR-VIEWER — Bootstrap */

LV.init = function() {
  LV.initMap();
  LV.SBS.init();
  LV.Search.init();
  LV.Bookmarks.load();
  LV.Bookmarks.render();
  LV.TOOLS.init();
  LV.OVERLAYS.init();
  LV.TrackManager.init();
  LV.URLSync.init();
  LV.Screenshot.init();
  LV.initPanels();
};

LV.initPanels = function() {
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    LV.UI.closePanel('bookmarksPanel', 'btn-bookmarks');
    LV.UI.closePanel('overlaysPanel', 'btn-overlays');
  });

  var bmAdd = document.getElementById('bm-add-btn');
  if (bmAdd) bmAdd.onclick = function() {
    var activeTab = document.querySelector('#bookmarksPanel .tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'tracks') {
      // Onglet Tracks → upload GPX
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = '.gpx';
      input.onchange = function() {
        if (input.files && input.files.length > 0) {
          LV.TrackManager.loadFile(input.files[0]);
        }
      };
      input.click();
    } else {
      // Onglet Vues → ajouter un bookmark
      LV.Bookmarks.add();
    }
  };

  var bmClose = document.getElementById('bm-close');
  if (bmClose) bmClose.onclick = function() {
    LV.UI.closePanel('bookmarksPanel', 'btn-bookmarks');
  };

  var olClose = document.getElementById('ol-close');
  if (olClose) olClose.onclick = function() {
    LV.UI.closePanel('overlaysPanel', 'btn-overlays');
  };
};

document.addEventListener('DOMContentLoaded', LV.init);
