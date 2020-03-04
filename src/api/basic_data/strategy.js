import request from '@/utils/request'

// 下发控制表查询
export function list(data) {
  return request({
    url: '/simpleControl/list',
    method: 'POST',
    data
  })
}

//下发参数
export  function issuedData(id) {
  return request({
    url: `/simpleControl/getFieldByProductId/${id}`,
    method: 'get'
  })
}
