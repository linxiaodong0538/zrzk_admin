import request from '@/utils/request';
// 设备监控导出/device/deviceRegister/importData
///parts/export 部件导出
export function monitoringExport(parameters = {}) {
  return request({
    url: '/parts/export',
    method: 'post',
  })
}