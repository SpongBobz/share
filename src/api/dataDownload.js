import request from "@/util/requset";

export function exportExcel(id) {
  return request.get(`/api/app/dataDownload/excel/${id}`, {
    responseType: "blob"
  });
}
export function exportXml(id) {
  return request.get(`/api/app/dataDownload/xml/${id}`, {
    responseType: "blob"
  });
}
export function exportShp(id) {
  return request.get(`/api/app/dataDownload/shapefile/${id}`, {
    responseType: "blob"
  });
}
export function exportDxf(id) {
  return request.get(`/api/app/dataDownload/dxf/${id}`, {
    responseType: "blob"
  });
}
