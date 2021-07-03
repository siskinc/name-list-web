import request from '@/utils/request'
import { _ } from 'lodash';

export function getNamespaceList(params) {
  return request({
    url: '/name-list/namespace/',
    method: 'get',
    params
  })
}

export async function getNamespaceCodeList(params) {
  let namespace_code_list = [];
  await request({
    url: '/name-list/namespace/',
    method: 'get',
    params
  }).then((response) => {
    response.data.forEach(element => {
      namespace_code_list.push(element.code);
    });
  });
  return namespace_code_list;
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