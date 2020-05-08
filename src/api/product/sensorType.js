import request from '@/utils/request'

// /deviceSensorType
// 查询传感器类型列表
export function deviceSensorType() {
  return request({
    url: '/deviceSensorType',
    method: 'get'
  })
}
// /deviceSensorType/list （查询传感器类型列表）复杂查询
export function search(query) {
  return request({
    url: '/deviceSensorType/list',
    data:query,
    method: 'post'
  })
}
// /deviceSensorType 根据ID删除传感器类型
export function deviceSensorTypeDelete(query) {
  return request({
    url: '/deviceSensorType',
    data:query,
    method: 'delete'
  })
}
// /deviceSensorType/validate 传感器参数验证
export function validate(query) {
  return request({
    url: '/deviceSensorType/validate',
    data:query,
    method: 'post'
  })
}

// /deviceSensorType  添加传感器类型
export function deviceSensorTypeAdd(query) {
  return request({
    url: '/deviceSensorType',
    data:query,
    method: 'post'
  })
}

// /deviceSensorType/{id} 点击修改显示详情/根据id查询详情信息
// getType

export function getType(id) {
  return request({
    url: '/deviceSensorType/'+id,
    method: 'get'
  })
}

// 更新传感器类型
// updateType /deviceSensorType 
export function updateType(data) {
  return request({
    url: '/deviceSensorType',
    method: 'put',
    data: data
  })
}
