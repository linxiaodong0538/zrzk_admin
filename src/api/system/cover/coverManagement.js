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
// /dev-api/device/bcProject
export function coverForm(query) {
  return request({
    url: '/system/deviceCover/deviceList',
    params:query,
    method: 'post',
  })
}


