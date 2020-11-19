<template>
  <div id="map" style="height:100%;width:100%">
    <measure ref="measure" :map="map"></measure>
  </div>
</template>

<script>
import addLayer from "@/mapconfig/addlayer/addLayer";
import createSource from "@/mapconfig/addlayer/mapSource";
import { Map, View } from "ol";
// import { transform, transformExtent } from "ol/proj";
import { defaults /**ScaleLine*/ } from "ol/control";
import { defaults as interactionDefaults } from "ol/interaction";

import { createMapInteraction } from "@/mapconfig/interaction/interaction";
import measure from "./measure";

// import { Vector as VectorSource} from 'ol/source';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
export default {
  name: "initMap",
  components: { measure },
  props: {
    mapType: Array,
    dtMapName: String,
    ztMapName: Object
  },
  data() {
    return {
      map: null,
      mapList: [],
      swipeLayer: null,
      geom: null,
      animationList: null,
      vectorSou: null, // 测量画图矢量源
      vectorLay: null, // 测量画图图层
      draw: null, // 测量画图工具
      geomType: null, // 绘画类型
      sketch: null,
      listener: null, // 监听移动事件，方便后面取消监听
      measureTooltip: null, // 覆盖层
      measureMoveTooltip: null, // 移动时的覆盖层element
      measureTooltipElement: [], // 绘画结束时的覆盖层element组
      flag: false,
      overlay: null,
      overlayDisplay: false
    };
  },
  watch: {
    mapType() {
      this.mapType.forEach(item => {
        item.layers.forEach(layer => {
          if (layer.url) {
            console.log(layer.url);
            this.mapList.push({
              name: item.id,
              class: item.class,
              layer: addLayer(
                "Tile",
                createSource(layer.type, layer.url, layer.name),
                this.dtMapName == item.id
                // false
              )
            });
          }
        });
      });
      this.mapList.forEach(item => {
        this.map.addLayer(item.layer);
      });
      this.map.addLayer(
        addLayer(
          "Tile",
          createSource(
            "WMS",
            "http://192.168.2.13:8098/geoserver/LJPipeGis/wms"
          ),
          true
        )
      );
    },
    //当地图的显隐发生改变的时候触发,动态设置地图的显示与隐藏
    dtMapName(newValue) {
      for (let item of this.mapList) {
        if (item.class == "DT") {
          if (item.name == newValue) {
            item.layer.setVisible(true);
          } else {
            item.layer.setVisible(false);
          }
        }
      }
    },

    ztMapName(newValue) {
      for (let item of this.mapList) {
        console.log(item.get("class"));
        if (item.get("class") === "ZT") {
          if (item.get("name") == newValue.name) {
            item.setVisible(newValue.visible);
            item.setOpacity(newValue.opacity);
          }
        }
      }
    }
  },
  mounted() {
    // var extent = transformExtent(
    //   [100.18344486, 26.84146594, 100.29738299, 26.92646555],
    //   "EPSG:4326",
    //   "EPSG:3857"
    // );
    // var center = transform(
    //   [100.24041393, 26.88396574],
    //   "EPSG:4326",
    //   "EPSG:3857"
    // );
    // var center = [100.24041393, 26.88396574];
    this.view = new View({
      center: [100.24041393, 26.88396574],
      minZoom: 12,
      maxZoom: 20,
      zoom: 15,
      // projection: "EPSG:3857"
      projection: "EPSG:4326"
    });
    this.map = new Map({
      target: "map",
      view: this.view,
      loadTilesWhileAnimating: true,
      controls: defaults({
        zoom: false,
        rotate: false
      }),
      interactions: new interactionDefaults({
        doubleClickZoom: false
      })
    });
    // this.view.fit(extent, this.map.getSize());
    // let scale = new ScaleLine();
    // this.map.addControl(scale);
  },
  methods: {
    getFeature(geom) {
      this.geom = geom;
    },
    drawLine(arr) {
      this.animationList = arr;
    },
    // 放大
    zoomOut() {
      this.view.setZoom(this.view.getZoom() + 1);
    },
    zoomIn() {
      this.view.setZoom(this.view.getZoom() - 1);
    },
    fullScreen() {
      var elem = document.body;
      if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
      } else {
        if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else {
          if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
          } else {
            if (elem.requestFullScreen) {
              elem.requestFullscreen();
            } else {
              alert("浏览器不支持全屏");
            }
          }
        }
      }
    },
    lineString() {
      this.$refs.measure.getGeomLengthOrArea("LineString");
    },
    drawPoint() {
      if (this.pointLayer) {
        this.pointSorce = createSource("Vector");
        this.pointLayer = addLayer("VectorPoint", this.pointSorce);
        this.map.addLayer(this.pointLayer);
      }
      this.drawPoint = createMapInteraction(this.pointSorce, "Point");
      this.map.addInteraction(this.drawPoint);
    }
  }
};
</script>
