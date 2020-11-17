import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function getPipeVersion(data) {
  return request.get(`/api/app/pipeVersion${getParamsFormat(data)}`);
}
export function getPipeWithFavourn(data) {
  return request.get(`/api/app/pipeVersion/withFavour${getParamsFormat(data)}`);
}
export function favour(item) {
  if (item.isFavour) {
    return request.delete(`/api/app/pipeVersion/favour/${item.id}`);
  } else {
    return request.post(`/api/app/pipeVersion/favour/${item.id}`);
  }
}
