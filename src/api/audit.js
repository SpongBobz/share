import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function getAuditData(data) {
  return request.get(`/api/app/dataAudit/my${getParamsFormat(data)}`);
}
export function approval(data) {
  return request.post(`/api/app/dataAudit/approval`, data);
}
export function reject(data) {
  return request.post(`/api/app/dataAudit/reject`, data);
}
export function progress(id) {
  return request.get(`/api/app/dataAudit/${id}/progress`);
}
