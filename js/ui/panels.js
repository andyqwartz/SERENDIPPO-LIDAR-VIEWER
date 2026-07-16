/* SERENDIPPO-LIDAR-VIEWER — Gestion des panneaux (LV.UI) */
var LV = window.LV || {};

LV.UI = {
  MOBILE_MQ: '(max-width: 768px)',

  /** @returns {boolean} */
  isMobile: function() {
    return window.matchMedia(LV.UI.MOBILE_MQ).matches;
  },

  /** @param {Element} el @returns {boolean} */
  isVisible: function(el) {
    return el && window.getComputedStyle(el).display !== 'none';
  },

  /**
   * Positionne un panneau par rapport à son bouton.
   * @param {Element} panel
   * @param {Element} btn
   */
  positionPanel: function(panel, btn) {
    if (!panel) return;
    panel.style.transform = 'none';
    if (LV.UI.isMobile()) {
      panel.style.left = '8px';
      panel.style.right = '8px';
      panel.style.top = 'auto';
      panel.style.width = 'auto';
      panel.style.maxWidth = 'none';
      return;
    }
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var pw = panel.offsetWidth;
    var ph = panel.offsetHeight;
    var gap = 10;
    var left = rect.left - pw - gap;
    var top = (window.innerHeight - ph) / 2;
    if (left < 12) left = 12;
    top = Math.max(12, Math.min(top, window.innerHeight - ph - 12));
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
    panel.style.right = 'auto';
  },

  /**
   * Bascule l'affichage d'un panneau.
   * @param {string} panelId
   * @param {string} btnId
   * @param {Function} [onOpen]
   */
  togglePanel: function(panelId, btnId, onOpen) {
    var panel = document.getElementById(panelId);
    var btn = document.getElementById(btnId);
    if (!panel || !btn) return;
    var open = !LV.UI.isVisible(panel);
    panel.style.display = open ? 'block' : 'none';
    btn.classList.toggle('active', open);
    if (open) {
      if (onOpen) onOpen();
      LV.UI.positionPanel(panel, btn);
    }
  },

  /**
   * Ferme un panneau.
   * @param {string} panelId
   * @param {string} btnId
   */
  closePanel: function(panelId, btnId) {
    var panel = document.getElementById(panelId);
    var btn = document.getElementById(btnId);
    if (!panel || !LV.UI.isVisible(panel)) return;
    panel.style.display = 'none';
    if (btn) btn.classList.remove('active');
  },

  /** Repositionne tous les panneaux ouverts (après resize). */
  repositionOpenPanels: function() {
    [
      ['overlaysPanel', 'btn-overlays'],
      ['bookmarksPanel', 'btn-bookmarks']
    ].forEach(function(p) {
      var panel = document.getElementById(p[0]);
      var btn = document.getElementById(p[1]);
      if (panel && btn && LV.UI.isVisible(panel)) {
        LV.UI.positionPanel(panel, btn);
      }
    });
  }
};