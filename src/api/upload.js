import request from '@/utils/request'

const api = {
  token: '/storage/token'
}

export default api

export function getToken () {
  return request.get(api.token)
}

export function getTokenByKey (key) {
  return request.get(api.token, { params: { key: key } })
}
