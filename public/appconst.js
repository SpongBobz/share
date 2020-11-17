/**
 * 系统静态变量
 */
var geodp = geodp || {};

(function() {
  geodp.appconst = geodp.appconst || {
    // 请求超时设置时间 （ms）
    requestTimeout: 30000,
    // api地址
    baseAPI: "http://192.168.2.13:9021",

    // 运维API
    userApi: "http://192.168.2.13:9022"
  };
})();
