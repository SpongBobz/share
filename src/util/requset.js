import axios from "axios";
import store from "@/store";
import { getAccessToken } from "@/util/auth";
import { Message } from "element-ui";

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL:
    process.env.NODE_ENV === "development" ? "" : window.geodp.appconst.baseAPI,
  timeout: window.geodp.appconst.requestTimeout // 请求超时时间
});
// 异常拦截处理器
const errorHandler = errorRep => {
  if (errorRep.response) {
    const { data, status, statusText, error } = errorRep.response;
    console.log(error);
    // 身份验证失败
    if (status === 401) {
      Message.error("登录过期，需要重新验证身份");
      // 如果登录了，则退出登录
      store.dispatch("user/logout").then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
    } else if (status === 405) {
      Message.error(statusText);
    } else if (data && data.Message) {
      Message.error(data.Message);
    } else if (data.error && data.error.message) {
      Message.error(data.error.message);
    }
    return Promise.reject(data);
  }
  return Promise.reject(errorRep);
};

// 请求前拦截
request.interceptors.request.use(config => {
  const token = getAccessToken();

  if (config.url.includes("Api/")) {
    config.baseURL = window.geodp.appconst.userApi;
    if (token) {
      config.headers["token"] = `${token}`;
    }
  } else if (token) {
    config.headers["Authorization.Token"] = token;
  }

  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  return config;
}, errorHandler);

// 请求后拦截
request.interceptors.response.use(response => {
  if (response.config.url.includes("Api/")) {
    if (response.data && !response.data.Success) {
      Message.error(response.data.Message);
    }
  }
  if (response.request && response.request.responseType == "blob") {
    return response;
  }
  return response.data;
}, errorHandler);

export default request;
