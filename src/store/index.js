import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import roleList from './modules/roleList'
import projectStatus from './modules/projectStatus'
import pop from './modules/pop'
import tmp from './modules/tmp'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    roleList,
    projectStatus,
    pop,
    tmp
  },
  getters
})

export default store
