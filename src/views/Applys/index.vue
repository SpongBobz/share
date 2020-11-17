<template>
  <div class="applys">
    <el-tabs
      class="left-tabs"
      tab-position="left"
      v-model="activeName"
      @tab-click="tabChange"
    >
      <el-tab-pane label="管类申请" name="source">
        <div class="panle-title">管类申请</div>
        <div class="panle-content">
          <el-form
            :model="formData"
            ref="pipeForm"
            :rules="rules"
            label-suffix=":"
            size="small"
          >
            <el-form-item label="版本">
              <el-select
                clearable
                v-model="formData.versionId"
                :loading="sourceLoading"
                placeholder="选择版本"
                style="width:175px"
              >
                <el-option
                  v-for="(item, k) in versionList"
                  :key="k"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="管类" prop="classes">
              <el-checkbox-group v-model="formData.classes">
                <div
                  style="text-align: left;margin-left: 50px"
                  v-for="pipe in pipeList"
                  :key="pipe.id"
                >
                  <span>管类：</span>
                  <el-checkbox :label="pipe.id">{{ pipe.name }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="panle-footer">
          <el-button type="primary" size="small" @click="requestPipe"
            >申请</el-button
          >
          <el-button class="reset" size="small" @click="reset">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图层管理" name="map"> </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getPipeWithFavourn } from "@/api/pipeVersion.js";
import { postPipe } from "@/api/dataRequest.js";
import { getPipeClass } from "@/api/pipeClass.js";
export default {
  data() {
    return {
      mapNameList: [],
      activeName: "source",
      defaultProps: {
        children: "children",
        label: "name"
      },
      formData: {
        versionId: null,
        classes: []
      },
      rules: {
        classes: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个类型",
            trigger: "change"
          }
        ]
      },
      filterText: "",
      pipeList: [],
      mapSourceList: [],
      versionList: [],
      sourceLoading: false,
      currntVersion: null
    };
  },
  created() {
    this.getPipeData();
  },
  computed: {
    userName() {
      return this.$store.state.user.userInfo.Name;
    }
  },
  methods: {
    requestPipe() {
      this.$refs.pipeForm.validate(valid => {
        if (valid) {
          this.loading = true;
          postPipe({ ...this.formData, creatorName: this.userName }).then(
            res => {
              console.log(res);
              this.loading = false;
            }
          );
        } else {
          console.log("登录失败!!");
          return false;
        }
      });
    },
    reset() {},
    getPipeData() {
      // 获取管类信息
      getPipeClass({ MaxResultCount: 999 }).then(res => {
        this.pipeList = res.items;
      });
      // 获取版本信息
      this.sourceLoading = true;
      getPipeWithFavourn({ MaxResultCount: 999 }).then(res => {
        this.versionList = res.items;
        this.versionList.push({
          id: null,
          title: "最新"
        });
        this.sourceLoading = false;
      });
    },
    getMapSource() {
      getPipeClass({ MaxResultCount: 999 }).then(res => {
        console.log(res);
        // this.mapSourceList = res.children;
      });
    },
    tabChange() {}
  }
};
</script>
<style lang="scss" scoped>
.applys {
  text-align: center;
  width: 350px;
  background: rgba(0, 75, 119, 0.9);
  position: absolute;
  left: 20px;
  bottom: 20px;
  top: 20px;
  border-radius: 4px;
  .panle-title {
    line-height: 42px;
    background-image: linear-gradient(to left, #28b0ff, transparent);
  }
  .panle-content {
    padding: 12px;
  }
  .panle-footer {
    width: 100%;
    position: absolute;
    bottom: 40px;
  }
}
</style>
<style lang="scss">
.left-tabs {
  height: 100%;
  &.el-tabs--left .el-tabs__header.is-left {
    margin: 0;
  }
  .el-tabs__content {
    height: 100%;
  }
  .el-tabs__nav-wrap {
    &::after {
      background-color: #0381cb;
    }
  }
  .el-tabs__active-bar {
    background-color: #31b3ff;
  }
  .el-tabs__item {
    color: #87c3ff;
    font-size: 16px;
    &.is-active,
    &:hover {
      color: #ffffff;
    }
  }
}
.el-checkbox {
  color: #fff;
}
</style>
