import request from '@/utils/request'

const api = {
    list: '/user/list',
    detail: '/user/detail',
    save: '/user/save',
    update: '/user/update',
    remove: '/user/remove'
}

export default api

export function getList (params) {
    return request.get(api.list, { params })
}

export function detail (id) {
    return request.get(api.detail, { params: { id: id } })
}

export function save (data) {
    return request.post(api.save, data)
}

export function update (data) {
    return request.post(api.update, data)
}

export function remove (id) {
    return request.post(api.remove, { id: id })
}
