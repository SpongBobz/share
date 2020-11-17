import moment from "moment";
import "moment/locale/zh-cn";

/**
 * 数据分组，按区县分组展示
 * @param {Array[Object]} list 需要分组的列表
 * @param {String} filed 分组的字段
 * @return {Object} 分组后的数据
 * @example groupData([{a:"a11",b:"b11"}],"a"); ====> {"a11":[{a:"a11",b:"b11"}]}
 */
export function groupData(list, filed) {
  let newData = {};
  list.forEach(item => {
    const fel = item[filed] ? item[filed] : "其他";
    if (Object.prototype.hasOwnProperty.call(newData, fel)) {
      newData[fel].push({ ...item });
    } else {
      newData[fel] = [];
      newData[fel][0] = { ...item };
    }
  });
  return newData;
}

/**
 * 格式化日期，默认返回当前日期
 * @param {String} dateString 日期字符串
 * @param {String} formatString 格式化的字符串
 */
export function formatDate(
  dateString = new Date().toISOString(),
  formatString = "YYYY-MM-DD HH:mm:ss"
) {
  return moment(dateString).format(formatString);
}

export const getParamsFormat = function(obj) {
  let result = "";
  let item;
  for (item in obj) {
    if (
      obj[item] === 0 ||
      obj[item] === false ||
      (obj[item] && String(obj[item]))
    ) {
      if (obj[item] instanceof Array) {
        obj[item].forEach(par => {
          result += `&${item}=${par}`;
        });
      } else if (item == "start" || item == "end") {
        result += `&${item}=${formatDate(obj[item])}`;
      } else {
        result += `&${item}=${obj[item]}`;
      }
    }
  }
  if (result) {
    result = "?" + result.slice(1);
  }
  return result;
};
