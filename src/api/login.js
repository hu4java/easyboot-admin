import request from '@/utils/request'

const api = {
  login: '/login',
  logout: '/logout',
  info: '/account/center/info',
  routes: '/account/center/antRoute'
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: api.login,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: api.info,
    method: 'get'
  })
}

export function getCurrentUserNav () {
  return request({
    url: api.routes,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: api.logout,
    method: 'post'
  })
}
