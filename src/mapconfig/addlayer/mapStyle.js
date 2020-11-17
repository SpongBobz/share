import { Fill, Circle, Style, Text, Icon, Stroke } from "ol/style";
import { Point, LineString, Polygon } from "ol/geom";
let padding = [3, 3, 3, 3];

let arrowImage = require("@/assets/arrow.png");
let address = require("@/assets/address.png");
let carImage = require("@/assets/car.png");

/**
 * 创建WFS要素样式
 * @param {*} feature 要素
 * @returns
 */
export function createStyle(feature) {
  return new Style({
    image: new Circle({
      radius: 0
    }),
    text: new Text({
      text: feature.get("name"),
      offsetX: 20,
      offsetY: -20,
      textAlign: "left",
      fill: new Fill({
        color: "white"
      }),
      backgroundFill: new Fill({
        color: feature.get("color")
      }),
      padding: padding
    })
  });
}

/**
 * 动态创建样式所需的图片地址与标注颜色
 * @param {number} [level=0]
 * @param {string} [type='07']
 * @returns {Property} { src , color }
 */
export function createSrcAndColor(level = 0, type = "07") {
  let src, color;
  src = type + "-" + level;
  switch (level) {
    case 0:
      color = "green";
      break;
    case 1:
      color = "blue";
      break;
    case 2:
      color = "orange";
      break;
    case 3:
      color = "red";
      break;
    default:
      break;
  }
  return {
    src: src,
    color: color
  };
}

/**
 * 创建要素样式
 * @param {string} src 图片地址
 * @param {string} color 标注颜色
 * @param {string} featureName 要素名称
 * @param {string} [position="left"] 标注显示在哪个位置，可选值有'left','right','center','end','start',默认值为'left'
 * @returns {Style} style 要素样式
 */
export function createFeatureStyle(src, color, featureName, position = "left") {
  return new Style({
    image: new Icon({
      scale: 1,
      anchor: [0.5, 1],
      src: src
    }),
    text: new Text({
      text: featureName,
      textAlign: position,
      offsetX: 20,
      offsetY: -20,
      fill: new Fill({
        color: "white"
      }),
      backgroundFill: new Fill({
        color: color
      }),
      padding: padding
    })
  });
}

/**
 * 创建带箭头的线的样式
 * @export
 * @param {*} feature
 * @returns
 */
export function createArrowStyle(feature) {
  let geometry = feature.getGeometry();
  let styles = [
    new Style({
      stroke: new Stroke({
        color: "#ffcc33",
        width: 2
      })
    })
  ];
  if (geometry instanceof Polygon) {
    styles.push(
      new Style({
        fill: new Fill({
          color: "rgba(255,255,255,0.2)"
        })
      })
    );
  } else if (geometry instanceof LineString) {
    // 遍历线条的每一段
    geometry.forEachSegment(function(start, end) {
      let dx = end[0] - start[0];
      let dy = end[1] - start[1];
      let rotation = Math.atan2(dy, dx);
      styles.push(
        new Style({
          geometry: new Point(end),
          image: new Icon({
            src: arrowImage,
            anchor: [0.75, 0.5],
            rotateWithView: true,
            rotation: -rotation
          })
        })
      );
    });
  } else if (geometry instanceof Point) {
    if (feature.get("type") == "icon") {
      styles.push(
        new Style({
          image: new Icon({
            src: address,
            anchor: [0.5, 1],
            scale: 0.1
          })
        })
      );
    } else if (feature.get("type") == "geoMarker") {
      styles.push(
        new Style({
          image: new Icon({
            src: carImage,
            anchor: [0.5, 1],
            scale: 0.1
          })
        })
      );
    }
  }
  return styles;
}

/**
 * 创建聚合要素样式
 * @export
 * @param {*} feature 要素
 * @returns
 */
export function createCluterStyle(feature) {
  return new Style({
    image: new Icon({
      src: address,
      anchor: [0.5, 1],
      scale: 0.1
    }),
    text: new Text({
      text: feature.get("features").length.toString(),
      fill: new Fill({
        color: "white"
      })
    })
  });
}

export function createMarkerStyle(src, rotation) {
  return new Style({
    image: new Icon({
      src: src,
      scale: 1,
      rotation: rotation
    })
  });
}
