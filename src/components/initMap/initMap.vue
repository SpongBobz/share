<template>
  <div id="map" style="height:100%;width:100%"></div>
</template>
<script>
import olMap from "@/mapconfig/CusOl.js";

// import templatedata from "../../static/TemplateData.js";

export default {
  name: "HelloWorld",
  props: {
    mapType: Array,
    ztMapName: Object
  },
  data() {
    return {};
  },
  watch: {
    mapType() {
      //根据后台数据加载系统数据，并填充目录树
      this.mapType.forEach(item => {
        this.loadLayer(item, item.visible);
      });
    }
  },
  mounted() {
    //初始化地图
    olMap.InitMap(
      "map",
      "EPSG:4521",
      "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
      [
        33607106.87531868,
        2940230.366420324,
        33647352.71520938,
        3012101.601493626
      ],
      [33621361, 2974920],
      6
    );
  },
  methods: {
    // 加载专题图
    loadZtMap(data) {
      data.forEach(item => {
        item.layers.forEach(layer => {
          this.loadLayer(layer);
        });
      });
    },
    // 移除专题图
    removeZtMap(data) {
      data.forEach(item => {
        item.layers.forEach(layer => {
          olMap.RemoveLayer(layer.sourceId, 1);
        });
      });
    },
    loadLayer: function(source, visible = true) {
      switch (source.type) {
        case "XYZ":
          olMap.AddMapTileByXyz(source.url, source.sourceId, 0, visible);
          break;
        case "WMTS":
          olMap.AddMapTileByWmts(source.url, source.name, source.sourceId, 1);
          break;
        case "WMS":
          olMap.AddWmsLayerAsImage(source.url, source.name, source.sourceId, 1);
          break;
      }
    },
    setLayerVisible(data) {
      data.forEach(item => {
        olMap.SetLayerVisible(item.name, item.isShow);
      });
    },
    setLayerOpacity(data) {
      olMap.SetLayerTransparency(data.name, data.opacity);
    },
    // 地图销毁
    destroyMap() {
      olMap.destroyMap();
    },
    // 放大
    zoomOut() {
      olMap.zoomOut();
    },
    // 缩小
    zoomIn() {
      olMap.zoomIn();
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
    ZoomToMaxExtent() {
      olMap.ZoomToMaxExtent();
    },

    RefreshMap() {
      olMap.RefreshMap();
    },

    ZoomToPoint() {
      olMap.ZoomToPoint(33621361, 2974920, 12);
    },

    DrawPolygon() {
      olMap.DrawPolygon(
        wkt => {
          alert(wkt);
        },
        true,
        false
      );
    },

    DrawPolygon1() {
      olMap.DrawPolygon(
        wkt => {
          alert(wkt);
        },
        false,
        true
      );
    },

    DrawPolygon2() {
      olMap.DrawPolygon(
        wkt => {
          alert(wkt);
        },
        true,
        true
      );
    },
    DrawLine() {
      olMap.DrawLine(
        wkt => {
          alert(wkt);
        },
        true,
        false
      );
    },
    DrawLine1() {
      olMap.DrawLine(
        wkt => {
          alert(wkt);
        },
        false,
        true
      );
    },
    DrawLine2() {
      olMap.DrawLine(
        wkt => {
          alert(wkt);
        },
        true,
        true
      );
    },
    DrawLabel() {
      olMap.DrawLabel("测试", 210);
    },
    CreateByWkt(data) {
      console.log(data);
      olMap.HiLightWkt(data);
      olMap.ZoomToWkt(data);
    },
    ZoomToWkt() {
      olMap.ZoomToWkt("Point(33661507.822716735 3000046.857574455)");
    },
    DrawCircle() {
      olMap.DrawCircle(
        (center, radius) => {
          alert(center + "," + radius);
        },
        true,
        false
      );
    },
    DrawCircle1() {
      olMap.DrawCircle(
        (center, radius) => {
          alert(center + "," + radius);
        },
        false,
        true
      );
    },
    DrawCircle2(func) {
      olMap.DrawCircle(
        wkt => {
          func(wkt);
        },
        true,
        true
      );
    },

    DrawBox() {
      olMap.DrawBox(
        wkt => {
          alert(wkt);
        },
        true,
        false
      );
    },

    DrawBox1(func) {
      olMap.DrawBox(
        wkt => {
          func(wkt);
        },
        false,
        true
      );
    },

    DrawBox2(func) {
      olMap.DrawBox(
        wkt => {
          func(wkt);
        },
        true,
        true
      );
    },
    ML() {
      olMap.MeasureLength();
    },
    MA() {
      olMap.MeasureArea();
    },
    SingleClickOnce() {
      olMap.SingleClickOnce(coordition => {
        alert(coordition);
      });
    },
    LoadGeoJson() {
      // olMap.AddGeoJson(templatedata.pipelineGeoJson, 2);
    },
    DownMapPicture() {
      olMap.DownMapPicture();
    }
  }
};
</script>
