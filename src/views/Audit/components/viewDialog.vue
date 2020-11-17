<template>
  <el-dialog
    :title="'申请数据详情'"
    width="800px"
    custom-class="cus-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
    center
    :visible.sync="dialogTreeVisible"
  >
    <div v-loading="loading" class="step-box">
      <Com-Table
        :columns="columns"
        :dataSource="tableData"
        :options="options"
        :fetch="getTabData"
        :pagination="pagination"
        :pageSizes="pageSizes"
        style="height: 100%"
      ></Com-Table>
    </div>
  </el-dialog>
</template>
<script>
import { getDataRequestById } from "@/api/dataRequest.js";
import { formatDate } from "@/util";
export default {
  name: "",
  data() {
    return {
      formatDate,
      dialogTreeVisible: false,
      flag: false,
      columns: [
        {
          prop: "pipeClassName",
          label: "管类"
        },
        {
          prop: "shapeType",
          label: "形态"
        },
        {
          label: "数量",
          render: row => {
            return <span>{row.total + row.totalUnit}</span>;
          }
        }
      ],
      id: "",
      loading: false,
      tableData: [],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 15
      },
      pageSizes: [10, 15, 30, 40, 60],
      options: {
        height: "calc(100% - 62px)",
        mutiSelect: false,
        index: false, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: false, // 是否一挂载就加载数据
        border: true
      }
    };
  },
  methods: {
    handleClose() {
      this.dialogTreeVisible = false;
      this.saveLoad = false;
    },
    getTabData() {
      this.loading = true;
      getDataRequestById(this.id).then(res => {
        console.log(res);
        this.tableData = res.dataOverviews;
        this.loading = false;
      });
    },
    open({ id }) {
      this.id = id;
      this.getTabData();
      this.dialogTreeVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.step-box {
  overflow: auto;
  height: 500px;
  margin-left: 10px;
  .step-view {
    width: 735px;
  }
}
</style>
