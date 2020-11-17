import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function mySourceTree(type) {
  return request.get(
    `/api/app/mapSource/mySourceTree?System=地下管网共享管理系统&Class=${type}`
  );
}
export function mySource(data) {
  return request.get(`/api/app/mapSource/mySource${getParamsFormat(data)}`);
}
