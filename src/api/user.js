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

export function getUserById(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function getUserByToken(token) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      token
    }
  })
}

export function getUserDetail(id) {
  return request({
    url: `/users/${id}/detail`,
    method: 'get'
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
    url: `/users/${id}`,
    method: 'delete'
  })
}

export function getAdmins() {
  return request({
    url: '/users/admins',
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

export function getStudentsWithoutTeacher() {
  return request({
    url: '/users/students',
    method: 'get',
    params: {
      assigned: 0
    }
  })
}

export function getStudentsByTeacher(teacherId) {
  return request({
    url: '/users/students',
    method: 'get',
    params: {
      teacher: teacherId
    }
  })
}
export function getStudentDetailsByTeacher(teacherId) {
  return request({
    url: '/users/students/details',
    method: 'get',
    params: {
      teacher: teacherId
    }
  })
}

export function getTeachersByMajor(majorId) {
  return request({
      url: '/users/teachers',
      method: 'get',
      params: {
          major: majorId
      }
  })
}

export function getTeacherDetail(teacherId) {
  return request({
    url: '/users/teachers/details',
    method: 'get',
    params: {
      owner: teacherId
    }
  })
}

export function getTeachersHavingProjects(projectStatus) {
  return request({
    url: '/users/teachers',
    method: 'get',
    params: {
      'project-status': projectStatus
    }
  })
}

export function getTeachersByQuery(listQuery) {
  let name = listQuery.name == '' ? null : listQuery.name;
  let college = listQuery.college == '' ? null : listQuery.college;
  let major = listQuery.major == '' ? null : listQuery.major;
  let projectStatus = listQuery.projectStatus === '' ? null : listQuery.projectStatus;
  return request({
    url: '/users/teachers',
    method: 'get',
    params: {
      name,
      college,
      major,
      'project-status': projectStatus
    }
  })
}