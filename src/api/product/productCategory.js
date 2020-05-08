import request from '@/utils/request'

// /productType
// 查询传感器类型列表
export function deviceSensorType() {
  return request({
    url: '/productType',
    method: 'get'
  })
}
// /productType/list （查询传感器类型列表）复杂查询
export function search(query) {
  return request({
    url: '/productType/list',
    data:query,
    method: 'post'
  })
}
// /productType 根据ID删除传感器类型
export function deviceSensorTypeDelete(query) {
  return request({
    url: '/productType',
    data:query,
    method: 'delete'
  })
}
// /productType/validate 传感器参数验证
export function validate(query) {
  return request({
    url: '/productType/validate',
    data:query,
    method: 'post'
  })
}

// /productType  添加传感器类型
export function deviceSensorTypeAdd(query) {
  return request({
    url: '/productType',
    data:query,
    method: 'post'
  })
}

// /productType/{id} 点击修改显示详情/根据id查询详情信息
// getType

export function getType(id) {
  return request({
    url: '/productType/'+id,
    method: 'get'
  })
}

// 更新传感器类型
// updateType /productType 
export function updateType(data) {
  return request({
    url: '/productType',
    method: 'put',
    data: data
  })
}
