import "ol/ol.css";
import { Map as olMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";

import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import Projection from "ol/proj/Projection";
import { get as getProjection } from "ol/proj";
import WMTS from "ol/source/WMTS";
import XYZ from "ol/source/XYZ";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { defaults /**ScaleLine*/ } from "ol/control";
import ImageWMS from "ol/source/ImageWMS";

import GeoJSON from "ol/format/GeoJSON";
import WKT from "ol/format/WKT";
import { Draw } from "ol/interaction";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { Fill, Stroke, Circle, Style, Text } from "ol/style";
import { createBox } from "ol/interaction/Draw";

//自定义的文件
import Common from "./Common.js";
import measurePart from "./measure.js";

export default {
  name: "CustomOpenlayer",
  description: "自定义OpenLayer类文件",

  //默认配置，无需修改
  config: {
    resolutions: [
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
    ],
    matrixIds: [
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
    ],
    matrixSet: "EPSG:4326" //切片方案名称，统一使用EPSG:编号,
  },
  //地图相关数据
  data: {
    BasicDataGroup: null, //基础数据图层组
    ThematicDataGroup: null, //专题数据图层组
    TemporaryDataGroup: null, //临时数据图层组
    projection: null, //当前地图的坐标系对象
    olMap: null, //地图对象
    view: null
  },

  InitMap: function(id, prjId, prjContent, extent, center, zoom) {
    try {
      this.data.BasicDataGroup = new Map();

      this.data.ThematicDataGroup = new Map();

      this.data.TemporaryDataGroup = new Map();

      //创建坐标系
      proj4.defs(prjId, prjContent);

      //注册坐标系
      register(proj4);

      let projection = new Projection({
        code: prjId,
        extent: extent
      });

      this.data.projection = projection;
      this.data.view = new View({
        projection: projection, //使用这个坐标系
        center: center,
        zoom: zoom
      });
      this.data.olMap = new olMap({
        target: id,
        view: this.data.view,
        controls: defaults({
          zoom: false,
          rotate: false
        })
      });
      return this.data.olMap;
    } catch (error) {
      console.error(error);
    }
  },
  /**
   *
   * @param {String} sourceUrl 服务地址
   * @param {String} layerName (作为唯一编号)
   * @param {String} type 类型。0为基础数据，1为专题数据，2位临时数据
   */
  AddMapTileByXyz: function(sourceUrl, layerName, type, visible = true) {
    try {
      let xyzSource = new XYZ({
        // crossOrigin: "anonymous",
        url: sourceUrl
      });

      let xyzLayer = new TileLayer({
        source: xyzSource,
        visible
      });

      this.data.olMap.addLayer(xyzLayer);

      switch (type) {
        case 0:
          //添加到基础数据图层组中
          this.data.BasicDataGroup.set(layerName, xyzLayer);
          break;

        case 1:
          //添加到专题数据图层组中
          this.data.ThematicDataGroup.set(layerName, xyzLayer);
          break;

        case 2:
          //添加到临时数据图层组中
          this.data.TemporaryDataGroup.set(layerName, xyzLayer);

          break;

        default:
          console.error("WMTS服务添加时设置的数据类型错误");

          break;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 将Wmts服务添加到地图中
   * @param {String} sourceUrl 服务地址
   * @param {String} sourceName 图层数据源名称
   * @param {String} layerName 图层名称(作为唯一编号)
   * @param {int} type 类型。0为基础数据，1为专题数据，2位临时数据
   */
  AddMapTileByWmts: function(sourceUrl, sourceName, layerName, type) {
    try {
      //根据配置获取WMTS坐标
      let wmtsProjection = getProjection(this.config.matrixSet);

      //创建WMTS服务源
      let wmtsSource = new WMTS({
        crossOrigin: "anonymous",
        //服务地址
        url: sourceUrl,
        layer: sourceName,
        //切片集
        matrixSet: this.config.matrixSet,
        format: "image/png",
        projection: wmtsProjection,
        //切片信息
        tileGrid: new WMTSTileGrid({
          tileSize: [256, 256],
          extent: [-180.0, -90.0, 180.0, 90.0], //范围
          origin: [-180.0, 90.0],
          resolutions: this.config.resolutions,
          matrixIds: this.config.matrixIds
        }),
        //

        wrapX: true
      });

      //创建WMTS服务图层
      let tileLayer = new TileLayer({
        source: wmtsSource
      });

      //将图层添加到地图中
      this.data.olMap.addLayer(tileLayer);

      switch (type) {
        case 0:
          //添加到基础数据图层组中
          this.data.BasicDataGroup.set(layerName, tileLayer);
          break;

        case 1:
          //添加到专题数据图层组中
          this.data.ThematicDataGroup.set(layerName, tileLayer);
          break;

        case 2:
          //添加到临时数据图层组中
          this.data.TemporaryDataGroup.set(layerName, tileLayer);

          break;

        default:
          console.error("WMTS服务添加时设置的数据类型错误");

          break;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   *
   * @param {string} sourceUrl  服务地址
   * @param {string} sourceName 图层数据源名称
   * @param {string} layerName 图层名称(作为唯一编号)
   * @param {string} type 类型。0为基础数据，1为专题数据，2位临时数据
   */
  AddWmsLayerAsImage: function(sourceUrl, sourceName, layerName, type) {
    try {
      let wmslayer = new ImageLayer({
        source: new ImageWMS({
          crossOrigin: "anonymous",
          url: sourceUrl,
          params: {
            FORMAT: "image/png",
            VERSION: "1.1.0",
            STYLES: "",
            LAYERS: sourceName,
            serverType: "geoserver"
          }
        })
      });

      this.data.olMap.addLayer(wmslayer);

      switch (type) {
        case 0:
          //添加到基础数据图层组中
          this.data.BasicDataGroup.set(layerName, wmslayer);
          break;

        case 1:
          //添加到专题数据图层组中
          this.data.ThematicDataGroup.set(layerName, wmslayer);
          break;

        case 2:
          //添加到临时数据图层组中
          this.data.TemporaryDataGroup.set(layerName, wmslayer);

          break;

        default:
          console.error("WMTS服务添加时设置的数据类型错误");

          break;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 添加GeoJson数据
   * @param {jsonObject} json GeoJson对象
   * @param {int} type 类型。0为基础数据，1为专题数据，2位临时数据
   */
  AddGeoJson: function(json, type) {
    try {
      let vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(json)
      });

      let vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: "green",
            width: 20
          }),
          fill: new Fill({
            color: "green"
          }),
          image: new Circle({
            radius: 10,
            fill: null,
            stroke: new Stroke({
              color: "magenta"
            })
          })
        })
      });

      this.data.olMap.addLayer(vectorLayer);

      switch (type) {
        case 0:
          //添加到基础数据图层组中
          this.data.BasicDataGroup.set(Common.GetCurentTimeStr(), vectorLayer);
          break;

        case 1:
          //添加到专题数据图层组中
          this.data.ThematicDataGroup.set(
            Common.GetCurentTimeStr(),
            vectorLayer
          );
          break;

        case 2:
          //添加到临时数据图层组中
          this.data.TemporaryDataGroup.set(
            Common.GetCurentTimeStr(),
            vectorLayer
          );

          break;

        default:
          console.error("WMTS服务添加时设置的数据类型错误");

          break;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 移除图层
   * @param {string} layerName 图层名称(作为唯一编号)
   * @param {int} type 类型。0为基础数据，1为专题数据，2位临时数据
   */
  RemoveLayer: function(layerName, type) {
    try {
      switch (type) {
        case 0:
          this.data.olMap.removeLayer(this.data.BasicDataGroup.get(layerName));

          this.data.BasicDataGroup.delete(layerName);
          break;
        case 1:
          this.data.olMap.removeLayer(
            this.data.ThematicDataGroup.get(layerName)
          );
          this.data.ThematicDataGroup.delete(layerName);
          break;
        case 2:
          this.data.olMap.removeLayer(
            this.data.TemporaryDataGroup.get(layerName)
          );
          this.data.TemporaryDataGroup.delete(layerName);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 设置图层的显示
   * @param {string} layerName 图层名称(加载时的layerName)
   * @param {bool} visible 可见性
   */
  SetLayerVisible: function(layerName, visible) {
    try {
      if (this.data.BasicDataGroup.get(layerName) != null) {
        this.data.BasicDataGroup.get(layerName).setVisible(visible);

        return;
      }

      if (this.data.ThematicDataGroup.get(layerName) != null) {
        this.data.ThematicDataGroup.get(layerName).setVisible(visible);

        return;
      }

      if (this.data.TemporaryDataGroup.get(layerName) != null) {
        this.data.TemporaryDataGroup.get(layerName).setVisible(visible);

        return;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 设置图层透明度(ImageLayer、TileLayer)
   * @param {string} layerName 图层
   * @param {int} value 透明度0--100
   */
  SetLayerTransparency: function(layerName, value) {
    try {
      // ol/layer/image setOpacity
      // ol/layer/tile  setOpacity
      if (this.data.BasicDataGroup.get(layerName) != null) {
        this.data.BasicDataGroup.get(layerName).setOpacity(value / 100.0);
        return;
      }

      if (this.data.ThematicDataGroup.get(layerName) != null) {
        this.data.ThematicDataGroup.get(layerName).setOpacity(value / 100.0);

        return;
      }

      if (this.data.TemporaryDataGroup.get(layerName) != null) {
        this.data.TemporaryDataGroup.get(layerName).setOpacity(value / 100.0);

        return;
      }
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 通过extent范围实现地图缩放
   *
   * @param {Array} extent extent数据类型为int数组，不能为字符串，如果为字符串则先转换为int数组。
   */
  ZoomToExtent: function(extent) {
    try {
      var mapZoom = extent;

      var mapPadding = [20, 10, 20, 10];

      this.data.olMap.getView().fit(mapZoom, this.data.olMap.getSize(), {
        constrainResolution: false,
        earest: false,
        padding: mapPadding
      });
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 缩放至全图
   */
  ZoomToMaxExtent: function() {
    try {
      let extent = this.data.projection.getExtent();
      this.ZoomToExtent(extent);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 缩放到指定位置
   * @param {DOUBLE} x  目标点X值
   * @param {Double} y  目标点Y值
   * @param {Double} zoom  查看的缩放等级
   */
  ZoomToPoint: function(x, y, zoom) {
    try {
      this.data.olMap.getView().animate({
        zoom: zoom,
        center: [x, y]
      });
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 缩放至wkt
   */
  ZoomToWkt: function(wkt) {
    let feature = this.FromWkt(wkt);

    let tempExtent = feature.getGeometry().getExtent();

    this.ZoomToExtent(tempExtent);
  },

  /**
   * 刷新地图，去除高亮、临时绘制对象
   */
  RefreshMap: function() {
    try {
      //从地图中移除临时图层
      for (let item of this.data.TemporaryDataGroup.values()) {
        this.data.olMap.removeLayer(item);
      }

      //从存储中移除临时图层标识
      this.data.TemporaryDataGroup.clear();
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 当地图尺寸变化后，进行刷新
   */
  RefreshDom: () => {
    this.data.olMap.updateSize();
  },

  /**
   * 获取地图当前的缩放比例
   *
   * @returns 缩放等级
   */
  GetZoomLevel: function() {
    try {
      return this.data.olMap.getView().getZoom();
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 将要素转换为wkt
   * @param {ol/Feature} feature 矢量要素
   */
  ToWkt: function(feature) {
    let format = new WKT();
    return format.writeFeature(feature);
  },

  /**
   * 根据wkt创建要素
   * @param {string} wkt
   */
  FromWkt: function(wkt) {
    let format = new WKT();

    let feature = format.readFeature(wkt, {
      dataProjection: this.projection,
      featureProjection: this.projection
    });

    return feature;
  },

  /**
   * 显示文本
   * @param {OL/Feature} feature 要素
   * @param {int} fontSize 字体大小
   * @param {string} fontcolor 字体颜色
   */
  HiLightLabel: function(feature, fontSize, fontcolor = "rgba(255, 0, 0,1)") {
    try {
      let source = new VectorSource({ wrapX: false });

      source.addFeature(feature.clone());

      let vector = new VectorLayer({
        source: source,
        style: feature => {
          return new Style({
            text: new Text({
              font: fontSize + "px Calibri,sans-serif",
              text: feature.clone().get("label"),
              fill: new Fill({ color: fontcolor })
            })
          });
        }
      });

      this.data.olMap.addLayer(vector);

      this.data.TemporaryDataGroup.set(Common.GetCurentTimeStr(), vector);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 将wkt在地图上进行显示
   * @param {string} wkt
   */
  HiLightWkt: function(wkt) {
    let format = new WKT();

    let feature = format.readFeature(wkt, {
      dataProjection: this.data.projection,
      featureProjection: this.data.projection
    });

    this.HiLightFeature(feature);
  },

  /**
   * 在地图上高亮显示矢量要素
   * @param {ol/Feature} feature 矢量要素
   */
  HiLightFeature: function(feature) {
    try {
      //符号化样式
      let style = new Style({
        image: new Circle({
          radius: 25,
          fill: new Fill({
            color: "rgba(255,0,0,1)"
          }),
          stroke: new Stroke({
            color: "#3399CC",
            width: 6
          })
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.6)"
        }),
        stroke: new Stroke({
          color: "#319FD3",
          width: 5
        })
      });

      //设置样式
      feature.setStyle(style);

      var source = new VectorSource({ wrapX: false });

      source.addFeature(feature.clone());

      var vector = new VectorLayer({
        source: source,
        zIndex: 999
      });

      this.data.olMap.addLayer(vector);

      this.data.TemporaryDataGroup.set(Common.GetCurentTimeStr(), vector);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 绘制多边形
   * @param {Function} event 回调函数
   * @param {Bool} retainShape  是否保留绘制的多边形
   * @param {Bool} excuteMethod  是否执行回调
   */
  DrawPolygon: function(event, retainShape, excuteMethod) {
    try {
      //创建矢量数据源
      let source = new VectorSource();

      //创建绘制工具
      let draw = new Draw({
        source: source,
        type: "Polygon",
        stopClick: true
      });

      //绘制完成后执行
      draw.on("drawend", evt => {
        if (retainShape) {
          this.HiLightFeature(evt.feature);
        }

        if (excuteMethod) {
          event(this.ToWkt(evt.feature));
        }

        this.data.olMap.removeInteraction(draw);
      });
      //添加
      this.data.olMap.addInteraction(draw);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 绘制圆形
   * @param {Function} event 回调函数
   * @param {bool} retainShape 是否保留绘制的 圆形
   * @param {bool} excuteMethod 是否执行回调
   */
  DrawCircle: function(event, retainShape, excuteMethod) {
    try {
      //创建矢量数据源
      let source = new VectorSource();

      //创建绘制工具
      let draw = new Draw({
        source: source,
        type: "Circle",
        stopClick: true
      });

      //绘制完成后执行
      draw.on("drawend", evt => {
        if (retainShape) {
          this.HiLightFeature(evt.feature);
        }

        if (excuteMethod) {
          let center = evt.feature.getGeometry().getCenter();
          event(
            this.CircleWkt(
              center[0],
              center[1],
              evt.feature.getGeometry().getRadius()
            )
          );
        }

        this.data.olMap.removeInteraction(draw);
      });
      //添加
      this.data.olMap.addInteraction(draw);
    } catch (error) {
      console.error(error);
    }
  },
  CircleWkt: function(x, y, radius, count = 36) {
    try {
      //度量角度
      let degrees = (2 * Math.PI) / count;

      let wkt = "POLYGON ((";

      for (let i = 0; i < count; i++) {
        let tempx = x + radius * Math.cos(degrees * i);

        let tempy = y + radius * Math.sin(degrees * i);

        wkt = wkt + tempx + " " + tempy + ",";
      }

      let startX = x + radius;

      let startY = y;

      wkt = wkt + startX + " " + startY + "))";

      return wkt;
    } catch (error) {
      console.error(error);
    }
  },
  /**
   * 绘制矩形
   * @param {function} event 回调函数
   * @param {bool} retainShape 是否保留绘制的矩形
   * @param {bool} excuteMethod 是否执行回调
   */
  DrawBox: function(event, retainShape, excuteMethod) {
    try {
      //创建矢量数据源
      let source = new VectorSource();

      //创建绘制盒子工具(矩形)
      let geometryFunction = new createBox();

      //创建绘制工具
      let draw = new Draw({
        source: source,
        type: "Circle",
        geometryFunction: geometryFunction,
        stopClick: true
      });

      //绘制完成后执行
      draw.on("drawend", evt => {
        if (retainShape) {
          this.HiLightFeature(evt.feature);
        }

        if (excuteMethod) {
          event(this.ToWkt(evt.feature));
        }

        this.data.olMap.removeInteraction(draw);
      });
      //添加
      this.data.olMap.addInteraction(draw);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 绘制线段
   * @param {function} event 回调函数
   * @param {boolean} retainShape 是否保留绘制的线段
   * @param {boolean} excuteMethod 是否执行回调函数
   */
  DrawLine: function(event, retainShape, excuteMethod) {
    try {
      let source = new VectorSource();

      let draw = new Draw({
        source: source,
        type: "LineString",
        stopClick: true
      });
      draw.on("drawend", evt => {
        if (retainShape) {
          this.HiLightFeature(evt.feature);
        }
        if (excuteMethod) {
          event(this.ToWkt(evt.feature));
        }
        this.data.olMap.removeInteraction(draw);
      });
      this.data.olMap.addInteraction(draw);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   *
   * @param {function} event 回调函数
   * @param {bool} retainShape 是否在图上保存绘制的点
   * @param {bool} excuteMethod 是否执行回调
   */
  DrawPoint: function(event, retainShape, excuteMethod) {
    try {
      let source = new VectorSource();

      let draw = new Draw({
        source: source,
        type: "Point",
        stopClick: true
      });

      draw.on("drawend", evt => {
        if (retainShape) {
          this.HiLightFeature(evt.feature);
        }

        if (excuteMethod) {
          event(this.ToWkt(evt.feature));
        }

        this.data.olMap.removeInteraction(draw);
      });

      this.data.olMap.addInteraction(draw);
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * 绘制文本标注在地图上
   * @param {string} value 文本内容
   * @param {int } fontSize 字体大小
   */
  DrawLabel(value, fontSize) {
    this.DrawPoint(
      wkt => {
        let marker = this.FromWkt(wkt);

        marker.set("label", value);

        this.HiLightLabel(marker, fontSize);
      },
      false,
      true
    );
  },

  /**
   * 长度测量
   */
  MeasureLength() {
    measurePart.Measure(this.data.olMap, "Length");
  },

  /**
   * 面积测量
   */
  MeasureArea() {
    measurePart.Measure(this.data.olMap, "Area");
  },

  /**
   * 执行一次地图单击获取点击位置坐标操作
   * @param {function} event 回调事件 参数 [x,y]
   */
  SingleClickOnce: function(event) {
    try {
      this.data.olMap.once("singleclick", function(e) {
        event(e.coordinate);
      });
    } catch (error) {
      console.error(error);
    }
  },
  DownMapPicture: function() {
    try {
      this.data.olMap.once("rendercomplete", () => {
        //创建画布
        let mapCanvas = document.createElement("canvas");

        //获取地图尺寸
        let size = this.data.olMap.getSize();

        mapCanvas.width = size[0];

        mapCanvas.height = size[1];

        //二维
        let mapContext = mapCanvas.getContext("2d");

        Array.prototype.forEach.call(
          document.querySelectorAll(".ol-layer canvas"),

          canvas => {
            if (canvas.width > 0) {
              let opacity = canvas.parentNode.style.opacity;

              mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);

              let transform = canvas.style.transform;
              // Get the transform parameters from the style's transform matrix
              let matrix = transform
                .match(/^matrix\(([^\\(]*)\)$/)[1]
                .split(",")
                .map(Number);
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );

              mapContext.drawImage(canvas, 0, 0);
            }
          }
        );
        if (navigator.msSaveBlob) {
          // link download attribuute does not work on MS browsers
          navigator.msSaveBlob(mapCanvas.msToBlob(), "map.png");
        } else {
          let link = document.getElementById("image-download");
          link.href = mapCanvas.toDataURL();
          link.click();
        }
      });
    } catch (error) {
      console.error(error);
    }
  },
  // 放大
  zoomOut() {
    this.data.view.setZoom(this.data.view.getZoom() + 1);
  },
  // 缩小
  zoomIn() {
    this.data.view.setZoom(this.data.view.getZoom() - 1);
  }
};
