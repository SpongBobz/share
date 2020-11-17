<template>
  <div class="personalInfo-page">
    <div class="info-menu">
      <div :class="{ active: panle == 'info' }" @click="changePanle('info')">
        个人信息
      </div>
      <div
        :class="{ active: panle == 'password' }"
        @click="changePanle('password')"
      >
        修改密码
      </div>
    </div>
    <div class="info-card">
      <div class="info-title">
        {{ panle == "info" ? "个人信息" : "修改密码" }}
      </div>
      <div class="info-form">
        <el-form
          :model="personalInfo"
          :rules="rules"
          size="small"
          ref="personalInfo"
          label-width="130px"
        >
          <div v-if="panle == 'info'">
            <el-form-item label="登录名:" prop="UserName">
              <el-input disabled v-model="personalInfo.UserName"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="Name">
              <el-input v-model="personalInfo.Name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="EmailAddress">
              <el-input v-model="personalInfo.EmailAddress"></el-input>
            </el-form-item>
            <el-form-item label="电话号码:" prop="PhoneNumber">
              <el-input v-model="personalInfo.PhoneNumber"></el-input>
            </el-form-item>
          </div>
          <div v-if="panle == 'password'">
            <el-form-item label="当前密码:" prop="CurrentPass">
              <el-input
                type="password"
                v-model="personalInfo.CurrentPass"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="Password">
              <el-input
                type="password"
                v-model="personalInfo.Password"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass">
              <el-input
                type="password"
                v-model="personalInfo.checkPass"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="submit">
          <el-button
            type="primary"
            size="small"
            :loading="loading"
            style="margin-right: 20px"
            @click="submitForm('personalInfo')"
            >保存</el-button
          >
          <el-button size="small" @click="resetForm('personalInfo')"
            >重置</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { editPassWord, editUser } from "@/api/user";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.personalInfo.checkPass !== "") {
          this.$refs.personalInfo.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.personalInfo.Password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      panle: "info",
      showAddCategory: false,
      personalInfo: {
        // userName: "",
        Name: "",
        departmentName: "",
        EmailAddress: "",
        PhoneNumber: "",
        CurrentPass: "",
        Password: "",
        checkPass: ""
      },
      loading: false,
      rules: {
        Name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        EmailAddress: [
          {
            pattern: /[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
            message: "请输入有效的邮箱格式！",
            trigger: "blur"
          }
        ],
        PhoneNumber: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            pattern: /((^0\d{2}-\d{8})|(^1[34578]\d{9}))$/,
            message:
              "请输入有效的电话号码，如：13996633888 或者 027-87588000！",
            trigger: "blur"
          }
        ],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      userInfo: {}
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.panle == "info") {
            editUser({
              Name: this.personalInfo.Name,
              EmailAddress: this.personalInfo.EmailAddress,
              PhoneNumber: this.personalInfo.PhoneNumber
            }).then(res => {
              if (res.Success) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
              } else {
                this.$message.error("保存失败");
              }

              this.loading = false;
            });
          } else {
            editPassWord({
              CurrentPass: this.personalInfo.CurrentPass,
              Password: this.personalInfo.Password
            }).then(res => {
              if (res) {
                if (res.Success) {
                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });
                  this.$store.dispatch("user/logout").then(() => {
                    location.reload();
                  });
                }
                this.loading = false;
              } else {
                this.$message.error("保存失败");
              }
            });
          }
        } else {
          this.$message.error("验证失败");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changePanle(item) {
      this.panle = item;
    },
    getUserInfo({ UserName, Name, PhoneNumber, EmailAddress }) {
      this.userInfo = {
        UserName,
        Name,
        PhoneNumber,
        EmailAddress
      };
      this.personalInfo = {
        UserName,
        Name,
        PhoneNumber,
        EmailAddress
      };
    }
  },
  created() {
    this.getUserInfo(this.$store.state.user.userInfo);
  }
};
</script>
<style lang="scss">
.personalInfo-page {
  color: #fff;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  .info-card {
    background: #113857;
    height: 90%;
    width: 740px;
    margin-top: 2%;
    border-radius: 4px;
    box-shadow: 0 0px 12px 0 #57b5ff;
    position: relative;
    text-align: center;
    .info-form {
      padding: 40px 80px 0 10px;
    }
  }
  .info-menu {
    margin-top: 2%;
    margin-right: 20px;
    width: 120px;
    height: 80px;
    background: #094178;
    border-radius: 2px;
    text-align: center;
    div {
      cursor: pointer;
      line-height: 40px;
      &.active,
      &:hover {
        background: #0066a1;
      }
    }
  }
  .info-title {
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    border-radius: 4px 4px 0 0;
    background-image: linear-gradient(to right, #28b0ff, transparent);
    color: #fff;
  }
  .submit {
    position: absolute;
    bottom: 60px;
    width: 100%;
    margin: auto;
  }
}
</style>
