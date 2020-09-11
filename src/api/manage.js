import request from '@/utils/request'

const api = {
  update: '/account/center/update',
  updatePassword: '/account/center/updatePassword'
}

export default api

export function update (data) {
  return request.post(api.update, data)
}

export function changePassword (data) {
  return request.post(api.updatePassword, data)
}
