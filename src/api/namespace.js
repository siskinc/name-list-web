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

export function updateNamespace(id, data) {
  return request({
    url: '/name-list/namespace/' + id,
    method: 'patch',
    data: data,
  })
}

export function deleteNamespace(id) {
  return request({
    url: '/name-list/namespace/' + id,
    method: 'delete',
  })
}