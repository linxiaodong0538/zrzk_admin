import request from '@/utils/request';
// productId/device/deviceRegister/importTemplate/{productId}
// 设备登记模板
export function deviceRegister(parentType) {
  return request({
    url: 'device/deviceRegister/importTemplate/'+parentType,
    // data:query,
    method: 'get',
  })
}
// /device/deviceRegister/export 
//设备登记导出
export function deviceExport(partsTypeId) {
  return request({
    url: '/device/deviceRegister/export',
    data:partsTypeId,
    method: 'post',
  })
}
//部件导入
export function partsImportTemplate(partsTypeId) {
  return request({
    url: '/parts/importTemplate/'+partsTypeId,
    // data:query,
    method: 'get',
  })
}

// /parts/export部件导出
export function partsExport(partsTypeId) {
  return request({
    url: '/parts/export',
    data:partsTypeId,
    method: 'post',
  })
}


//传感器模块下载 /deviceSensor/importTemplate
export function deviceSensor(partsTypeId) {
  return request({
    url: '/deviceSensor/importTemplate',
    // data:query,
    method: 'get',
  })
}
//传感器导出  /deviceSensor/export
export function deviceSensorExport(query) {
  return request({
    url: '/deviceSensor/export',
    data:query,
    method: 'post',
  })
}
//产品导入  /product/importData
export function productImportTemplate(partsTypeId) {
  return request({
    url: '/product/importTemplate',
    // data:query,
    method: 'get',
  })
}
// /parts/export部件导出
