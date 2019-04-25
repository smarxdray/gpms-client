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

export function getProjects(queryObj) {
    return request({
        url: '/projects',
        method: 'get',
        params: queryObj
    })
}

export function updateProjectsByTeacher(project) {
    return request({
        url: '/projects',
        method: 'put',
        data: project
    })
}

export function deleteProject(id) {
    return request({
        url: `/projects/${id}`,
        method: 'delete'
    })
}