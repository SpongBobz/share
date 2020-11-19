<template>
  <div class="log">
    <el-form
      class="query-form"
      :model="queryForm"
      label-suffix=":"
      size="small"
      inline
    >
      <el-form-item label="时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          :clearable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input
          v-model="queryForm.key"
          placeholder="申请人姓名、申请类型、意见"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryBtn">查询</el-button>
        <el-button class="reset" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs
      class="table-tabs"
      v-model="currntTab"
      tab-position="top"
      @tab-click="tabChange"
    >
      <el-tab-pane
        v-for="item in panes"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <Com-Table
          :columns="item.columns"
          :dataSource="tableData"
          :options="options"
          :fetch="getTabData"
          :pagination="pagination"
          :pageSizes="pageSizes"
          style="height: 100%"
        >
          <template slot="func" slot-scope="scoped">
            <el-button
              size="mini"
              @click="viewData(scoped.row)"
              type="primary"
              style="margin-right: 5px"
              >查看</el-button
            >
            <el-button
              size="mini"
              v-if="scoped.row.auditable"
              @click="approval(scoped.row)"
              type="success"
              style="margin-right: 5px"
              >通过</el-button
            >
            <el-button
              size="mini"
              v-if="scoped.row.auditable"
              @click="reject(scoped.row)"
              type="warning"
              style="margin-right: 5px"
              >驳回</el-button
            >
            <el-button
              size="mini"
              @click="openProgress(scoped.row)"
              type="primary"
              style="margin-right: 5px"
              >进度</el-button
            >
          </template>
          <template slot="successFunc" slot-scope="scoped">
            <el-button
              size="mini"
              @click="viewData(scoped.row)"
              type="primary"
              style="margin-right: 5px"
              >查看</el-button
            >
            <el-button
              size="mini"
              @click="exportData(scoped.row, exportXml, 'xml')"
              type="success"
              style="margin-right: 5px"
              :title="scoped.row.isFileReady || '文件暂时不能下载'"
              :disabled="!scoped.row.isFileReady"
              >XML</el-button
            >
            <el-button
              size="mini"
              @click="exportData(scoped.row, exportShp, 'shp')"
              type="warning"
              style="margin-right: 5px"
              :title="scoped.row.isFileReady || '文件暂时不能下载'"
              :disabled="!scoped.row.isFileReady"
              >shp</el-button
            >
            <el-button
              size="mini"
              @click="exportData(scoped.row, exportExcel, 'xls')"
              type="success"
              style="margin-right: 5px"
              :title="scoped.row.isFileReady || '文件暂时不能下载'"
              :disabled="!scoped.row.isFileReady"
              >Excel</el-button
            >
            <el-button
              size="mini"
              @click="exportData(scoped.row, exportDxf, 'dxf')"
              type="success"
              style="margin-right: 5px"
              :title="scoped.row.isFileReady || '文件暂时不能下载'"
              :disabled="!scoped.row.isFileReady"
              >DXF</el-button
            >
          </template>
        </Com-Table>
      </el-tab-pane>
    </el-tabs>
    <Approval ref="Approval" @change="getTabData" />
    <Progress ref="Progress" />
    <ViewDialog ref="ViewDialog" />
  </div>
