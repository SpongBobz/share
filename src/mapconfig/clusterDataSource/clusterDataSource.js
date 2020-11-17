import { Cluster } from "ol/source";

/**
 * 创建聚合图层源
 * @export
 * @param {*} source 需要聚合的图层源
 * @param {number} [distance=10] 距离超过多少开始聚合，默认为10，单位为像素
 * @returns
 */
export function createCluterSource(source, distance = 10) {
  return new Cluster({
    distance: distance,
    source: source
  });
}
