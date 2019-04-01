import request from '@/utils/request'

export function getUsers() {
  return request({
    url: '/users/all',
    method: 'get'
  })
}

export function getTeachers() {
  return request({
    url: '/users/teachers',
    method: 'get'
  })
}

export function getStudents() {
  return request({
    url: '/users/students',
    method: 'get'
  })
}