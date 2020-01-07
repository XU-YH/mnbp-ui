import request from '@/utils/request'

// 查询客户列表
export function listCustomer(query) {
  return request({
    url: '/business/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getCustomer(id) {
  return request({
    url: '/business/customer/' + id,
    method: 'get'
  })
}

// 新增客户
export function addCustomer(data) {
  return request({
    url: '/business/customer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateCustomer(data) {
  return request({
    url: '/business/customer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delCustomer(id) {
  return request({
    url: '/business/customer/' + id,
    method: 'delete'
  })
}

// 导出客户
export function exportCustomer(query) {
  return request({
    url: '/business/customer/export',
    method: 'get',
    params: query
  })
}

// 权益查询，查询客户承保信息
export function listCustomerInsuranceInfo(query) {
  return request({
    url: '/business/customer/insuranceInfo/list',
    method: 'get',
    params: query
  })
}

// 下载人员导入模板
export function importTemplate() {
  return request({
    url: '/business/customer/importTemplate',
    method: 'get'
  })
}
