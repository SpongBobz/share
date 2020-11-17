/**
 * 根据坐标数组返回坐标对象集合
 * @export
 * @param {Array} coordinate 坐标数组
 */
export function PointArr(coordinate) {
  let pointArr = [];
  for (let i = 0, j = coordinate.length - 1; i < j; i += 2) {
    pointArr.push({ lon: coordinate[i], lat: coordinate[i + 1] });
  }
  return pointArr;
}

export function Point(coordinate) {
  this.lon = coordinate[0];
  this.lat = coordinate[1];
  return this;
}
