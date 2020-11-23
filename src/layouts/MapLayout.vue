<template>
  <div class="map-layout">
    <init-map class="map" :mapType="dtSource" ref="olMap"></init-map>
    <router-view />
    <div class="map-list">
      <div
        v-for="item in dtSource"
        @click="mapChange(item.sourceId)"
        :key="item.id"
        class="map-item"
        :class="{ active: item.sourceId == dtMapName }"
        :style="{
          background: 'url(' + require(`../assets/imgs/${item.name}.png`) + ')'
        }"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="map-tools">
      <div class="tool-item" @click="zoomOut">
        <IconFont type="fangda" /> 放大
      </div>
      <span class="line"></span>
      <div class="tool-item" @click="zoomIn">
        <IconFont type="suoxiao" /> 缩小
      </div>
      <span class="line"></span>
      <div class="tool-item" @click="fullScreen">
        <IconFont type="quanping" /> 全屏
      </div>
      <!-- <span class="line"></span>
      <div class="tool-item" @click="drawPoint">
        <IconFont type="dingwei" /> 标记
      </div> -->
      <span class="line"></span>
      <div class="tool-item" @click="lineString">
        <IconFont type="ceju" /> 测距
      </div>
      <!-- <span class="line"></span>
      <div class="tool-item" @click="drawPoint">
        <i class="el-icon-refresh"></i> 重置
      </div> -->
    </div>
  </div>
</template>
<script>
import initMap from "@/components/initMap/initMap";
import { mySource } from "@/api/mapSource.js";

export default {
  components: {
    initMap
  },
  data() {
    return {
      allSource: [],
      dtSource: [],
      ztSource: [],
      dtMapName: "",
      dtVizible: []
    };
  },
  mounted() {
    this.getMapSource();
  },
  methods: {
    getMapSource() {
      mySource({ Class: "DT" }).then(res => {
        this.dtSource = [];
        this.dtVizible = [];
        res.forEach((item, i) => {
          item.layers.forEach(layer => {
            this.dtVizible.push({
              name: layer.sourceId,
              isShow: this.dtVizible.length == 0
            });
            this.dtSource.push({
              ...layer,
              visible: i == 0
            });
          });
        });
        this.$store.commit("user/setMap", this.dtSource);
        this.dtMapName = this.dtVizible[0].name;
      });
      mySource({ System: "地下管网共享管理系统", Class: "ZT" }).then(res => {
        this.ztSource = res;
        // res.forEach(item => {
        //   if (item.layers[0].url && !item.layers[0].url.includes("localhost")) {
        //     this.ztSource.push(item);
        //   }
        // });
        // this.ztSource.splice(0, 1);
        this.loadZtMap();
      });
    },
    loadZtMap(data = this.ztSource) {
      this.$refs.olMap.loadZtMap(data);
    },
    removeZtMap() {
      this.$refs.olMap.removeZtMap(this.ztSource);
      return this.ztSource;
    },
    mapChange(name) {
      if (name != this.dtMapName) {
        this.dtVizible.forEach((item, i) => {
          if (item.name == name) {
            this.dtVizible[i].isShow = true;
          } else {
            this.dtVizible[i].isShow = false;
          }
        });
        this.dtMapName = name;
        this.$refs.olMap.setLayerVisible(this.dtVizible);
      }
    },
    zoomOut() {
      this.$refs.olMap.zoomOut();
    },
    zoomIn() {
      this.$refs.olMap.zoomIn();
    },
    fullScreen() {
      this.$refs.olMap.fullScreen();
    },
    drawPoint() {
      this.$refs.olMap.drawPoint();
    },
    lineString() {
      this.$refs.olMap.ML();
    }
  }
};
</script>
<style lang="scss" scoped>
.map-layout {
  height: 100%;
  position: relative;
  color: #fff;
  .map-tools {
    position: absolute;
    display: flex;
    right: 20px;
    top: 20px;
    line-height: 40px;
    background: #055887b3;
    border-radius: 4px;
    align-items: center;
    .tool-item {
      padding: 0 12px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: aquamarine;
      }
    }
    .line {
      width: 1px;
      height: 20px;
      background: #31b3ff;
    }
  }
  .map-list {
    position: absolute;
    background: #005998;
    right: 20px;
    bottom: 20px;
    border-radius: 4px;
    padding: 5px 5px 5px 0;
    text-align: center;
    display: flex;
    .map-item {
      height: 60px;
      width: 86px;
      background: #2b7ab7;
      margin-left: 5px;
      cursor: pointer;
      &:hover,
      &.active {
        span {
          background-color: #3385ff;
        }
      }
      span {
        padding: 2px;
        position: relative;
        border-radius: 2px;
        top: 38px;
        cursor: pointer;
      }
    }
  }
}
</style>
