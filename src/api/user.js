import request from '@/utils/request'

export function getUsers() {
  return request({
    url: '/users',
    method: 'get',
    params: {
      type: 'all'
    }
  })
}

export function addUser(user) {
  return request({
    url: '/users',
    method: 'post',
    data: user
  })
}

export function updateUser(user) {
  return request({
    url: '/users',
    method: 'put',
    data: user
  })
}

export function deleteUser(id) {
  return request({
    url: '/users',
    method: 'delete',
    params: {
      id
    }
  })
}

export function getTeachers() {
  return request({
    url: '/users',
    method: 'get',
    params: {
      type: 'teacher'
    }
  })
}

export function getStudents() {
  return request({
    url: '/users',
    method: 'get',
    params: {
      type: 'student'
    }
  })
}

export function getStudentsWithoutTeacher() {
  return request({
    url: '/students',
    method: 'get',
    params: {
      allotted: 0
    }
  })
}