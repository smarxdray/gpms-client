import Mock from 'mockjs'
import { deepClone } from '@/utils'
import { filterAsyncRoutes } from '@/store/modules/permission'
import { asyncRoutes, constantRoutes } from '@/router'

const routes = deepClone([...constantRoutes, ...asyncRoutes])

// const roles = [
//   {
//     key: 'admin',
//     name: 'admin',
//     description: 'Super Administrator. Have access to view all pages.',
//     routes: routes
//   },
//   {
//     key: 'teacher',
//     name: 'teacher',
//     description: 'Normal Teacher. Can see all pages except permission page',
//     routes: filterAsyncRoutes(routes, ['teacher'])
//   },
//   {
//     key: 'student',
//     name: 'student',
//     description: 'Normal Student. Can see all pages except permission page',
//     routes: filterAsyncRoutes(routes, ['student'])
//   },
  // {
  //   key: 'editor',
  //   name: 'editor',
  //   description: 'Normal Editor. Can see all pages except permission page',
  //   routes: filterAsyncRoutes(routes, ['editor'])
  // },
//   {
//     key: 'forbidden',
//     name: 'forbidden',
//     description: 'Forbidden account. Have no access to view any pages.',
//     routes: []
//   },
//   {
//     key: 'visitor',
//     name: 'visitor',
//     description: 'Just a visitor. Can only see the home page and the document page',
//     routes: [{
//       path: '',
//       redirect: 'dashboard',
//       children: [
//         {
//           path: 'dashboard',
//           name: 'Dashboard',
//           meta: { title: 'dashboard', icon: 'dashboard' }
//         }
//       ]
//     }]
//   }
// ]
// const roles = [
  // {
  //   id: 1,
  //   name: 'admin',
  //   description: 'Super Administrator. Have access to view all pages.',
  //   routes: routes
  // },
  // {
  //   id: 2,
  //   name: 'forbbiden',
  //   description: 'Normal Teacher. Can see all pages except permission page',
  //   routes: filterAsyncRoutes(routes, ['forbidden'])
  // },
  // {
  //   id: 3,
  //   name: 'visitor',
  //   description: 'Normal visitor. Can see all pages except permission page',
  //   routes: filterAsyncRoutes(routes, ['visitor'])
  // },
  // {
  //   id: 4,
  //   name: 'teacher',
  //   description: 'Normal Teacher. Can see all pages except permission page',
  //   routes: filterAsyncRoutes(routes, ['teacher'])
  // },
  // {
  //   id: 5,
  //   name: 'student',
  //   description: 'Normal Student. Can see all pages except permission page',
  //   routes: filterAsyncRoutes(routes, ['student'])
  // }
// ]

export default {
  getRoutes() {
    return routes
  },
  getRoles() {
    return roles
  },
  addRole() {
    return Mock.mock('@integer(300, 5000)')
  },
  updateRole() {
    const res = {
      data: 'success'
    }
    return res
  },
  deleteRole() {
    const res = {
      data: 'success'
    }
    return res
  }
}
