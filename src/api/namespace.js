import request from '@/utils/request'

export function getNamespaceList(params) {
  return request({
    url: '/name-list/namespace/',
    method: 'get',
    params
  })
}

export function createNamespace(data) {
  return request({
    url: '/name-list/namespace/',
    method: 'post',
    data: data,
  })
}
