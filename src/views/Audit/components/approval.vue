<template>
  <el-dialog
    :title="'数据审批提示'"
    width="30%"
    custom-class="cus-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
    center
    :visible.sync="dialogTreeVisible"
  >
    <el-form
      class="approval-form"
      :model="formData"
      ref="dialogForm"
      :rules="rules"
      label-width="80px"
    >
      <div class="approval-title">
        {{
          `是否${flag ? "通过" : "驳回"} ${name} 于 ${formatDate(
            time
          )} 提交的数据申请？`
        }}
      </div>
      <el-form-item :label="flag ? '审核意见' : '驳回意见'" prop="approval">
        <el-input
          :autosize="{ minRows: 4, maxRows: 8 }"
          type="textarea"
          v-model="formData.approval"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" :loading="saveLoad" @click="save"
        >保 存</el-button
      >
      <el-button @click="handleClose" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { reject, approval } from "@/api/audit.js";
import { formatDate } from "@/util";
export default {
  name: "",
  data() {
    return {
      formatDate,
      dialogTreeVisible: false,
      flag: false,
      saveLoad: false,
      formData: {
        approval: "",
        id: ""
      },
      name: "",
      time: "",
      rules: {
        approval: [
          {
            required: true,
            message: `请输入理由${this.flag ? "审核意见" : "驳回意见"} !`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    save() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.saveLoad = true;
          if (!this.flag) {
            reject(this.formData)
              .then(() => {
                this.saveLoad = false;
                this.handleClose();
                this.$message.success("保存成功！");
                this.$emit("change");
              })
              .catch(() => {
                this.saveLoad = false;
              });
          } else {
            approval(this.formData).then(() => {
              this.saveLoad = false;
              this.handleClose();
              this.$message.success("保存成功！");
              this.$emit("change");
            });
          }
        } else {
          this.$message({
            type: "warning",
            message: "验证不通过！"
          });
          this.saveLoad = false;
          return false;
        }
      });
    },
    handleClose() {
      this.dialogTreeVisible = false;
      this.saveLoad = false;
      this.$refs.dialogForm.resetFields();
    },
    open({ creatorName, id, creationTime }, flag) {
      this.flag = flag;
      this.name = creatorName;
      this.time = creationTime;
      this.formData.id = id;
      this.dialogTreeVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.approval-title {
  color: #fff;
  margin-bottom: 20px;
  padding-left: 10px;
}
</style>
