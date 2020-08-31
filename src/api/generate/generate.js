import request from '@/utils/request'

const api = {
  code: '/generate/code'
}

export default api

export function generateCode (data) {
  return request({
    url: api.code,
    method: 'post',
    responseType: 'blob',
    data
  })
}
