<template>
  <el-dialog
    :title="title"
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
      label-width="80px"
    >
      <el-form-item label="审批员" prop="auditUserId">
        <el-select
          clearable
          v-model="formData.auditUserId"
          placeholder="选择审批员"
          style="width:100%"
        >
          <el-option
            v-for="(item, k) in userList"
            :key="k"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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
import { getAuditeableUsers, addNode, editNode } from "@/api/auditSetting.js";
export default {
  name: "",
  data() {
    return {
      dialogTreeVisible: false,
      title: "",
      saveLoad: false,
      userList: [],
      formData: {
        auditUserId: null
      },
      node: null
    };
  },
  computed: {},
  methods: {
    save() {
      this.$refs.dialogForm.validate(valid => {
        if (valid) {
          this.saveLoad = true;
          if (this.title == "编辑审核节点") {
            editNode({
              name: this.node.name,
              ...this.formData,
              id: this.node.id
            })
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
            addNode({
              ...this.formData,
              step: this.node.step
            }).then(() => {
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
    },
    getUsers() {
      if (!this.userList.length) {
        getAuditeableUsers({ MaxResultCount: 999 }).then(res => {
          this.userList = res.items;
        });
      }
    },
    open(data, flag) {
      this.node = data;
      this.getUsers();
      this.dialogTreeVisible = true;
      if (flag) {
        this.title = "添加审核节点";
        this.formData.auditUserId = null;
      } else {
        this.title = "编辑审核节点";
        this.formData.auditUserId = data.auditUserId;
      }
    }
  }
};
</script>
