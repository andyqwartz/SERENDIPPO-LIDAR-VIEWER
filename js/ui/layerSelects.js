/* SERENDIPPO-LIDAR-VIEWER — Selecteurs de couches gauche/droite */

/**
 * Initialise les menus déroulants de sélection de couches.
 * Appelé par LV.TOOLS.init().
 */
LV.TOOLS.initLayerSelects = function() {
  var names = LV.LAYER_NAMES;
  var groups = LV.LAYER_GROUPS || [{ label: '', keys: LV.SELECTABLE_LAYERS }];
  [
    { id: 'leftLayerSelect', key: 'leftKey', onChange: LV.TOOLS.switchLeftLayer },
    { id: 'rightLayerSelect', key: 'rightKey', onChange: LV.TOOLS.switchRightLayer }
  ].forEach(function(cfg) {
    var sel = document.getElementById(cfg.id);
    if (!sel) return;
    sel.innerHTML = '';
    groups.forEach(function(group) {
      var container = sel;
      if (group.label) {
        var og = document.createElement('optgroup');
        og.label = group.label;
        container = og;
        sel.appendChild(og);
      }
      group.keys.forEach(function(key) {
        var opt = document.createElement('option');
        opt.value = key;
        opt.textContent = names[key] || key;
        container.appendChild(opt);
      });
    });
    sel.value = LV[cfg.key];
    sel.onchange = cfg.onChange;
  });
};

/**
 * Change une couche d'un côté.
 * @param {string} side - 'left' ou 'right'
 */
LV.TOOLS.switchLayer = function(side) {
  var isLeft = side === 'left';
  var keyProp = isLeft ? 'leftKey' : 'rightKey';
  var selId = isLeft ? 'leftLayerSelect' : 'rightLayerSelect';
  var oldKey = LV[keyProp];
  var newKey = document.getElementById(selId).value;
  if (oldKey === newKey) return;

  LV[keyProp] = newKey;

  // Réassemble l'empilement des deux panes (les 2 côtés changent de top/bottom)
  if (LV.rebuildStack) LV.rebuildStack();
};

LV.TOOLS.switchLeftLayer = function() { LV.TOOLS.switchLayer('left'); };
LV.TOOLS.switchRightLayer = function() { LV.TOOLS.switchLayer('right'); };