import request from "@/util/requset";
// import { getParamsFormat } from "@/util";

export function login(data) {
  return request.post("/Api/Token/Login", data);
}
export function getUser() {
  return request.get("/Api/SysUser/GetUserInfo?id=3");
}
export function editUser(data) {
  return request.post("/Api/SysUser/EditUser", data);
}
export function editPassWord(data) {
  return request.post("/Api/SysUser/EditPassWord", data);
}
