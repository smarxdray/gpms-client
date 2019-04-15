import request from '@/utils/request'

export function addProjects(data) {
    return request({
        url: '/projects',
        method: 'post',
        data
    })
}