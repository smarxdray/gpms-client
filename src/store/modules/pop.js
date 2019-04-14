const pop = {
  state: {
    newNotice: false
  },

  mutations: {
    SET_NEW_NOTICE: (state, newNotice) => {
      state.newNotice = newNotice
    }
  }
}

export default pop