import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getUserByToken } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import store from './store'

const user = {
  state: {
    id: 0,
    code: '',
    phone: '',
    email: '',
    name: '',
    gender: '',
    status: '',
    token: getToken(),
    desc: '',
    avatarUri: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, desc) => {
      state.desc = desc
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatarUri) => {
      state.avatarUri = avatarUri
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const body = response.data;
          if (body.code != 200) {
            return reject(body.msg)
          }
          commit('SET_TOKEN', body.data.token)
          setToken(body.data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserByToken(state.token).then(res => {
          const body = res.data;
          const user = body.data.user;
          commit('SET_ID', user.id)
          commit('SET_CODE', user.code)
          commit('SET_NAME', user.name)
          commit('SET_AVATAR', user.avatarUri)
          let allRoles = body.data.roles;
          commit('SET_ROLE_LIST', allRoles)
          let roles = allRoles.filter(r => r.id == user.role).map(r => r.name);
          commit('SET_ROLES', roles)
          resolve(roles)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
