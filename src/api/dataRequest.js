import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function getDataRequest(data) {
  return request.get(`/api/app/dataRequest${getParamsFormat(data)}`);
}
export function getDataRequestById(id) {
  return request.get(`/api/app/dataRequest/${id}`);
}
export function postPipe(data) {
  return request.post(`/api/app/dataRequest/byClasses`, data);
}
export function postTowns(data) {
  return request.post(`/api/app/dataRequest/byTowns`, data);
}
export function postGeometry(data) {
  return request.post(`/api/app/dataRequest/byGeometry`, data);
}
