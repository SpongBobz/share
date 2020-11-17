<template>
  <div class="config">
    <div class="config-title">审核配置</div>
    <div class="config-steps" v-loading="nodeLoading">
      <el-steps :active="100" align-center>
        <el-step v-for="(node, i) in nodeList" :key="node.id">
          <template slot="title">
            <div style="color: #fff">
              <el-button
                v-if="node.step != 1"
                @click="preMoveNode(node.id, i)"
                type="text"
                icon="el-icon-back"
                title="向前移动审核节点"
              ></el-button>
              {{ node.auditUserName }}
              <el-button
                v-if="i != nodeList.length - 1"
                @click="nextMoveNode(node.id, i)"
                style="margin-left: 0px"
                type="text"
                icon="el-icon-right"
                title="向后移动审核节点"
              ></el-button>
            </div>
          </template>
          <template slot="description">
            <el-button
              style="color: #CCCCCC"
              @click="createNode(node)"
              size="mini"
              >添加</el-button
            >
            <el-button @click="editNode(node)" style="color:#7FD0FF" size="mini"
              >编辑</el-button
            >
            <el-popconfirm
              :title="`是否确认删除节点 ${node.auditUserName} ？`"
              @confirm="delNode(node)"
            >
              <el-button
                slot="reference"
                style="color: #DE6262;margin-left: 10px;"
                size="mini"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-step>
      </el-steps>
    </div>
    <SetNodeDialog ref="setNodeDialog" @change="getData" />
  </div>
</template>
<script>
import { getNodes, delNode, orderNode } from "@/api/auditSetting";
import SetNodeDialog from "./components/setNodeDialog";
export default {
  components: {
    SetNodeDialog
  },
  data() {
    return {
      nodeList: [],
      nodeLoading: false
    };
  },
  methods: {
    preMoveNode(id, index) {
      this.nodeLoading = true;
      let params = this.nodeList.map(item => {
        return item.id;
      });
      this.nodeList = [];
      let tempId = params[index - 1];
      params[index - 1] = id;
      params[index] = tempId;
      this.$nextTick(() => {
        orderNode(params)
          .then(res => {
            this.$nextTick(() => {
              this.nodeList = res;
            });
            this.nodeLoading = false;
          })
          .catch(() => {
            this.nodeLoading = false;
          });
      });
    },
    // 向后移动审核节点
    nextMoveNode(id, index) {
      this.nodeLoading = true;
      let params = this.nodeList.map(item => {
        return item.id;
      });
      this.nodeList = [];
      let tempId = params[index + 1];
      params[index + 1] = id;
      params[index] = tempId;
      this.$nextTick(() => {
        orderNode(params)
          .then(res => {
            this.$nextTick(() => {
              this.nodeList = res;
            });
            this.nodeLoading = false;
          })
          .catch(() => {
            this.nodeLoading = false;
          });
      });
    },
    editNode(node) {
      this.$refs.setNodeDialog.open(node, false);
    },
    createNode(node) {
      this.$refs.setNodeDialog.open(node, true);
    },
    delNode(node) {
      this.nodeLoading = true;
      delNode(node.id).then(() => {
        this.$message.success("删除成功！");
        this.getData();
      });
    },
    getData() {
      this.nodeLoading = true;
      this.nodeList = [];
      getNodes().then(res => {
        this.nodeList = res;
        this.nodeLoading = false;
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.config {
  margin: 20px;
  height: calc(100% - 40px);
  background: #113857;
  color: #fff;
  text-align: center;
  .config-title {
    line-height: 54px;
    background: #125c87;
  }
  .config-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 60px);
  }
}
</style>
<style lang="scss">
.el-steps {
  .el-step.is-center .el-step__description {
    padding: 10px 20px;
    .el-button--mini {
      padding: 5px 7px;
      background: #005998;
      border: 1px solid #3988b7;
    }
  }
}
</style>
