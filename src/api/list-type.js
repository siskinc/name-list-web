import request from '@/utils/request'

export async function getListTypes(params) {
  return request({
    url: '/name-list/type/',
    method: 'get',
    params
  })
}

export async function getListTypeCodeList(params) {
  let listTypeCodeList = [];
  let data = [];
  await getListTypes(params).then(response => {
    data = response.data;
  });
  for (let i in data) {
    const element = data[i];
    listTypeCodeList.push(element.code);
  }
  return listTypeCodeList;
}

export function createListType(data) {
  return request({
    url: `/name-list/type/`,
    method: 'post',
    data: data,
  })
}

export function updateListType(id, data) {
  // console.log(`update data: ${JSON.stringify(data)}`);
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