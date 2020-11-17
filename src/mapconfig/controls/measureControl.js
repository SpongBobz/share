import { getLength, getArea } from "ol/sphere";

/**
 * 计算要素的长度
 * @export
 * @param {*} line 需要计算长度的要素
 * @returns
 */
export function formatLength(line) {
  let length = getLength(line, {
    projection: "EPSG:4326"
  });
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + "km";
  } else {
    output = Math.round(length * 100) / 100 + "m";
  }
  return output;
}

/**
 * 计算要素的面积
 * @export
 * @param {*} polygon 需要计算面积的要素
 * @returns
 */
export function formatArea(polygon) {
  let area = getArea(polygon, {
    projection: "EPSG:4326"
  });
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + "km²";
  } else {
    output = Math.round(area * 100) / 100 + "m²";
  }
  return output;
}
