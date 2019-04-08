import { getRoles } from '@/api/role'

const roleList = {
  state: {
    list: []
  },

  mutations: {
    SET_LIST: (state, list) => {
      state.list = list
    }
  },

  actions: {

    // 获取用户信息
    GetRoleList(context) {
      return new Promise((resolve, reject) => {
        getRoles().then(response => {
          const body = response.data
          let roleList = body.data;
          if (roleList && roleList.length > 0) { // 验证返回的roles是否是一个非空数组
            context.commit('SET_LIST', roleList)
          } else {
            reject('getInfo: roles must be a non-null array!')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default roleList