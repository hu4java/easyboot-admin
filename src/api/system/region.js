import request from '@/utils/request'

const api = {
    list: '/region/list',
    selectList: 'region/selectList',
    detail: '/region/detail',
    save: '/region/save',
    update: '/region/update',
    remove: '/region/remove'
}

export default api

export function getList (params) {
    return request.get(api.list, { params })
}

export function getSelectList () {
    return request.get(api.selectList)
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
