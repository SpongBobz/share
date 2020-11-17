<template>
  <div class="log">
    <el-form
      class="query-form"
      :model="queryForm"
      label-suffix=":"
      size="small"
      inline
    >
      <el-form-item label="日志类型">
        <el-select
          clearable
          v-model="queryForm.typeId"
          placeholder="请选择日志类型"
          style="width:100%"
          :loading="typeLoading"
        >
          <el-option
            v-for="(item, k) in typeList"
            :key="k"
            :label="item.Type"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="queryBtn">查询</el-button>
        <el-button class="reset" @click="reset">重置</el-button>
        <el-button icon="el-icon-download" type="primary" @click="exportData"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
    <div class="tab-content">
      <Com-Table
        :columns="columns"
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
            @click="viewLog(scoped.row)"
            type="primary"
            style="margin-right: 5px"
            >查看</el-button
          >
        </template>
      </Com-Table>
    </div>
    <InfoDialog @change="getTabData" ref="infoDialog" />
  </div>
</template>
<script>
import { getLogList, getLogTypeList, exportLog } from "@/api/log.js";
import { formatDate } from "@/util";
import InfoDialog from "./components/InfoDialog";
export default {
  components: {
    InfoDialog
  },
  data() {
    return {
      columns: [
        {
          prop: "CreateName",
          label: "操作人员"
        },
        {
          prop: "SystemDisplayName",
          label: "所属系统"
        },
        {
          prop: "Details",
          label: "详情"
        },
        {
          prop: "TypeName",
          label: "日志类型"
        },
        {
          label: "时间",
          render: row => {
            return <span>{formatDate(row.CreationTime)}</span>;
          }
        },
        {
          prop: "func",
          label: "操作",
          width: 150
        }
      ],
      queryForm: {
        systemId: 3,
        typeId: null
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
        initTable: true // 是否一挂载就加载数据
        // border: true,
      },
      typeList: [],
      typeLoading: false
    };
  },
  created() {
    this.getLogTypeList();
  },
  methods: {
    exportData() {
      this.exportLoad = true;
      let parms = {
        ...this.queryForm,
        StartTime: formatDate(this.time[0]),
        EndTime: formatDate(this.time[1]),
        pageIndex: this.pagination.pageIndex,
        pagesize: this.pagination.pageSize
      };
      exportLog(parms)
        .then(res => {
          var content = res.data;
          var blob = new Blob([content]);
          let fileName = "";
          if (res.headers["filename"]) {
            let iconv = require("iconv-lite");
            iconv.skipDecodeWarning = true; //忽略警告
            fileName = iconv.decode(res.headers["filename"], "utf-8");
          } else {
            fileName = "日志信息.csv"; //要保存的文件名称
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
    viewLog(data) {
      this.$refs.infoDialog.open(data);
    },
    queryBtn() {
      this.pagination.pageIndex = 1;
      this.getTabData();
    },
    reset() {
      this.queryForm = {
        systemId: 3,
        typeId: null
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
        StartTime: formatDate(this.time[0]),
        EndTime: formatDate(this.time[1]),
        pageIndex: this.pagination.pageIndex,
        pagesize: this.pagination.pageSize
      };
      getLogList(parms).then(res => {
        this.tableData = res.Data.Data;
        this.pagination.total = res.Data.PageInfo.Count;
        this.options.loading = false;
      });
    },
    getLogTypeList() {
      this.typeLoading = true;
      getLogTypeList().then(res => {
        this.typeList = res.Data;
        this.typeLoading = false;
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
