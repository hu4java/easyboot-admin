import request from '@/utils/request'

const api = {
  login: '/login',
  logout: '/logout',
  // get my info
  UserInfo: '/user/center/info',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
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
    url: api.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: api.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: api.logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