</template>
<script>
import { getAuditData } from "@/api/audit.js";
import {
  exportExcel,
  exportXml,
  exportShp,
  exportDxf
} from "@/api/dataDownload.js";
import { formatDate } from "@/util";
import Approval from "./components/approval";
import Progress from "./components/progress";
import ViewDialog from "./components/viewDialog";
export default {
  components: {
    Approval,
    Progress,
    ViewDialog
  },
  data() {
    return {
      exportExcel,
      exportXml,
      exportShp,
      exportDxf,
      panes: [
        {
          label: "审核中",
          key: "0",
          columns: [
            {
              prop: "creatorName",
              label: "提交人"
            },
            {
              label: "提交时间",
              render: row => {
                return <span>{formatDate(row.creationTime)}</span>;
              }
            },
            {
              prop: "title",
              label: "申请类型"
            },
            {
              prop: "func",
              label: "操作",
              width: 340
            }
          ]
        },
        {
          label: "未通过",
          key: "4",
          columns: [
            {
              prop: "creatorName",
              label: "提交人"
            },
            {
              label: "提交时间",
              render: row => {
                return <span>{formatDate(row.creationTime)}</span>;
              }
            },
            {
              prop: "finalApproval",
              label: "审核意见"
            }
          ]
        },
        {
          label: "已通过",
          key: "9",
          columns: [
            {
              prop: "creatorName",
              label: "提交人"
            },
            {
              label: "提交时间",
              render: row => {
                return <span>{formatDate(row.creationTime)}</span>;
              }
            },
            {
              prop: "title",
              label: "申请类型"
            },
            {
              prop: "successFunc",
              label: "操作",
              width: 380
            }
          ]
        }
      ],
      currntTab: "0",
      queryForm: {
        key: null
      },
      time: [new Date(new Date() - 7 * 24 * 3600 * 1000), new Date()],
      tableData: [],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 15
      },
      pageSizes: [10, 15, 30, 40, 60],
      treeLoading: false,
      options: {
        height: "calc(100% - 62px)",
        mutiSelect: false,
        index: true, // 显示序号， 多选则 mutiSelect
        loading: false, // 表格动画
        initTable: false, // 是否一挂载就加载数据
        border: true
      },
      typeList: [],
      typeLoading: false
    };
  },
  created() {
    this.getTabData();
  },
  methods: {
    // 审核中
    viewData(data) {
      this.$refs.ViewDialog.open(data);
    },
    approval(row) {
      this.$refs.Approval.open(row, true);
    },
    reject(row) {
      this.$refs.Approval.open(row, false);
    },
    openProgress(row) {
      this.$refs.Progress.open(row);
    },
    // 已通过
    exportData(row, api, name) {
      this.exportLoad = true;
      api(row.id)
        .then(res => {
          var content = res.data;
          var blob = new Blob([content]);
          let fileName = "";
          if (res.headers["content-disposition"]) {
            let temp = res.headers["content-disposition"]
              .split(";")[2]
              .split("filename*=UTF-8''")[1];
            console.log(temp);
            fileName = decodeURIComponent(temp);
            console.log(fileName);
          } else {
            fileName = "文件." + name; //要保存的文件名称
          }
          if ("download" in document.createElement("a")) {
            // 非IE下载
            var elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
          this.exportLoad = false;
        })
        .catch(() => {
          this.exportLoad = false;
          this.$message.error("导出失败!");
        });
    },
    tabChange() {
      this.getTabData();
    },
    queryBtn() {
      this.pagination.pageIndex = 1;
      this.getTabData();
    },
    reset() {
      this.queryForm = {
        key: null
      };
      this.pagination = {
        total: 0,
        pageIndex: 1,
        pageSize: 15
      };
      this.getTabData();
    },
    getTabData() {
      this.options.loading = true;
      let parms = {
        ...this.queryForm,
        Start: formatDate(this.time[0]),
        End: formatDate(this.time[1]),
        Status: this.currntTab - 0,
        skipCount: (this.pagination.pageIndex - 1) * this.pagination.pageSize,
        maxResultCount: this.pagination.pageSize
      };
      getAuditData(parms).then(res => {
        this.tableData = res.items;
        this.pagination.total = res.totalCount;
        this.options.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.log {
  height: calc(100% - 12px);
  background: #04242460;
  padding: 6px 20px;
  position: relative;
  overflow: auto;
}
</style>
<style lang="scss">
.el-tabs__item {
  color: #fff;
  font-size: 16px;
}
.table-tabs {
  height: calc(100% - 61px);
  .el-tabs__content {
    height: calc(100% - 48px);
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
