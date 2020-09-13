import request from '@/utils/request'

const api = {
    list: '/operationLog/list',
    detail: '/menu/detail'
}

export default api

export function getList (params) {
    return request.get(api.list, { params })
}

export function detail (id) {
    return request.get(api.detail, { params: { id: id } })
}
