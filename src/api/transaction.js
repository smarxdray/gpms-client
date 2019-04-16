import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

export function assign(matchList) {
  return request({
    url: '/assignments',
    method: 'post',
    data: matchList
  })
}

export function unassign(matchList) {
  return request({
    url: '/assignments',
    method: 'delete',
    data: matchList
  })
}

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

export function download(fileId) {
  return request({
    url: `/download/${fileId}`,
    method: 'get'
  })
}

