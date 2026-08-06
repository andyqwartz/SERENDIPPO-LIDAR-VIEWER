/* SERENDIPPO-LIDAR-VIEWER — Providers Europe (relief LiDAR/DTM publics) */
/* Couverture : 9 territoires europeens via flux officiels WMS/WMTS publics.
   Allemagne & Pologne non inclus : pas de flux public direct utilisable librement. */

LV.PROV_EU = {
  // ── Belgique / Vlaanderen — DHMV II hillshade 25cm (WMTS) ──
  be_vl: function() {
    return L.tileLayer(LV.URL.EU_BE_VL, {
      maxZoom: 19, detectRetina: true, attribution: LV.ATTR.EU_BE_VL
    });
  },

  // ── Belgique / Wallonie — MNT 2021-2022 hillshade (WMS) ──
  be_wa: function() {
    return wms3857(LV.URL.EU_BE_WA, '0', {
      maxZoom: 19, detectRetina: true, attribution: LV.ATTR.EU_BE_WA
    });
  },

  // ── Suisse — swissALTI3D reliefschattierung (WMTS 3857) ──
  ch: function() {
    return L.tileLayer(LV.URL.EU_CH, {
      maxZoom: 19, detectRetina: true, attribution: LV.ATTR.EU_CH
    });
  },

  // ── Angleterre — Environment Agency LiDAR Composite DTM 1m (WMS) ──
  gb_en: function() {
    return wms3857(LV.URL.EU_GB, 'Lidar_Composite_Hillshade_DTM_1m', {
      maxZoom: 19, maxNativeZoom: 17, detectRetina: true, attribution: LV.ATTR.EU_GB
    });
  },

  // ── Tchéquie — CUZK DMR 5G GrayscaleHillshade (WMS) ──
  cz: function() {
    return wms3857(LV.URL.EU_CZ, 'dmr5g:GrayscaleHillshade', {
      maxZoom: 19, maxNativeZoom: 18, detectRetina: true, attribution: LV.ATTR.EU_CZ
    });
  },

  // ── Slovaquie — ZBGIS DMR (WMS) ──
  sk: function() {
    return wms3857(LV.URL.EU_SK, '0', {
      maxZoom: 19, maxNativeZoom: 18, detectRetina: true, attribution: LV.ATTR.EU_SK
    });
  },

  // ── Luxembourg — geoportail.lu MNT relief (WMS) ──
  lu: function() {
    return wms3857(LV.URL.EU_LU, '3032', {
      maxZoom: 20, maxNativeZoom: 19, transparent: false, detectRetina: true, attribution: LV.ATTR.EU_LU
    });
  },

  // ── Suède — Lantmateriet höjdmodell terrängskuggning (WMS) ──
  se: function() {
    return wms3857(LV.URL.EU_SE, 'terrangskuggning', {
      maxZoom: 19, maxNativeZoom: 17, transparent: false, attribution: LV.ATTR.EU_SE
    });
  },

  // ── Norvège — Kartverket Høydedata DTM skyggerelieff (ImageServer export) ──
  no: function() {
    return LV.arcgisExport(LV.URL.EU_NO, {
      maxZoom: 20, maxNativeZoom: 18, exportTransparent: false,
      renderingRule: '{"rasterFunction":"skyggerelieff"}',
      attribution: LV.ATTR.EU_NO
    });
  }
};
