import request from '@/utils/request'
// 福州区域
// /dev-api/system/area
export function region() {
  return request({
    url: '/system/area/treeselect',
    method: 'get'
  })
}
//分组
export function wellGroup() {
  console.log();

  return request({
    url: '/device/deviceGroups/treeselect',
    method: 'get',
  })
}
//项目
export function items() {
  return request({
    url: '/device/bcProject',
    method: 'get',
  })
}
// 灯具api接口

// /dev-api/lightPole/deviceLight/listForProduct
// 产品api接口
export function product(id) {
  // console.log(id);
  return request({
    url: '/lightPole/deviceLight/listForProduct/' + id,
    // params:query,
    method: 'get',
  })
}
//根据id查询设备详情
// /lightPole/deviceLight/getDeviceInfor/{deviceId}
export function queryDevice(id) {
  // console.log(id);
  return request({
    url: '/lightPole/deviceLight/getDeviceInfor/' + id,
    // params:query,
    method: 'get',
  })
}
//根据设备id获取历史数据
// /lightPole/deviceLight/getDeviceFieldUploadList/{deviceId}
export function loadList(id) {
  // console.log(id);
  return request({
    url: '/lightPole/deviceLight/getDeviceFieldUploadList/' + id,
    // params:query,
    method: 'get',
  })
}
//灯具查询接口
export function search(query) {
  // console.log(query);
  return request({
    url: '/lightPole/deviceLight/list',
    data:query,
    method: 'post',
  })
}
export function produceId(query) {
  // console.log(query);
  return request({
    url: '/lightPole/deviceLight/productFiledList',
    params:query,
    method: 'post',
  })
}
// /lightPole/deviceLight/productFiledList



//lightPole/deviceLight/getSensorList根据产品id获取传感器列表
// /lightPole/deviceLight/getUploadFieldByDeviceIdForList 获取上传的参数列表

export function sensor(query) {
  return request({
    url: 'lightPole/deviceLight/getUploadFieldByDeviceIdForList',
    data:query,
    method: 'post',
  })
}
//历史数据api接口/lightPole/deviceLight/queryForHistory
export function queryForHistory(query) {
  return request({
    url: '/lightPole/deviceLight/queryForHistory',
    data:query,
    method: 'post',
  })
}
//单灯集控器导出 
// /device/deviceRegister/exportForDeviceSensor 传感器导出接口
// /product/export 产品导出接口
export function monitoringExport(parameters = {}) {
  return request({
    url: '/device/deviceRegister/exportForDeviceSensor',
    method: 'post',
  })
}