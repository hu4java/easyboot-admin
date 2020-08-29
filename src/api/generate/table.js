import request from '@/utils/request'

const api = {
  list: '/table/list',
  info: '/table/info'
}

export default api

export function getList (params) {
  return request.get(api.list, { params })
}

export function getInfo (tableName) {
  return request.get(api.info, { params: { tableName: tableName } })
}
