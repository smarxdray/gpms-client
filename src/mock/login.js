import { param2Obj } from '@/utils'

// const userMap = {
//   admin: {
//     roles: ['admin'],
//     token: 'admin',
//     introduction: '我是超级管理员',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Ray'
//   },
//   teacher: {
//     roles: ['teacher'],
//     token: 'teacher',
//     introduction: '我是教师',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Mary'
//   },
//   student: {
//     roles: ['student'],
//     token: 'student',
//     introduction: '我是学生',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'John'
//   },
//   editor: {
//     roles: ['editor'],
//     token: 'editor',
//     introduction: '我是编辑',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Normal Editor'
//   }
// }

let userList = []
// let i = 0
// for (const key in userMap) {
//   if (userMap.hasOwnProperty(key)) {
//     let element = userMap[key];
//     element.id = i++
//     userList.push(element)
//   }
// }

export default {
  getUsers: () => {
    return userList
  },
  getTeachers() {
    return userList.filter( u => u.roles.includes('teacher'))
  },
  getStudents() {
    return userList.filter( u => u.roles.includes('student'))
  },
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    return userMap[username]
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    console.log(token)
    if (userMap[token]) {
      return userMap[token]
    } else {
      return false
    }
  },
  logout: () => 'success'
}
