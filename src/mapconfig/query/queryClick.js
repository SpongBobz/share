import axios from "axios";

/**
 * 地图点击查询事件
 * @export
 * @param {String} type 要查询的图层的加载类型，Wfs以及其他
 * @param {Object} map 地图
 * @param {Object} ev 点击事件的参数
 * @param {Object} [source=null] 如果加载类型为其他时图层的源
 * @returns
 */
export function featureClicked(type, map, ev, source = null) {
  if (type === "Wfs") {
    let pixel = map.getEventPixel(ev.originalEvent);
    let feature = map.forEachFeatureAtPixel(pixel, function(feature) {
      return feature;
    });
    if (feature != undefined) {
      return feature.values_;
    }
  } else {
    // wms服务的点击查询
    let viewResolution = map.getView().getResolution();
    let url = source.getFeatureInfoUrl(
      ev.coordinate,
      viewResolution,
      "EPSG:4326",
      { INFO_FORMAT: "application/json" }
    );
    if (url) {
      axios.get(url).then(response => {
        return response.data;
      });
    }
  }
}
