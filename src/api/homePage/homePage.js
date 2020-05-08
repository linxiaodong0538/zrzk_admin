import request from '@/utils/request';
// /pageHome/getDeviceCountByProductType 各类型下设备数量统计
export function statistics(query) {
  return request({
    url: '/pageHome/getDeviceCountByProductType',
    data:query,
    method: 'get',
  })
}
// /pageHome/getEventStatistics 事件统计
export function eventStatistics(query) {
  return request({
    url: '/pageHome/getEventStatistics',
    data:query,
    method: 'get',
  })
}

// /pageHome/getCountNumForDeviceStatus 统计概览

export function statisticalOverview(query) {
  return request({
    url: '/pageHome/getCountNumForDeviceStatus',
    data:query,
    method: 'get',
  })
}
// /product/importData 导入excel
// /device/deviceRegister/importDataForDeviceSensor 传感器导入接口
export function Import(query) {
  return request({
    url: '/device/deviceRegister/importDataForDeviceSensor',
    data:query,
    // method: 'get',
  })
}
// /product/importTemplate
// /device/deviceRegister/importTemplateForDeviceSensor 传感器下载模板接口
// /parts/importTemplate/ 部件下载模块
// 导入下载模板
export function importTemplate(partsTypeId) {
  return request({
    url: '/parts/importTemplate/'+partsTypeId,
    // data:query,
    method: 'get',
  })
}
// /device/deviceRegister/importTemplate/{productId}
// 设备登记模板

export function  deviceImportTemplate(productId) {
  return request({
    url: '/device/deviceRegister/importTemplate/'+productId,
    method: 'get',
  })
}
// 设备导入登记模板/device/deviceRegister/importData

export function  deviceImportData(productId) {
  return request({
    url: '/device/deviceRegister/importData',
    // method: 'get',
  })
}