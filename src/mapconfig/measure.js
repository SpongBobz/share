import "ol/ol.css";
import { unByKey } from "ol/Observable";
import Overlay from "ol/Overlay";
import { getArea, getLength } from "ol/sphere";
import { LineString, Polygon } from "ol/geom";
import Draw from "ol/interaction/Draw";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

//数据源为矢量图层
var source = new VectorSource();

/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
var sketch;

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
var helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
let helpTooltip;

/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
var measureTooltipElement;

/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
var measureTooltip;

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = "点击继续绘制多边形进行面积测量 ";

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = "点击继续绘制折线进行长度测量";

let map = null;

let typeSelect = null;

let draw; // global so we can remove it later
let listener;

//获取线的长度
function formatLength(line) {
  let length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
}

//获取面积
function formatArea(polygon) {
  let area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
}

//创建提示标签
function createHelpTooltip() {
  //判断提示标签是否已经存在
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement("div");
  //设置要素的类名
  helpTooltipElement.className = "ol-tooltip hidden";
  //创建一个覆盖叠加图层
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: "center-left"
  });
  //添加至地图
  map.addOverlay(helpTooltip);
}

//创建测量结果标签
function createMeasureTooltip() {
  //判断提示标签是否已经存在
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  //创建一个覆盖叠加图层
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center"
  });
  //添加至地图
  map.addOverlay(measureTooltip);
}

/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
function pointerMoveHandler(evt) {
  //判断鼠标是不是在拖拽选择
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  var helpMsg = "点击进行绘";

  if (sketch) {
    let geom = sketch.getGeometry();
    //判断绘制的是不是面
    if (geom instanceof Polygon) {
      //设置面绘制提示标签
      helpMsg = continuePolygonMsg;
    }
    //判断绘制的是不是线
    else if (geom instanceof LineString) {
      //设置线绘制提示标签
      helpMsg = continueLineMsg;
    }
  }

  //设置提示标签的内容
  helpTooltipElement.innerHTML = helpMsg;

  //更新其位置
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove("hidden");
}

//清除地图绘制数据，以及事件监听
function ClearnMapDraw() {
  // 将当前绘制的要素设置为null
  sketch = null;

  //移除OverLay
  if (measureTooltip != null) {
    map.removeOverlay(measureTooltip);
  }

  //移除OverLay
  if (helpTooltip != null) {
    map.removeOverlay(helpTooltip);
  }

  unByKey(listener);
  //移除交互
  map.removeInteraction(draw);
  map.un("pointermove", pointerMoveHandler);
}

export default {
  name: "olMeasure",

  /**
   * 测量绘制
   */
  Measure: function(olmap, type) {
    //判断是不是存留有上一次的监听事件
    if (listener) {
      ClearnMapDraw();
    }

    map = olmap;

    map.on("pointermove", pointerMoveHandler);

    map.getViewport().addEventListener("mouseout", function() {
      helpTooltipElement.classList.add("hidden");
    });

    //设置测量类型
    typeSelect = type;

    //添加交互
    this.addInteraction();
    map.addInteraction(draw);

    //创建测量结果标签
    createMeasureTooltip();

    //添加提示标签
    createHelpTooltip();

    //开始绘制
    draw.on("drawstart", function(evt) {
      // set sketch，
      sketch = evt.feature;

      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      //初始位置
      let tooltipCoord = evt.coordinate;

      //监听图形发生变化时
      listener = sketch.getGeometry().on("change", function(evt) {
        //获取目标图形
        let geom = evt.target;
        let output;
        //判断要素是不是面
        if (geom instanceof Polygon) {
          //获取面积
          output = formatArea(geom);
          //测量标签位置变化（获取当前的要素的XXX点）
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        }
        //判断是不是线
        else if (geom instanceof LineString) {
          //获取长度
          output = formatLength(geom);
          //测量标签位置变化（获取当前的要素的XXX点）
          tooltipCoord = geom.getLastCoordinate();
        }
        //设置测量标签的值
        measureTooltipElement.innerHTML = output;
        //设置测量标签的位置
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    //绘制结束事件
    draw.on(
      "drawend",
      function() {
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static hidden";
        measureTooltip.setOffset([0, -7]);

        ClearnMapDraw();
      },
      this
    );
  },
  addInteraction: function() {
    let type = typeSelect == "Area" ? "Polygon" : "LineString";
    draw = new Draw({
      source: source,
      type: type,
      stopClick: true,
      style: new Style({
        fill: new Fill({
          //设置面填充颜色
          color: "rgba(169, 169, 169, 0.2)"
        }),
        stroke: new Stroke({
          //设置线的颜色
          color: "rgba(0, 122, 204, 0.5)",
          //lineDash: [100, 100],
          width: 3
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.7)"
          }),
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)"
          })
        })
      })
    });
  }
};
