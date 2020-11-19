// 测量功能
<template>
  <div id="map">
    <div v-for="(item, index) in measureTooltipElement" :key="index">
      <div :id="step(index)" class="ol-tooltip ol-tooltip-static">
        {{ item.value }}
        <el-button
          type="primary"
          icon="el-icon-close"
          size="mini"
          @click="deleteMeasure(index)"
        ></el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { formatArea, formatLength } from "@/mapconfig/controls/measureControl";
import createSource from "@/mapconfig/addlayer/mapSource";
import addLayer from "@/mapconfig/addlayer/addLayer";
import { createMapInteraction } from "@/mapconfig/interaction/interaction";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import { LineString, Polygon } from "ol/geom";

export default {
  name: "measure",
  props: {
    map: Object
  },
  data() {
    return {
      vectorSou: null, //测量画图矢量源
      vectorLay: null, //测量画图图层
      draw: null, //测量画图工具
      geomType: null, //绘画类型
      sketch: null,
      listener: null, //监听移动事件，方便后面取消监听
      measureTooltip: null, //覆盖层
      measureMoveTooltip: null, //移动时的覆盖层element
      measureTooltipElement: [], //绘画结束时的覆盖层element组
      flag: false
    };
  },
  mounted() {},
  methods: {
    //创建矢量化图层
    createVector: function() {
      this.vectorSou = createSource("Vector");
      this.vectorLay = addLayer("Vector", this.vectorSou);
      this.map.addLayer(this.vectorLay);
    },
    // 获取长度或面积
    getGeomLengthOrArea: function(geomType) {
      if (this.vectorLay == null) {
        this.createVector();
      }
      if (this.geomType && this.geomType == geomType) {
        if (this.draw) {
          this.map.getInteractions().array_.length = 9;
          this.draw = null;
          this.geomType = null;
        }
      } else {
        // this.map.getInteractions().array_.length = 9;
        this.draw = null;
        this.geomType = geomType;
        this.createMeasureTooltip();
        this.addInteraction(geomType);
        this.map.addInteraction(this.draw);
      }
    },
    // 将测量工具添加到map中
    addInteraction: function(geomType) {
      this.draw = createMapInteraction(this.vectorSou, geomType);
      let output, coordinate;
      // 开始绘画事件
      this.draw.on("drawstart", ev => {
        this.sketch = ev.feature;
        coordinate = ev.coordinate;
        // 实时监测
        this.listener = this.sketch.getGeometry().on("change", ev => {
          let geom = ev.target;
          if (geom instanceof Polygon) {
            output = formatArea(geom);
            coordinate = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = formatLength(geom);
            coordinate = geom.getLastCoordinate();
          }
          this.measureMoveTooltip.innerHTML = output;
          this.measureMoveTooltip.style.color = "red";
          this.measureTooltip.setPosition(coordinate);
        });
      });
      // 绘画结束
      this.draw.on("drawend", ev => {
        this.sketch = null;
        this.measureTooltipElement.push({ value: output });
        let index = this.getArrayIndex(this.measureTooltipElement, {
          value: output
        });
        let divId = "step" + index;
        let element;
        // 当div的id动态加载好之后设置覆盖层以及要素的id方便后面进行删除
        this.$nextTick(() => {
          element = document.getElementById(divId);
          this.measureTooltip.setElement(element);
          this.measureTooltip.id = divId;
          this.measureTooltip.setPosition(coordinate);
          ev.feature.setId(divId);
        });
        this.map.removeInteraction(this.draw);
        this.draw = null;
        this.geomType = null;
        unByKey(this.listener);
      });
    },
    // 创建覆盖层显示长度或面积
    createMeasureTooltip: function() {
      if (this.measureMoveTooltip) {
        this.measureMoveTooltip = null;
      }
      this.measureMoveTooltip = document.createElement("div");
      this.measureMoveTooltip.className =
        "ol-tooltip ol-tooltip-measure move-text";
      this.measureTooltip = new Overlay({
        element: this.measureMoveTooltip,
        offset: [0, -15],
        positioning: "bottom-center"
      });
      this.map.addOverlay(this.measureTooltip);
    },
    // 删除覆盖层以及当前feature
    deleteMeasure: function(index) {
      let featureId = this.step(index);
      let feature = this.vectorSou.getFeatureById(featureId);
      this.vectorSou.removeFeature(feature);
      let node = document.getElementById(featureId);
      node.parentNode.removeChild(node);
      let overlay = this.map.getOverlayById(featureId);
      this.map.removeOverlay(overlay);
      this.measureTooltipElement[index] = "";
    },
    // 得到当前div的下标
    getArrayIndex: function(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i].value == obj.value) {
          return i;
        }
      }
      return -1;
    },
    // 动态设置id
    step: function(i) {
      return "step" + i;
    }
  }
};
</script>
<style lang="scss" scoped>
$top: 2%;
$position: fixed;
$leftOrRight: 2%;
#buttonGroup {
  position: $position;
  top: $top;
  right: $leftOrRight;
  z-index: 1001;
}
.queryGroup {
  position: $position;
  top: $top;
  left: $leftOrRight;
  width: 15%;
}
.featureTable {
  position: $position;
  top: 6%;
  left: $leftOrRight;
  width: 15%;
}
.ol-tooltip {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
}
.ol-tooltip-measure {
  opacity: 1;
  font-weight: bold;
}
.ol-tooltip-static {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}
.measuringmianjiceliang {
  background: url("../../assets/面积测量.png");
  background-color: white;
}
.measuringjuliceliang {
  background: url("../../assets/距离测量.png");
  background-color: white;
}
</style>
