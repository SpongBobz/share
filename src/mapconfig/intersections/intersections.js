let Intersections = {};

/**
 * 判断点是否在多边形内部
 * @param {*} points 多边形坐标集合
 * @param {*} point 点坐标
 * @returns
 */
Intersections.withinPolygon = function(points, point) {
  let x = Number(point.lon),
    y = Number(point.lat);
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    let xi = Number(points[i].lon),
      yi = Number(points[i].lat);
    let xj = Number(points[j].lon),
      yj = Number(points[j].lat);
    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * 判断点是否在圆内部
 * @param {*} center 圆心坐标
 * @param {*} radius 圆半径
 * @param {*} point 点坐标
 * @returns
 */
Intersections.withinCircle = function(center, radius, point) {
  if (radius === 0) return false;
  let dx = center.lon - point.lon;
  let dy = center.lat - point.lat;
  return dx * dx + dy * dy <= radius * radius;
};

export default Intersections;
