import request from '@/utils/request'

// 查询方案条款列表
export function listClause(query) {
  return request({
    url: '/business/scheme/clause/list',
    method: 'get',
    params: query
  })
}

// 查询方案条款详细
export function getClause(id) {
  return request({
    url: '/business/scheme/clause/' + id,
    method: 'get'
  })
}

// 新增方案条款
export function addClause(data) {
  return request({
    url: '/business/scheme/clause',
    method: 'post',
    data: data
  })
}

// 修改方案条款
export function updateClause(data) {
  return request({
    url: '/business/scheme/clause',
    method: 'put',
    data: data
  })
}

// 删除方案条款
export function delClause(id) {
  return request({
    url: '/business/scheme/clause/' + id,
    method: 'delete'
  })
}

// 导出方案条款
export function exportClause(query) {
  return request({
    url: '/business/scheme/clause/export',
    method: 'get',
    params: query
  })
}
