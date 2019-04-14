import { getRoles } from '@/api/role'

const roleList = {
  state: {
    list: []
  },

  mutations: {
    SET_ROLE_LIST: (state, list) => {
      state.list = list
    }
  },

  actions: {

    // 获取用户信息
    // GetRoleList(context) {
    //   return new Promise((resolve, reject) => {
    //     getRoles().then(response => {
    //       const body = response.data
    //       let roles = body.data;
    //       if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         context.commit('SET_ROLE_LIST', roles)
    //       } else {
    //         reject('getInfo: roles must be a non-null array!')
    //       }
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // }
  }
}

export default roleList