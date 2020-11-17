import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function getLogTypeList() {
  return request.get(`/Api/SysLog/GetDicLogTypeList`);
}
export function getSysTypeList() {
  return request.get(`/Api/SysLog/GetSystemTypeList`);
}
export function getLogList(data) {
  return request.get(`/Api/SysLog/GetList${getParamsFormat(data)}`);
}
export function exportLog(data) {
  return request.post(`/Api/SysLog/ExportLog`, data, {
    responseType: "blob"
  });
}
