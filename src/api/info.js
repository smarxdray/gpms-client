import request from '@/utils/request'

export function getColleges() {
    return request({
        url: '/colleges',
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