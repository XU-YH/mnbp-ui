import request from '@/utils/request'

// 查询方案列表
export function listInsuranceScheme(query) {
  return request({
    url: '/business/insuranceScheme/list',
    method: 'get',
    params: query
  })
}

// 查询方案详细
export function getInsuranceScheme(id) {
  return request({
    url: '/business/insuranceScheme/' + id,
    method: 'get'
  })
}

// 新增方案
export function addInsuranceScheme(data) {
  return request({
    url: '/business/insuranceScheme',
    method: 'post',
    data: data
  })
}

// 修改方案
export function updateInsuranceScheme(data) {
  return request({
    url: '/business/insuranceScheme',
    method: 'put',
    data: data
  })
}

// 删除方案
export function delInsuranceScheme(id) {
  return request({
    url: '/business/insuranceScheme/' + id,
    method: 'delete'
  })
}

// 导出方案
export function exportInsuranceScheme(query) {
  return request({
    url: '/business/insuranceScheme/export',
    method: 'get',
    params: query
  })
}