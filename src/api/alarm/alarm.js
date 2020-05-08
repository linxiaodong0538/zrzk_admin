import request from '@/utils/request';
//报警设备报警
///alert/abnormalAlert/list 复杂查询
export function search(query) {
  return request({
    url: '/alert/abnormalAlert/list',
    data:query,
    method: 'post',
  })
}
//解除报警/alert/abnormalAlert/releaseAlarm
export function releaseAlarm(query) {
  return request({
    url: '/alert/abnormalAlert/releaseAlarm',
    data:query,
    method: 'put',
  })
}
///alert/abnormalAlert/operator 批量处理
export function operator(query) {
  return request({
    url: '/alert/abnormalAlert/operator',
    data:query,
    method: 'post',
  })
}