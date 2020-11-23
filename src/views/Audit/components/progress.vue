<template>
  <el-dialog
    :title="'审核进度'"
    width="800px"
    custom-class="cus-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
    center
    :visible.sync="dialogTreeVisible"
  >
    <div v-loading="loading" class="step-box">
      <el-steps class="step-view" align-center finish-status="success">
        <el-step title="提交申请" status="success"></el-step>
        <el-step
          v-for="node in nodeList"
          :key="node.id"
          :status="node.isAudited ? 'success' : 'finish'"
        >
          <template slot="title">
            <div v-if="!node.cus">
              {{ node.isAudited ? "已审批" : "审批中" }}
            </div>
            <div v-if="node.cus">
              通过/不通过
            </div>
            <div>{{ node.auditorName }}</div>
            {{ node.auditTime ? formatDate(node.auditTime) : "" }}
          </template>
          <template slot="description">
            {{ node.approval }}
          </template>
        </el-step>
      </el-steps>
    </div>
  </el-dialog>
</template>
<script>
import { progress } from "@/api/audit.js";
import { formatDate } from "@/util";
export default {
  name: "",
  data() {
    return {
      formatDate,
      dialogTreeVisible: false,
      flag: false,
      saveLoad: false,
      id: "",
      loading: false,
      nodeList: []
    };
  },
  methods: {
    handleClose() {
      this.dialogTreeVisible = false;
      this.saveLoad = false;
    },
    getInfo() {
      this.loading = true;
      progress(this.id).then(res => {
        this.nodeList = res.steps;
        this.nodeList.push({ cus: true });
        this.loading = false;
      });
    },
    open({ id }) {
      this.id = id;
      this.getInfo();
      this.dialogTreeVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.step-box {
  overflow-x: auto;
  overflow-y: hidden;
  margin: 90px 0;
  .step-view {
    width: 735px;
  }
}
</style>
