export default {
  /**
   * 获取系统当前时间
   */
  GetCurentTimeStr: function() {
    try {
      let time = new Date();

      return time.toLocaleString();
    } catch (error) {
      console.error(error);
    }
  }
};
