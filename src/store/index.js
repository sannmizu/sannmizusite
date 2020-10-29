import { createStore } from 'vuex'

export default createStore({
  state: {
    page: "home"
  },
  mutations: {
    setPage(state, newPage) {
      state.page = newPage
    }
  },
  actions: {
  },
  modules: {
  }
})
