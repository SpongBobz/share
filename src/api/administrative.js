import request from "@/util/requset";
import { getParamsFormat } from "@/util";

export function getTown(data) {
  return request.get(`/api/app/administrative/town${getParamsFormat(data)}`);
}
