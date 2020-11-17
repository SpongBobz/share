import { XYZ, TileWMS, WMTS as wmtsSource, ImageWMS, Vector } from "ol/source";
import WMTS from "ol/tilegrid/WMTS";
import { GeoJSON } from "ol/format";
import { bbox } from "ol/loadingstrategy";
import Projection from "ol/proj/Projection";
// 切片名 切片使用4326坐标系
let matrixIds = [
  "EPSG:4326:0",
  "EPSG:4326:1",
  "EPSG:4326:2",
  "EPSG:4326:3",
  "EPSG:4326:4",
  "EPSG:4326:5",
  "EPSG:4326:6",
  "EPSG:4326:7",
  "EPSG:4326:8",
  "EPSG:4326:9",
  "EPSG:4326:10",
  "EPSG:4326:11",
  "EPSG:4326:12",
  "EPSG:4326:13",
  "EPSG:4326:14",
  "EPSG:4326:15",
  "EPSG:4326:16",
  "EPSG:4326:17",
  "EPSG:4326:18"
];
// 分辨率
let resolutions = [
  0.703125,
  0.3515625,
  0.17578125,
  0.087890625,
  0.0439453125,
  0.02197265625,
  0.010986328125,
  0.0054931640625,
  0.00274658203125,
  0.001373291015625,
  6.866455078125e-4,
  3.4332275390625e-4,
  1.71661376953125e-4,
  8.58306884765625e-5,
  4.291534423828125e-5,
  2.1457672119140625e-5,
  1.0728836059570312e-5,
  5.364418029785156e-6,
  2.682209014892578e-6
];
// 切片策略
let tilegrid = new WMTS({
  extent: [-180.0, -90.0, 180.0, 90.0], //切片范围
  tileSize: [256, 256],
  origin: [-180.0, 90.0], //切片原点
  resolutions: resolutions, //分辨率
  matrixIds: matrixIds //层级标识列表
});
// 设置地图投影
let projection = new Projection({
  code: "EPSG:4326",
  units: "degrees",
  axisOrientation: "neu"
});
/**
 * 通过地图地址创建地图服务数据源
 * @param {string} type
 * @param {string} url
 * @param {string} LAYERS
 * @returns 地图服务数据源
 */
function createSource(type, url, LAYERS) {
  if (type == "TileWMS" && LAYERS == undefined) {
    throw new Error("请输入图层名称");
  } else if (type == "WMTS" && LAYERS == undefined) {
    throw new Error("请输入图层名称");
  }
  let source = null;
  switch (type) {
    case "XYZ":
      source = new XYZ({
        url: url
      });
      break;
    case "TileWMS":
      source = new TileWMS({
        url: url,
        params: {
          LAYERS: LAYERS,
          TILED: true
        }
      });
      break;
    case "WMS":
      source = new TileWMS({
        url: url,
        params: {
          LAYERS: LAYERS,
          TILED: true
        }
      });
      break;
    case "WMTS": //url: http://localhost:8519/geoserver/gwc/service/wmts
      source = new wmtsSource({
        url: url,
        layer: LAYERS,
        format: "image/jpeg",
        matrixSet: "EPSG:4326",
        projection: projection,
        tileGrid: tilegrid
      });
      break;
    case "ImageWMS":
      source = new ImageWMS({
        url: url,
        params: {
          LAYERS: LAYERS
        },
        serverType: "geoserver",
        crossOrigin: "anonymous"
      });
      break;
    case "Wfs":
      source = new Vector({
        format: new GeoJSON(),
        url: url,
        strategy: bbox //根据视图的范围和分辨率加载要素
      });
      break;
    case "Vector": //用于通过坐标点创建要素
      source = new Vector();
      break;
    default:
      break;
  }
  return source;
}
export default createSource;
