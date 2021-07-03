import request from '@/utils/request'

export function getListTypes(params) {
  return request({
    url: '/name-list/type/',
    method: 'get',
    params
  })
}

export function updateListType(id, data) {
  return request({
    url: `/name-list/type/${id}`,
    method: 'patch',
    data: data,
  })
}

export function deleteListType(id) {
  return request({
    url: `/name-list/type/${id}`,
    method: 'delete',
  })
}