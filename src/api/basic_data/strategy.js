import request from '@/utils/request'

// 下发控制表查询
export function list(data) {
  return request({
    url: '/simpleControl/list',
    method: 'POST',
    data
  })
}

//下发数据
export  function issuedData(id) {
  return request({
    url: `/simpleControl/getFieldByProductId/${id}`,
    method: 'get'
  })
}


//添加下发控制
export function submitControl(data) {
  return request({
    url: '/simpleControl',
    method: 'POST',
    data
  })
}

//查询产品类型
export function productType() {
  return request({
    url: '/device/deviceGroups/listForProductType',
    method: 'get',
  })
}

//查询产品名称下拉选项
export function productNames() {
  return request({
    url: '/simpleControl/ListForProduct',
    method: 'get',
  })
}
