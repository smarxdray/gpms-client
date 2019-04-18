import request from '@/utils/request'

export function getColleges() {
    return request({
        url: '/colleges',
        method: 'get'
    })
}

export function getMajors() {
    return request({
        url: '/majors',
        method: 'get'
    })
}