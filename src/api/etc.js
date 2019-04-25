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

export function getMajorsByCollege(collegeId) {
    return request({
        url: '/majors',
        method: 'get',
        params: {
            college: collegeId
        }
    })
}

export function getRoles() {
    return request({
      url: '/roles',
      method: 'get'
    })
}