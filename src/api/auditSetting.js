import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function getNodes() {
  return request.get(`/api/app/dataAuditSetting/nodes`);
}
export function addNode(data) {
  return request.post(`/api/app/dataAuditSetting/node`, data);
}
export function orderNode(data) {
  return request.post(`/api/app/dataAuditSetting/ordernode`, data);
}
export function editNode(data) {
  return request.put(`/api/app/dataAuditSetting/node`, data);
}
export function delNode(id) {
  return request.delete(`/api/app/dataAuditSetting/${id}/node`);
}
export function getAuditeableUsers(data) {
  return request.get(
    `/api/app/dataAuditSetting/auditeableUsers${getParamsFormat(data)}`
  );
}
