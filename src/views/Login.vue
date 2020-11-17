<template>
  <div class="login-container">
    <img class="login-img" src="../assets/imgs/login-img.png" alt="" />
    <div class="login-form">
      <div class="login-box">
        <div class="form-title">
          <img src="../assets/imgs/left.png" alt="" />
          <span class="title">用户登录</span>
          <img src="../assets/imgs/right.png" alt="" />
        </div>
        <div class="form-box">
          <el-form
            :model="loginForm"
            status-icon
            :rules="rules"
            ref="loginForm"
            class="demo-ruleForm login-from"
          >
            <el-form-item prop="UserName">
              <el-input
                class="full-width"
                v-model.number="loginForm.UserName"
                placeholder="请输入用户名"
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item prop="Password">
              <el-input
                class="full-width"
                type="password"
                prefix-icon="el-icon-lock"
                ref="pass"
                v-model="loginForm.Password"
                autocomplete="off"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="verificationCode">
              <el-row>
                <el-col :span="12">
                  <el-input
                    type="text"
                    class="full-width"
                    v-model="loginForm.verificationCode"
                    placeholder="请输入验证码"
                    @keyup.enter.native="handleLogin"
                  ></el-input>
                </el-col>
                <el-col :span="8">
                  <div class="verification-code">{{ checkCode }}</div>
                </el-col>
                <el-col :span="4">
                  <el-button
                    style="color: #fff"
                    type="text"
                    size="small"
                    @click="changeCode"
                    >换一张</el-button
                  >
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width: 100%"
                :loading="loading"
                @click="handleLogin"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var code;
export default {
  name: "Login",
  data() {
    let validateCode = (rule, value, callback) => {
      let newCode = this.checkCode;

      if (value.toUpperCase() !== newCode) {
        // if (newCode.toLocaleLowerCase() == value) {
        //   callback(new Error("请区分大小写"));
        // }
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        UserName: "",
        Password: "",
        verificationCode: ""
      },
      rules: {
        Password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        UserName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        verificationCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: validateCode, trigger: "blur" }
        ]
      },
      loading: false,
      pwdType: "Password",
      redirect: undefined,
      checkCode: "1234"
    };
  },
  created() {
    this.createCode();
  },
  methods: {
    showPwd() {
      if (this.pwdType === "Password") {
        this.pwdType = "";
      } else {
        this.pwdType = "Password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch("user/login", this.loginForm).then(async res => {
            if (res && res.Success) {
              this.$store.dispatch("user/getUserInfo").then(res => {
                if (res.flag) {
                  this.$router.push(res.path);
                } else {
                  this.$message.error("当前用户无权限进入此系统！");
                }
              });
            }
            this.createCode();
            this.loading = false;
          });
        } else {
          console.log("登录失败!!");
          this.createCode();
          return false;
        }
      });
    },
    /* 生产验证码 */
    createCode() {
      code = "";
      let codeLength = 4; //验证码的长度
      let random = new Array(
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ); //随机数
      for (var i = 0; i < codeLength; i++) {
        let index = Math.floor(Math.random() * random.length); //取得随机数的索引（0~35）
        code += random[index]; //根据索引取得随机数加到code上
      }
      this.checkCode = code; //把code值赋给验证码
    },
    /* 换一张 */
    changeCode() {
      this.createCode();
    }
  }
};
</script>
<style lang="scss" scoped>
$w: 1920/100vw;
$h: 1080/100vh;
.login-container {
  text-align: center;
  box-sizing: border-box;
  height: 100%;
  background: url("../assets/imgs/login-bg.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow-y: hidden;
  .login-img {
    position: absolute;
    width: 710 / $w;
    left: 8%;
    top: 220 / $h;
    min-width: 504px;
  }
  .login-form {
    box-sizing: border-box;
    position: absolute;
    right: 160 / $w;
    top: 270 / $h;
    width: 560 / $w;
    height: 500 / $h;
    min-width: 465px;
    min-height: 380px;
    background: url("../assets/imgs/login-form.png") no-repeat;
    background-size: 100% 100%;
    padding: 55 / $h 55 / $w;
    .login-box {
      height: 100%;
      background: rgba(23, 68, 104, 0.13);
      box-shadow: inset 0px 0px 16px 0px#0381CB;
      border: 1px solid #0381cb;
      border-radius: 2px;
      .form-box {
        padding: 0 60px;
      }
      .form-title {
        font-size: 24px;
        color: #63acdf;
        line-height: 80 / $h;
        align-items: center;
        min-height: 50px;
        margin-bottom: 10 / $h;
        .title {
          margin: auto 30 / $w;
        }
      }
      .verification-code {
        background: #247aad;
        margin: 0 5px;
        color: #fff;
        border-radius: 4px;
        font-size: 20 / $w;
        letter-spacing: 2px;
      }
    }
  }
}
</style>

<style lang="scss"></style>
