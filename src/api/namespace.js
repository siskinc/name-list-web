import request from '@/utils/request'

export function getNamespaceList(params) {
    return request({
      url: '/name-list/namespace/',
      method: 'get',
      params
    })
  }
  