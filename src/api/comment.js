import request from '@/utils/request'

export function addComment(comment) {
    return request({
        url: '/comments',
        method: 'post',
        data: comment
    })
}