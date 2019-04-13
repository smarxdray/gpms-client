import request from '@/utils/request'

export function getFilesByOwner(ownerId) {
    return request({
        url: '/files',
        method: 'get',
        params: {
            owner: ownerId
        }
    })
}

export function downloadFile(id) {
    return request({
      url: `/files/download/${id}`,
      method: 'get'
    })
  }