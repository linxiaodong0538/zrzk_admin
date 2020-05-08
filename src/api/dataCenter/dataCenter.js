import request from '@/utils/request';
///mapShow 获取所有设备信息

export function dataDisplay(query) {
  return request({
    url: '/mapShow',
    data:query,
    method: 'get',
  })
}
