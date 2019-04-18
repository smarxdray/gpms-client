import request from '@/utils/request'

export function addProjects(projects) {
    return request({
        url: '/projects',
        method: 'post',
        data: projects
    })
}

export function getProjectById(id) {
    return request({
        url: `/projects/${id}`,
        method: 'get'
    })
}

export function getProjectsByTeacher(teacherId) {
    return request({
        url: '/projects',
        method: 'get',
        params: {
            teacher: teacherId
        }
    })
}

export function updateProjectsByTeacher(teacherId, status) {
    return request({
        url: '/projects',
        method: 'put',
        data: {
            teacher: teacherId,
            status
        }
    })
}

export function deleteProject(id) {
    return request({
        url: `/projects/${id}`,
        method: 'delete'
    })
}