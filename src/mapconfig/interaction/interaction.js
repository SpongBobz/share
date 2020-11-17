import Draw from "ol/interaction/Draw";

/**
 * 创建交互工具
 * @export
 * @param {*} source
 * @param {*} type
 * @returns
 */
export function createMapInteraction(source, type) {
  return new Draw({
    source: source,
    type: type
  });
}
