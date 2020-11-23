<template>
  <el-container>
    <el-header height="86px">
      <div class="header-left">
        <span class="sys-time">{{
          formatDate(new Date(), "YYYY年MM月DD日  dddd")
        }}</span>
        <div class="sys-menu">
          <div
            class="menu-item"
            @click="menuChange('/onMap')"
            :class="{ active: roteName == 'onMap' }"
          >
            在线地图
          </div>
          <div
            v-if="menuList.leftMenu"
            :class="{ active: roteName == menuList.leftMenu.url }"
            class="menu-item"
            @click="menuChange(menuList.leftMenu.url)"
          >
            {{ menuList.leftMenu.DisplayName }}
          </div>
        </div>
      </div>
      <div class="header-title"></div>
      <div class="header-right">
        <div class="sys-menu">
          <div
            v-for="item in menuList.rightMenu"
            :class="{ active: roteName == item.url }"
            :key="item.Name"
            class="menu-item"
            @click="menuChange(item.url)"
          >
            {{ item.DisplayName }}
          </div>
        </div>
        <span class="sys-user">
          <el-dropdown trigger="click" @command="handleUserCommand">
            <span class="el-dropdown-link">
              {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="logOut">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script>
import { formatDate } from "@/util";
export default {
  data() {
    return { formatDate };
  },
  computed: {
    roteName() {
      return this.$route.name;
    },
    menuList() {
      let leftMenu = null;
      let rightMenu = [];
      if (this.$store.state.user.menuList.length) {
        if (this.$store.state.user.menuList.length < 3) {
          rightMenu = this.$store.state.user.menuList;
        } else {
          this.$store.state.user.menuList.forEach((item, i) => {
            if (i == 0) {
              leftMenu = item;
            } else {
              rightMenu.push(item);
            }
          });
        }
      }
      return { leftMenu, rightMenu };
    },
    userName() {
      return this.$store.state.user.userInfo.Name;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
      location.reload();
    },
    menuChange(name) {
      this.$router.push(name);
    },
    handleUserCommand(cmd) {
      switch (cmd) {
        case "logOut":
          this.logout(); //退出系统
          break;
        case "userinfo":
          this.$router.push("userinfo");
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$w: 1920/100vw;
$h: 1080/100vh;
.el-header {
  line-height: 86px;
  padding: 0;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6bbeee;
  .header-left {
    flex: 1;
    height: 100%;
    background: url("../assets/imgs/left-menu.png") no-repeat;
    background-size: 100% 100%;
    padding: 0 40 / $w;
    display: flex;
    justify-content: space-between;
    .sys-time {
      font-size: 18px;
      font-weight: 400;
      width: 200px;
    }
    .sys-menu {
      padding: 0 20 / $w;
      font-size: 18px;
      width: 350 / $w;
      min-width: 244px;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      .menu-item {
        padding: 9px 25px 16px;
        margin-bottom: 4px;
        cursor: pointer;
        line-height: 1rem;
        font-weight: bold;
        &.active,
        &:hover {
          background: url(~@/assets/imgs/menu-bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
  .header-right {
    flex: 1;
    height: 100%;
    background: url("../assets/imgs/right-menu.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    position: relative;
    .sys-menu {
      padding: 0 20 / $w;
      font-size: 18px;
      width: 540 / $w;
      min-width: 366px;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      .menu-item {
        padding: 9px 25px 16px;
        margin-bottom: 4px;
        cursor: pointer;
        line-height: 1rem;
        font-weight: bold;
        &.active,
        &:hover {
          background: url(~@/assets/imgs/menu-bg.png) no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .sys-user {
      position: absolute;
      right: 25px;
      top: 10px;
      line-height: 1.5rem;
      .el-dropdown-link {
        cursor: pointer;
        color: #fff;
        font-size: 16px;
      }
    }
  }
  .header-title {
    width: 580 / $w;
    min-width: 414px;
    height: 100%;
    background: url("../assets/imgs/title.png") no-repeat;
    background-size: 100% 100%;
  }
}
.el-container {
  height: 100%;
  .el-main {
    padding: 4px;
    margin-top: 8px;
    background: #0b2a3d90;
  }
}
</style>
