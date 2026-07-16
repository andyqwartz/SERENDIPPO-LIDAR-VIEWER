/* SERENDIPPO-LIDAR-VIEWER — Providers dev (Espagne, Italie) */
/* ⚠ EXPERIMENTAL — not production-ready. Use at your own risk. */
var LV = window.LV || {};

/**
 * Dev providers — Spain and Italy.
 * Spain: partially working (PNOA LiDAR, MDT, MTN historical).
 * Italy: TINITALY, PCN LiDAR WMS (regional), IGM — often unreliable.
 */
LV.PROV_DEV = {
  // ── Espagne (IDEe / IGN-CNIG) ──
  lidar_es: function() {
    return gmWMTS(LV.URL.ES_LIDAR, 'EL.GridCoverageDSM', 'default', 'png', {
      maxZoom: 17, attribution: LV.ATTR.ES_LIDAR
    });
  },
  mdt_es: function() {
    return gmWMTS(LV.URL.ES_MDT, 'Relieve', 'default', 'jpeg', {
      maxZoom: 17, attribution: LV.ATTR.ES_MDT
    });
  },
  es_ortho: function() {
    return gmWMTS(LV.URL.ES_PNOA, 'OI.OrthoimageCoverage', 'default', 'jpeg', {
      maxZoom: 19, attribution: LV.ATTR.ES_ORTHO
    });
  },
  es_mtn50: function() {
    return gmWMTS(LV.URL.ES_MTN, 'mtn50-edicion1', 'default', 'jpeg', {
      maxZoom: 15, attribution: LV.ATTR.ES_MTN50
    });
  },
  es_mtn25: function() {
    return gmWMTS(LV.URL.ES_MTN, 'mtn25-edicion1', 'default', 'jpeg', {
      maxZoom: 16, attribution: LV.ATTR.ES_MTN25
    });
  },
  // ── Italie (TINITALY / PCN / IGM) ──
  mdt_it: function() {
    return wms3857(LV.URL.IT_TINITALY, 'tinitaly_hshd', {
      maxZoom: 15, attribution: LV.ATTR.IT_MDT
    });
  },
  lidar_it: function() {
    return L.layerGroup([
      wms3857(LV.URL.IT_PCN + 'LIDAR_PIEMONTE.map', 'EL.LIDAR.PIEMONTE.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Piémont' }),
      wms3857(LV.URL.IT_PCN + 'LIDAR_LOMBARDIA.map', 'EL.LIDAR.LOMBARDIA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Lombardie' }),
      wms3857(LV.URL.IT_PCN + 'LIDAR_VENETO.map', 'EL.LIDAR.VENETO.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Vénétie' }),
      wms3857(LV.URL.IT_PCN + 'LIDAR_TOSCANA.map', 'EL.LIDAR.TOSCANA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Toscane' }),
      wms3857(LV.URL.IT_PCN + 'LIDAR_LAZIO.map', 'EL.LIDAR.LAZIO.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Latium' }),
      wms3857(LV.URL.IT_PCN + 'LIDAR_SICILIA.map', 'EL.LIDAR.SICILIA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Sicile' }),
      wms3857(LV.URL.IT_PCN + 'LIDAR_SARDEGNA.map', 'EL.LIDAR.SARDEGNA.2x2.DTM', { maxZoom: 18, attribution: LV.ATTR.IT_LIDAR + 'Sardaigne' }),
    ]);
  },
  it_igm25: function() {
    return wms3857(LV.URL.IT_IGM, 'CB.IGM25000.32,CB.IGM25000.33', {
      maxZoom: 16, transparent: false, attribution: LV.ATTR.IT_IGM
    });
  }
};