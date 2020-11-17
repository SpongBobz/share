<template>
  <div id="map" style="height:100%;width:100%"></div>
</template>

<script>
import addLayer from "@/mapconfig/addlayer/addLayer";
import createSource from "@/mapconfig/addlayer/mapSource";
import { Map, View } from "ol";
import { transform, transformExtent } from "ol/proj";
import { defaults, FullScreen /**ScaleLine*/ } from "ol/control";
import { defaults as interactionDefaults } from "ol/interaction";
export default {
  name: "initMap",
  components: {},
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
      animationList: null
    };
  },
  watch: {
    mapType() {
      this.mapType.forEach(item => {
        item.layers.forEach(layer => {
          if (layer.url) {
            this.mapList.push({
              name: item.id,
              class: item.class,
              layer: addLayer(
                "Tile",
                createSource(layer.type, layer.url, layer.name),
                this.dtMapName == item.id
                // true
              )
            });
          }
        });
      });
      this.mapList.forEach(item => {
        console.log(item.layer.get("class"));
        this.map.addLayer(item.layer);
      });
    },
    //当地图的显隐发生改变的时候触发,动态设置地图的显示与隐藏
    dtMapName(newValue) {
      for (let item of this.mapList) {
        if (item.class == "DT") {
          console.log(item);
          if (item.name == newValue) {
            item.layer.setVisible(true);
          } else {
            item.layer.setVisible(false);
          }
        }
      }
    },

    ztMapName(newValue) {
      console.log(this.mapList, newValue);
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
    var extent = transformExtent(
      [100.18344486, 26.84146594, 100.29738299, 26.92646555],
      "EPSG:4326",
      "EPSG:3857"
    );
    var center = transform(
      [100.24041393, 26.88396574],
      "EPSG:4326",
      "EPSG:3857"
    );
    this.view = new View({
      center: center,
      minZoom: 12,
      maxZoom: 20,
      zoom: 19,
      projection: "EPSG:3857"
      // projection: "EPSG:4326"
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
    this.view.fit(extent, this.map.getSize());
    this.fullScreen = new FullScreen();
    this.map.addControl(this.fullScreen);
    console.log(this.fullScreen);
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
    exitFullScreen() {
      this.fullScreen.exitFullScreen();
    }
  }
};
</script>

<style></style>
