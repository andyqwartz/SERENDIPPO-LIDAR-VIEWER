/* SERENDIPPO-LIDAR-VIEWER — Providers France (production) */

/**
 * FR providers — production stable.
 * Each provider is a function returning a Leaflet layer.
 * Registered via LV.ProviderRegistry.
 */
LV.PROV_FR = {
  lidar: function() {
    return LV.ignWMTS('IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW', LV.WMTS.PM, LV.IMG.PNG, {
      maxZoom: 19, attribution: LV.ATTR.IGN_LIDAR
    });
  },
  mns: function() {
    return LV.ignWMTS('IGNF_LIDAR-HD_MNS_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW', LV.WMTS.PM_0_18, LV.IMG.PNG, {
      maxZoom: 18, attribution: LV.ATTR.IGN_MNS
    });
  },
  ortho: function() {
    return LV.ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS', LV.WMTS.PM, LV.IMG.JPEG, {
      maxZoom: 19, attribution: LV.ATTR.IGN
    });
  },
  hrortho: function() {
    return LV.ignWMTS('HR.ORTHOIMAGERY.ORTHOPHOTOS', LV.WMTS.PM_6_19, LV.IMG.JPEG, {
      maxZoom: 19, attribution: LV.ATTR.IGN_HR
    });
  },
  planign: function() {
    return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', LV.WMTS.PM_0_19, LV.IMG.PNG, {
      maxZoom: 19, attribution: LV.ATTR.IGN_PLAN
    });
  },
  bduni: function() {
    return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1', LV.WMTS.PM_0_18, LV.IMG.PNG, {
      maxZoom: 18, attribution: LV.ATTR.IGN_J1
    });
  },
  cassini: function() {
    return LV.ignWMTS('BNF-IGNF_GEOGRAPHICALGRIDSYSTEMS.CASSINI', LV.WMTS.PM_6_14, LV.IMG.PNG, {
      maxZoom: 14, attribution: LV.ATTR.IGN_CASSINI
    });
  },
  etatmajor: function() {
    return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40', LV.WMTS.PM, LV.IMG.JPEG, {
      maxZoom: 16, attribution: LV.ATTR.IGN_EM
    });
  },
  scan50: function() {
    return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN50.1950', LV.WMTS.PM_3_15, LV.IMG.JPEG, {
      maxZoom: 15, attribution: LV.ATTR.IGN_SCAN50
    });
  },
  ortho1950: function() {
    return LV.ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS.1950-1965', LV.WMTS.PM, LV.IMG.JPEG, {
      maxZoom: 18, attribution: LV.ATTR.IGN_ORTHO50
    });
  },
  ortho1965: function() {
    return LV.ignWMTS('ORTHOIMAGERY.ORTHOPHOTOS.1965-1980', LV.WMTS.PM, LV.IMG.JPEG, {
      maxZoom: 18, attribution: LV.ATTR.IGN_ORTHO65
    });
  },
  scan25: function() {
    return LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR', LV.WMTS.PM, LV.IMG.JPEG, {
      maxZoom: 19, attribution: LV.ATTR.IGN_SCAN25
    });
  },
  superposed: function() {
    return L.layerGroup([
      L.tileLayer(LV.URL.GOOGLE_S, { maxZoom: 20 }),
      LV.ignWMTS('GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1', LV.WMTS.PM_0_18, LV.IMG.PNG, {
        maxZoom: 18, opacity: 0.5, attribution: '© Google / IGN — Plan J+1'
      })
    ]);
  }
};