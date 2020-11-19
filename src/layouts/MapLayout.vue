<template>
  <div class="map-layout">
    <init-map
      class="map"
      :dtMapName="dtMapName"
      :mapType="dtSource"
      ref="olMap"
    ></init-map>
    <router-view />
    <div class="map-list">
      <div
        v-for="item in dtSource"
        @click="mapChange(item.id)"
        :key="item.id"
        class="map-item"
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
      <span class="line"></span>
      <div class="tool-item" @click="drawPoint">
        <IconFont type="dingwei" /> 标记
      </div>
      <span class="line"></span>
      <div class="tool-item" @click="lineString">
        <IconFont type="ceju" /> 测距
      </div>
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
      dtMapName: "古城区正射影像"
    };
  },
  created() {
    this.getMapSource();
  },
  methods: {
    getMapSource() {
      mySource({ Class: "DT" }).then(res => {
        this.dtSource = res;
      });
      mySource({ System: "地下管网共享管理系统", Class: "ZT" }).then(res => {
        this.ztSource = res;
        let temp = [];
        res.forEach(item => {
          if (
            item.layers[0].url &&
            item.layers[0].url.includes("localhost") != -1
          ) {
            console.log(item.layers[0].url);
            temp.push(item);
          }
        });
      });
    },
    mapChange(item) {
      this.dtMapName = item;
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
      this.$refs.olMap.lineString();
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
      span {
        position: relative;
        top: 36px;
        cursor: pointer;
      }
    }
  }
}
</style>
