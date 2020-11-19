import { Tile, Image, Vector, Heatmap } from "ol/layer";
import { createStyle, createArrowStyle, createCluterStyle } from "./mapStyle";

/**
 * 创建地图图层
 * @param {string} type
 * @param {source} source
 * @returns 地图图层
 */
function addLayer(type, source, visible) {
  let layer = null;
  if (type && source) {
    switch (type) {
      // 添加Tile地图，主要用于添加底图和发布在geoserver中的wmts服务
      case "Tile":
        layer = new Tile({
          source: source,
          visible: visible
        });
        break;
      //加载wms服务
      case "Image":
        layer = new Image({
          source: source
        });
        break;
      case "WMS":
        layer = new Image({
          source: source
        });
        break;
      case "Wfs":
        layer = new Vector({
          source: source,
          style: function(feature) {
            createStyle(feature);
          }
        });
        break;
      case "Vector":
        layer = new Vector({
          source: source,
          style: createArrowStyle
        });
        break;
      case "VectorPoint":
        layer = new Vector({
          source: source
        });
        break;
      case "cluterVector":
        layer = new Vector({
          source: source,
          style: createCluterStyle
        });
        break;
      case "heatMap":
        layer = new Heatmap({
          source: source,
          blur: 20,
          radius: 20
        });
        break;
      default:
        break;
    }
    return layer;
  } else {
    throw new Error("请输入要加载的地图类型和地图源数据！");
  }
}
export default addLayer;
