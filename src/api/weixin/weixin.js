import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询客户承保信息
export function getInsuranceInfo(query) {
  return request({
    url: '/weixin/insuranceInfo',
    method: 'get',
    params: query
  })
}

// 微信用户绑定
export function binding(data) {
  return request({
    url: '/weixin/binding',
    method: 'post',
    data: data
  })
}

// 微信用户解绑
export function unbind(data) {
  return request({
    url: '/system/unbind',
    method: 'put',
    data: data
  })
}
