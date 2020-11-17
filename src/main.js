import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";

import "@/components";
import "./style/theme/index.css";

import router from "./router";
import store from "./store";

// 引入iconfont
import IconFont from "@/components/Icon/index.js";
Vue.use(IconFont);

// 引入公用scss
import "@/style/index.scss"; // global css
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
