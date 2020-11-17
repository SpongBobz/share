<template>
  <el-dialog
    :title="title"
    width="30%"
    custom-class="cus-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
    center
    disabled
    :visible.sync="dialogTreeVisible"
  >
    <el-form :model="formData" ref="dialogForm" label-width="80px">
      <el-form-item label="操作人员">
        <el-input v-model.trim="formData.CreateName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="所属系统">
        <el-input
          v-model.trim="formData.SystemDisplayName"
          placeholder=""
        ></el-input>
      </el-form-item>
      <el-form-item label="日志类型">
        <el-input v-model.trim="formData.TypeName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-input
          v-model.trim="formData.CreationTime"
          placeholder=""
        ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model.trim="formData.Details"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 10 }"
          show-word-limit
          placeholder=""
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      formData: {},
      dialogTreeVisible: false,
      title: ""
    };
  },
  methods: {
    handleClose() {
      this.formData = {};
      this.dialogTreeVisible = false;
    },
    open(data) {
      this.dialogTreeVisible = true;
      this.title = "日志详情";
      this.formData = { ...data };
    }
  }
};
</script>
