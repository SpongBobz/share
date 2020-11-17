import { View } from "ol";
import { inAndOut } from "ol/easing";

/**
 * 地图旋转功能
 * @param {*} button 地图恢复初始方向的按钮
 * @param {*} rotation 要旋转的角度 90,0,-90
 * @param {*} type 旋转的类型，left, center, right
 * @param {*} map 要旋转的地图
 */
function rotationView(button, rotation, type, map) {
  let view = map.getView();
  let r =
    type === "center" ? 0 : view.getRotation() + (rotation / 180) * Math.PI;
  if (view && view instanceof View) {
    if (view.getRotation !== undefined) {
      view.animate({
        rotation: r,
        duration: 250,
        easing: inAndOut
      });
      button.style.msTransform = "rotate(" + r + "rad)";
      button.style.webkitTransform = "rotate(" + r + "rad)";
      button.style.transform = "rotate(" + r + "rad)";
    }
  } else {
    throw new Error("未获取到地图视图");
  }
}

export default rotationView;
