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
            :model="pipeData"
            ref="pipeForm"
            :rules="rules"
            label-suffix="："
            label-position="top"
            size="small"
          >
            <el-form-item label="版本">
              <el-select
                clearable
                v-model="pipeData.versionId"
                :loading="sourceLoading"
                placeholder="选择版本"
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
              <div style="margin-left: 22px;">
                <el-checkbox-group v-model="pipeData.classes">
                  <el-checkbox
                    v-for="item in pipeList"
                    :key="item.id"
                    :label="item.id"
                    >{{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="panle-footer">
          <el-button
            type="primary"
            :loading="loading"
            size="small"
            @click="requestPipe"
            >申请</el-button
          >
          <el-button class="reset" size="small" @click="reset">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="区域申请" name="town">
        <div class="panle-title">区域申请</div>
        <div class="panle-content">
          <el-form
            :model="townData"
            label-position="top"
            ref="townForm"
            :rules="rules"
            label-suffix="："
            size="small"
          >
            <el-form-item label="版本">
              <el-select
                clearable
                v-model="townData.versionId"
                :loading="sourceLoading"
                placeholder="选择版本"
              >
                <el-option
                  v-for="(item, k) in versionList"
                  :key="k"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-loading="townLoading" label="行政区域" prop="towns">
              <div style="margin-left: 22px">
                <el-checkbox-group v-model="townData.towns">
                  <el-checkbox
                    v-for="item in townList"
                    :key="item.id"
                    :label="item.name"
                    >{{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="panle-footer">
          <el-button
            type="primary"
            :loading="loading"
            size="small"
            @click="requestTown"
            >申请</el-button
          >
          <el-button class="reset" size="small" @click="reset">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自定义" name="cus">
        <div class="panle-title">自定义区域申请</div>
        <div class="panle-content">
          <el-form
            :model="cusData"
            label-position="top"
            ref="cusForm"
            :rules="rules"
            label-suffix="："
            size="small"
          >
            <el-form-item label="版本">
              <el-select
                clearable
                v-model="cusData.versionId"
                :loading="sourceLoading"
                placeholder="选择版本"
              >
                <el-option
                  v-for="(item, k) in versionList"
                  :key="k"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="绘制图形" prop="geoWKT">
              <div class="drawBox">
                <div
                  @click="drawRect"
                  :class="{
                    active: currntDraw == 'rect',
                    isDisabled: currntDraw
                  }"
                  class="area rect"
                ></div>
                <div
                  @click="drawCircle"
                  :class="{
                    active: currntDraw == 'circle',
                    isDisabled: currntDraw
                  }"
                  class="area circle"
                ></div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="panle-footer">
          <el-button
            type="primary"
            :loading="loading"
            size="small"
            @click="requestCus"
            >申请</el-button
          >
          <el-button class="reset" size="small" @click="reset">取消</el-button>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="属性" name="shux">
        <div class="panle-title">属性申请</div>
        <div class="panle-content">
          <el-form
            :model="cusData"
            label-position="top"
            ref="townForm"
            :rules="rules"
            label-suffix="："
            size="small"
          >
            <el-form-item label="备注">
              <el-select
                clearable
                v-model="cusData.versionId"
                :loading="sourceLoading"
                placeholder="选择备注"
              >
                <el-option
                  v-for="(item, k) in versionList"
                  :key="k"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="panle-footer">
          <el-button type="primary" size="small" @click="requestCus"
            >申请</el-button
          >
          <el-button class="reset" size="small" @click="reset">取消</el-button>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import { getPipeWithFavourn } from "@/api/pipeVersion.js";
import { getTown } from "@/api/administrative.js";
import { postPipe, postTowns, postGeometry } from "@/api/dataRequest.js";
import { getPipeClass } from "@/api/pipeClass.js";
export default {
  data() {
    return {
      activeName: "source",
      pipeData: {
        versionId: null,
        classes: []
      },
      townData: {
        versionId: null,
        towns: []
      },
      cusData: {
        versionId: null,
        geoWKT: ""
      },
      rules: {
        classes: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个类型",
            trigger: "change"
          }
        ],
        towns: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个区域",
            trigger: "change"
          }
        ],
        geoWKT: [
          {
            required: true,
            message: "请绘制图形",
            trigger: "change"
          }
        ]
      },
      pipeList: [],
      townList: [],
      versionList: [],
      sourceLoading: false,
      townLoading: false,
      currntVersion: null,
      loading: false,
      currntDraw: ""
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
    // 管类申请
    requestPipe() {
      this.$refs.pipeForm.validate(valid => {
        if (valid) {
          this.loading = true;
          postPipe({ ...this.pipeData, creatorName: this.userName }).then(
            () => {
              this.loading = false;
              this.$message.success("提交成功!");
            }
          );
        } else {
          this.$message.error("提交失败!");
          return false;
        }
      });
    },
    // 区域申请
    requestTown() {
      this.$refs.townForm.validate(valid => {
        if (valid) {
          this.loading = true;
          postTowns({ ...this.townData, creatorName: this.userName }).then(
            () => {
              this.loading = false;
              this.$message.success("提交成功!");
            }
          );
        } else {
          this.$message.error("提交失败!");
          return false;
        }
      });
    },
    // 自定义区域申请
    requestCus() {
      this.$refs.cusForm.validate(valid => {
        if (valid) {
          this.loading = true;
          postGeometry({ ...this.cusData, creatorName: this.userName }).then(
            () => {
              this.loading = false;
              this.$message.success("提交成功!");
              this.$parent.$refs.olMap.RefreshMap();
            }
          );
        } else {
          this.$message.error("提交失败!");
          return false;
        }
      });
    },

    drawRect() {
      if (!this.currntDraw) {
        this.currntDraw = "rect";
        this.cusData.geoWKT = "";
        this.$parent.$refs.olMap.RefreshMap();
        this.$parent.$refs.olMap.DrawBox2(this.getDrawData);
      } else {
        this.$message.warning("请先完成绘制!");
      }
    },
    drawCircle() {
      if (!this.currntDraw) {
        this.currntDraw = "circle";
        this.cusData.geoWKT = "";
        this.$parent.$refs.olMap.RefreshMap();
        this.$parent.$refs.olMap.DrawCircle2(this.getDrawData);
      } else {
        this.$message.warning("请先完成绘制!");
      }
    },
    getDrawData(data) {
      this.currntDraw = "";
      this.cusData.geoWKT = data;
    },
    reset() {
      this.$refs.townForm.resetFields();
      this.$refs.cusForm.resetFields();
      this.$refs.pipeForm.resetFields();
    },
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
    getTownList() {
      this.townLoading = true;
      getTown({ MaxResultCount: 999 }).then(res => {
        this.townList = res.items;
        this.townLoading = false;
      });
    },
    tabChange() {
      if (this.activeName == "town" && !this.townList.length) {
        this.getTownList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.applys {
  width: 350px;
  background: rgba(0, 75, 119, 0.9);
  position: absolute;
  left: 20px;
  bottom: 20px;
  top: 20px;
  border-radius: 4px;
  .panle-title {
    text-align: center;
    line-height: 42px;
    background-image: linear-gradient(to left, #28b0ff, transparent);
  }
  .panle-content {
    padding: 12px;
  }
  .panle-footer {
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: 40px;
  }
  .drawBox {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    .area {
      border: 2px dashed #ffc600c0;
      cursor: pointer;
      &.rect {
        width: 28px;
        height: 24px;
        margin-right: 20px;
      }
      &.circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      &.active {
        border-color: #00ffffc0 !important;
      }
      &:hover {
        border-color: #00ffffc0;
        &.isDisabled {
          cursor: not-allowed;
          border-color: #ffc600c0;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-form--label-top .el-form-item__label {
  padding: 0;
}
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
  min-width: 80px;
  margin-right: 20px;
  .el-checkbox__inner {
    background-color: transparent;
    border-color: #c4e9ff;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #fff;
  }
}
</style>
