<template>
  <el-dialog
    :title="'申请数据详情'"
    :width="'1060px'"
    custom-class="cus-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
    center
    :visible.sync="dialogTreeVisible"
  >
    <div v-loading="loading" class="info-box">
      <div v-if="isShowMap" id="viewMap">
        <init-map :mapType="dtSource" ref="viewMap"></init-map>
      </div>
      <Com-Table
        v-if="tableShow"
        :columns="columns"
        :dataSource="tableData"
        :options="options"
        :fetch="getTabData"
        :pagination="pagination"
        :pageSizes="pageSizes"
        class="view-tabel"
        :style="{ width: tableShow && isShowMap ? '630px' : '100%' }"
      ></Com-Table>
    </div>
  </el-dialog>
</template>
<script>
import { getDataRequestById } from "@/api/dataRequest.js";
import initMap from "@/components/initMap/initMap";
import { formatDate } from "@/util";
export default {
  name: "",
  components: {
    initMap
  },
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
        border: true,
        emptyText: "正在生成数据，请稍后查看！"
      },
      dtSource: [],
      isShowMap: false,
      tableShow: false
    };
  },
  computed: {
    dtMap() {
      return this.$store.state.user.dtMap;
    }
  },
  methods: {
    handleClose() {
      this.dialogTreeVisible = false;
      this.tableShow = false;
      this.isShowMap = false;
      this.saveLoad = false;
    },
    getTabData() {
      this.loading = true;
      getDataRequestById(this.id).then(res => {
        this.tableData = res.dataOverviews;
        this.$nextTick(() => {});
        res.filters.forEach(item => {
          if (item.name == "GeometryFilter") {
            this.isShowMap = true;
            this.tableShow = true;
            item.extraProperties.args.forEach(arg => {
              this.$nextTick(() => {
                this.dtSource = [this.dtMap[0]];
                this.$refs.viewMap.CreateByWkt(arg.g);
              });
            });
          }
        });
        this.tableShow = true;
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
.el-dialog.cus-dialog.el-dialog--center .el-dialog__body {
  padding: 0;
}
.info-box {
  overflow: auto;
  height: 500px;
  display: flex;
  justify-content: space-between;
  #viewMap {
    flex-shrink: 0;
    width: 350px;
    border: 1px solid #3988b7;
    border-radius: 4px;
  }
  .view-tabel {
    height: 100%;
    flex-shrink: 0;
  }
}
</style>
