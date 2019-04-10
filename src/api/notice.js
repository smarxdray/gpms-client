import request from '@/utils/request'

export function getNotices(id = '') {
    return request({
        url: `/notices/${id}`,
        method: 'get'
    })
}

export function addNotice(notice) {
    return request({
        url: '/notices',
        method: 'post',
        data: notice
    })
}