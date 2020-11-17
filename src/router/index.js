import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getAccessToken } from "@/util/auth";
import Layout from "@/layouts";
// import MapLayout from "@/layouts/MapLayout";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/onMap",
    children: [
      {
        path: "/map",
        name: "map",
        component: () =>
          // import(/* webpackChunkName: "OnMap" */ "@/views/OnMap"),
          import(/* webpackChunkName: "OnMap" */ "@/layouts/MapLayout"),
        meta: { title: "在线地图" },
        redirect: "/onMap",
        children: [
          {
            path: "/onMap",
            name: "onMap",
            component: () =>
              import(/* webpackChunkName: "OnMap" */ "@/views/OnMap"),
            meta: { title: "在线地图" }
          },
          {
            path: "/applys",
            name: "applys",
            component: () =>
              import(/* webpackChunkName: "Applys" */ "@/views/Applys"),
            meta: { title: "数据申请" }
          }
        ]
      },
      {
        path: "/config",
        name: "config",
        component: () =>
          import(/* webpackChunkName: "Config" */ "@/views/Config"),
        meta: { title: "审核配置" }
      },
      {
        path: "/audit",
        name: "audit",
        component: () =>
          import(/* webpackChunkName: "Audit" */ "@/views/Audit"),
        meta: { title: "数据审核" }
      },
      {
        path: "/log",
        name: "log",
        component: () => import(/* webpackChunkName: "log" */ "@/views/Log"),
        meta: { title: "日志管理" }
      },
      {
        path: "/userinfo",
        name: "userinfo",
        component: () =>
          import(/* webpackChunkName: "Userinfo" */ "@/views/Userinfo"),
        meta: { title: "用户信息" }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "@/views/Login.vue"),
    meta: { title: "登录" }
  }
];
const router = new VueRouter({
  mode: process.env.NODE_ENV === "development" ? "history" : "hash",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  let token = getAccessToken();
  document.title = to.meta.title ? to.meta.title : "成都市监测数据管理系统";
  if (token) {
    let userInfo = store.state.user.userInfo;
    if (userInfo == null || !userInfo.Name) {
      await store.dispatch("user/getUserInfo");
    }
    if (to.path === "/login") {
      //token存在，并且是login页面
      next("/");
    } else {
      //token存在，不是login页面
      next();
    }
  } else {
    if (to.path === "/login") {
      //token不存在，并且是login页面
      next();
    } else {
      //token不存在，不是login页面
      next("/login");
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
export default router;
