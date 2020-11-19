<template>
  <div class="map-panle">
    <el-tabs
      class="cus-tabs"
      v-model="activeName"
      @tab-click="tabChange"
      v-loading="sourceLoading"
    >
      <el-tab-pane label="资源管理" name="source">
        <el-input
          size="small"
          clearable
          placeholder="输入版本号"
          style="width: 226px"
          v-model="filterText"
        >
          <el-button
            slot="append"
            @click="getPipeData"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <span class="filter-icon" @click="fliter" :class="{ active: isFavour }">
          <IconFont type="shaixuan" />
        </span>
        <div class="version-box">
          <div class="ridio-item" v-for="item in versionList" :key="item.id">
            <el-radio v-model="currntVersion" :label="item.id">{{
              item.title
            }}</el-radio>
            <i
              @click="favournFunc(item)"
              :title="item.isFavour ? '取消收藏' : '收藏'"
              class="star"
              :class="item.isFavour ? 'el-icon-star-on' : 'el-icon-star-off'"
            ></i>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图层管理" name="map" v-loading="layaerLoading">
        <el-tree class="cus-tree" :data="mapSourceList" :props="defaultProps">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <span :title="node.label">{{ node.label }}</span>
            </span>
            <el-slider
              v-if="data.isSource && data.sources.length"
              v-model="data.sources[0].defaultOpacity"
              height="5px"
              v-on.stop.prevent
            ></el-slider>
            <i
              v-if="data.isSource && data.sources.length"
              @click.stop.prevent="
                data.sources[0].defaultVisible = !data.sources[0].defaultVisible
              "
              :title="data.sources[0].defaultVisible ? '隐藏' : '显示'"
              class="el-icon-view"
              :style="{
                color: data.sources[0].defaultVisible ? '#31B3FF' : '#fff',
                'font-size': '14px',
                'margin-right': '4px'
              }"
            ></i>
          </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getPipeWithFavourn, favour } from "@/api/pipeVersion.js";
import { mySourceTree } from "@/api/mapSource.js";
export default {
  data() {
    return {
      mapNameList: [],
      activeName: "source",
      defaultProps: {
        children: "children",
        label: "name"
      },
      filterText: "",
      versionList: [],
      mapSourceList: [],
      currntVersion: null,
      sourceLoading: false,
      layaerLoading: false,
      isFavour: null // 搜索过滤条件
    };
  },
  created() {
    this.getPipeData();
  },
  methods: {
    // 过滤按钮事件
    fliter() {
      if (this.isFavour) {
        this.isFavour = null;
      } else {
        this.isFavour = true;
      }
      this.getPipeData();
    },
    // 获取历史版本
    getPipeData() {
      this.sourceLoading = true;
      getPipeWithFavourn({
        Key: this.filterText,
        FavourOnly: this.isFavour,
        MaxResultCount: 999
      }).then(res => {
        this.versionList = res.items;
        if (this.versionList && this.versionList.length) {
          this.currntVersion = this.versionList[0].id;
        }
        this.sourceLoading = false;
      });
    },
    //  获取图层管理资源
    getMapSource() {
      this.layaerLoading = true;
      mySourceTree("zt").then(res => {
        this.mapSourceList = res.children;
        this.layaerLoading = false;
      });
    },
    tabChange() {
      if (this.activeName == "map" && this.mapSourceList.length < 1) {
        this.getMapSource();
      }
    },
    // 收藏版本
    favournFunc(item) {
      favour(item).then(() => {
        item.isFavour = !item.isFavour;
        // this.$message.success("操作成功！");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.map-panle {
  text-align: center;
  width: 290px;
  background: rgba(0, 75, 119, 0.9);
  position: absolute;
  left: 20px;
  bottom: 20px;
  top: 20px;
  border-radius: 4px;
  .version-box {
    text-align: left;
    color: #fff;
    padding: 0 10px 0 6px;
    .star {
      float: right;
      cursor: pointer;
    }
    .ridio-item {
      margin: 14px 0;
    }
  }
  .filter-icon {
    margin: 10px;
    font-size: 20px;
    vertical-align: sub;
    cursor: pointer;
    &.active,
    &:hover {
      color: aquamarine;
    }
  }
}
</style>
<style lang="scss">
.cus-tabs {
  .el-tabs__nav-wrap {
    &::after {
      background-color: #0381cb;
    }
    .el-tabs__nav {
      float: none;
      .el-tabs__active-bar {
        background-color: #31b3ff;
        left: 51px;
        width: 82px !important;
      }
    }
  }
  .el-tabs__item {
    color: #87c3ff;
    font-size: 16px;
    &.is-active,
    &:hover {
      color: #ffffff;
    }
  }
  .el-tabs__content {
    padding: 0 12px;
    min-height: 300px;
  }
}
.el-slider {
  flex: 1;
  padding: 0 14px 0 10px;
  .el-slider__runway {
    height: 4px;
    .el-slider__bar {
      height: 4px;
    }
    .el-slider__button-wrapper {
      height: 18px;
      width: 18px;
      top: -8px;
      .el-slider__button {
        width: 8px;
        height: 8px;
      }
    }
  }
}
.el-input-group__append,
.el-input-group__prepend {
  background-color: #154067;
  color: #ffffff;
  border: 1px solid #406789;
  border-left: none;
  .el-button {
    padding: 12px;
  }
}
</style>
