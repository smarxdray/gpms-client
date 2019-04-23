import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

// export function assign(matchList) {
//   return request({
//     url: '/assignments',
//     method: 'post',
//     data: matchList
//   })
// }

// export function unassign(matchList) {
//   return request({
//     url: '/assignments',
//     method: 'delete',
//     data: matchList
//   })
// }

export function setAssignment(assigned, unassigned) {
  return request({
    url: '/assignments',
    method: 'post',
    data: {
      assigned,
      unassigned
    }
  })
}

export function selectProject(studentId, projectId) {
  return request({
    url: '/select-project',
    method: 'put',
    data: {
      student: studentId,
      project: projectId
    }
  })
}

export function unselectProject(studentId, projectId) {
  return request({
    url: '/unselect-project',
    method: 'put',
    data: {
      student: studentId,
      project: projectId
    }
  })
}

