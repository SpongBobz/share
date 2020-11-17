import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function getPipeClass(data) {
  return request.get(`/api/app/pipeClass${getParamsFormat(data)}`);
}
export function getPipeWithFavourn(data) {
  return request.get(`/api/app/pipeVersion/withFavour${getParamsFormat(data)}`);
}
