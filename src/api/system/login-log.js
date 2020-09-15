import request from '@/utils/request'

const api = {
    list: '/loginLog/list'
}

export default api

export function getList (params) {
    return request.get(api.list, { params })
}
