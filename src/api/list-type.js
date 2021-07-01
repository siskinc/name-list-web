import request from '@/utils/request'

export function getListTypes(params) {
    return request({
      url: '/name-list/list-type',
      method: 'get',
      params
    })
  }
  