import request from '@/utils/request'

export function getListTypes(params) {
    return request({
      url: '/api/list-type',
      method: 'get',
      params
    })
  }
  