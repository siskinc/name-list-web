import request from '@/utils/request'
import {clearObj} from '@/utils/map';

export function getListItems(params) {
    params = _.clone(params);
    params = clearObj(params);
    return request({
        url: '/name-list/item/',
        method: 'get',
        params: params,
    })
}

export function createListItem(data) {
    return request({
        url: '/name-list/item/',
        method: 'post',
        data
    })
}

export function updateListItem(id, data) {
    return request({
        url: `/name-list/item/${id}`,
        method: 'patch',
        data
    })
}

export function deleteListItem(id) {
    return request({
        url: `/name-list/item/${id}`,
        method: 'delete'
    })
}

export function hitOneListItem(data) {
    return request({
        url: '/name-list/item-hit/pre',
        method: 'post',
        data
    })
}

export function hitAllListItem(data) {
    return request({
        url: '/name-list/item-hit/all',
        method: 'post',
        data
    })
}