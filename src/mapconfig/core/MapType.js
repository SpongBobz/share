const key = "c0b9cb30599dd11c468c8aaa2fc1863a";
let MapType = {
  天地图矢量地图:
    "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + key, //天地图矢量地图
  天地图矢量地图标注:
    "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + key, //天地图矢量地图标注
  天地图影像地图:
    "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + key, //天地图影像地图
  天地图影像地图标注:
    "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=" + key, //天地图影像地图标注
  谷歌地形图:
    "http://mt3.google.cn/vt/lyrs=t@131,r@216000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Gal", //谷歌地形图
  谷歌交通图:
    "http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i345013117!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0", //谷歌交通图
  谷歌卫星地图:
    "http://mt2.google.cn/vt/lyrs=y&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=G", //谷歌卫星地图
  蓝黑色矢量地图:
    "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}", //GeoQ提供的蓝黑色矢量地图
  高德路网地图:
    "https://wprd03.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=8&x={x}&y={y}&z={z}" //高德路网地图
};
export default MapType;
