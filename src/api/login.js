import request from '@/utils/request'

export function loginByUsername(code, password) {
  const data = {
    code,
    password
  }
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

