import request from '@/utils/request'

export function getNamespaceList(params) {
    return request({
      url: '/api/namespace',
      method: 'get',
      params
    })
  }
  