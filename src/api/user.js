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

export function getStudentDetail(studentId) {
  return request({
    url: `/users/students/details/${studentId}`,
    method: 'get'
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

export function getStudentsByTeacher(teacherId) {
  return request({
    url: '/students',
    method: 'get',
    params: {
      teacher: teacherId
    }
  })
}
export function getStudentDetailsByTeacher(teacherId) {
  return request({
    url: '/students/details',
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
      id: teacherId
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
  let projectStatus = listQuery.projectStatus == '' ? null : listQuery.projectStatus;
  return request({
    url: '/users/teachers',
    method: 'post',
    data: {
      name,
      college,
      major,
      projectStatus
    }
  })
}