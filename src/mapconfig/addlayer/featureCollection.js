import { Point } from "ol/geom";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import { createSrcAndColor, createFeatureStyle } from "./mapStyle";

/**
 * 创建要素集合
 * @export
 * @param {*} arrList 坐标集合 格式为[{}]
 * @param {string} [projection="EPSG:4326"] 指定坐标系统，默认为WGS84
 * @param {Number} 指定类型，0代表普通要素，1代表需要聚合的要素
 * @returns
 */
export function featureCollection(arrList, projection = "EPSG:4326", type = 0) {
  let romeArr = [];
  // 普通要素集合
  if (type === 0) {
    for (let i = 0, len = arrList.length; i < len; i++) {
      let point = new Feature({
        geometry: new Point(
          new fromLonLat([arrList[i].lon, arrList[i].lat], projection)
        )
        // name: arrList[i].name
      });
      let srcAndColor = createSrcAndColor(arrList[i].level, arrList[i].type);

      // 通过创建的图片地址请求图片
      srcAndColor.src = require("@/assets/" + srcAndColor.src + ".png");

      point.setStyle(
        createFeatureStyle(srcAndColor.src, srcAndColor.color, arrList[i].name)
      );
      romeArr.push(point);
    }
  }
  // 聚合要素集合
  else if (type === 1) {
    for (let i = 0, len = arrList.length; i < len; i++) {
      let point = new Feature({
        geometry: new Point(
          new fromLonLat([arrList[i].lon, arrList[i].lat], projection)
        )
      });
      romeArr.push(point);
    }
  }
  return romeArr;
}
